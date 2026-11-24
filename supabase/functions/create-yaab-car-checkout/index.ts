import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface YaabCarCheckoutRequest {
  carSlug: string;
  pickupDate: string; // yyyy-MM-dd
  returnDate: string; // yyyy-MM-dd
  pickupTime?: string; // HH:mm
  returnTime?: string; // HH:mm
  pickupLocation?: string;
  returnLocation?: string;
  driverName: string;
  driverEmail: string;
  driverPhone?: string;
  additionalDriver?: boolean;
  notes?: string;
}

// Fallback fleet (Santiago-approved prices "Desde" from yaabcar.mx, 24 Nov 2026).
// Used ONLY if the rental_cars table is not available yet (migration not applied).
// The database is authoritative once the migration is applied.
const FALLBACK_CARS: Record<string, { id: string; name: string; trim: string; year: number; pricePerDay: number; deposit: number | null; minDays: number }> = {
  "jac-sei-8": { id: "jac-sei-8", name: "JAC SEI 8", trim: "Limited", year: 2025, pricePerDay: 1850, deposit: 5000, minDays: 3 },
  "suzuki-ertiga": { id: "suzuki-ertiga", name: "Suzuki Ertiga", trim: "Boostergreen", year: 2025, pricePerDay: 1500, deposit: null, minDays: 3 },
  "dodge-attitude": { id: "dodge-attitude", name: "Dodge Attitude", trim: "SE", year: 2022, pricePerDay: 650, deposit: null, minDays: 3 },
};

const parseLocalDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: YaabCarCheckoutRequest = await req.json();

    if (!body.carSlug || !body.pickupDate || !body.returnDate || !body.driverName || !body.driverEmail) {
      throw new Error("Missing required fields");
    }

    const pickup = parseLocalDate(body.pickupDate);
    const ret = parseLocalDate(body.returnDate);
    const totalDays = Math.round((ret.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24));
    if (isNaN(totalDays) || totalDays < 1) {
      throw new Error("Invalid rental dates");
    }

    // Car + price are read from the database, never trusted from the client.
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    let carId: string | null = null;
    let carName = "";
    let pricePerDay = 0;
    let deposit: number | null = null;
    let minDays = 3;

    const { data: car, error: carError } = await supabaseAdmin
      .from("rental_cars")
      .select("id, name, trim, year, price_per_day_mxn, deposit_mxn, min_days, active")
      .eq("slug", body.carSlug)
      .maybeSingle();

    if (car && !carError && car.active !== false) {
      carId = car.id;
      carName = `${car.name} ${car.trim || ""} ${car.year}`.trim();
      pricePerDay = Number(car.price_per_day_mxn);
      deposit = car.deposit_mxn != null ? Number(car.deposit_mxn) : null;
      minDays = Number(car.min_days) || 3;
    } else {
      // Table not applied yet (or car missing): approved fallback prices.
      const fb = FALLBACK_CARS[body.carSlug];
      if (!fb) throw new Error("Car not found");
      console.log("rental_cars lookup failed, using fallback fleet:", carError?.message);
      carName = `${fb.name} ${fb.trim} ${fb.year}`;
      pricePerDay = fb.pricePerDay;
      deposit = fb.deposit;
      minDays = fb.minDays;
    }

    if (totalDays < minDays) {
      throw new Error(`Minimum rental is ${minDays} days`);
    }

    // Total = days x daily rate. NO duration discount is applied: YAAB's
    // 3-day quoter totals do not form a consistent discount rule, so the
    // exact discount rule is pending confirmation with YAAB.
    const totalMxn = totalDays * pricePerDay;
    const depositMxn = Math.round(totalMxn / 2); // 50% advance via Stripe
    const balanceDueMxn = totalMxn - depositMxn; // 50% on delivery (cash/transfer to YAAB)

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const customers = await stripe.customers.list({ email: body.driverEmail, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({
        email: body.driverEmail,
        name: body.driverName,
        phone: body.driverPhone,
      });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: {
              name: `Anticipo 50% — Renta ${carName}`,
              description: `${totalDays} días (${body.pickupDate} – ${body.returnDate}) | Total $${totalMxn.toLocaleString("es-MX")} MXN | Saldo a la entrega: $${balanceDueMxn.toLocaleString("es-MX")} MXN`,
            },
            unit_amount: depositMxn * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.get("origin") || "https://margeatravel.com"}/activities/car-rentals/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin") || "https://margeatravel.com"}/activities/car-rentals/${body.carSlug}`,
      metadata: {
        carId: carId || "",
        carSlug: body.carSlug,
        carName,
        pickupDate: body.pickupDate,
        returnDate: body.returnDate,
        pickupTime: body.pickupTime || "",
        returnTime: body.returnTime || "",
        pickupLocation: body.pickupLocation || "",
        returnLocation: body.returnLocation || "",
        totalDays: totalDays.toString(),
        pricePerDay: pricePerDay.toString(),
        totalMxn: totalMxn.toString(),
        depositMxn: depositMxn.toString(),
        balanceDueMxn: balanceDueMxn.toString(),
        securityDepositMxn: deposit != null ? deposit.toString() : "",
        driverName: body.driverName,
        driverEmail: body.driverEmail,
        driverPhone: body.driverPhone || "",
        additionalDriver: body.additionalDriver ? "true" : "false",
        notes: body.notes || "",
      },
    });

    console.log("YAAB checkout session created:", session.id, carName, totalDays, "days, deposit", depositMxn, "MXN");

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in create-yaab-car-checkout:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

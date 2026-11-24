import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CarRentalNotificationRequest {
  car_name: string;
  driver_name: string;
  driver_email: string;
  driver_phone?: string;
  pickup_date: string;
  return_date: string;
  pickup_time?: string;
  return_time?: string;
  pickup_location?: string;
  return_location?: string;
  total_days: number;
  total_mxn: number;
  deposit_paid_mxn: number;
  balance_due_mxn: number;
  security_deposit_mxn?: number | null;
  additional_driver?: boolean;
  confirmation_number: string;
}

const money = (n: number) => `$${Number(n).toLocaleString("es-MX")} MXN`;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const booking: CarRentalNotificationRequest = await req.json();

    // HIGH PRIORITY email to admin: availability must be confirmed with YAAB (<24h)
    const adminEmailResponse = await resend.emails.send({
      from: "Margea Car Rentals <noreply@margeatravel.com>",
      to: ["admin@margeatravel.com"],
      subject: `🔴 NUEVA RESERVA DE COCHE - ${booking.car_name} (${booking.confirmation_number})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔴 Nueva Reserva de Coche</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Anticipo del 50% pagado — falta confirmar disponibilidad con YAAB</p>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
              <p style="margin: 0; color: #856404;"><strong>Acción pendiente:</strong> confirma disponibilidad con YAAB Rental Car Cancún (WhatsApp +52 998 104 9534) en menos de 24 h. Si no hay auto, reembolsa el anticipo por Stripe y marca la reserva como cancelada.</p>
            </div>
            <h2 style="color: #333; margin-top: 25px;">🚗 Vehículo</h2>
            <p style="font-size: 18px; font-weight: bold; color: #667eea; margin: 5px 0;">${booking.car_name}</p>
            <h2 style="color: #333; margin-top: 25px;">👤 Conductor</h2>
            <p style="color: #333; margin: 5px 0;"><strong>Nombre:</strong> ${booking.driver_name}</p>
            <p style="color: #333; margin: 5px 0;"><strong>Email:</strong> ${booking.driver_email}</p>
            ${booking.driver_phone ? `<p style="color: #333; margin: 5px 0;"><strong>Teléfono:</strong> ${booking.driver_phone}</p>` : ""}
            ${booking.additional_driver ? `<p style="color: #333; margin: 5px 0;"><strong>Conductor adicional:</strong> Sí (costo extra según YAAB)</p>` : ""}
            <h2 style="color: #333; margin-top: 25px;">📅 Detalles de la renta</h2>
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
              <tr style="background: #667eea; color: white;">
                <td style="padding: 12px; font-weight: bold;">Entrega</td>
                <td style="padding: 12px; font-weight: bold;">Devolución</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${booking.pickup_date}${booking.pickup_time ? ` — ${booking.pickup_time}` : ""}</td>
                <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${booking.return_date}${booking.return_time ? ` — ${booking.return_time}` : ""}</td>
              </tr>
              <tr>
                <td style="padding: 12px; color: #666;"><strong>Lugar de entrega:</strong></td>
                <td style="padding: 12px;">${booking.pickup_location || "Por coordinar"}</td>
              </tr>
              <tr>
                <td style="padding: 12px; color: #666;"><strong>Lugar de devolución:</strong></td>
                <td style="padding: 12px;">${booking.return_location || "Por coordinar"}</td>
              </tr>
              <tr>
                <td style="padding: 12px; color: #666;"><strong>Días:</strong></td>
                <td style="padding: 12px;">${booking.total_days}</td>
              </tr>
              <tr>
                <td style="padding: 12px; color: #666;"><strong>Total de la renta:</strong></td>
                <td style="padding: 12px;">${money(booking.total_mxn)}</td>
              </tr>
              <tr style="background: #f0f4ff;">
                <td style="padding: 12px; font-weight: bold; color: #333;">Anticipo pagado (50%):</td>
                <td style="padding: 12px; font-weight: bold; color: #667eea; font-size: 18px;">${money(booking.deposit_paid_mxn)}</td>
              </tr>
              <tr>
                <td style="padding: 12px; color: #666;"><strong>Saldo a la entrega (50%):</strong></td>
                <td style="padding: 12px;">${money(booking.balance_due_mxn)} (efectivo o transferencia a YAAB)</td>
              </tr>
              ${booking.security_deposit_mxn ? `<tr>
                <td style="padding: 12px; color: #666;"><strong>Depósito en garantía (informativo, no cobrado):</strong></td>
                <td style="padding: 12px;">${money(booking.security_deposit_mxn)}</td>
              </tr>` : ""}
            </table>
            <div style="margin-top: 25px; padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
              <p style="margin: 0; color: #856404;"><strong>Referencia:</strong> ${booking.confirmation_number}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">Operado por YAAB Rental Car Cancún · Reserva desde margeatravel.com</p>
          </div>
        </div>
      `,
      headers: { "X-Priority": "1", "X-MSMail-Priority": "High", Importance: "High" },
    });

    console.log("Admin car rental email sent:", adminEmailResponse);

    // Confirmation email to the driver
    const guestEmailResponse = await resend.emails.send({
      from: "Margea <noreply@margeatravel.com>",
      to: [booking.driver_email],
      subject: `Tu reserva de coche ${booking.confirmation_number} — ${booking.car_name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">¡Anticipo recibido!</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Gracias por tu reserva, ${booking.driver_name}</p>
          </div>
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #333; line-height: 1.6;">
              Recibimos tu anticipo del 50% para rentar <strong>${booking.car_name}</strong>.
              Estamos confirmando la disponibilidad con YAAB y te escribiremos en menos de 24 horas
              con la confirmación final. Si no hubiera auto disponible, te reembolsamos el anticipo completo.
            </p>
            <h2 style="color: #333; margin-top: 25px;">📅 Tu renta</h2>
            <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden;">
              <tr style="background: #667eea; color: white;">
                <td style="padding: 12px; font-weight: bold;">Entrega</td>
                <td style="padding: 12px; font-weight: bold;">Devolución</td>
              </tr>
              <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${booking.pickup_date}${booking.pickup_time ? ` — ${booking.pickup_time}` : ""}</td>
                <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${booking.return_date}${booking.return_time ? ` — ${booking.return_time}` : ""}</td>
              </tr>
              <tr>
                <td style="padding: 12px; color: #666;"><strong>Lugar de entrega:</strong></td>
                <td style="padding: 12px;">${booking.pickup_location || "Por coordinar"}</td>
              </tr>
              <tr>
                <td style="padding: 12px; color: #666;"><strong>Lugar de devolución:</strong></td>
                <td style="padding: 12px;">${booking.return_location || "Por coordinar"}</td>
              </tr>
              <tr>
                <td style="padding: 12px; color: #666;"><strong>Días:</strong></td>
                <td style="padding: 12px;">${booking.total_days}</td>
              </tr>
              <tr>
                <td style="padding: 12px; color: #666;"><strong>Total de la renta:</strong></td>
                <td style="padding: 12px;">${money(booking.total_mxn)}</td>
              </tr>
              <tr style="background: #f0f4ff;">
                <td style="padding: 12px; font-weight: bold; color: #333;">Anticipo pagado (50%):</td>
                <td style="padding: 12px; font-weight: bold; color: #667eea; font-size: 18px;">${money(booking.deposit_paid_mxn)}</td>
              </tr>
              <tr>
                <td style="padding: 12px; color: #666;"><strong>Saldo a la entrega (50%):</strong></td>
                <td style="padding: 12px;">${money(booking.balance_due_mxn)} (efectivo o transferencia a YAAB)</td>
              </tr>
              ${booking.security_deposit_mxn ? `<tr>
                <td style="padding: 12px; color: #666;"><strong>Depósito en garantía:</strong></td>
                <td style="padding: 12px;">${money(booking.security_deposit_mxn)} (reembolsable, se informa antes de la entrega)</td>
              </tr>` : ""}
            </table>
            <div style="margin-top: 25px; padding: 15px; background: #d1ecf1; border-left: 4px solid #17a2b8; border-radius: 4px;">
              <p style="margin: 0; color: #0c5460;"><strong>Tu número de referencia:</strong> ${booking.confirmation_number}</p>
              <p style="margin: 10px 0 0 0; color: #0c5460; font-size: 14px;">Guárdalo para cualquier consulta sobre tu renta.</p>
            </div>
            <div style="margin-top: 25px; padding: 20px; background: white; border-radius: 8px; border: 1px solid #e0e0e0;">
              <h3 style="color: #333; margin-top: 0;">📋 Para la entrega necesitas</h3>
              <p style="color: #666; margin: 5px 0;">Licencia de conducir vigente, identificación oficial (INE o pasaporte) y ser mayor de 18 años. Seguro incluido y kilometraje libre.</p>
              <h3 style="color: #333; margin-top: 15px;">📞 ¿Necesitas ayuda?</h3>
              <p style="margin: 5px 0;"><strong>Email:</strong> admin@margeatravel.com</p>
              <p style="margin: 5px 0;"><strong>Teléfono:</strong> +52 998 233 4867</p>
            </div>
            <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">Saludos,<br><strong>El Equipo de Margea</strong><br>Operado por YAAB Rental Car Cancún</p>
          </div>
        </div>
      `,
    });

    console.log("Driver car rental email sent:", guestEmailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        adminEmailId: adminEmailResponse.data?.id,
        guestEmailId: guestEmailResponse.data?.id,
      }),
      { headers: { "Content-Type": "application/json", ...corsHeaders }, status: 200 }
    );
  } catch (error: any) {
    console.error("Error in send-car-rental-notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BookingRow {
  id: string;
  check_in: string;
  check_out: string;
  total_price: number;
  status: string;
  booking_reference: string | null;
}

const formatDate = (value: string) =>
  new Date(value + "T00:00:00").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export function MemberBookingsSection({ email }: { email: string }) {
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (!email) {
      setLoading(false);
      return;
    }
    supabase
      .from("bookings")
      .select("id, check_in, check_out, total_price, status, booking_reference")
      .eq("guest_email", email)
      .order("check_in", { ascending: false })
      .then(({ data }) => {
        if (!active) return;
        setBookings((data as BookingRow[]) ?? []);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [email]);

  return (
    <div className="bg-white rounded-[20px] p-6 md:p-8 border border-[rgba(29,40,57,0.06)] shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#c9a96e]/15 border border-[#c9a96e]/40 flex items-center justify-center">
          <CalendarDays className="w-4 h-4 text-[#c9a96e]" />
        </div>
        <h2 className="font-cormorant text-2xl md:text-3xl text-[#1d2839]">Booking history</h2>
      </div>

      {loading ? (
        <p className="font-inter text-[13px] text-[#1d2839]/55">Loading your bookings...</p>
      ) : bookings.length === 0 ? (
        <div>
          <p className="font-inter text-[13px] text-[#1d2839]/70 leading-relaxed">
            No stays booked under this email yet. Bookings made directly with Margea using{" "}
            <span className="text-[#1d2839]">{email}</span> will appear here. For past bookings made
            on other platforms, use Claim Points.
          </p>
          <Link
            to="/stays"
            className="inline-block mt-4 font-inter text-[12px] uppercase tracking-[0.12em] underline underline-offset-2 text-[#1d2839]"
          >
            Browse stays
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-[rgba(29,40,57,0.08)]">
          {bookings.map((b) => (
            <div key={b.id} className="py-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-inter text-[13px] text-[#1d2839]">
                  {formatDate(b.check_in)} — {formatDate(b.check_out)}
                </p>
                {b.booking_reference && (
                  <p className="font-inter text-[11px] uppercase tracking-[0.14em] text-[#1d2839]/45 mt-0.5">
                    Ref {b.booking_reference}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="font-cormorant text-xl text-[#1d2839]">
                  ${Number(b.total_price).toLocaleString()}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-inter uppercase tracking-[0.14em] bg-[#c9a96e]/15 text-[#1d2839] border border-[#c9a96e]/40">
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

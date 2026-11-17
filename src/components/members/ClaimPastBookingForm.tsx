import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { toursPricing } from "@/data/toursPricing";
import { isPropertyHidden } from "@/config/hidden-properties";

type ClaimType = "stay" | "tour" | "transport";

const PLATFORMS = [
  "Direct with Margea",
  "Booking.com",
  "Airbnb",
  "Expedia",
  "VRBO",
  "Other",
];

interface Props {
  memberEmail: string;
  memberName?: string;
  standalone?: boolean;
  onPointsCredited?: (points: number) => void;
}

export function ClaimPastBookingForm({ memberEmail, memberName, standalone, onPointsCredited }: Props) {
  const [claimType, setClaimType] = useState<ClaimType>("stay");
  const [properties, setProperties] = useState<string[]>([]);
  const [itemName, setItemName] = useState("");
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [bookingDate, setBookingDate] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [creditedPoints, setCreditedPoints] = useState(0);

  useEffect(() => {
    let active = true;
    supabase
      .from("properties")
      .select("id, title")
      .order("title")
      .then(({ data }) => {
        if (!active || !data) return;
        setProperties(
          data
            .filter((p) => !isPropertyHidden(p))
            .map((p) => p.title)
        );
      });
    return () => {
      active = false;
    };
  }, []);

  const amountNumber = Number(amount);
  const points = Number.isFinite(amountNumber) && amountNumber > 0 ? Math.floor(amountNumber * 0.1) : 0;

  const handleTypeChange = (next: ClaimType) => {
    setClaimType(next);
    setItemName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName.trim() || !bookingDate || !(amountNumber > 0)) {
      toast.error("Please complete all fields.");
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("submit-point-claim", {
      body: {
        claim_type: claimType,
        item_name: itemName.trim(),
        platform: claimType === "stay" ? platform : null,
        booking_date: bookingDate,
        amount_usd: amountNumber,
      },
    });
    setSubmitting(false);
    if (error) {
      console.error(error);
      toast.error("Could not submit your claim. Please try again.");
      return;
    }
    const credited = Number((data as { points?: number } | null)?.points ?? points);
    setCreditedPoints(credited);
    setSubmitted(true);
    setItemName("");
    setBookingDate("");
    setAmount("");
    onPointsCredited?.(credited);
    toast.success(`${credited} Margea Points credited to your account.`);
  };

  const fieldClass =
    "w-full h-10 rounded-[10px] bg-white/70 border border-[#1d2839]/15 px-3 font-inter text-[13px] text-[#1d2839] focus:outline-none focus:border-[#1d2839]/40";
  const labelClass =
    "block font-inter text-[11px] uppercase tracking-[0.14em] text-[#1d2839]/70 mb-1.5";

  const wrapperClass = standalone
    ? "bg-white rounded-[20px] p-6 md:p-8 border border-[rgba(29,40,57,0.06)] shadow-sm"
    : "mt-6 pt-6 border-t border-[#1d2839]/15";

  if (submitted) {
    return (
      <div className={wrapperClass}>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-[#1d2839] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-cormorant text-xl text-[#1d2839]">
              Thanks! We've credited {creditedPoints} Margea Points to your account.
            </p>
            <p className="font-inter text-[13px] text-[#1d2839]/80 mt-1">
              Your new balance is already live on your profile. We may still review this booking for verification.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-3 font-inter text-[12px] uppercase tracking-[0.12em] underline underline-offset-2 text-[#1d2839]"
            >
              Submit another booking
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={wrapperClass}>
      <h4 className="font-cormorant text-xl md:text-2xl text-[#1d2839] mb-1">
        Already booked with us? Claim your points
      </h4>
      <p className="font-inter text-[13px] text-[#1d2839]/80 mb-4">
        Log a past booking and your Margea Points are credited right away.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {(["stay", "tour", "transport"] as ClaimType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => handleTypeChange(t)}
            className={`px-4 h-9 rounded-full font-inter text-[12px] uppercase tracking-[0.12em] border transition-colors ${
              claimType === t
                ? "bg-[#1d2839] text-white border-[#1d2839]"
                : "bg-white/50 text-[#1d2839] border-[#1d2839]/20 hover:bg-white/80"
            }`}
          >
            {t === "stay" ? "Stay" : t === "tour" ? "Tour" : "Transport"}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className={claimType === "stay" ? "" : "sm:col-span-2"}>
          <label className={labelClass}>
            {claimType === "stay" ? "Property" : claimType === "tour" ? "Tour" : "Transport route"}
          </label>
          {claimType === "stay" ? (
            <select
              className={fieldClass}
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            >
              <option value="">Select a property</option>
              {properties.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          ) : claimType === "tour" ? (
            <select
              className={fieldClass}
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            >
              <option value="">Select a tour</option>
              {toursPricing.map((t) => (
                <option key={t.id} value={t.title}>
                  {t.title}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          ) : (
            <input
              className={fieldClass}
              placeholder="e.g. Cancun Airport → Tulum"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          )}
        </div>

        {claimType === "stay" && (
          <div>
            <label className={labelClass}>Booking platform</label>
            <select
              className={fieldClass}
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className={labelClass}>
            {claimType === "stay" ? "Check-in date" : "Date"}
          </label>
          <input
            type="date"
            className={fieldClass}
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Amount paid (USD)</label>
          <input
            type="number"
            min="1"
            step="0.01"
            className={fieldClass}
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 bg-[#1d2839] hover:bg-[#2a3a52] disabled:opacity-60 text-white font-inter font-medium tracking-wide px-6 h-11 text-[13px] uppercase rounded-[10px] transition-colors"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          Submit claim
        </button>
        {points > 0 && (
          <span className="font-inter text-[13px] text-[#1d2839]/85">
            You will receive <strong>{points} Margea Points</strong> instantly
          </span>
        )}
      </div>
    </form>
  );
}

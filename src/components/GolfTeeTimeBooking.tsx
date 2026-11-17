import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Users, Loader2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { GolfCourse, GolfPricing } from "@/data/golf-courses-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface GolfTeeTimeBookingProps {
  course: GolfCourse;
}

const TEE_TIMES = [
  "7:00 AM", "7:30 AM", "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM",
  "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM",
];

export function GolfTeeTimeBooking({ course }: GolfTeeTimeBookingProps) {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [players, setPlayers] = useState("2");
  const [selectedRate, setSelectedRate] = useState<GolfPricing>(course.pricing[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const numPlayers = parseInt(players);
  const totalPrice = selectedRate.price * numPlayers;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !name || !email) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-golf-checkout", {
        body: {
          courseId: course.id,
          courseName: course.name,
          playerName: name,
          playerEmail: email,
          playerPhone: phone,
          preferredDate: format(date, "yyyy-MM-dd"),
          preferredTime: time,
          numberOfPlayers: numPlayers,
          rateType: selectedRate.label,
          pricePerPlayer: selectedRate.price,
          totalPrice,
          notes,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error("Golf checkout error:", err);
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <section className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
      <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        Book a Tee Time
      </h2>

      <form onSubmit={handleCheckout} className="space-y-5">
        {/* Rate Selection */}
        {course.pricing.length > 1 && (
          <div>
            <Label className="text-sm font-medium mb-2 block">Rate</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {course.pricing.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setSelectedRate(p)}
                  className={cn(
                    "border rounded-lg px-4 py-3 text-center transition-all text-sm",
                    selectedRate.label === p.label
                      ? "border-primary bg-primary/5 text-primary font-semibold"
                      : "border-border hover:border-primary/40 text-muted-foreground"
                  )}
                >
                  <div className="font-semibold">${p.price} USD</div>
                  <div className="text-xs mt-0.5">{p.label}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < tomorrow}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Tee Time *</Label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {TEE_TIMES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Players */}
        <div>
          <Label className="text-sm font-medium mb-2 block">Number of Players *</Label>
          <Select value={players} onValueChange={setPlayers}>
            <SelectTrigger className="w-full">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} {n === 1 ? "Player" : "Players"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="golf-name" className="text-sm font-medium mb-2 block">Full Name *</Label>
            <Input id="golf-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
          </div>
          <div>
            <Label htmlFor="golf-email" className="text-sm font-medium mb-2 block">Email *</Label>
            <Input id="golf-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@email.com" />
          </div>
        </div>

        <div>
          <Label htmlFor="golf-phone" className="text-sm font-medium mb-2 block">Phone</Label>
          <Input id="golf-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" />
        </div>

        <div>
          <Label htmlFor="golf-notes" className="text-sm font-medium mb-2 block">Notes (optional)</Label>
          <Textarea id="golf-notes" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Club rentals, cart preferences, special requests..." />
        </div>

        {/* Price Breakdown */}
        <div className="bg-muted/40 rounded-xl p-5 space-y-2 border border-border">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{selectedRate.label} rate</span>
            <span>${selectedRate.price} USD / player</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Players</span>
            <span>× {numPlayers}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between font-semibold text-foreground text-lg">
            <span>Total</span>
            <span>${totalPrice} USD</span>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay $${totalPrice} USD — Book Tee Time`
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          Secure payment powered by Stripe. Your booking will be confirmed immediately.
        </p>
      </form>
    </section>
  );
}

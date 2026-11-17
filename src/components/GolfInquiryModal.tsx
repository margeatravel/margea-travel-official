import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { golfCourses, GolfCourse } from "@/data/golf-courses-data";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckCircle } from "lucide-react";

interface GolfInquiryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedCourse?: GolfCourse | null;
}

export function GolfInquiryModal({
  open,
  onOpenChange,
  preselectedCourse,
}: GolfInquiryModalProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [caseNumber, setCaseNumber] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    preferredCourse: preselectedCourse?.name || "",
    preferredTeeTime: "",
    numberOfPlayers: "2",
    message: "",
  });

  // Update preselected course when modal opens
  const handleOpenChange = (o: boolean) => {
    if (o && preselectedCourse) {
      setForm((f) => ({ ...f, preferredCourse: preselectedCourse.name }));
    }
    if (!o) {
      setSubmitted(false);
    }
    onOpenChange(o);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Insert into DB
      const { data, error } = await supabase
        .from("golf_inquiries" as any)
        .insert({
          full_name: form.fullName,
          email: form.email,
          phone: form.phone,
          preferred_course: form.preferredCourse,
          preferred_tee_time: form.preferredTeeTime,
          number_of_players: parseInt(form.numberOfPlayers),
          message: form.message,
        } as any)
        .select()
        .single();

      if (error) throw error;

      const cn = (data as any)?.case_number || "MAR-GF-00000";
      setCaseNumber(cn);

      // Send email notification
      await supabase.functions.invoke("send-golf-inquiry-email", {
        body: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          preferredCourse: form.preferredCourse,
          preferredTeeTime: form.preferredTeeTime,
          numberOfPlayers: form.numberOfPlayers,
          message: form.message,
          caseNumber: cn,
        },
      });

      setSubmitted(true);
      setForm({
        fullName: "",
        email: "",
        phone: "",
        preferredCourse: "",
        preferredTeeTime: "",
        numberOfPlayers: "2",
        message: "",
      });
    } catch (err: any) {
      console.error("Golf inquiry error:", err);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="margea-booking-modal sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            {submitted ? "Request Received" : "Golf Tee Time Inquiry"}
          </DialogTitle>
        </DialogHeader>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-primary mx-auto" />
            <h3 className="text-lg font-semibold text-foreground">Thank you!</h3>
            <p className="text-muted-foreground">
              Your golf inquiry has been submitted. Our team will contact you shortly.
            </p>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-xs text-muted-foreground">Case Number</p>
              <p className="text-2xl font-bold text-primary">{caseNumber}</p>
            </div>
            <p className="text-sm text-muted-foreground">
              Follow us{" "}
              <a
                href="https://www.instagram.com/margeatravel/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                @margeatravel
              </a>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="golf-name">Full Name</Label>
              <Input
                id="golf-name"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="golf-email">Email</Label>
              <Input
                id="golf-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="golf-phone">Phone Number</Label>
              <Input
                id="golf-phone"
                type="tel"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="golf-course">Preferred Golf Course</Label>
              <Select
                value={form.preferredCourse}
                onValueChange={(v) => setForm({ ...form, preferredCourse: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {golfCourses.map((c) => (
                    <SelectItem key={c.id} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="golf-tee">Preferred Tee Time</Label>
                <Input
                  id="golf-tee"
                  type="time"
                  value={form.preferredTeeTime}
                  onChange={(e) =>
                    setForm({ ...form, preferredTeeTime: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="golf-players">Number of Players</Label>
                <Select
                  value={form.numberOfPlayers}
                  onValueChange={(v) =>
                    setForm({ ...form, numberOfPlayers: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} {n === 1 ? "Player" : "Players"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="golf-msg">Message / Special Requests</Label>
              <Textarea
                id="golf-msg"
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Inquiry"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, Loader2, X } from "lucide-react";

interface ClaimRow {
  id: string;
  member_email: string;
  member_name: string | null;
  claim_type: string;
  item_name: string;
  platform: string | null;
  booking_date: string;
  amount_usd: number;
  points: number;
  status: string;
  created_at: string;
}

export function AdminPointClaims() {
  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("point_claims")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error(error);
      toast.error("Failed to load point claims.");
    } else {
      setClaims((data ?? []) as ClaimRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const decide = async (claim: ClaimRow, status: "approved" | "rejected") => {
    setBusyId(claim.id);
    const { error } = await supabase
      .from("point_claims")
      .update({ status })
      .eq("id", claim.id);

    if (!error && status === "approved") {
      const { data: member } = await supabase
        .from("members")
        .select("id, credits_balance")
        .eq("email", claim.member_email)
        .maybeSingle();
      if (member) {
        await supabase
          .from("members")
          .update({ credits_balance: (member.credits_balance ?? 0) + claim.points })
          .eq("id", member.id);
      }
    }

    setBusyId(null);
    if (error) {
      toast.error("Failed to update claim.");
      return;
    }
    setClaims((prev) => prev.map((c) => (c.id === claim.id ? { ...c, status } : c)));
    toast.success(status === "approved" ? `Approved — ${claim.points} points credited.` : "Claim rejected.");
  };

  return (
    <div className="mt-10 bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-cormorant text-2xl text-[#1d2839]">Past Booking Point Claims</h2>
        <Button size="sm" variant="outline" onClick={load} disabled={loading}>
          Refresh
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3 font-medium">Member</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Item</th>
              <th className="px-4 py-3 font-medium">Platform</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Points</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-gray-500">
                  <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Loading claims…
                </td>
              </tr>
            )}
            {!loading && claims.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-gray-500">
                  No claims submitted yet.
                </td>
              </tr>
            )}
            {!loading &&
              claims.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-[#1d2839]">
                    <div className="font-medium">{c.member_name ?? "—"}</div>
                    <div className="text-gray-600 text-xs">{c.member_email}</div>
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-700">{c.claim_type}</td>
                  <td className="px-4 py-3 text-gray-700">{c.item_name}</td>
                  <td className="px-4 py-3 text-gray-700">{c.platform ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {new Date(c.booking_date).toLocaleDateString("en-US", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-gray-700">${Number(c.amount_usd).toFixed(2)}</td>
                  <td className="px-4 py-3 font-mono text-[#1d2839]">{c.points}</td>
                  <td className="px-4 py-3">
                    {c.status === "approved" ? (
                      <Badge className="bg-[#c9a96e] hover:bg-[#c9a96e] text-[#1d2839]">Approved</Badge>
                    ) : c.status === "rejected" ? (
                      <Badge variant="outline" className="border-red-400 text-red-600">Rejected</Badge>
                    ) : (
                      <Badge variant="outline" className="border-amber-500 text-amber-700">Pending</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {c.status === "pending" ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          disabled={busyId === c.id}
                          onClick={() => decide(c, "approved")}
                          className="bg-[#1d2839] hover:bg-[#2a3a52] text-white"
                        >
                          {busyId === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busyId === c.id}
                          onClick={() => decide(c, "rejected")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2, Search, ShieldCheck, LogOut, Plus, UserPlus } from "lucide-react";
import { AdminPointClaims } from "@/components/admin/AdminPointClaims";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface MemberRow {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  country: string;
  status: string;
  credits_balance: number;
  created_at: string;
}

export default function AdminMembers() {
  const navigate = useNavigate();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [creditInputs, setCreditInputs] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const [grantOpen, setGrantOpen] = useState(false);
  const [grantEmail, setGrantEmail] = useState("");
  const [grantBusy, setGrantBusy] = useState(false);

  const handleGrantAdmin = async () => {
    const email = grantEmail.trim().toLowerCase();
    if (!email) {
      toast.error("Enter an email address.");
      return;
    }
    setGrantBusy(true);
    const { data, error } = await supabase.rpc("grant_admin_by_email", { _email: email });
    setGrantBusy(false);
    if (error) {
      console.error(error);
      toast.error(error.message || "Failed to grant admin access.");
      return;
    }
    const result = data as { success: boolean; message: string } | null;
    if (result?.success) {
      toast.success(result.message || "Admin role granted.");
      setGrantEmail("");
      setGrantOpen(false);
    } else {
      toast.error(result?.message || "Could not grant admin role.");
    }
  };
  useEffect(() => {
    const verify = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        navigate("/members/login?redirect=/admin/members", { replace: true });
        return;
      }

      setUserEmail(session.user.email ?? null);

      const { data: roleData, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error(error);
        toast.error("Could not verify admin access.");
        setCheckingAuth(false);
        return;
      }

      if (!roleData) {
        setIsAdmin(false);
        setCheckingAuth(false);
        return;
      }

      setIsAdmin(true);
      setCheckingAuth(false);
    };

    verify();
  }, [navigate]);

  const loadMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("members")
      .select("id, first_name, last_name, email, phone, country, status, credits_balance, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error("Failed to load members.");
    } else {
      setMembers((data ?? []) as MemberRow[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) loadMembers();
  }, [isAdmin]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        `${m.first_name} ${m.last_name}`.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q),
    );
  }, [members, search]);

  const handleActivate = async (id: string) => {
    setBusyId(id);
    const { error } = await supabase
      .from("members")
      .update({ status: "active" })
      .eq("id", id);
    setBusyId(null);
    if (error) {
      toast.error("Failed to activate member.");
      return;
    }
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status: "active" } : m)));
    toast.success("Member activated.");
  };

  const handleAddCredits = async (id: string) => {
    const raw = creditInputs[id];
    const amount = parseInt(raw ?? "", 10);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a positive credit amount.");
      return;
    }
    const target = members.find((m) => m.id === id);
    if (!target) return;
    const newBalance = (target.credits_balance ?? 0) + amount;

    setBusyId(id);
    const { error } = await supabase
      .from("members")
      .update({ credits_balance: newBalance })
      .eq("id", id);
    setBusyId(null);

    if (error) {
      toast.error("Failed to add credits.");
      return;
    }
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, credits_balance: newBalance } : m)),
    );
    setCreditInputs((prev) => ({ ...prev, [id]: "" }));
    toast.success(`Added ${amount} credits.`);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/members/login", { replace: true });
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f6f3]">
        <Loader2 className="h-6 w-6 animate-spin text-[#1d2839]" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1d2839] p-6">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center">
          <ShieldCheck className="h-10 w-10 text-[#c9a96e] mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-[#1d2839] mb-2">Admin access required</h1>
          <p className="text-sm text-gray-600 mb-2">
            Signed in as <span className="font-medium">{userEmail}</span>
          </p>
          <p className="text-sm text-gray-600 mb-6">
            This account does not have admin permissions. Contact a workspace administrator to request access.
          </p>
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
            >
              Sign out
            </Button>
            <Link to="/" className="text-sm text-[#1d2839] underline">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f3]">
      <Helmet>
        <title>Admin · Members · Margea</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      {/* Header */}
      <header className="bg-[#1d2839] text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-[#c9a96e]" />
            <div>
              <h1 className="text-lg font-semibold leading-tight">Margea Admin</h1>
              <p className="text-xs text-white/60">Members management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-sm text-white/70">{userEmail}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSignOut}
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-1" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-[#1d2839]">Members</h2>
            <p className="text-sm text-gray-600">
              {filtered.length} of {members.length} member{members.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Dialog open={grantOpen} onOpenChange={setGrantOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1d2839] hover:bg-[#2a3a52] text-white whitespace-nowrap">
                  <UserPlus className="h-4 w-4 mr-2" /> Grant admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Grant admin access</DialogTitle>
                  <DialogDescription>
                    Enter the email of an existing user account. They must already have signed up
                    (members or auth account) before they can be promoted.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2 py-2">
                  <Label htmlFor="grant-email">User email</Label>
                  <Input
                    id="grant-email"
                    type="email"
                    placeholder="user@example.com"
                    value={grantEmail}
                    onChange={(e) => setGrantEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !grantBusy) handleGrantAdmin();
                    }}
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setGrantOpen(false)}
                    disabled={grantBusy}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGrantAdmin}
                    disabled={grantBusy}
                    className="bg-[#1d2839] hover:bg-[#2a3a52] text-white"
                  >
                    {grantBusy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" /> Grant admin
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#1d2839] text-white text-left">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Country</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Credits</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                      <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Loading members…
                    </td>
                  </tr>
                )}
                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                      No members found.
                    </td>
                  </tr>
                )}
                {!loading &&
                  filtered.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50 align-top">
                      <td className="px-4 py-3 font-medium text-[#1d2839]">
                        {m.first_name} {m.last_name}
                      </td>
                      <td className="px-4 py-3 text-gray-700">{m.email}</td>
                      <td className="px-4 py-3 text-gray-700">{m.country}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{m.phone}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {new Date(m.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-4 py-3">
                        {m.status === "active" ? (
                          <Badge className="bg-[#c9a96e] hover:bg-[#c9a96e] text-[#1d2839]">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-amber-500 text-amber-700">
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-[#1d2839]">{m.credits_balance ?? 0}</td>
                      <td className="px-4 py-3">
                        {m.status !== "active" ? (
                          <Button
                            size="sm"
                            disabled={busyId === m.id}
                            onClick={() => handleActivate(m.id)}
                            className="bg-[#1d2839] hover:bg-[#2a3a52] text-white"
                          >
                            {busyId === m.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              "Activate"
                            )}
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min={1}
                              placeholder="0"
                              value={creditInputs[m.id] ?? ""}
                              onChange={(e) =>
                                setCreditInputs((prev) => ({ ...prev, [m.id]: e.target.value }))
                              }
                              className="w-20 h-8"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={busyId === m.id}
                              onClick={() => handleAddCredits(m.id)}
                              className="border-[#c9a96e] text-[#1d2839] hover:bg-[#c9a96e]/10"
                            >
                              {busyId === m.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <Plus className="h-3 w-3 mr-1" /> Credits
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          Admin access is controlled via the <code>user_roles</code> table. To grant another user
          admin access, insert a row with their <code>user_id</code> and role <code>admin</code>.
        </p>
        <AdminPointClaims />
      </main>
    </div>
  );
}

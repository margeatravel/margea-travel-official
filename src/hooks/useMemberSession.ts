import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Session-aware member auth state.
 * Validates against the auth server with getUser() (not the cached getSession())
 * and keeps in sync via onAuthStateChange.
 */
export function useMemberSession() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const validate = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!active) return;
      setEmail(!error && data.user ? data.user.email ?? "" : null);
      setLoading(false);
    };

    validate();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      validate();
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { loading, isSignedIn: !!email, email };
}

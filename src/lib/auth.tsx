import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "jeweler" | "ambassador" | "volunteer";

/** Current session plus the roles granted to the signed-in account. */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    const loadRoles = async (user: User | null) => {
      if (!user) {
        if (alive) setRoles([]);
        return;
      }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      if (alive) setRoles((data ?? []).map((r) => r.role as AppRole));
    };

    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session);
      setLoading(false);
      void loadRoles(data.session?.user ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      setSession(next);
      void loadRoles(next?.user ?? null);
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user: session?.user ?? null,
    roles,
    loading,
    isAdmin: roles.includes("admin"),
    signOut: () => supabase.auth.signOut(),
  };
}

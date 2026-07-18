"use client";

import { FormEvent, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

export function AuthPanel() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  async function sendMagicLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const client = supabase;
    if (!client) return;
    const { error } = await client.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    setMessage(error ? error.message : "Check your email for a sign-in link.");
  }

  const client = supabase;
  if (!client) return <p className="auth-note">Add Supabase environment variables to enable saved progress and sign-in.</p>;
  if (user) return <div className="auth-panel"><span>Signed in as {user.email}</span><button type="button" onClick={() => client.auth.signOut()}>Sign out</button></div>;
  return (
    <form className="auth-panel" onSubmit={sendMagicLink}>
      <label htmlFor="auth-email">Save your progress</label>
      <input id="auth-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
      <button type="submit">Email me a sign-in link</button>
      {message && <span>{message}</span>}
    </form>
  );
}

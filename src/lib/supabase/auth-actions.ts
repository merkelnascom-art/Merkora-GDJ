"use server";

import { getSupabaseServerClient } from "./server";

export type AuthActionResult = { ok: true; message?: string } | { ok: false; error: string };

export async function signInWithPassword(form: { email: string; password: string }): Promise<AuthActionResult> {
  const email = form.email.trim();
  if (!email || !form.password) return { ok: false, error: "Renseigne ton adresse e-mail et ton mot de passe." };
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "La connexion sécurisée n'est pas encore configurée. Le mode local reste disponible." };
  const { error } = await supabase.auth.signInWithPassword({ email, password: form.password });
  if (error) return { ok: false, error: "Connexion impossible. Vérifie tes identifiants ou confirme ton adresse e-mail." };
  return { ok: true, message: "Connexion réussie." };
}

export async function signUpWithPassword(form: { email: string; password: string; displayName: string }): Promise<AuthActionResult> {
  const email = form.email.trim();
  const displayName = form.displayName.trim();
  if (!email || !form.password) return { ok: false, error: "Renseigne ton adresse e-mail et un mot de passe." };
  if (form.password.length < 8) return { ok: false, error: "Choisis un mot de passe d'au moins 8 caractères." };
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "La création de compte n'est pas encore configurée. Le mode local reste disponible." };
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.signUp({
    email,
    password: form.password,
    options: {
      data: { display_name: displayName },
      emailRedirectTo: new URL("/auth/callback", baseUrl).toString(),
    },
  });
  if (error) return { ok: false, error: "Création du compte impossible. Vérifie l'adresse saisie et réessaie." };
  return { ok: true, message: "Compte créé. Consulte ta boîte e-mail pour confirmer ton adresse avant de te connecter." };
}

export async function signOut(_formData?: FormData): Promise<AuthActionResult> {
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "La connexion sécurisée n'est pas configurée." };
  const { error } = await supabase.auth.signOut();
  if (error) return { ok: false, error: "La déconnexion n'a pas abouti. Réessaie." };
  return { ok: true };
}

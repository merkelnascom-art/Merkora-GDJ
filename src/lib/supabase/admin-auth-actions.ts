"use server";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "./server";
import { MERKORA_ADMIN_EMAIL } from "./admin-constants";
export type AdminAuthResult = { ok: true; message?: string } | { ok: false; error: string };
export async function requestAdminOtp(emailValue: string): Promise<AdminAuthResult> {
  const email = emailValue.trim().toLowerCase();
  if (email !== MERKORA_ADMIN_EMAIL) return { ok: false, error: "Cette adresse n'est pas autorisée pour l'administration MerKora." };
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Le service de connexion sécurisée n'est pas configuré." };
  const { error } = await supabase.auth.signInWithOtp({ email: MERKORA_ADMIN_EMAIL, options: { shouldCreateUser: false } });
  if (error) return { ok: false, error: "Impossible d'envoyer le code. Vérifie la configuration e-mail de MerKora ou réessaie plus tard." };
  return { ok: true, message: "Un code de connexion a été envoyé dans la boîte e-mail administrateur." };
}
export async function verifyAdminOtp(emailValue: string, tokenValue: string): Promise<AdminAuthResult> {
  const email = emailValue.trim().toLowerCase();
  const token = tokenValue.replace(/\s/g, "");
  if (email !== MERKORA_ADMIN_EMAIL) return { ok: false, error: "Adresse administrateur non autorisée." };
  if (!/^\d{6}$/.test(token)) return { ok: false, error: "Saisis le code à six chiffres reçu par e-mail." };
  const supabase = await getSupabaseServerClient();
  if (!supabase) return { ok: false, error: "Le service de connexion sécurisée n'est pas configuré." };
  const { error } = await supabase.auth.verifyOtp({ email: MERKORA_ADMIN_EMAIL, token, type: "email" });
  if (error) return { ok: false, error: "Code invalide ou expiré. Demande un nouveau code puis réessaie." };
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user || user.email?.trim().toLowerCase() !== MERKORA_ADMIN_EMAIL) {
    await supabase.auth.signOut();
    return { ok: false, error: "Cette session ne possède pas l'identité administrateur autorisée." };
  }
  return { ok: true, message: "Identité administrateur vérifiée." };
}
export async function adminSignOut(): Promise<void> {
  const supabase = await getSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}

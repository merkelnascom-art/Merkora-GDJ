import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

type CustomerOrder = {
  id: string;
  customer_name: string;
  desired_date: string | null;
  total_amount_xof: number;
  status: string;
  created_at: string;
};
type CustomerRequest = {
  id: string;
  creation_type: string;
  occasion: string;
  desired_date: string;
  status: string;
  reference_image_path: string | null;
  reference_image_url?: string;
  created_at: string;
};

const orderLabels: Record<string, string> = {
  received: "Reçue", confirmed: "Confirmée", preparing: "En préparation",
  ready: "Prête", delivered: "Livrée", cancelled: "Annulée",
};
const requestLabels: Record<string, string> = {
  received: "Reçue", reviewing: "En étude", quoted: "Devis proposé",
  accepted: "Acceptée", rejected: "Refusée", completed: "Terminée",
};
const money = (value: number) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value) + " FCFA";

export function CustomerAccountPanel({
  supabase,
  storeId,
}: {
  supabase: SupabaseClient;
  storeId: string;
}) {
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [requests, setRequests] = useState<CustomerRequest[]>([]);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [registerMode, setRegisterMode] = useState(false);

  const loadHistory = useCallback(async (id: string) => {
    const [orderResult, requestResult] = await Promise.all([
      supabase.from("project_store_orders")
        .select("id,customer_name,desired_date,total_amount_xof,status,created_at")
        .eq("storefront_id", storeId).eq("customer_user_id", id)
        .order("created_at", { ascending: false }).limit(50),
      supabase.from("project_store_custom_requests")
        .select("id,creation_type,occasion,desired_date,status,reference_image_path,created_at")
        .eq("storefront_id", storeId).eq("customer_user_id", id)
        .order("created_at", { ascending: false }).limit(50),
    ]);
    if (orderResult.error || requestResult.error) {
      setFeedback("Impossible de charger votre suivi. Réessayez dans quelques instants.");
      return;
    }
    setOrders((orderResult.data ?? []) as CustomerOrder[]);
    const rows = (requestResult.data ?? []) as CustomerRequest[];
    const withImages = await Promise.all(rows.map(async (request) => {
      if (!request.reference_image_path) return request;
      const { data } = await supabase.storage.from("project-store-references")
        .createSignedUrl(request.reference_image_path, 900);
      return { ...request, reference_image_url: data?.signedUrl ?? "" };
    }));
    setRequests(withImages);
  }, [storeId, supabase]);

  useEffect(() => {
    let alive = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (!alive) return;
      const user = data.user;
      setUserId(user?.id ?? "");
      setUserEmail(user?.email ?? "");
      if (user) void loadHistory(user.id);
    });
    const refreshHistory = () => {
      void supabase.auth.getUser().then(({ data: current }) => {
        if (current.user) void loadHistory(current.user.id);
      });
    };
    window.addEventListener("merkora-store-order-submitted", refreshHistory);
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setUserId(user?.id ?? "");
      setUserEmail(user?.email ?? "");
      if (user) void loadHistory(user.id);
      else { setOrders([]); setRequests([]); }
    });
    return () => { alive = false; data.subscription.unsubscribe(); window.removeEventListener("merkora-store-order-submitted", refreshHistory); };
  }, [loadHistory, supabase]);

  async function authenticate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFeedback("");
    if (registerMode) {
      const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
      if (error) setFeedback("Création du compte impossible : " + error.message);
      else if (data.session && data.user) {
        setFeedback("Compte créé. Vous êtes connecté.");
        setPassword("");
        await loadHistory(data.user.id);
      } else {
        setFeedback("Compte créé. Consultez votre email pour confirmer l'inscription, puis connectez-vous.");
        setRegisterMode(false);
        setPassword("");
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) setFeedback("Connexion impossible : " + error.message);
      else if (data.user) {
        setFeedback("Connexion réussie. Voici votre suivi personnel.");
        setPassword("");
        await loadHistory(data.user.id);
      }
    }
    setBusy(false);
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) setFeedback("Déconnexion impossible. Réessayez.");
    else {
      setUserId(""); setUserEmail(""); setOrders([]); setRequests([]);
      setFeedback("Vous êtes déconnecté.");
    }
  }

  return (
    <section className="sweet-panel" aria-labelledby="customer-account-title">
      <p className="eyebrow">Votre espace personnel</p>
      <h2 id="customer-account-title">Mes commandes et mon suivi</h2>
      {!userId ? (
        <>
          <p>Créez un compte ou connectez-vous pour retrouver vos commandes et vos demandes personnalisées sur tous vos appareils.</p>
          <form className="sweet-form" onSubmit={authenticate}>
            <label>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <label>Mot de passe<input required type="password" minLength={8} autoComplete={registerMode ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            <button type="submit" disabled={busy}>{registerMode ? "Créer mon compte" : "Me connecter"}</button>
          </form>
          <button className="sweet-secondary" type="button" onClick={() => setRegisterMode((value) => !value)}>
            {registerMode ? "J'ai déjà un compte" : "Créer un compte client"}
          </button>
        </>
      ) : (
        <div className="sweet-history">
          <div className="sweet-inline"><span>Connecté : {userEmail}</span><button type="button" onClick={signOut}>Déconnexion</button><button type="button" onClick={() => void loadHistory(userId)}>Actualiser</button></div>
          <h3>Mes commandes</h3>
          {orders.length === 0 ? <p>Aucune commande liée à ce compte pour le moment.</p> : orders.map((order) => (
            <article key={order.id}>
              <strong>{money(Number(order.total_amount_xof))}</strong>
              <span>Commande du {new Date(order.created_at).toLocaleDateString("fr-FR")} · {order.desired_date ? "Souhaitée le " + order.desired_date : "Date à convenir"}</span>
              <span>Statut : <strong>{orderLabels[order.status] ?? order.status}</strong></span>
              <small>Référence : {order.id.slice(0, 8).toUpperCase()}</small>
            </article>
          ))}
          <h3>Mes demandes personnalisées</h3>
          {requests.length === 0 ? <p>Aucune demande personnalisée liée à ce compte pour le moment.</p> : requests.map((request) => (
            <article key={request.id}>
              <strong>{request.creation_type} · {request.occasion}</strong>
              <span>Demandée le {new Date(request.created_at).toLocaleDateString("fr-FR")} · souhaitée le {request.desired_date}</span>
              <span>Statut : <strong>{requestLabels[request.status] ?? request.status}</strong></span>
              {request.reference_image_url ? <a href={request.reference_image_url} target="_blank" rel="noreferrer"><img className="sweet-reference-image" src={request.reference_image_url} alt="Votre photo d'inspiration" /></a> : null}
            </article>
          ))}
        </div>
      )}
      {feedback ? <p className="sweet-feedback" role="status" aria-live="polite">{feedback}</p> : null}
    </section>
  );
}

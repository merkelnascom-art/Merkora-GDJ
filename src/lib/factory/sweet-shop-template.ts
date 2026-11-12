export type SweetShopMode = "catalogue" | "custom-order" | "cart";

export function sweetShopModeForModule(id: string): SweetShopMode | null {
  if (id === "catalogue-de-gateau-et-de-patisserie") return "catalogue";
  if (id === "commande-personnalisee") return "custom-order";
  if (id === "panier-et-validation-de-commande") return "cart";
  return null;
}

export function createSweetShopModulePage(id: string, title: string, description: string): string {
  const mode = sweetShopModeForModule(id);
  if (!mode) throw new Error("Module Asho Sweet non pris en charge.");
  return `import { SweetShopWorkspace } from "@/components/sweet-shop-workspace";

export default function SweetShopModulePage() {
  return (
    <main>
      <p className="eyebrow">Asho Sweet · Espace de commande</p>
      <h1>{${JSON.stringify(title)}}</h1>
      <p className="lead">{${JSON.stringify(description)}}</p>
      <SweetShopWorkspace mode="${mode}" />
      <p><a href="/">← Retour à l'accueil</a></p>
    </main>
  );
}
`;
}

export const sweetShopStyles = `
.sweet-workspace { display: grid; gap: 22px; margin-top: 28px; }
.sweet-panel { padding: clamp(20px, 4vw, 32px); border: 1px solid #e2e8f0; border-radius: 22px; background: #fff; box-shadow: 0 12px 36px #1720330a; }
.sweet-panel h2 { margin: 8px 0 10px; font-size: clamp(22px, 3vw, 30px); }
.sweet-panel > p:not(.eyebrow) { color: #64748b; line-height: 1.65; }
.sweet-heading { display: flex; justify-content: space-between; align-items: start; gap: 16px; }
.sweet-count, .sweet-category { display: inline-flex; padding: 6px 10px; border-radius: 999px; background: #f1f5f9; color: #475569; font-size: 12px; font-weight: 700; }
.sweet-notice { display: grid; gap: 4px; padding: 14px 18px; border: 1px solid #bfdbfe; border-radius: 14px; background: #eff6ff; color: #1e40af; font-size: 13px; line-height: 1.5; }
.sweet-products { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-top: 22px; }
.sweet-product { display: flex; flex-direction: column; align-items: start; gap: 10px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; }
.sweet-product h3, .sweet-history h3 { margin: 4px 0; }
.sweet-product p { flex: 1; margin: 0; color: #64748b; line-height: 1.55; }
.sweet-product img { width: 100%; height: 170px; object-fit: cover; border-radius: 12px; }
.sweet-product > strong { font-size: 18px; }
.sweet-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 20px; }
.sweet-form label { display: grid; gap: 7px; color: #334155; font-size: 13px; font-weight: 650; }
.sweet-form input, .sweet-form select, .sweet-form textarea, .sweet-cart-line input { width: 100%; min-width: 0; padding: 11px 12px; border: 1px solid #cbd5e1; border-radius: 10px; background: #fff; color: #172033; font: inherit; }
.sweet-form textarea { min-height: 92px; resize: vertical; }
.sweet-wide { grid-column: 1 / -1; }
.sweet-form button, .sweet-product button, .sweet-action { width: fit-content; padding: 11px 16px; border: 0; border-radius: 10px; background: #172033; color: white; font-weight: 700; cursor: pointer; }
.sweet-form button:disabled { opacity: .45; cursor: not-allowed; }
.sweet-empty { padding: 22px; border: 1px dashed #cbd5e1; border-radius: 14px; color: #64748b; }
.sweet-cart { display: grid; gap: 12px; }
.sweet-cart-line { display: grid; grid-template-columns: 1fr 90px auto; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid #e2e8f0; }
.sweet-cart-line div { display: grid; gap: 4px; }
.sweet-cart-line span, .sweet-history span, .sweet-history small { color: #64748b; font-size: 13px; }
.sweet-total { display: flex; justify-content: space-between; padding-top: 12px; font-size: 18px; }
.sweet-history { display: grid; gap: 12px; margin-top: 24px; }
.sweet-history article { display: grid; gap: 8px; padding: 14px; border-radius: 12px; background: #f8fafc; }
.sweet-inline { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
.sweet-inline button, .sweet-history button, .sweet-secondary { padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 9px; background: white; color: #172033; font-weight: 650; cursor: pointer; }
.sweet-feedback { padding: 12px 16px; border-radius: 12px; background: #eff6ff; color: #1e40af; }
@media (max-width: 640px) { .sweet-form { grid-template-columns: 1fr; } .sweet-wide { grid-column: auto; } .sweet-cart-line { grid-template-columns: 1fr 72px; } .sweet-cart-line > strong { grid-column: 1 / -1; } .sweet-heading { flex-direction: column; } }
`;

export const sweetShopWorkspaceSource = String.raw`"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Mode = "catalogue" | "custom-order" | "cart";
type Store = { id: string; display_name: string; description: string; is_published: boolean };
type Product = { id: string; name: string; description: string; category: string; price_xof: number; image_url: string; is_active: boolean };
type CartLine = { productId: string; quantity: number };
type Order = { id: string; customer_name: string; customer_phone: string; desired_date: string | null; notes: string; items: Array<{ name: string; quantity: number; unit_price_xof: number; line_total_xof: number }>; total_amount_xof: number; status: string; created_at: string };
type CustomRequest = { id: string; customer_name: string; customer_phone: string; occasion: string; desired_date: string; portions: number; flavour: string; decoration: string; notes: string; status: string; created_at: string };

const STOREFRONT_SLUG = "asho-sweet";
const money = (value: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value) + " FCFA";
const statuses = ["received", "confirmed", "preparing", "ready", "delivered", "cancelled"];
const requestStatuses = ["received", "reviewing", "quoted", "accepted", "rejected", "completed"];

function makeClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export function SweetShopWorkspace({ mode }: { mode: Mode }) {
  const supabase = useMemo(() => makeClient(), []);
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [adminOpen, setAdminOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("Gâteaux");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [occasion, setOccasion] = useState("");
  const [portions, setPortions] = useState("8");
  const [flavour, setFlavour] = useState("");
  const [decoration, setDecoration] = useState("");
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);

  const loadStore = useCallback(async () => {
    if (!supabase) return;
    const { data, error } = await supabase.from("project_storefronts")
      .select("id,display_name,description,is_published").eq("slug", STOREFRONT_SLUG).maybeSingle();
    if (error) { setFeedback("Impossible de charger la boutique : " + error.message); return; }
    setStore(data as Store | null);
  }, [supabase]);

  const loadPublicProducts = useCallback(async (storeId: string) => {
    if (!supabase) return;
    const { data, error } = await supabase.from("project_store_products")
      .select("id,name,description,category,price_xof,image_url,is_active")
      .eq("storefront_id", storeId).eq("is_active", true).order("sort_order");
    if (error) { setFeedback("Impossible de charger le catalogue : " + error.message); return; }
    setProducts((data ?? []) as Product[]);
  }, [supabase]);

  const loadAdminData = useCallback(async (storeId: string) => {
    if (!supabase) return;
    const [productResult, orderResult, requestResult] = await Promise.all([
      supabase.from("project_store_products").select("id,name,description,category,price_xof,image_url,is_active").eq("storefront_id", storeId).order("created_at", { ascending: false }),
      supabase.from("project_store_orders").select("*").eq("storefront_id", storeId).order("created_at", { ascending: false }).limit(100),
      supabase.from("project_store_custom_requests").select("*").eq("storefront_id", storeId).order("created_at", { ascending: false }).limit(100),
    ]);
    if (productResult.error || orderResult.error || requestResult.error) {
      setFeedback("Accès gestion refusé ou chargement impossible. Vérifiez que vous utilisez le compte propriétaire du projet.");
      return;
    }
    setProducts((productResult.data ?? []) as Product[]);
    setOrders((orderResult.data ?? []) as Order[]);
    setRequests((requestResult.data ?? []) as CustomRequest[]);
  }, [supabase]);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (!alive) return;
      setUserEmail(data.user?.email ?? "");
      await loadStore();
    };
    void init();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? "");
      void Promise.resolve().then(loadStore);
    });
    return () => { alive = false; authListener.subscription.unsubscribe(); };
  }, [supabase, loadStore]);

  useEffect(() => {
    if (!store || !supabase) return;
    if (userEmail) void loadAdminData(store.id);
    else if (store.is_published) void loadPublicProducts(store.id);
    else setProducts([]);
  }, [store, userEmail, supabase, loadAdminData, loadPublicProducts]);

  const cartLines = useMemo(() => cart.map((line) => {
    const product = products.find((item) => item.id === line.productId);
    return product ? { ...product, quantity: line.quantity } : null;
  }).filter((line): line is Product & { quantity: number } => Boolean(line)), [cart, products]);
  const estimatedTotal = cartLines.reduce((sum, line) => sum + Number(line.price_xof) * line.quantity, 0);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) setFeedback("Connexion impossible : " + error.message);
    else { setPassword(""); setFeedback("Connexion effectuée. Chargement de l'espace de gestion…"); }
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setOrders([]); setRequests([]); setAdminOpen(false); setFeedback("Vous êtes déconnecté.");
  }

  async function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !store) return;
    const price = Number(productPrice);
    if (!productName.trim() || !Number.isSafeInteger(price) || price <= 0) {
      setFeedback("Saisissez un nom et un prix entier positif en FCFA."); return;
    }
    setBusy(true);
    const { error } = await supabase.from("project_store_products").insert({
      storefront_id: store.id, name: productName.trim(), description: productDescription.trim(),
      category: productCategory, price_xof: price, image_url: productImage.trim(),
    });
    setBusy(false);
    if (error) { setFeedback("Ajout impossible : " + error.message); return; }
    setProductName(""); setProductDescription(""); setProductPrice(""); setProductImage("");
    await loadAdminData(store.id); setFeedback("Produit ajouté au catalogue.");
  }

  async function updateProduct(product: Product, changes: Partial<Product>) {
    if (!supabase || !store) return;
    const { error } = await supabase.from("project_store_products").update(changes).eq("id", product.id).eq("storefront_id", store.id);
    if (error) { setFeedback("Modification impossible : " + error.message); return; }
    await loadAdminData(store.id); setFeedback("Catalogue mis à jour.");
  }

  async function togglePublication() {
    if (!supabase || !store) return;
    const next = !store.is_published;
    if (next && products.filter((product) => product.is_active).length === 0) { setFeedback("Ajoutez au moins un produit actif avec son prix réel avant de publier la boutique."); return; }
    const { error } = await supabase.from("project_storefronts").update({ is_published: next }).eq("id", store.id);
    if (error) { setFeedback("Publication impossible : " + error.message); return; }
    setStore({ ...store, is_published: next });
    setFeedback(next ? "Boutique publiée : le catalogue est maintenant accessible." : "Boutique masquée du public.");
  }

  async function addToCart(productId: string) {
    setCart((current) => {
      const existing = current.find((line) => line.productId === productId);
      return existing ? current.map((line) => line.productId === productId ? { ...line, quantity: line.quantity + 1 } : line) : [...current, { productId, quantity: 1 }];
    });
    setFeedback("Produit ajouté au panier.");
  }

  function changeQuantity(productId: string, quantity: number) {
    setCart((current) => quantity <= 0 ? current.filter((line) => line.productId !== productId) : current.map((line) => line.productId === productId ? { ...line, quantity: Math.min(quantity, 99) } : line));
  }

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !store || !cartLines.length || !customer.trim() || !phone.trim()) {
      setFeedback("Ajoutez des produits et renseignez votre nom et votre téléphone."); return;
    }
    setBusy(true);
    const { error } = await supabase.from("project_store_orders").insert({
      storefront_id: store.id, customer_name: customer.trim(), customer_phone: phone.trim(),
      desired_date: date || null, notes: note.trim(),
      items: cartLines.map((line) => ({ product_id: line.id, quantity: line.quantity })),
    });
    setBusy(false);
    if (error) { setFeedback("Commande non transmise : " + error.message); return; }
    setCart([]); setCustomer(""); setPhone(""); setDate(""); setNote("");
    setFeedback("Commande transmise à Asho Sweet. L'équipe doit encore la confirmer. Aucun paiement n'a été effectué.");
  }

  async function submitCustomRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase || !store || !customer.trim() || !phone.trim() || !occasion.trim() || !date || Number(portions) < 1) {
      setFeedback("Complétez votre nom, téléphone, occasion, date et nombre de portions."); return;
    }
    setBusy(true);
    const { error } = await supabase.from("project_store_custom_requests").insert({
      storefront_id: store.id, customer_name: customer.trim(), customer_phone: phone.trim(),
      occasion: occasion.trim(), desired_date: date, portions: Number(portions),
      flavour: flavour.trim(), decoration: decoration.trim(), notes: note.trim(),
    });
    setBusy(false);
    if (error) { setFeedback("Demande non transmise : " + error.message); return; }
    setCustomer(""); setPhone(""); setDate(""); setOccasion(""); setFlavour(""); setDecoration(""); setNote("");
    setFeedback("Votre demande personnalisée a été transmise à Asho Sweet.");
  }

  async function updateOrderStatus(order: Order, status: string) {
    if (!supabase || !store) return;
    const { error } = await supabase.from("project_store_orders").update({ status }).eq("id", order.id).eq("storefront_id", store.id);
    if (error) { setFeedback("Mise à jour de commande impossible : " + error.message); return; }
    await loadAdminData(store.id);
  }

  async function updateRequestStatus(request: CustomRequest, status: string) {
    if (!supabase || !store) return;
    const { error } = await supabase.from("project_store_custom_requests").update({ status }).eq("id", request.id).eq("storefront_id", store.id);
    if (error) { setFeedback("Mise à jour de la demande impossible : " + error.message); return; }
    await loadAdminData(store.id);
  }

  if (!supabase) return <section className="sweet-panel"><h2>Configuration requise</h2><p>La boutique doit être reliée à Supabase. Configurez NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY dans l'environnement du projet.</p></section>;
  if (!store) return <section className="sweet-panel"><h2>Boutique en préparation</h2><p>La boutique Asho Sweet n'est pas encore publiée. Le propriétaire peut se connecter pour ajouter les produits et gérer la boutique.</p>{!userEmail ? <form className="sweet-form" onSubmit={signIn}><label>Email du propriétaire<input required type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Mot de passe<input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label><button type="submit" disabled={busy}>Se connecter</button></form> : <p>Compte connecté : {userEmail}. Chargement de la boutique…</p>}{feedback && <p role="status">{feedback}</p>}</section>;

  return (
    <div className="sweet-workspace">
      {store.is_published ? null : <div className="sweet-notice"><strong>Boutique non publiée</strong><span>Seul le propriétaire connecté peut gérer le catalogue. Les visiteurs ne voient pas encore les produits.</span></div>}
      {mode === "catalogue" && (
        <section className="sweet-panel">
          <div className="sweet-heading"><div><p className="eyebrow">Asho Sweet · Catalogue</p><h2>{store.display_name}</h2><p>{store.description}</p></div><span className="sweet-count">{products.filter((p) => p.is_active).length} produit(s)</span></div>
          {products.filter((p) => p.is_active).length === 0 ? <p className="sweet-empty">Le catalogue sera affiché ici dès que les produits et leurs prix réels auront été ajoutés.</p> : <div className="sweet-products">{products.filter((p) => p.is_active).map((product) => <article className="sweet-product" key={product.id}>{product.image_url ? <img src={product.image_url} alt={product.name} /> : null}<span className="sweet-category">{product.category}</span><h3>{product.name}</h3><p>{product.description}</p><strong>{money(Number(product.price_xof))}</strong><button type="button" onClick={() => addToCart(product.id)}>Ajouter au panier</button></article>)}</div>}
        </section>
      )}
      {mode === "cart" && <section className="sweet-panel"><p className="eyebrow">Asho Sweet · Votre sélection</p><h2>Panier</h2>{cartLines.length === 0 ? <p className="sweet-empty">Votre panier est vide. Ajoutez des produits depuis le catalogue.</p> : <div className="sweet-cart">{cartLines.map((line) => <div className="sweet-cart-line" key={line.id}><div><strong>{line.name}</strong><span>{money(Number(line.price_xof))} l'unité</span></div><input aria-label={"Quantité " + line.name} type="number" min="0" max="99" value={line.quantity} onChange={(event) => changeQuantity(line.id, Number(event.target.value))} /><strong>{money(Number(line.price_xof) * line.quantity)}</strong></div>)}<div className="sweet-total"><span>Total estimatif</span><strong>{money(estimatedTotal)}</strong></div></div>}
          <form className="sweet-form" onSubmit={submitOrder}><label>Nom complet<input required maxLength={120} value={customer} onChange={(event) => setCustomer(event.target.value)} /></label><label>Téléphone<input required type="tel" maxLength={40} value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+229…" /></label><label>Date souhaitée<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><label className="sweet-wide">Précisions<textarea maxLength={2000} value={note} onChange={(event) => setNote(event.target.value)} /></label><button type="submit" disabled={busy || !cartLines.length}>Transmettre la commande (sans paiement)</button></form>
        </section>}
      {mode === "custom-order" && <section className="sweet-panel"><p className="eyebrow">Asho Sweet · Sur mesure</p><h2>Imaginons votre création</h2><p>Décrivez votre gâteau ou votre commande spéciale.</p><form className="sweet-form" onSubmit={submitCustomRequest}><label>Votre nom<input required maxLength={120} value={customer} onChange={(event) => setCustomer(event.target.value)} /></label><label>Téléphone<input required type="tel" maxLength={40} value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+229…" /></label><label>Occasion<input required maxLength={160} value={occasion} onChange={(event) => setOccasion(event.target.value)} placeholder="Anniversaire, mariage…" /></label><label>Date souhaitée<input required type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><label>Nombre de portions<input required type="number" min="1" max="500" value={portions} onChange={(event) => setPortions(event.target.value)} /></label><label>Saveur souhaitée<input maxLength={160} value={flavour} onChange={(event) => setFlavour(event.target.value)} /></label><label className="sweet-wide">Décoration souhaitée<input maxLength={500} value={decoration} onChange={(event) => setDecoration(event.target.value)} /></label><label className="sweet-wide">Autres précisions<textarea maxLength={2000} value={note} onChange={(event) => setNote(event.target.value)} /></label><button type="submit" disabled={busy}>Transmettre ma demande</button></form></section>}
      <section className="sweet-panel">
        <div className="sweet-inline"><h2>Espace Asho Sweet</h2><button className="sweet-secondary" type="button" onClick={() => setAdminOpen((value) => !value)}>{adminOpen ? "Fermer" : "Gestion de la boutique"}</button></div>
        {adminOpen && !userEmail && <form className="sweet-form" onSubmit={signIn}><label>Email du propriétaire<input required type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>Mot de passe<input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} /></label><button type="submit" disabled={busy}>Se connecter</button></form>}
        {adminOpen && userEmail && <div className="sweet-history"><div className="sweet-inline"><span>Connecté : {userEmail}</span><button type="button" onClick={signOut}>Déconnexion</button><button type="button" onClick={togglePublication}>{store.is_published ? "Masquer la boutique" : "Publier la boutique"}</button></div>
          <h3>Ajouter un produit</h3><form className="sweet-form" onSubmit={addProduct}><label>Nom<input required maxLength={160} value={productName} onChange={(event) => setProductName(event.target.value)} /></label><label>Catégorie<input required maxLength={80} value={productCategory} onChange={(event) => setProductCategory(event.target.value)} /></label><label>Prix en FCFA<input required type="number" min="1" step="1" value={productPrice} onChange={(event) => setProductPrice(event.target.value)} /></label><label>Image (URL facultative)<input type="url" value={productImage} onChange={(event) => setProductImage(event.target.value)} /></label><label className="sweet-wide">Description<textarea maxLength={2000} value={productDescription} onChange={(event) => setProductDescription(event.target.value)} /></label><button type="submit" disabled={busy}>Enregistrer le produit</button></form>
          <h3>Catalogue à gérer</h3>{products.map((product) => <article key={product.id}><strong>{product.name} · {money(Number(product.price_xof))}</strong><span>{product.is_active ? "Visible" : "Masqué"}</span><div className="sweet-inline"><button type="button" onClick={() => { const next = window.prompt("Nouveau prix en FCFA", String(product.price_xof)); if (next && Number.isSafeInteger(Number(next)) && Number(next) > 0) void updateProduct(product, { price_xof: Number(next) }); }}>Modifier le prix</button><button type="button" onClick={() => void updateProduct(product, { is_active: !product.is_active })}>{product.is_active ? "Masquer" : "Réactiver"}</button></div></article>)}
          <h3>Commandes reçues</h3>{orders.length === 0 ? <p>Aucune commande pour le moment.</p> : orders.map((order) => <article key={order.id}><strong>{order.customer_name} · {money(Number(order.total_amount_xof))}</strong><span>{order.customer_phone} · {new Date(order.created_at).toLocaleString("fr-FR")}</span><span>{order.items.map((item) => item.quantity + " × " + item.name).join(", ")}</span><div className="sweet-inline"><select aria-label="Statut de commande" value={order.status} onChange={(event) => void updateOrderStatus(order, event.target.value)}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></div></article>)}
          <h3>Demandes personnalisées</h3>{requests.length === 0 ? <p>Aucune demande personnalisée pour le moment.</p> : requests.map((request) => <article key={request.id}><strong>{request.occasion} · {request.customer_name}</strong><span>{request.customer_phone} · {request.portions} portions · {request.desired_date}</span><span>{request.flavour} · {request.decoration}</span><small>{request.notes}</small><select aria-label="Statut de demande personnalisée" value={request.status} onChange={(event) => void updateRequestStatus(request, event.target.value)}>{requestStatuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></article>)}
        </div>}
      </section>
      {feedback && <p className="sweet-feedback" role="status" aria-live="polite">{feedback}</p>}
    </div>
  );
}
`;

export function createSweetShopWorkspaceFile() {
  return { path: "src/components/sweet-shop-workspace.tsx", content: sweetShopWorkspaceSource };
}

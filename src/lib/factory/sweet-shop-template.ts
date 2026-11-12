"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

type Mode = "catalogue" | "custom-order" | "cart";
type Product = { id: string; name: string; description: string; category: string; price: number };
type CartLine = { productId: string; quantity: number };
type CustomRequest = { id: string; customer: string; phone: string; occasion: string; date: string; portions: number; flavour: string; decoration: string; notes: string; createdAt: string };
type Order = { id: string; customer: string; phone: string; date: string; note: string; lines: Array<{ name: string; quantity: number; unitPrice: number }>; total: number; status: string; createdAt: string };

const PRODUCTS_KEY = "merkora-asho-sweet-products-v1";
const CART_KEY = "merkora-asho-sweet-cart-v1";
const REQUESTS_KEY = "merkora-asho-sweet-custom-requests-v1";
const ORDERS_KEY = "merkora-asho-sweet-orders-v1";
const money = (value: number) => new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(value) + " FCFA";
const newId = () => globalThis.crypto?.randomUUID?.() ?? String(Date.now()) + Math.random().toString(36).slice(2);

export function SweetShopWorkspace({ mode }: { mode: Mode }) {
  const [ready, setReady] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("Gâteaux");
  const [productPrice, setProductPrice] = useState("");
  const [customer, setCustomer] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [occasion, setOccasion] = useState("");
  const [portions, setPortions] = useState("8");
  const [flavour, setFlavour] = useState("");
  const [decoration, setDecoration] = useState("");
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    try {
      const read = <T,>(key: string, fallback: T): T => {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) as T : fallback;
      };
      setProducts(read(PRODUCTS_KEY, []));
      setCart(read(CART_KEY, []));
      setRequests(read(REQUESTS_KEY, []));
      setOrders(read(ORDERS_KEY, []));
    } catch {
      setFeedback("Le stockage de démonstration est indisponible dans ce navigateur.");
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
      window.localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
      window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch {
      setFeedback("Enregistrement local impossible. Vérifiez l'espace disponible du navigateur.");
    }
  }, [ready, products, cart, requests, orders]);

  const cartLines = useMemo(() => cart.map((line) => {
    const product = products.find((item) => item.id === line.productId);
    return product ? { ...product, quantity: line.quantity } : null;
  }).filter((line): line is Product & { quantity: number } => Boolean(line)), [cart, products]);
  const total = cartLines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const price = Number(productPrice);
    if (!productName.trim() || !Number.isFinite(price) || price <= 0) {
      setFeedback("Indiquez un nom de produit et un prix positif en FCFA.");
      return;
    }
    setProducts((current) => [...current, {
      id: newId(), name: productName.trim(), description: productDescription.trim(),
      category: productCategory, price,
    }]);
    setProductName(""); setProductDescription(""); setProductPrice("");
    setFeedback("Produit ajouté au catalogue de démonstration.");
  }

  function addToCart(productId: string) {
    setCart((current) => {
      const existing = current.find((line) => line.productId === productId);
      return existing
        ? current.map((line) => line.productId === productId ? { ...line, quantity: line.quantity + 1 } : line)
        : [...current, { productId, quantity: 1 }];
    });
    setFeedback("Produit ajouté au panier.");
  }

  function changeQuantity(productId: string, quantity: number) {
    setCart((current) => quantity <= 0
      ? current.filter((line) => line.productId !== productId)
      : current.map((line) => line.productId === productId ? { ...line, quantity } : line));
  }

  function submitCustomRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!customer.trim() || !phone.trim() || !occasion.trim() || !date || Number(portions) < 1) {
      setFeedback("Complétez le nom, le téléphone, l'occasion, la date et le nombre de portions.");
      return;
    }
    setRequests((current) => [{
      id: newId(), customer: customer.trim(), phone: phone.trim(), occasion: occasion.trim(),
      date, portions: Number(portions), flavour: flavour.trim(), decoration: decoration.trim(),
      notes: note.trim(), createdAt: new Date().toISOString(),
    }, ...current]);
    setFeedback("Demande personnalisée enregistrée sur cet appareil. Asho Sweet ne l'a pas encore reçue.");
    setCustomer(""); setPhone(""); setDate(""); setOccasion(""); setFlavour(""); setDecoration(""); setNote("");
  }

  function validateOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cartLines.length || !customer.trim() || !phone.trim()) {
      setFeedback("Ajoutez au moins un produit et renseignez votre nom et téléphone.");
      return;
    }
    const order: Order = {
      id: newId(), customer: customer.trim(), phone: phone.trim(), date, note: note.trim(),
      lines: cartLines.map((line) => ({ name: line.name, quantity: line.quantity, unitPrice: line.price })),
      total, status: "À confirmer par Asho Sweet", createdAt: new Date().toISOString(),
    };
    setOrders((current) => [order, ...current]);
    setCart([]);
    setFeedback("Commande enregistrée sur cet appareil, sans paiement. Asho Sweet ne l'a pas encore reçue.");
    setCustomer(""); setPhone(""); setDate(""); setNote("");
  }

  if (!ready) return <section className="sweet-panel"><p>Chargement de l'espace de démonstration…</p></section>;

  return (
    <div className="sweet-workspace">
      <div className="sweet-notice" role="note">
        <strong>Mode démonstration</strong>
        <span>Les données restent dans ce navigateur. Aucun compte, serveur partagé, paiement ou envoi de commande n'est encore connecté.</span>
      </div>

      {mode === "catalogue" && (
        <>
          <section className="sweet-panel">
            <div className="sweet-heading"><div><p className="eyebrow">Asho Sweet · Catalogue</p><h2>Nos créations</h2><p>Ajoutez les produits et leurs vrais prix avant de présenter le catalogue aux clients.</p></div><span className="sweet-count">{products.length} produit(s)</span></div>
            {products.length === 0 ? <p className="sweet-empty">Aucun produit dans le catalogue. Ajoutez les articles et prix validés par Asho Sweet ci-dessous.</p> : (
              <div className="sweet-products">{products.map((product) => (
                <article className="sweet-product" key={product.id}>
                  <span className="sweet-category">{product.category}</span><h3>{product.name}</h3>
                  <p>{product.description || "Une création préparée par Asho Sweet."}</p>
                  <strong>{money(product.price)}</strong>
                  <button type="button" onClick={() => addToCart(product.id)}>Ajouter au panier</button>
                </article>
              ))}</div>
            )}
          </section>
          <section className="sweet-panel">
            <p className="eyebrow">Gestion de démonstration</p><h2>Ajouter un produit</h2>
            <form className="sweet-form" onSubmit={addProduct}>
              <label>Nom du produit<input required maxLength={90} value={productName} onChange={(event) => setProductName(event.target.value)} placeholder="Ex. Gâteau personnalisé" /></label>
              <label>Catégorie<select value={productCategory} onChange={(event) => setProductCategory(event.target.value)}><option>Gâteaux</option><option>Pâtisseries</option><option>Autres créations</option></select></label>
              <label>Prix (FCFA)<input required type="number" min="1" step="1" value={productPrice} onChange={(event) => setProductPrice(event.target.value)} placeholder="Prix réel" /></label>
              <label className="sweet-wide">Description<textarea maxLength={300} value={productDescription} onChange={(event) => setProductDescription(event.target.value)} placeholder="Composition, format, détails…" /></label>
              <button type="submit">Enregistrer le produit</button>
            </form>
          </section>
        </>
      )}

      {mode === "custom-order" && (
        <section className="sweet-panel">
          <p className="eyebrow">Asho Sweet · Sur mesure</p><h2>Imaginons votre création</h2>
          <p>Décrivez votre gâteau ou votre commande spéciale. Les détails seront conservés localement dans cette démonstration.</p>
          <form className="sweet-form" onSubmit={submitCustomRequest}>
            <label>Votre nom<input required value={customer} onChange={(event) => setCustomer(event.target.value)} /></label>
            <label>Téléphone<input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+229…" /></label>
            <label>Occasion<input required value={occasion} onChange={(event) => setOccasion(event.target.value)} placeholder="Anniversaire, mariage…" /></label>
            <label>Date souhaitée<input required type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
            <label>Nombre de portions<input required type="number" min="1" max="500" value={portions} onChange={(event) => setPortions(event.target.value)} /></label>
            <label>Saveur souhaitée<input value={flavour} onChange={(event) => setFlavour(event.target.value)} placeholder="Chocolat, vanille…" /></label>
            <label className="sweet-wide">Décoration souhaitée<input value={decoration} onChange={(event) => setDecoration(event.target.value)} placeholder="Couleurs, thème, inscription…" /></label>
            <label className="sweet-wide">Autres précisions<textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={800} /></label>
            <button type="submit">Enregistrer ma demande</button>
          </form>
          {requests.length > 0 && <div className="sweet-history"><h3>Demandes enregistrées sur cet appareil</h3>{requests.map((request) => <article key={request.id}><strong>{request.occasion}</strong><span>{request.customer} · {request.portions} portions · {request.date}</span><small>À confirmer par Asho Sweet — non transmise</small></article>)}</div>}
        </section>
      )}

      {mode === "cart" && (
        <>
          <section className="sweet-panel">
            <p className="eyebrow">Asho Sweet · Votre sélection</p><h2>Panier</h2>
            {cartLines.length === 0 ? <p className="sweet-empty">Votre panier est vide. Retournez au catalogue pour ajouter des créations.</p> : (
              <div className="sweet-cart">{cartLines.map((line) => <div className="sweet-cart-line" key={line.id}>
                <div><strong>{line.name}</strong><span>{money(line.price)} l'unité</span></div>
                <input aria-label={"Quantité " + line.name} type="number" min="0" max="99" value={line.quantity} onChange={(event) => changeQuantity(line.id, Number(event.target.value))} />
                <strong>{money(line.price * line.quantity)}</strong>
              </div>)}
              <div className="sweet-total"><span>Total estimatif</span><strong>{money(total)}</strong></div></div>
            }
          </section>
          <section className="sweet-panel">
            <p className="eyebrow">Validation</p><h2>Vos coordonnées</h2>
            <form className="sweet-form" onSubmit={validateOrder}>
              <label>Nom complet<input required value={customer} onChange={(event) => setCustomer(event.target.value)} /></label>
              <label>Téléphone<input required type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+229…" /></label>
              <label>Date souhaitée<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
              <label className="sweet-wide">Précisions<textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={800} placeholder="Livraison, inscription, consignes…" /></label>
              <button type="submit" disabled={!cartLines.length}>Valider la demande (sans paiement)</button>
            </form>
            {orders.length > 0 && <div className="sweet-history"><h3>Demandes de commande enregistrées</h3>{orders.map((order) => <article key={order.id}><strong>{order.customer} · {money(order.total)}</strong><span>{order.lines.map((line) => line.quantity + " × " + line.name).join(", ")}</span><small>{order.status} — non transmise</small></article>)}</div>}
          </section>
        </>
      )}

      {feedback && <p className="sweet-feedback" role="status" aria-live="polite">{feedback}</p>}
    </div>
  );
}


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
  return \`import { SweetShopWorkspace } from "@/components/sweet-shop-workspace";

export default function SweetShopModulePage() {
  return (
    <main>
      <p className="eyebrow">Asho Sweet · Espace de commande</p>
      <h1>{\${JSON.stringify(title)}}</h1>
      <p className="lead">{\${JSON.stringify(description)}}</p>
      <SweetShopWorkspace mode="\${mode}" />
      <p><a href="/">← Retour au catalogue</a></p>
    </main>
  );
}
\`;
}

export const sweetShopStyles = \`
.sweet-workspace { display: grid; gap: 22px; margin-top: 28px; }
.sweet-panel { padding: clamp(20px, 4vw, 32px); border: 1px solid #e2e8f0; border-radius: 22px; background: #fff; box-shadow: 0 12px 36px #1720330a; }
.sweet-panel h2 { margin: 8px 0 10px; font-size: clamp(22px, 3vw, 30px); }
.sweet-panel > p:not(.eyebrow) { color: #64748b; line-height: 1.65; }
.sweet-heading { display: flex; justify-content: space-between; align-items: start; gap: 16px; }
.sweet-count, .sweet-category { display: inline-flex; padding: 6px 10px; border-radius: 999px; background: #f1f5f9; color: #475569; font-size: 12px; font-weight: 700; }
.sweet-notice { display: grid; gap: 4px; padding: 14px 18px; border: 1px solid #f2d7a1; border-radius: 14px; background: #fffbeb; color: #854d0e; font-size: 13px; line-height: 1.5; }
.sweet-products { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-top: 22px; }
.sweet-product { display: flex; flex-direction: column; align-items: start; gap: 10px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px; }
.sweet-product h3, .sweet-history h3 { margin: 4px 0; }
.sweet-product p { flex: 1; margin: 0; color: #64748b; line-height: 1.55; }
.sweet-product > strong { font-size: 18px; }
.sweet-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-top: 20px; }
.sweet-form label { display: grid; gap: 7px; color: #334155; font-size: 13px; font-weight: 650; }
.sweet-form input, .sweet-form select, .sweet-form textarea, .sweet-cart-line input { width: 100%; min-width: 0; padding: 11px 12px; border: 1px solid #cbd5e1; border-radius: 10px; background: #fff; color: #172033; font: inherit; }
.sweet-form textarea { min-height: 92px; resize: vertical; }
.sweet-wide { grid-column: 1 / -1; }
.sweet-form button, .sweet-product button { width: fit-content; padding: 11px 16px; border: 0; border-radius: 10px; background: #172033; color: white; font-weight: 700; cursor: pointer; }
.sweet-form button:disabled { opacity: .45; cursor: not-allowed; }
.sweet-empty { padding: 22px; border: 1px dashed #cbd5e1; border-radius: 14px; color: #64748b; }
.sweet-cart { display: grid; gap: 12px; }
.sweet-cart-line { display: grid; grid-template-columns: 1fr 90px auto; align-items: center; gap: 14px; padding: 14px 0; border-bottom: 1px solid #e2e8f0; }
.sweet-cart-line div { display: grid; gap: 4px; }
.sweet-cart-line span, .sweet-history span, .sweet-history small { color: #64748b; font-size: 13px; }
.sweet-total { display: flex; justify-content: space-between; padding-top: 12px; font-size: 18px; }
.sweet-history { display: grid; gap: 12px; margin-top: 24px; }
.sweet-history article { display: grid; gap: 5px; padding: 14px; border-radius: 12px; background: #f8fafc; }
.sweet-feedback { padding: 12px 16px; border-radius: 12px; background: #eff6ff; color: #1e40af; }
@media (max-width: 640px) { .sweet-form { grid-template-columns: 1fr; } .sweet-wide { grid-column: auto; } .sweet-cart-line { grid-template-columns: 1fr 72px; } .sweet-cart-line > strong { grid-column: 1 / -1; } .sweet-heading { flex-direction: column; } }
\`;

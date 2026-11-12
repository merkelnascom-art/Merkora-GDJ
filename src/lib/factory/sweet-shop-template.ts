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

"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Calculator, Truck, ShoppingBag } from "lucide-react";
import { api } from "@/lib/axios";
import { useCartStore } from "@/store/useCartStore";

const money = (amount: number) => "Rs. " + amount.toLocaleString("en-PK");
const deliveryFee = 200;
const card = "min-w-0 rounded-2xl border border-[var(--line,#ded7d2)] bg-[var(--surface,#fff)] p-5 sm:p-7";
const field = "mt-2 w-full rounded-lg border border-[var(--line,#ccc)] bg-transparent px-3 py-3 text-base";
type Receipt = {
    orderId: string;
    createdAt: string;
    orderStatus: string;
    paymentMethod: string;
    paymentStatus: string;
    customerInfo: { fullName: string; phone: string; address: string; city: string };
    orderItems: { _id: string; title: string; size?: string; color?: string; price: number; quantity: number }[];
    subtotal: number;
    shippingFee: number;
    totalAmount: number;
};

function OrderSlip({ order }: { order: Receipt }) {
    const customer = order.customerInfo;
    const date = new Intl.DateTimeFormat("en-PK", {
        dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Karachi",
    }).format(new Date(order.createdAt));
    return <article id="order-slip" className="mx-auto max-w-3xl space-y-4 px-4 py-8 sm:py-12">
        <style>{`@media print {
      @page { margin: 14mm; }
      body, body *:has(#order-slip) { display: block !important; background: white !important; margin: 0 !important; padding: 0 !important; }
      body :not(#order-slip):not(#order-slip *):not(:has(#order-slip)) { display: none !important; }
      #order-slip { width: 100%; max-width: none; padding: 0; }
      #order-slip, #order-slip * { color: black !important; background: white !important; box-shadow: none !important; }
      #order-slip li, #order-slip header, #order-slip dl { break-inside: avoid; }
      #order-slip .slip-actions { display: none !important; }
    }`}</style>
        <header className={card + " space-y-3"}>
            <p className="text-xs font-semibold uppercase tracking-widest">Malik Brand Zone</p>
            <h1 className="font-serif text-4xl">Order received</h1>
            <div className="flex flex-wrap items-center justify-between gap-2">
                <strong>{order.orderId}</strong>
                <span className="rounded-full border px-3 py-1 text-sm">Order status · {order.orderStatus}</span>
            </div>
            <p className="text-sm">Placed {date} (PKT)</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2">
            <section className={card}>
                <h2 className="mb-3 font-serif text-xl">Customer information</h2>
                <p className="font-semibold">{customer.fullName}</p>
                <p className="mt-1 break-words">{customer.phone}</p>
            </section>
            <section className={card}>
                <h2 className="mb-3 font-serif text-xl">Delivery address</h2>
                <p className="whitespace-pre-line break-words">{customer.address}</p><p>{customer.city}</p>
            </section>
        </div>
        <section className={card}>
            <h2 className="font-serif text-2xl">Order details</h2>
            <ul className="my-4 divide-y">{order.orderItems.map(item =>
                <li key={item._id} className="flex items-start justify-between gap-3 py-3">
                    <div className="min-w-0"><strong className="break-words">{item.title}</strong>
                        <p className="text-sm">{[item.size, item.color].filter(Boolean).join(" / ")}</p>
                        <p className="text-sm">{item.quantity} × {money(item.price)}</p>
                    </div><strong>{money(item.price * item.quantity)}</strong>
                </li>)}</ul>
            <dl className="space-y-2 rounded-xl bg-[var(--tint,#f6f3f1)] p-4">
                <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(order.subtotal)}</dd></div>
                <div className="flex justify-between"><dt>Delivery fee</dt><dd>{money(order.shippingFee)}</dd></div>
                <div className="flex justify-between border-t pt-3 font-semibold"><dt>Grand total</dt><dd>{money(order.totalAmount)}</dd></div>
            </dl>
            <p className="mt-4 text-sm">{order.paymentMethod === "COD" ? "Cash on delivery" : order.paymentMethod} · Payment {order.paymentStatus.toLowerCase()}</p>
        </section>
        <div className="slip-actions flex flex-wrap items-center justify-between gap-3">
            <Link href="/" className="inline-flex min-h-11 items-center underline">Continue shopping</Link>
            <button type="button" onClick={() => window.print()} className="min-h-12 rounded-lg bg-[var(--plum,#713a50)] px-6 font-semibold text-[var(--on-plum,white)]">Print order slip</button>
        </div>
    </article>;
}

// Retain the draft during client-side shopping in this tab.
const deliveryDraft = { fullName: "", phone: "", city: "", address: "" };

export default function CheckoutPage() {
    const { cart, fetchCart, clearCart } = useCartStore();
    const [ready, setReady] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");
    const [receipt, setReceipt] = useState<Receipt | null>(null);
    const lock = useRef(false);

    useEffect(() => {
        let active = true;
        fetchCart().finally(() => { if (active) setReady(true); });
        return () => { active = false; };
    }, [fetchCart]);

    const items = cart?.items ?? [];
    const subtotal = items.reduce((total, item) =>
        total + (item.product?.discountPrice || item.product?.price || 0) * item.quantity, 0);
    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (lock.current || !items.length) return;
        const fields = new FormData(event.currentTarget);
        const customer = Object.fromEntries(["fullName", "phone", "city", "address"].map(key =>
            [key, String(fields.get(key) ?? "").trim()]));
        if (Object.values(customer).some(value => !value)) {
            setError("Please complete your delivery details.");
            return;
        }
        lock.current = true;
        setBusy(true);
        setError("");
        try {
            const { data } = await api.post<{ data: Receipt }>("/orders", {
                customer, paymentMethod: "COD",
                orderItems: items.map(item => ({
                    product: item.product._id, quantity: item.quantity,
                    selectedSize: item.size, selectedColor: item.color,
                })),
            });
            Object.assign(deliveryDraft, { fullName: "", phone: "", city: "", address: "" });
            setReceipt(data.data);
            await clearCart();
        } catch (cause) {
            const detail = (cause as { response?: { data?: { message?: string } } })?.response?.data?.message;
            setError(detail || "Order confirmation unavailable. Check with the store before submitting again.");
        } finally {
            setBusy(false);
            lock.current = false;
        }
    }

    const back = <Link href="/" className="inline-flex min-h-11 items-center underline">Continue shopping</Link>;
    if (receipt) return <OrderSlip order={receipt} />;
    if (!ready) return <p role="status" className="p-6">Loading cart…</p>;
    if (!cart && typeof window !== "undefined" && window.localStorage.getItem("cart_session_id")) {
        return <section className="space-y-3 p-6">
            <h1 className="text-2xl">Checkout</h1>
            <p role="alert">Couldn’t load your cart.</p>
            <button className="min-h-11 underline" onClick={async () => {
                setReady(false);
                try { await fetchCart(); } finally { setReady(true); }
            }}>Retry</button>
        </section>;
    }


    return <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h1 className="mb-6 font-serif text-4xl">Checkout</h1>
        <form onSubmit={submit} className="grid items-start gap-6 lg:grid-cols-[1.1fr_1fr]">
            <section className={card} aria-labelledby="delivery">
                <h2 id="delivery" className="mb-5 font-serif text-2xl">Delivery details</h2>
                <div className="grid gap-4 sm:grid-cols-2" onChange={event => {
                    const input = event.target;
                    if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
                        const key = input.name;
                        if (key === "fullName" || key === "phone" || key === "city" || key === "address") {
                            deliveryDraft[key] = input.value;
                        }
                    }
                }}>
                    <label>Full name<input className={field} name="fullName" defaultValue={deliveryDraft.fullName} autoComplete="name" required /></label>
                    <label>Phone number<input className={field} name="phone" defaultValue={deliveryDraft.phone} type="tel" autoComplete="tel" required /></label>
                    <label className="sm:col-span-2">City<input className={field} name="city" defaultValue={deliveryDraft.city} autoComplete="address-level2" required /></label>
                    <label className="sm:col-span-2">Complete address<textarea className={field} name="address" defaultValue={deliveryDraft.address} rows={3} autoComplete="street-address" required /></label>
                </div>
            </section>
            <aside className={card + " space-y-5"} aria-labelledby="summary">
                <h2 id="summary" className="font-serif text-2xl">Order summary</h2>
                {items.length === 0 ? <div className="rounded-xl border border-[var(--line,#ddd)] p-5">
                    <p role="status" className="mb-4">Your bag is empty. Add an item to place your order.</p>
                    <Link href="/new-arrivals" className="inline-flex min-h-11 items-center rounded-lg bg-[var(--plum,#713a50)] px-4 text-[var(--on-plum,white)]">Shop new arrivals</Link>
                </div> : <>
                    <ul className="divide-y divide-[var(--line,#ddd)]">{items.map(item => <li key={JSON.stringify([item.product?._id, item.size, item.color])}
                        className="flex items-center gap-3 py-3">
                        {item.product?.images?.[0] && <Image src={item.product.images[0]} width={64} height={76} alt="" className="h-16 w-14 rounded-lg object-cover" />}
                        <div className="min-w-0 flex-1"><p className="font-semibold">{item.quantity} × {item.product?.title}</p>
                            <p className="text-sm">{[item.size, item.color].filter(Boolean).join(" / ")}</p></div>
                        <strong>{money((item.product?.discountPrice || item.product?.price || 0) * item.quantity)}</strong>
                    </li>)}</ul>
                    <dl className="space-y-3 rounded-xl bg-[var(--tint,#f6f3f1)] p-4">
                        <div className="flex justify-between"><dt className="flex items-center gap-2"><Calculator size={17} />Subtotal</dt><dd>{money(subtotal)}</dd></div>
                        <div className="flex justify-between"><dt className="flex items-center gap-2"><Truck size={17} />Delivery fee</dt><dd>{money(deliveryFee)}</dd></div>
                        <div className="flex justify-between border-t pt-4 text-lg font-bold"><dt>Grand total</dt><dd>{money(subtotal + deliveryFee)}</dd></div>
                    </dl>
                    {error && <p role="alert">{error}</p>}
                    <button disabled={busy} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[var(--plum,#713a50)] px-3 font-semibold text-[var(--on-plum,white)] disabled:opacity-60">
                        <ShoppingBag size={18} />{busy ? "Placing order…" : "Place COD order · " + money(subtotal + deliveryFee)}
                    </button>
                    <div className="text-center text-sm">{back}</div>
                </>}
            </aside>
        </form>
    </main>;
}

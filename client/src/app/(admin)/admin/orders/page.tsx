"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { statuses, getOrdersPageApi, updateOrderStatusApi, type Status, type Order, type Orders } from "@/services/admin.api";

const label = (s: Status) => s === "Confirmed" ? "Processing" : s;
const button = "min-h-11 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-[var(--ink)] disabled:opacity-50";
const money = new Intl.NumberFormat("en-PK", { style: "currency", currency: "PKR", maximumFractionDigits: 0 });

export default function OrdersPage() {
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState("");
    const [result, setResult] = useState<Orders | null>(null);
    const [failed, setFailed] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const [edit, setEdit] = useState<Order | null>(null);
    const [draft, setDraft] = useState<Status>("Pending");
    const [saving, setSaving] = useState(false);
    const dialog = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        const abort = new AbortController();
        getOrdersPageApi(page, filter || undefined, abort.signal)
            .then((data) => {
                if (abort.signal.aborted) return;
                if (page > Math.max(1, data.totalPages)) setPage(Math.max(1, data.totalPages));
                else setResult(data);
            }).catch(() => { if (!abort.signal.aborted) setFailed(true); });
        return () => abort.abort();
    }, [page, filter, attempt]);
    function reload() { setResult(null); setFailed(false); setAttempt(n => n + 1); }

    async function save() {
        if (!edit || saving || draft === edit.orderStatus) return;
        setSaving(true);
        try {
            await updateOrderStatusApi(edit._id, draft);
            dialog.current?.close();
            toast.success("Order status updated.");
            reload();
        } catch { toast.error("Couldn’t update the order. Please try again."); }
        finally { setSaving(false); }
    }
    return <section className="mx-auto max-w-5xl space-y-4 p-4 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-serif text-3xl font-semibold">Orders</h1>
            <select className={button} aria-label="Filter by order status" value={filter} onChange={e => { setFilter(e.target.value); setPage(1); reload(); }}>
                <option value="">All statuses</option>{statuses.map(s => <option key={s} value={s}>{label(s)}</option>)}
            </select>
        </div>
        {failed ? <button className={button} onClick={reload}>Couldn’t load orders. Retry</button> : !result ? <p role="status">Loading orders…</p> :
            !result.orders.length ? <p>No orders match this view.</p> : <>
                <ul className="grid gap-3">{result.orders.map(o =>
                    <li key={o._id} className="rounded-xl border border-(--line) bg-brand-surface p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div><h2 className="font-semibold">{o.orderId}</h2><p className="text-sm">{o.customerInfo.fullName} · {o.customerInfo.city}</p></div>
                            <div><strong>{money.format(o.totalAmount)}</strong><p className="text-sm text-brand-muted">{label(o.orderStatus)}</p></div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-start justify-between gap-2 border-t border-[var(--line)] pt-2">
                            <details className="min-w-0 flex-1"><summary className="min-h-11 cursor-pointer py-2">Order details</summary>
                                <ul>{o.orderItems.map((item, i) => <li key={i}>{item.quantity} × {item.title} {[item.size, item.color].filter(Boolean).join(" / ")}</li>)}</ul>
                                <p className="mt-3">{o.customerInfo.address}</p><a href={"tel:" + o.customerInfo.phone} className="inline-flex min-h-11 items-center underline">{o.customerInfo.phone}</a>
                                <p>{o.paymentMethod} · {o.paymentStatus}</p>
                            </details>
                            <button className={button} onClick={() => { setEdit(o); setDraft(o.orderStatus); dialog.current?.showModal(); }}>Update status</button>
                        </div>
                    </li>)}</ul>
                {result.totalPages > 1 && <div className="flex items-center justify-between"><button className={button} disabled={page <= 1} onClick={() => { setPage(page - 1); reload(); }}>Previous</button>{page} / {result.totalPages}<button className={button} disabled={page >= result.totalPages} onClick={() => { setPage(page + 1); reload(); }}>Next</button></div>}
            </>}
        <dialog ref={dialog} onClose={() => setEdit(null)} onCancel={e => { if (saving) e.preventDefault(); }} aria-labelledby="status-title" className="fixed inset-0 m-auto w-[min(92vw,24rem)] rounded-xl bg-[var(--surface)] p-5 text-[var(--ink)] backdrop:bg-black/60">
            <h2 id="status-title" className="font-semibold">Update {edit?.orderId}</h2>
            <label className="my-4 grid gap-2">Order status<select className={button} value={draft} disabled={saving} onChange={e => { const value = statuses.find(s => s === e.target.value); if (value) setDraft(value); }}>{statuses.map(s => <option key={s} value={s}>{label(s)}</option>)}</select></label>
            <div className="flex justify-end gap-2"><button className={button} disabled={saving} onClick={() => dialog.current?.close()}>Cancel</button><button className={button} disabled={saving || draft === edit?.orderStatus} onClick={save}>{saving ? "Saving…" : "Save changes"}</button></div>
        </dialog>
    </section>;
}

"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/axios";

type Banner = { _id: string; imageUrl: string };
const maxBanners = 4;
const limit = 4 * 1024 * 1024;
const button = "min-h-11 rounded-lg border border-[var(--line)] px-4 font-medium disabled:opacity-50";

function responseOf(error: unknown) {
    if (typeof error !== "object" || error === null || !("response" in error)) return;
    return error.response as { status?: number; data?: { message?: unknown } } | undefined;
}

function errorText(error: unknown, fallback: string) {
    const detail: unknown = responseOf(error)?.data?.message;
    return typeof detail === "string" && detail ? detail : fallback;
}

export default function BannersPage() {
    const [items, setItems] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const [busy, setBusy] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState("");
    const [selected, setSelected] = useState<Banner | null>(null);
    const picker = useRef<HTMLInputElement>(null);
    const dialog = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (!file) { setPreview(""); return; }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    useEffect(() => {
        const abort = new AbortController();
        async function load() {
            try {
                const config = { signal: abort.signal, headers: { Accept: "application/json" } };
                const { data } = await api.get<{ data: Banner[] }>("/banners", config);
                if (!Array.isArray(data.data)) throw new Error("Invalid banner list.");
                if (!abort.signal.aborted) setItems(data.data);
            } catch {
                if (!abort.signal.aborted) setFailed(true);
            } finally {
                if (!abort.signal.aborted) setLoading(false);
            }
        }
        void load();
        return () => abort.abort();
    }, [attempt]);

    const full = items.length >= maxBanners;

    function choose(image?: File) {
        if (!image || full) return;
        if (!["image/jpeg", "image/png", "image/webp"].includes(image.type) || image.size > limit || !image.size) {
            toast.error("Choose a JPG, PNG or WebP image up to 4 MB.");
            return;
        }
        setFile(image);
    }

    async function publish() {
        if (!file || busy || full || loading || failed) return;
        setBusy(true);
        const body = new FormData();
        body.append("image", file);
        try {
            const { data } = await api.post<{ data: Banner }>("/banners", body, { headers: { "Content-Type": undefined } });
            setItems(list => [data.data, ...list]);
            setFile(null);
            toast.success("Banner published.");
        } catch (error) {
            toast.error(errorText(error, "Couldn’t publish banner."));
            if (responseOf(error)?.status === 409) {
                setFile(null);
                setLoading(true);
                setAttempt(n => n + 1);
            }
        }
        finally { setBusy(false); }
    }

    async function remove() {
        if (!selected || busy) return;
        setBusy(true);
        try {
            await api.delete("/banners/" + selected._id);
            setItems(list => list.filter(item => item._id !== selected._id));
            dialog.current?.close();
            toast.success("Banner removed.");
        } catch (error) { toast.error(errorText(error, "Couldn’t remove banner.")); }
        finally { setBusy(false); }
    }

    return <section className="mx-auto max-w-5xl space-y-5 p-4 sm:p-8">
        <h1 className="font-serif text-3xl font-semibold">Hero Banners</h1>
        <div className="space-y-4 rounded-xl border border-(--line) bg-brand-surface p-4">
            <p className="text-sm text-brand-muted">Choose a landscape image up to 4 MB. New banners appear first on the homepage.</p>
            {!loading && !failed && <p role="status" className="text-sm font-medium">
                {items.length} / {maxBanners} published. {full && "Remove a published banner to upload another."}
            </p>}
            <input disabled={full || busy || loading || failed} ref={picker} type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={e => { choose(e.target.files?.[0]); e.target.value = ""; }} />
            {file && preview && <div className="relative aspect-2/1 max-w-xl overflow-hidden rounded-lg">
                <Image src={preview} alt="Selected banner preview" fill unoptimized sizes="100vw" className="object-cover" />
            </div>}
            <div className="flex flex-wrap gap-2">
                <button className={button} disabled={busy || loading || failed || full} onClick={() => picker.current?.click()}>{file ? "Change image" : "Choose image"}</button>
                {file && <><button className={button} disabled={busy || full || loading || failed} onClick={publish}>{busy ? "Please wait…" : "Publish banner"}</button>
                    <button className={button} disabled={busy} onClick={() => setFile(null)}>Cancel</button></>}
            </div>
        </div>
        {failed ? <button className={button} onClick={() => { setFailed(false); setLoading(true); setAttempt(n => n + 1); }}>Couldn’t load banners. Retry</button> :
            loading ? <p role="status">Loading banners…</p> : !items.length ? <p>The homepage is using its default photo.</p> :
                <ul className="grid gap-4 sm:grid-cols-2">{items.map((item, index) =>
                    <li key={item._id} className="overflow-hidden rounded-xl border border-(--line) bg-brand-surface">
                        <div className="relative aspect-2/1"><Image src={item.imageUrl} alt={"Homepage banner " + (index + 1)} fill sizes="(min-width:640px) 30rem, 100vw" className="object-cover" /></div>
                        <div className="flex items-center justify-between gap-3 p-3"><span>Banner {index + 1}</span><button className={button} disabled={busy} onClick={() => { setSelected(item); dialog.current?.showModal(); }}>Remove</button></div>
                    </li>)}</ul>}
        <dialog ref={dialog} onCancel={e => { if (busy) e.preventDefault(); }} onClose={() => setSelected(null)} aria-labelledby="remove-title" className="fixed inset-0 m-auto w-[min(92vw,24rem)] space-y-4 rounded-xl bg-brand-surface p-5 text-brand-ink backdrop:bg-black/60">
            <h2 id="remove-title" className="font-semibold">Remove this homepage banner?</h2>
            <div className="flex justify-end gap-2"><button autoFocus className={button} disabled={busy} onClick={() => dialog.current?.close()}>Cancel</button><button className={button} disabled={busy} onClick={remove}>Remove</button></div>
        </dialog>
    </section>;
}

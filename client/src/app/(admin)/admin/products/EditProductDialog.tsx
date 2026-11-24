/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { getAllCategoriesApi, updateProductApi } from "@/services/admin.api";
import type { ICategory, IProduct } from "@/types";

type Props = {
  product: IProduct;
  onClose: () => void;
  onSaved: (product: IProduct) => void;
};

const inputClass = "block min-h-11 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-base";

export default function EditProductDialog({ product, onClose, onSaved }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const submitting = useRef(false);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoryError, setCategoryError] = useState(false);
  const [kept, setKept] = useState(product.images ?? []);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!dialog.current?.open) dialog.current?.showModal();
    let active = true;
    getAllCategoriesApi().then(rows => { if (active) setCategories(rows); })
      .catch(() => { if (active) setCategoryError(true); });
    return () => { active = false; };
  }, []);

  const defaults = {
    title: product.title, slug: product.slug, price: String(product.price),
    discountPrice: String(product.discountPrice ?? ""), stock: String(product.stock),
    fabric: product.fabric ?? "", sizes: (product.sizes ?? []).join(", "),
    colors: (product.colors ?? []).join(", "), description: product.description ?? "",
    category: product.category?._id ?? "", isFeatured: String(!!product.isFeatured),
  };

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const form = new FormData(event.currentTarget);
    const patch = new FormData();
    for (const [name, original] of Object.entries(defaults)) {
      const value = name === "isFeatured" ? String(form.has(name)) : String(form.get(name) ?? "").trim();
      if (value !== original) patch.append(name, value);
    }
    if (kept.length !== (product.images ?? []).length || files.length > 0) {
      if (!kept.length && !files.length) { setError("Keep or add at least one product image."); return; }
      kept.forEach(url => patch.append("retainedImages", url));
      files.forEach(file => patch.append("images", file));
    }
    if (!Array.from(patch.keys()).length) { onClose(); return; }
    submitting.current = true;
    setSaving(true);
    setError("");
    try {
      const updated = await updateProductApi(product._id, patch);
      onSaved(updated);
      toast.success("Product updated.");
    } catch (cause) {
      const message = (cause as { response?: { data?: { message?: string } } } | null)?.response?.data?.message;
      const detail = typeof message === "string" ? message : "Couldn’t save this product. Please try again.";
      setError(detail);
      toast.error(detail);
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  }

  const fields = [
    ["title", "Product name"], ["slug", "Product slug"], ["price", "Price (PKR)"],
    ["discountPrice", "Sale price (PKR)"], ["stock", "Stock"], ["fabric", "Fabric"],
    ["sizes", "Sizes (comma-separated)"], ["colors", "Colors (comma-separated)"],
  ] as const;

  return (
    <dialog ref={dialog} aria-labelledby="edit-product-title"
      onCancel={event => { event.preventDefault(); if (!submitting.current) onClose(); }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-1rem)] max-w-xl overflow-y-auto rounded-xl border border-(--line) bg-brand-surface p-0 text-brand-ink backdrop:bg-black/50">
      <form onSubmit={save}>
        <header className="flex items-center justify-between border-b p-4">
          <h2 id="edit-product-title" className="text-xl font-semibold">Edit product</h2>
          <button type="button" aria-label="Close edit product" disabled={saving} onClick={onClose} className="grid size-11 place-items-center"><X size={20} /></button>
        </header>
        <fieldset disabled={saving} className="grid gap-4 p-4 sm:grid-cols-2">
          {fields.map(([key, label]) => {
            const numeric = key === "price" || key === "discountPrice" || key === "stock";
            return <label key={key}>{label}
              <input className={inputClass} name={key} defaultValue={defaults[key]}
                type={numeric ? "number" : "text"} min={numeric ? 0 : undefined}
                step={key === "stock" ? 1 : numeric ? "0.01" : undefined}
                required={["title", "slug", "stock", "price"].includes(key)} />
            </label>;
          })}
          <label className="sm:col-span-2">Category
            <select className={inputClass} name="category" defaultValue={defaults.category} required>
              <option value="" disabled>Select category</option>
              {product.category && <option value={defaults.category}>{product.category.name}</option>}
              {categories.filter(c => c._id !== defaults.category).map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            {categoryError && <small>Couldn’t load other categories. Reopen the editor to retry.</small>}
          </label>
          <label className="sm:col-span-2">Description<textarea name="description" rows={3} className={inputClass} defaultValue={defaults.description} /></label>
          <label className="flex min-h-11 items-center gap-2"><input type="checkbox" name="isFeatured" defaultChecked={product.isFeatured} /> Featured product</label>
          <section className="space-y-2 sm:col-span-2" aria-label="Product images">
            <p>Product images</p>
            <div className="flex flex-wrap gap-3">
              {kept.map((url, index) => <div key={url} className="relative">
                <img src={url} alt={`Product image ${index + 1}`} width={80} height={96} className="h-24 w-20 rounded object-cover" />
                <button type="button" aria-label={`Remove image ${index + 1}`} className="absolute right-0 top-0 grid size-11 place-items-center rounded bg-black/70 text-white" onClick={() => setKept(kept.filter((_, i) => i !== index))}><X size={16} /></button>
              </div>)}
            </div>
            {files.map((file, i) => <button type="button" key={i} className="flex min-h-11 items-center gap-2 break-all" onClick={() => setFiles(files.filter((_, j) => i !== j))}>{file.name} · Remove</button>)}
            <label className="block">Add photos (up to 3 total)
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple className={inputClass}
                onChange={event => {
                  const next = [...files, ...Array.from(event.target.files ?? [])];
                  event.target.value = "";
                  if (next.length + kept.length > 3) { setError("Remove an image first. Each product can have up to three."); return; }
                  if (next.some(f => !["image/jpeg","image/png","image/webp"].includes(f.type))) { setError("Choose JPG, PNG or WebP photos."); return; }
                  if (next.reduce((total, f) => total + f.size, 0) > 4 * 1024 * 1024) { setError("Choose new photos totalling 4 MB or less."); return; }
                  setFiles(next); setError("");
                }} />
            </label>
          </section>
        </fieldset>
        <footer className="sticky bottom-0 border-t bg-brand-surface p-4">
          {error && <p role="alert" className="mb-2 text-sm">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" disabled={saving} onClick={onClose} className="min-h-11 rounded-lg border px-4">Cancel</button>
            <button disabled={saving} className="min-h-11 rounded-lg bg-brand-ink px-4 text-brand-surface">{saving ? "Saving…" : "Save changes"}</button>
          </div>
        </footer>
      </form>
    </dialog>
  );
}

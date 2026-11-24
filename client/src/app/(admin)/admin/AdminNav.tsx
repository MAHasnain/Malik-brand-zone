"use client";
import { useState } from "react";
import { api } from "@/lib/axios";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, Package, Tags, Images, ExternalLink, LogOut } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/banners", label: "Hero Banners", icon: Images },
  { href: "/", label: "View store", icon: ExternalLink, LogOut },
];

export default function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;";
      window.location.replace("/admin/login");
    }
  };

  return <nav aria-label="Admin navigation" className="flex min-h-0 flex-1 flex-col">
    <div className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/admin" && href !== "/" && pathname.startsWith(href + "/"));
        return <Link key={href} href={href} onClick={onNavigate} aria-current={active ? "page" : undefined}
          className={`flex min-h-11 items-center gap-3 rounded-lg px-4 text-sm font-medium ${active ? "bg-brand-primary text-(--on-plum)" : "hover:bg-(--tint)"}`}>
          <Icon size={18} aria-hidden />{label}
        </Link>;
      })}
    </div>
    <div className="shrink-0 border-t border-(--line) p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <button type="button" disabled={loggingOut} onClick={handleLogout}
        className="flex min-h-11 w-full items-center gap-3 rounded-lg px-4 text-sm font-medium hover:bg-(--tint) disabled:opacity-60">
        <LogOut size={18} aria-hidden />{loggingOut ? "Logging out…" : "Logout"}
      </button>
    </div>
  </nav>;
}

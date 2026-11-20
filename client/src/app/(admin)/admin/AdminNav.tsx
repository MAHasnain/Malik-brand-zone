"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, Package, Tags, Images, ExternalLink } from "lucide-react";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/banners", label: "Hero Banners", icon: Images },
  { href: "/", label: "View store", icon: ExternalLink },
];

export default function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return <nav aria-label="Admin navigation" className="space-y-1 p-3">
    {links.map(({ href, label, icon: Icon }) => {
      const active = pathname === href || (href !== "/admin" && href !== "/" && pathname.startsWith(href + "/"));
      return <Link key={href} href={href} onClick={onNavigate} aria-current={active ? "page" : undefined}
        className={`flex min-h-11 items-center gap-3 rounded-lg px-4 text-sm font-medium ${active ? "bg-brand-primary text-(--on-plum)" : "hover:bg-(--tint)"}`}>
        <Icon size={18} aria-hidden />{label}
      </Link>;
    })}
  </nav>;
}

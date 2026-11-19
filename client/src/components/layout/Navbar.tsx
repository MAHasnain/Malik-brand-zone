"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, Moon, ShoppingBag, Sun, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import HeaderSearch from './HeaderSearch';

const womenLinks = [
    { label: "Luxury Pret", href: "/women?category=pret" },
    { label: "Unstitched", href: "/women?category=unstitched" },
] as const;

function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark" | null>(null);

    useEffect(() => {
        function restore() {
            let dark = document.documentElement.dataset.theme === "dark";
            try {
                dark = localStorage.getItem("mbz-theme") === "dark";
            } catch {

            }
            const current = dark ? "dark" : "light";
            document.documentElement.dataset.theme = current;
            setTheme(current);
        }
        function onStorage(event: StorageEvent) {
            if (event.key === "mbz-theme" || event.key === null) restore();
        }
        restore();
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    function toggle() {
        const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        setTheme(next);
        try {
            localStorage.setItem("mbz-theme", next);
        } catch {
            
        }
    }

    const Icon = theme === "dark" ? Sun : Moon;
    return (
        <button type="button" onClick={toggle} disabled={theme === null}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="mbz-theme-toggle inline-flex size-11 shrink-0 items-center justify-center rounded-full">
            {theme !== null && <Icon size={19} aria-hidden="true" />}
        </button>
    );
}

export default function Navbar() {

    const { openCart, cart } = useCartStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const reduceMotion = useReducedMotion();
    const [womenOpen, setWomenOpen] = useState(false);
    const womenRef = useRef<HTMLDivElement>(null);
    const toggleRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!womenOpen) return;
        function dismissOutside(event: PointerEvent) {
            if (event.target instanceof Node && !womenRef.current?.contains(event.target)) {
                setWomenOpen(false);
            }
        }
        function dismissOnEscape(event: KeyboardEvent) {
            if (event.key !== "Escape") return;
            if (womenRef.current?.contains(document.activeElement)) toggleRef.current?.focus();
            setWomenOpen(false);
        }
        document.addEventListener("pointerdown", dismissOutside);
        document.addEventListener("keydown", dismissOnEscape);
        return () => {
            document.removeEventListener("pointerdown", dismissOutside);
            document.removeEventListener("keydown", dismissOnEscape);
        };
    }, [womenOpen]);

    const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

    return (
        <>
            <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto flex h-19 items-center justify-between px-4 lg:px-8">

                    {/* Left: Hamburger & Brand Logo */}
                    <div className="flex shrink-0 items-center gap-1 sm:gap-4 lg:flex-1 ">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="lg:hidden p-1 hover:opacity-70 transition-opacity"
                            aria-label="Menu"
                        >
                            <Menu className="h-6 w-6 text-gray-800" />
                        </button>
                        <Link href="/" className="text-2xl font-serif font-bold tracking-widest text-gray-900">
                            <Image src="/MBZ-black.png" alt="Brand Logo" width={60} height={60} priority />
                        </Link>
                    </div>

                    {/* Center: Desktop Navigation Links */}
                    <nav className="hidden h-full whitespace-nowrap lg:flex gap-8 items-center justify-center flex-1">
                        <Link href="/new-arrivals" className="text-sm font-medium tracking-wide hover:text-gray-500 transition-colors">
                            New Arrivals
                        </Link>
                        <Link href="/sale" className="text-sm font-medium tracking-wide text-red-600 hover:text-red-700 transition-colors">
                            Sale
                        </Link>
                        <div
                            ref={womenRef}
                            className="flex h-full items-center"
                            onPointerEnter={(event) => {
                                if (event.pointerType === "mouse") setWomenOpen(true);
                            }}
                            onPointerLeave={(event) => {
                                if (event.pointerType === "mouse" && !event.currentTarget.contains(document.activeElement)) {
                                    setWomenOpen(false);
                                }
                            }}
                            onBlur={(event) => {
                                if (!event.currentTarget.contains(event.relatedTarget)) setWomenOpen(false);
                            }}
                        >
                            <Link href="/women" onClick={() => setWomenOpen(false)} className="inline-flex min-h-11 items-center text-sm font-medium tracking-wide hover:text-gray-500">
                                Women
                            </Link>
                            <button
                                type="button"
                                ref={toggleRef}
                                aria-label="Women submenu"
                                aria-expanded={womenOpen}
                                aria-controls="women-desktop-panel"
                                onClick={() => setWomenOpen(open => !open)}
                                className="grid size-11 place-items-center"
                            >
                                <ChevronDown aria-hidden size={15} className={womenOpen ? "rotate-180" : ""} />
                            </button>
                            <motion.div
                                id="women-desktop-panel"
                                initial={false}
                                animate={{
                                    opacity: womenOpen ? 1 : 0,
                                    y: womenOpen || reduceMotion ? 0 : -6,
                                }}
                                transition={{
                                    duration: reduceMotion ? 0 : womenOpen ? 0.32 : 0.24,
                                    ease: "easeOut",
                                }}
                                inert={!womenOpen}
                                aria-hidden={!womenOpen}
                                style={{ pointerEvents: womenOpen ? "auto" : "none" }}
                                className="absolute inset-x-0 top-full border-y border-gray-100 bg-white shadow-lg">
                                <div className="container mx-auto grid grid-cols-[1fr_2fr] gap-12 px-8 py-8">
                                    <Link href="/women" onClick={() => setWomenOpen(false)} className="w-fit font-serif text-3xl">Women</Link>
                                    <ul className="grid grid-cols-2 gap-6 border-l border-gray-200 pl-8">
                                        {womenLinks.map(({ label, href }) => (
                                            <li key={href}>
                                                <Link href={href} onClick={() => setWomenOpen(false)} className="flex min-h-11 items-center border-b border-gray-200 text-sm font-medium hover:border-current">
                                                    {label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        </div>
                        <Link href="/home-living" className="text-sm font-medium tracking-wide hover:text-gray-500 transition-colors">
                            Home & Living
                        </Link>
                    </nav>

                    {/* Right: Action Icons (Search & Cart) */}
                    <div className="ml-2 flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-3">
                        <div className="min-w-0 flex-1 lg:max-w-56">
                            <HeaderSearch />
                        </div>

                        <ThemeToggle />

                        {/* Trigger Cart Drawer */}
                        <button onClick={() => {
                            console.log("Cart icon clicked");
                            openCart();
                        }}
                            className="relative p-1 hover:opacity-70 transition-opacity cursor-pointer" aria-label="Cart">
                            <ShoppingBag className="h-6 w-6 text-gray-800" />
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                                    {totalItems}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm lg:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-full w-[80%] max-w-sm bg-white z-50 shadow-2xl flex flex-col lg:hidden"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-100">
                                <span className="text-xl font-serif font-bold tracking-widest text-gray-900">
                                    <Image src="/MBZ-black.png" alt="Brand Logo" width={60} height={60} />
                                </span>
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    aria-label="Close menu"
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex flex-col overflow-y-auto p-6 gap-6">
                                <Link href="/new-arrivals" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium tracking-wide">
                                    New Arrivals
                                </Link>
                                <Link href="/sale" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium tracking-wide text-red-600">
                                    Sale
                                </Link>
                                <div className="relative">
                                    <Link href="/women" onClick={() => setIsMobileMenuOpen(false)} className="absolute left-0 top-0 z-10 inline-flex min-h-11 items-center text-lg font-medium tracking-wide">
                                        Women
                                    </Link>
                                    <details className="group">
                                        <summary aria-label="Women submenu" className="ml-auto flex size-11 cursor-pointer list-none items-center justify-center rounded-full hover:bg-gray-100 [&::-webkit-details-marker]:hidden">
                                            <ChevronDown aria-hidden size={18} className="group-open:rotate-180 motion-safe:transition-transform" />
                                        </summary>
                                        <ul className="mt-1 border-l border-gray-200 pl-4">
                                            {womenLinks.map(({ label, href }) => (
                                                <li key={href}>
                                                    <Link href={href} onClick={() => setIsMobileMenuOpen(false)} className="flex min-h-11 items-center text-sm text-gray-700">
                                                        {label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </details>
                                </div>
                                <Link href="/home-living" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium tracking-wide">
                                    Home & Living
                                </Link>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
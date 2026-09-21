"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Menu, ShoppingBag, Search, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import HeaderSearch from './HeaderSearch';

export default function Navbar() {
    // Zustand Store State Integration Updated
    const { openDrawer, cart } = useCartStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const totalItems = cart?.totalItems || 0;

    return (
        <>
            <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">

                    {/* Left: Hamburger & Brand Logo */}
                    <div className="flex items-center gap-4 flex-1 justify-start">
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
                    <nav className="hidden lg:flex gap-8 items-center justify-center flex-1">
                        <Link href="/new-arrivals" className="text-sm font-medium tracking-wide hover:text-gray-500 transition-colors">
                            New Arrivals
                        </Link>
                        <Link href="/sale" className="text-sm font-medium tracking-wide text-red-600 hover:text-red-700 transition-colors">
                            Sale
                        </Link>
                        <Link href="/women" className="text-sm font-medium tracking-wide hover:text-gray-500 transition-colors">
                            Women
                        </Link>
                        <Link href="/home-living" className="text-sm font-medium tracking-wide hover:text-gray-500 transition-colors">
                            Home & Living
                        </Link>
                    </nav>

                    {/* Right: Action Icons (Search & Cart) */}
                    <div className="flex items-center justify-end gap-5 flex-1">
                        <div className="flex items-center gap-4">
                            <HeaderSearch />
                        </div>

                        {/* Trigger Cart Drawer */}
                        <button onClick={openDrawer} className="relative p-1 hover:opacity-70 transition-opacity" aria-label="Cart">
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
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <div className="flex flex-col p-6 gap-6">
                                <Link href="/new-arrivals" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium tracking-wide">
                                    New Arrivals
                                </Link>
                                <Link href="/sale" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium tracking-wide text-red-600">
                                    Sale
                                </Link>
                                <Link href="/women" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium tracking-wide">
                                    Women
                                </Link>
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
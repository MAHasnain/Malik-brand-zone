"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, X, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const FILTER_OPTIONS = {
    fabrics: ["Lawn", "Cotton", "Silk", "Chiffon"],
    sizes: ["XS", "S", "M", "L", "XL"],
};

export default function FilterSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // --- URL Syncing Logic ---
    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const currentValues = params.get(key)?.split(",") || [];

        if (currentValues.includes(value)) {
            // Remove if already selected
            const updatedValues = currentValues.filter((v) => v !== value);
            if (updatedValues.length > 0) {
                params.set(key, updatedValues.join(","));
            } else {
                params.delete(key);
            }
        } else {
            // Add new selection
            currentValues.push(value);
            params.set(key, currentValues.join(","));
        }

        // scroll: false prevents page from jumping to top on every click
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const clearFilters = () => {
        router.push(pathname, { scroll: false });
    };

    // --- Filter UI Blocks ---
    const renderFilterContent = () => {
        return (
            <div className="flex flex-col gap-8 pb-20 lg:pb-0">
                <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl">Filters</h3>
                    {Array.from(searchParams.keys()).length > 0 && (
                        <button onClick={clearFilters} className="text-xs underline text-gray-500 hover:text-black">
                            Clear All
                        </button>
                    )}
                </div>

                {/* Fabric Filter (Checkboxes) */}
                <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-medium text-sm mb-4 flex items-center justify-between">
                        Fabric <ChevronDown className="w-4 h-4" />
                    </h4>
                    <div className="space-y-3">
                        {FILTER_OPTIONS.fabrics.map((fabric) => {
                            const isChecked = searchParams.get("fabric")?.split(",").includes(fabric);
                            return (
                                <label key={fabric} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-4 h-4 border flex items-center justify-center transition-colors ${isChecked ? 'bg-black border-black' : 'border-gray-300 group-hover:border-black'}`}>
                                        {isChecked && <div className="w-2 h-2 bg-white" />}
                                    </div>
                                    <span className="text-sm text-gray-700">{fabric}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>

                {/* Size Filter (Pills) */}
                <div className="border-t border-gray-100 pt-4">
                    <h4 className="font-medium text-sm mb-4 flex items-center justify-between">
                        Size <ChevronDown className="w-4 h-4" />
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {FILTER_OPTIONS.sizes.map((size) => {
                            const isSelected = searchParams.get("size")?.split(",").includes(size);
                            return (
                                <button
                                    key={size}
                                    onClick={() => handleFilterChange("size", size)}
                                    className={`w-10 h-10 text-xs font-medium border flex items-center justify-center transition-colors ${isSelected ? "bg-black text-white border-black" : "bg-white text-black border-gray-300 hover:border-black"
                                        }`}
                                >
                                    {size}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* --- DESKTOP VIEW (Fixed Left Sidebar) --- */}
            <aside className="hidden lg:block w-64 shrink-0 pr-8">
                <div className="sticky top-24">
                    {renderFilterContent()}
                </div>
            </aside>

            {/* --- MOBILE VIEW (Floating Button & Bottom Drawer) --- */}
            <div className="lg:hidden">
                {/* Floating Trigger Button */}
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="bg-black text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-xl hover:bg-gray-800 transition-colors text-sm font-medium tracking-wide"
                    >
                        <Filter className="w-4 h-4" />
                        Filters & Sort
                    </button>
                </div>

                {/* Framer Motion Bottom Sheet */}
                <AnimatePresence>
                    {isMobileOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileOpen(false)}
                                className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
                            />

                            {/* Drawer */}
                            <motion.div
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed bottom-0 left-0 right-0 h-[80vh] bg-white z-50 rounded-t-3xl p-6 overflow-y-auto"
                            >
                                <div className="flex justify-center mb-6">
                                    <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                                </div>
                                <button
                                    onClick={() => setIsMobileOpen(false)}
                                    className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                {renderFilterContent()}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
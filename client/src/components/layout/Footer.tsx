import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="border-t border-brand-champagne bg-brand-surface text-brand-ink">
            <div className="mx-auto w-full max-w-360 px-5 sm:px-8 lg:px-16">
                <div className="grid grid-cols-2 gap-x-5 gap-y-7 py-9 sm:gap-x-8 lg:grid-cols-[1.3fr_.8fr_1fr_1.25fr] lg:gap-x-10 lg:py-12">

                    {/* Brand & About */}
                    <div className="col-span-2 lg:col-span-1">
                        <Link href="/" className="mb-4 inline-flex">
                            <Image
                                src="/MBZ-black.png"
                                alt="Malik Brand Zone"
                                width={64}
                                height={64}
                                className="dark:invert"
                            />
                        </Link>
                        <p className="max-w-[34ch] text-sm leading-6 text-brand-muted">
                            Redefining elegance for the modern woman. Premium fabrics, intricate embroidery, and timeless silhouettes delivered nationwide.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-2 text-sm font-semibold uppercase tracking-[.09em] text-brand-ink">Shop</h4>
                        <ul className="text-sm text-brand-muted">
                            <li><Link href="/new-arrivals" className="inline-flex min-h-11 items-center hover:text-brand-primary hover:underline">New Arrivals</Link></li>
                            <li><Link href="/women?category=pret" className="inline-flex min-h-11 items-center hover:text-brand-primary hover:underline">Luxury Pret</Link></li>
                            <li><Link href="/women?category=unstitched" className="inline-flex min-h-11 items-center hover:text-brand-primary hover:underline">Unstitched</Link></li>
                            <li><Link href="/sale" className="inline-flex min-h-11 items-center text-brand-primary hover:underline">Sale</Link></li>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h4 className="mb-2 text-sm font-semibold uppercase tracking-[.09em] text-brand-ink">Customer Care</h4>
                        <ul className="text-sm text-brand-muted">
                            <li><Link href="/contact" className="inline-flex min-h-11 items-center hover:text-brand-primary hover:underline">Contact Us</Link></li>
                            <li><Link href="/shipping" className="inline-flex min-h-11 items-center hover:text-brand-primary hover:underline">Shipping & Delivery</Link></li>
                            <li><Link href="/returns" className="inline-flex min-h-11 items-center hover:text-brand-primary hover:underline">Returns & Exchanges</Link></li>
                            <li><Link href="/faq" className="inline-flex min-h-11 items-center hover:text-brand-primary hover:underline">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter & Contact */}
                    <div className="col-span-2 min-w-0 lg:col-span-1">
                        <h4 className="mb-2 text-sm font-semibold uppercase tracking-[.09em] text-brand-ink">Stay Updated</h4>
                        <p className="mb-4 max-w-[36ch] text-sm leading-6 text-brand-muted">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <form className="flex w-full max-w-md overflow-hidden rounded-md border border-brand-line focus-within:border-brand-plum">
                            <input
                                type="email"
                                aria-label="Email address" autoComplete="email" placeholder="Enter your email"
                                className="min-w-0 flex-1 px-3 py-2 text-base text-brand-ink"
                            />
                            <button type="button" className="min-h-11 shrink-0 bg-brand-plum px-4 text-sm font-semibold text-brand-on-plum">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-brand-line py-4 text-center sm:justify-between">
                    <p className="text-xs text-brand-muted">
                        Developed by <a href="https://linktr.ee/MAHasnain" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-brand-primary">MAHasnain</a>
                    </p>
                    <p className="text-xs text-brand-muted">
                        © {new Date().getFullYear()} Malik Brand Zone. All rights reserved.
                    </p>

                    <div className="flex w-full justify-center gap-1 sm:w-auto">
                        <a href="https://www.instagram.com/malikadnanbrandhouse" aria-label="Instagram" className="inline-flex size-11 items-center justify-center rounded-full text-brand-muted hover:bg-brand-tint hover:text-brand-primary">
                            <FaInstagram className="w-5 h-5" />
                        </a>
                        <a href="https://www.facebook.com/people/Malik-Adnan-Brand-House/pfbid0i7nraC7MnUT8qZDcsfww2WWy4sw9VcTHcqsaFx29fvLcDzNoFeyLL2FdW9GKj8zcl/" aria-label="Facebook" className="inline-flex size-11 items-center justify-center rounded-full text-brand-muted hover:bg-brand-tint hover:text-brand-plum">
                            <FaFacebook className="w-5 h-5" />
                        </a>
                        <a href="https://www.tiktok.com/@malikbrotherbrandzone" aria-label="TikTok" className="inline-flex size-11 items-center justify-center rounded-full text-brand-muted hover:bg-brand-tint hover:text-brand-primary">
                            <FaTiktok className="w-5 h-5" />
                        </a>
                        <a href="https://wa.me/923172888917" aria-label="WhatsApp" className="inline-flex size-11 items-center justify-center rounded-full text-brand-muted hover:bg-brand-tint hover:text-brand-primary">
                            <FaWhatsapp className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
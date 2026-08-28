import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand & About */}
                    <div>
                        <Link href="/" className="text-2xl font-serif font-bold tracking-widest text-gray-900 mb-6 block">
                            <Image src="/MBZ-black.png" alt="Brand Logo" width={80} height={80} />
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                            Redefining elegance for the modern woman. Premium fabrics, intricate embroidery, and timeless silhouettes delivered nationwide.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-medium text-gray-900 mb-6 tracking-wide uppercase text-sm">Shop</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><Link href="/new-arrivals" className="hover:text-black transition-colors">New Arrivals</Link></li>
                            <li><Link href="/women?category=pret" className="hover:text-black transition-colors">Luxury Pret</Link></li>
                            <li><Link href="/women?category=unstitched" className="hover:text-black transition-colors">Unstitched</Link></li>
                            <li><Link href="/sale" className="text-red-600 hover:text-red-700 transition-colors">Sale</Link></li>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h4 className="font-medium text-gray-900 mb-6 tracking-wide uppercase text-sm">Customer Care</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
                            <li><Link href="/shipping" className="hover:text-black transition-colors">Shipping & Delivery</Link></li>
                            <li><Link href="/returns" className="hover:text-black transition-colors">Returns & Exchanges</Link></li>
                            <li><Link href="/faq" className="hover:text-black transition-colors">FAQs</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter & Contact */}
                    <div>
                        <h4 className="font-medium text-gray-900 mb-6 tracking-wide uppercase text-sm">Stay Updated</h4>
                        <p className="text-gray-500 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                        <form className="flex mb-6">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-black"
                            />
                            <button type="button" className="bg-black text-white px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-md">
                        Developed by <a href="https://linktr.ee/MAHasnain" className=' hover:text-black transition-colors '>MAHasnain</a>
                    </p>
                    <p className="text-gray-400 text-xs">
                        © {new Date().getFullYear()} Malik Brand Zone. All rights reserved.
                    </p>
                    
                    <div className="flex gap-5">
                        <a href="#" className="text-gray-400 hover:text-black transition-colors">
                            <FaInstagram className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-black transition-colors">
                            <FaFacebook className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-black transition-colors">
                            <FaTiktok className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-green-600 transition-colors">
                            <FaWhatsapp className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
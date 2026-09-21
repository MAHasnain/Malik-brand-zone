import { Mail, MapPin, Phone, Instagram, Facebook, MessageCircle } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 lg:px-8 py-16">
            <div className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="text-4xl font-serif text-gray-900 mb-4">Get in Touch</h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                    Whether you have a question about our collections, need assistance with your order, or just want to share your feedback, our team is here to help.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-5xl mx-auto">
                {/* Contact Form */}
                <div className="bg-gray-50 p-8">
                    <h3 className="text-xl font-serif mb-6">Send us a Message</h3>
                    <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">First Name</label>
                                <input type="text" className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black bg-white" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Last Name</label>
                                <input type="text" className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black bg-white" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
                            <input type="email" className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black bg-white" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                            <textarea rows={5} className="w-full border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black bg-white resize-none"></textarea>
                        </div>
                        <button className="w-full bg-black text-white py-4 text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors">
                            Submit Inquiry
                        </button>
                    </form>
                </div>

                {/* Store Info & Socials */}
                <div className="flex flex-col justify-center">
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <MapPin className="w-6 h-6 text-gray-400 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-medium text-gray-900 mb-1">Store Location</h4>
                                <p className="text-gray-500 text-sm">123 Fashion Avenue, Boutique District<br />Karachi, Pakistan</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <Phone className="w-6 h-6 text-gray-400 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-medium text-gray-900 mb-1">Phone & WhatsApp</h4>
                                <p className="text-gray-500 text-sm">+92 300 1234567<br />Mon-Sat, 10:00 AM - 8:00 PM</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <Mail className="w-6 h-6 text-gray-400 shrink-0 mt-1" />
                            <div>
                                <h4 className="font-medium text-gray-900 mb-1">Email Support</h4>
                                <p className="text-gray-500 text-sm">support@banani.pk</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-12 border-t border-gray-100">
                        <h4 className="font-medium text-gray-900 mb-6">Connect with Us</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <a href="#" className="flex items-center gap-3 text-gray-500 hover:text-black transition-colors text-sm border border-gray-100 p-4 bg-gray-50 hover:bg-white">
                                <FaInstagram className="w-5 h-5 text-pink-600" /> @banani.official
                            </a>
                            <a href="#" className="flex items-center gap-3 text-gray-500 hover:text-black transition-colors text-sm border border-gray-100 p-4 bg-gray-50 hover:bg-white">
                                <FaWhatsapp className="w-5 h-5 text-green-600" /> WhatsApp Chat
                            </a>
                            <a href="#" className="flex items-center gap-3 text-gray-500 hover:text-black transition-colors text-sm border border-gray-100 p-4 bg-gray-50 hover:bg-white">
                                <FaFacebook className="w-5 h-5 text-blue-600" /> Banani Store
                            </a>
                            <a href="#" className="flex items-center gap-3 text-gray-500 hover:text-black transition-colors text-sm border border-gray-100 p-4 bg-gray-50 hover:bg-white">
                                <FaTiktok className="w-5 h-5 text-black" /> Banani Tok
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
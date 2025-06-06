'use client'
import { useCartStore } from '@/store/cart';
import { useWishlistStore } from '@/store/wishlist';
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLogo from './AppLogo';
import { Button } from '../ui/button';
import { handleSignOut } from '@/actions/auth/user';

type CountryOption = {
    code: string;
    name: string;
    currency: string;
    flag: string;
};
type User = {
    name?: string;
    email?: string;
} | null;
export default function Header({ user }: { user: User }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const router = useRouter();
    const { items: cartItems } = useCartStore();
    const { items: wishlistItems } = useWishlistStore();

    const accountRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
                setIsAccountOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const countries: CountryOption[] = [
        { code: 'US', name: 'United States', currency: 'USD', flag: '🇺🇸' },
        { code: 'GB', name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧' },
        { code: 'EU', name: 'European Union', currency: 'EUR', flag: '🇪🇺' },
        { code: 'CA', name: 'Canada', currency: 'CAD', flag: '🇨🇦' },
        // Add more countries as needed
    ];

    const [selectedCountry, setSelectedCountry] = useState(countries[0]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearchOpen(false);
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="bg-white text-neutral-800 sticky top-0 z-50 shadow-sm">
            {/* Announcement Bar */}
            <div className="bg-neutral-900 text-white py-2 text-center text-sm font-medium">
                <p>Free worldwide shipping on orders over $150</p>
            </div>

            <nav className="border-b border-neutral-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Left Navigation - Desktop */}
                        <div className="hidden lg:flex items-center space-x-8">
                            <Link href="/" className="text-sm font-medium hover:text-neutral-600 transition-colors hover:underline">Home</Link>
                            <Link href="/shop" className="text-sm font-medium hover:text-neutral-600 transition-colors hover:underline">Shop</Link>
                            <Link href="/new" className="text-sm font-medium hover:text-neutral-600 transition-colors hover:underline">New In</Link>
                            <Link href="/blog" className="text-sm font-medium hover:text-neutral-600 transition-colors hover:underline">Blog</Link>
                            <Link href="/collections" className="text-sm font-medium hover:text-neutral-600 transition-colors hover:underline">Collections</Link>
                            <Link href="/sale" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors hover:underline">Sale</Link>
                        </div>

                        {/* Logo - Centered on all screens */}
                        <Link href="/" className="text-2xl font-bold tracking-tight lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                            <AppLogo />
                        </Link>

                        {/* Right Actions */}
                        <div className="flex items-center space-x-4 sm:space-x-6">
                            {/* Country Selector - Hidden on mobile */}
                            <div className="hidden sm:block relative">
                                <button
                                    onClick={() => setIsLocationOpen(!isLocationOpen)}
                                    className="flex items-center gap-2 text-sm hover:text-neutral-600"
                                >
                                    <span>{selectedCountry.flag}</span>
                                    <span>{selectedCountry.currency}</span>
                                </button>

                                {isLocationOpen && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-neutral-100 z-50">
                                        <ul className="py-2">
                                            {countries.map((country) => (
                                                <li
                                                    key={country.code}
                                                    className="flex items-center gap-2 px-4 py-2 hover:bg-neutral-50 cursor-pointer"
                                                    onClick={() => {
                                                        setSelectedCountry(country);
                                                        setIsLocationOpen(false);
                                                    }}
                                                >
                                                    <span>{country.flag}</span>
                                                    <span>{country.name}</span>
                                                    <span className="ml-auto text-neutral-600">{country.currency}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Search */}
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="p-2 hover:text-neutral-600 transition-colors"
                                aria-label="Search"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                            {/* Wishlist */}
                            <Link href="/wishlist" className="relative p-2 hover:text-neutral-600 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                                <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                    {wishlistItems.length}
                                </span>
                            </Link>

                            {/* Cart */}
                            <Link href="/cart" className="relative p-2 hover:text-neutral-600 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                <span className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartItems.reduce((total, item) => total + item.quantity, 0)}
                                </span>
                            </Link>
                            {/* Account */}
                            <div className="relative" ref={accountRef}>
                                <button
                                    onClick={() => setIsAccountOpen(!isAccountOpen)}
                                    className="p-2 hover:text-neutral-600 transition-colors"
                                    aria-label="Account"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </button>


                                {isAccountOpen && (
                                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-neutral-200 z-50 overflow-hidden transition-all duration-300 ease-in-out transform-gpu">
                                        {user?.email ? (
                                            <div className="p-5 bg-gradient-to-r from-neutral-50 to-neutral-100 border-b border-neutral-200">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-800 font-semibold">
                                                        {user.name?.[0] || user.email[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-neutral-900 text-base">Welcome</div>
                                                        <p className="text-sm text-neutral-600 truncate">{user.name || user.email}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-5 border-b border-neutral-200">
                                                <div className="font-semibold text-neutral-900 text-base">Account</div>
                                                <p className="text-sm text-neutral-500 mt-1">Sign in for a personalized experience</p>
                                            </div>
                                        )}
                                        <div className="py-2">
                                            {!user?.email && (
                                                <>
                                                    <Link href="/login" className="block px-5 py-3 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors duration-200">Sign In</Link>
                                                    <Link href="/register" className="block px-5 py-3 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors duration-200">Create Account</Link>
                                                </>
                                            )}

                                            {user?.email && (
                                                <>
                                                    <Link href="/account/orders" className="block px-5 py-3 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors duration-200">Orders</Link>
                                                    <Link href="/wishlist" className="block px-5 py-3 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors duration-200">Wishlist</Link>
                                                    <Link href="/account/settings" className="block px-5 py-3 text-sm text-neutral-700 hover:bg-neutral-100 transition-colors duration-200">Settings</Link>
                                                    <form action={handleSignOut}>
                                                        <Button
                                                            type="submit"
                                                            variant="ghost"
                                                            className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                                                        >
                                                            Logout
                                                        </Button>
                                                    </form>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>



                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="lg:hidden p-2 hover:text-neutral-600"
                                aria-label="Menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-white border-t border-neutral-100">
                    <div className="max-w-7xl mx-auto px-4 py-6">
                        <nav className="space-y-6">
                            <ul className="space-y-3">
                                <li><Link href="/shop" className="block text-lg font-medium hover:text-neutral-600">Shop</Link></li>
                                <li><Link href="/new" className="block text-lg font-medium hover:text-neutral-600">New In</Link></li>
                                <li><Link href="/collections" className="block text-lg font-medium hover:text-neutral-600">Collections</Link></li>
                                <li><Link href="/sale" className="block text-lg font-medium text-red-600 hover:text-red-700">Sale</Link></li>
                            </ul>
                            <div className="border-t border-neutral-100 pt-6">
                                <button
                                    onClick={() => setIsLocationOpen(!isLocationOpen)}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <span>{selectedCountry.flag}</span>
                                    <span>{selectedCountry.name}</span>
                                    <span className="ml-auto">{selectedCountry.currency}</span>
                                </button>
                            </div>
                        </nav>
                    </div>
                </div>
            )}

            {/* Search Modal */}
            {isSearchOpen && (
                <div className="fixed inset-0 bg-white z-50">
                    <div className="max-w-3xl mx-auto px-4 py-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-medium">Search products</h2>
                            <button
                                onClick={() => setIsSearchOpen(false)}
                                className="p-2 hover:text-neutral-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-3 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-colors"
                            />
                            <svg
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </form>
                    </div>
                </div>
            )}
        </header>
    );
}
import React from 'react';
import ScrollToTopButton from './ScrollToTopButton';
import Link from 'next/link';

export default function Footer() {
    return (
        <>
            <footer className='bg-black text-white py-16 lg:py-24'>
                <div className='max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
                        {/* Newsletter Section - Span 5 columns */}
                        <div className="lg:col-span-5 space-y-8">
                            <h2 className='text-3xl font-bold tracking-tight'>Stay Connected</h2>
                            <p className='text-gray-300 text-lg leading-relaxed max-w-md'>
                                Subscribe to our newsletter for curated content and exclusive early access.
                            </p>
                            <form className="relative max-w-md flex items-center gap-4">
                                <div className="relative flex-grow">
                                    <label htmlFor="newsletter-email" className="sr-only">Email address</label>

                                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                    </svg>

                                    <input
                                        id="newsletter-email"
                                        type="email"
                                        placeholder="Enter your email"
                                        aria-label="Enter your email for newsletter"
                                        className="w-full pl-12 pr-6 py-4 bg-black border border-white text-white placeholder-white text-base focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors duration-200"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="px-8 py-4 bg-white text-black font-medium border border-white hover:bg-black hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition-colors duration-200"
                                >
                                    Subscribe
                                </button>
                            </form>
                        </div>

                        {/* Navigation Links Section - Span 4 columns */}
                        <nav className='lg:col-span-5 grid grid-cols-2 sm:grid-cols-3 gap-8'>
                            <div className="space-y-6">
                                <h4 className='text-lg font-semibold tracking-wide'>Shop</h4>
                                <ul className="space-y-4 text-gray-300">
                                    <li><Link href="#" className="hover:text-white  hover:underline transition duration-200">New Arrivals</Link></li>
                                    <li><Link href="#" className="hover:text-white  hover:underline transition duration-200">Best Sellers</Link></li>
                                    <li><Link href="#" className="hover:text-white  hover:underline transition duration-200">Sale Items</Link></li>
                                    <li><Link href="#" className="hover:text-white  hover:underline transition duration-200">Limited Editions</Link></li>
                                </ul>
                            </div>
                            <div className="space-y-6">
                                <h4 className='text-lg font-semibold tracking-wide'>Account</h4>
                                <ul className="space-y-4 text-gray-300">
                                    <li><Link href="#" className="hover:text-white  hover:underline transition duration-200">My Account</Link></li>
                                    <li><Link href="#" className="hover:text-white  hover:underline transition duration-200">Order History</Link></li>
                                    <li><Link href="#" className="hover:text-white  hover:underline transition duration-200">Wishlist</Link></li>
                                    <li><Link href="#" className="hover:text-white  hover:underline transition duration-200">Settings</Link></li>
                                </ul>
                            </div>
                            <div className="space-y-6">
                                <h4 className='text-lg font-semibold tracking-wide'>Legal</h4>
                                <ul className="space-y-4 text-gray-300">
                                    <li><Link href="#" className="hover:text-white  hover:underline transition duration-200">Privacy Policy</Link></li>
                                    <li><Link href="#" className="hover:text-white  hover:underline transition duration-200">Terms of Service</Link></li>
                                    <li><Link href="#" className="hover:text-white  hover:underline transition duration-200">Refund Policy</Link></li>
                                    <li><Link href="#" className="hover:text-white  hover:underline transition duration-200">Cookie Policy</Link></li>
                                </ul>
                            </div>
                        </nav>

                        {/* Social Media Section - Span 3 columns */}
                        <div className="lg:col-span-2 space-y-8">
                            <h4 className='text-lg font-semibold tracking-wide'>Follow Us</h4>
                            <div className='flex flex-wrap gap-5'>
                                {['Facebook', 'X', 'Instagram', 'LinkedIn','Whatsapp','Youtube'].map((social) => (
                                    <a
                                        key={social}
                                        href="#"
                                        aria-label={social}
                                        className="group relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 transition-all duration-200 hover:bg-white hover:text-black hover:border-transparent"
                                    >
                                        <span className="absolute -top-10 bg-white text-black px-2 opacity-0 group-hover:opacity-100 text-sm transition-opacity duration-200">
                                            {social}
                                        </span>
                                        {/* Keep existing SVG icons */}
                                        {social === 'Facebook' && (
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                            </svg>
                                        )}
                                        {social === 'X' && (
                                         <svg className="w-6 h-6 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                         <path d="M13.795 10.533 20.68 2h-3.073l-5.255 6.517L7.69 2H1l7.806 10.91L1.47 22h3.074l5.705-7.07L15.31 22H22l-8.205-11.467Zm-2.38 2.95L9.97 11.464 4.36 3.627h2.31l4.528 6.317 1.443 2.02 6.018 8.409h-2.31l-4.934-6.89Z"/>
                                       </svg>
                                        )}
                                        {social === 'Instagram' && (
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                            </svg>
                                        )}
                                        {social === 'LinkedIn' && (
                                        <svg className="w-6 h-6 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z" clipRule="evenodd"/>
                                        <path d="M7.2 8.809H4V19.5h3.2V8.809Z"/>
                                      </svg>
                                    )}
                                        {social === 'Whatsapp' && (
                                      <svg className="w-6 h-6 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                      <path fill="currentColor" fillRule="evenodd" d="M12 4a8 8 0 0 0-6.895 12.06l.569.718-.697 2.359 2.32-.648.379.243A8 8 0 1 0 12 4ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.96 9.96 0 0 1-5.016-1.347l-4.948 1.382 1.426-4.829-.006-.007-.033-.055A9.958 9.958 0 0 1 2 12Z" clipRule="evenodd"/>
                                      <path fill="currentColor" d="M16.735 13.492c-.038-.018-1.497-.736-1.756-.83a1.008 1.008 0 0 0-.34-.075c-.196 0-.362.098-.49.291-.146.217-.587.732-.723.886-.018.02-.042.045-.057.045-.013 0-.239-.093-.307-.123-1.564-.68-2.751-2.313-2.914-2.589-.023-.04-.024-.057-.024-.057.005-.021.058-.074.085-.101.08-.079.166-.182.249-.283l.117-.14c.121-.14.175-.25.237-.375l.033-.066a.68.68 0 0 0-.02-.64c-.034-.069-.65-1.555-.715-1.711-.158-.377-.366-.552-.655-.552-.027 0 0 0-.112.005-.137.005-.883.104-1.213.311-.35.22-.94.924-.94 2.16 0 1.112.705 2.162 1.008 2.561l.041.06c1.161 1.695 2.608 2.951 4.074 3.537 1.412.564 2.081.63 2.461.63.16 0 .288-.013.4-.024l.072-.007c.488-.043 1.56-.599 1.804-1.276.192-.534.243-1.117.115-1.329-.088-.144-.239-.216-.43-.308Z"/>
                                    </svg>
                                        )}
                                            {social === 'Youtube' && (
                                      <svg className="w-6 h-6 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                      <path fillRule="evenodd" d="M21.7 8.037a4.26 4.26 0 0 0-.789-1.964 2.84 2.84 0 0 0-1.984-.839c-2.767-.2-6.926-.2-6.926-.2s-4.157 0-6.928.2a2.836 2.836 0 0 0-1.983.839 4.225 4.225 0 0 0-.79 1.965 30.146 30.146 0 0 0-.2 3.206v1.5a30.12 30.12 0 0 0 .2 3.206c.094.712.364 1.39.784 1.972.604.536 1.38.837 2.187.848 1.583.151 6.731.2 6.731.2s4.161 0 6.928-.2a2.844 2.844 0 0 0 1.985-.84 4.27 4.27 0 0 0 .787-1.965 30.12 30.12 0 0 0 .2-3.206v-1.516a30.672 30.672 0 0 0-.202-3.206Zm-11.692 6.554v-5.62l5.4 2.819-5.4 2.801Z" clipRule="evenodd"/>
                                    </svg>
                                    
                                        )}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className='mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4'>
                        <div className="text-sm text-gray-400">© 2025 Eclipse. All rights reserved.</div>
                        <div className="flex items-center gap-8 text-sm text-gray-400">
                      <h4>ECLIPSE</h4>
                        </div>
                    </div>
                </div>
            </footer>
            <ScrollToTopButton />
        </>
    );
}
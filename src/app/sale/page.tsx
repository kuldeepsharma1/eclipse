'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './sale.module.css';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, Star, 
  TrendingUp, Award, Package, Truck, RefreshCw, ShieldCheck 
} from 'lucide-react';

const luxuryBrands = [
  'Gucci', 'Prada', 'Louis Vuitton', 'Hermès', 'Chanel', 'Dior'
];

const categories = [
  {
    name: 'Luxury Watches',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49',
    discount: '40%'
  },
  {
    name: 'Designer Bags',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
    discount: '50%'
  },
  {
    name: 'Premium Shoes',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2',
    discount: '60%'
  },
  {
    name: 'Accessories',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f',
    discount: '70%'
  }
];

const testimonials = [
  {
    name: 'Emily Thompson',
    role: 'Fashion Influencer',
    comment: "The quality of products and service is exceptional. I am impressed with every purchase.",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
  },
  {
    name: 'Michael Chen',
    role: 'Style Consultant',
    comment: "Best luxury shopping experience online. The deals are unmatched.",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e'
  },
  {
    name: 'Sarah Williams',
    role: 'Fashion Blogger',
    comment: "Incredible selection of premium brands. The sale prices are amazing!",
    rating: 5,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80'
  }
];

export default function SalePage() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 200], [1, 0]);

  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        }
        if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        }
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section with Parallax */}
      <section className={styles.heroSection}>
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b"
            alt="Luxury Shopping"
            fill
            className="object-cover opacity-50"
            priority
          />
        </motion.div>
        
        <motion.div style={{ opacity }} className={`${styles.container} relative z-10 h-screen flex flex-col justify-center items-center text-center`}>
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className={`${styles.heroText} ${styles.gradientText} mb-8`}
          >
            LUXURY SALE
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-2xl md:text-4xl mb-8 font-light tracking-wide"
          >
            UP TO <span className="font-bold text-red-500">70% OFF</span>
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button 
              size="lg"
              className="bg-white text-black hover:bg-gray-200 transition-all duration-300 group"
            >
              EXPLORE COLLECTION
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-black">
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {[

              { icon: <TrendingUp />, stat: '70%', label: 'Discount' },
              { icon: <Award />, stat: '100+', label: 'Luxury Brands' },
              { icon: <Package />, stat: '10K+', label: 'Products' },
              { icon: <ShieldCheck />, stat: '100%', label: 'Authentic' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={styles.statCard}
              >
                <div className="text-4xl mb-4 text-white/80">{item.icon}</div>
                <div className="text-4xl font-bold mb-2">{item.stat}</div>
                <div className="text-gray-400">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className={styles.container}>
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Shop by Category
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={styles.categoryCard}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                />
                <div className={styles.categoryOverlay} />
                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <span className="text-red-500 font-bold">Up to {category.discount} OFF</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_50%)]" />
        </div>
        <div className={styles.container}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Flash Sale Ends In
            </h2>
            <p className="text-gray-400 text-lg">Don&apos;t miss out on these exclusive deals</p>
          </motion.div>
          <div className={styles.saleCountdown}>
            {Object.entries(timeLeft).map(([unit, value], index) => (
              <motion.div
                key={unit}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={styles.countdownBox}
              >
                <span className={styles.countdownNumber}>
                  {String(value).padStart(2, '0')}
                </span>
                <span className="text-sm uppercase tracking-wider text-gray-400">
                  {unit}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-black">
        <div className={styles.container}>
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            What Our Customers Say
          </motion.h2>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={styles.testimonialCard}
              >
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{testimonial.comment}</p>
                <div className="flex gap-1">
                  {Array(testimonial.rating).fill(null).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className={styles.container}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[

              {
                icon: <Truck className="w-8 h-8" />,
                title: "Free Express Shipping",
                description: "On orders over $500"
              },
              {
                icon: <RefreshCw className="w-8 h-8" />,
                title: "Easy Returns",
                description: "30-day return policy"
              },
              {
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "Secure Shopping",
                description: "100% secure payment"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className={styles.glassCard}
              >
                <div className="p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-20 bg-black">
        <div className={styles.container}>
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold text-center mb-16"
          >
            Featured Luxury Brands
          </motion.h2>
          <div className={styles.brandGrid}>
            {luxuryBrands.map((brand, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={styles.brandLogo}
              >
                <div className="text-2xl font-serif text-center">{brand}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className={styles.container}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6">
              Subscribe & Get 10% Off
            </h2>
            <p className="text-gray-400 mb-8">
              Be the first to know about our exclusive offers and new arrivals
            </p>
            <div className="flex gap-4 flex-col sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/20 transition-colors"
              />
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-200 whitespace-nowrap"
              >
                Subscribe Now
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              By subscribing you agree to our Terms of Service and Privacy Policy
            </p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

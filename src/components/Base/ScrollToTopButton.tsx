'use client';

import React, { useState, useEffect, useRef } from 'react';

// Type for a function that takes no arguments and returns void
type VoidCallback = () => void;

// Custom Hook for throttling
const useThrottle = (
    func: VoidCallback,
    limit: number
): VoidCallback => {
    const lastFunc = useRef<NodeJS.Timeout | null>(null);
    const lastRan = useRef<number>(0);

    return React.useCallback(() => {
        const now = Date.now();

        if (!lastRan.current) {
            func();
            lastRan.current = now;
        } else {
            if (lastFunc.current) {
                clearTimeout(lastFunc.current);
            }
            const remaining = limit - (now - lastRan.current);
            lastFunc.current = setTimeout(() => {
                func();
                lastRan.current = Date.now();
            }, remaining <= 0 ? 0 : remaining);
        }
    }, [func, limit]);
};

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const handleScroll: VoidCallback = React.useCallback(() => {
        setIsVisible(window.scrollY > 300);
    }, []);

    const throttledHandleScroll = useThrottle(handleScroll, 100) as EventListener;

    useEffect(() => {
        window.addEventListener('scroll', throttledHandleScroll);

        return () => {
            window.removeEventListener('scroll', throttledHandleScroll);
        };
    }, [throttledHandleScroll]);

    const scrollToTop = (): void => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const buttonClasses: string = `
        fixed bottom-8 right-8 z-10
        p-2.5 bg-black backdrop-blur-sm
        shadow-lg rounded-full
        transform transition-all duration-200 ease-out
        
        hover:scale-125 hover:shadow-white/20
        focus:outline-none 
        group
        animate-fade-in
        ${isVisible
            ? 'translate-y-0 opacity-100 visible cursor-pointer'
            : 'translate-y-20 opacity-0 invisible'
        }
    `;

    return (
        <button
            onClick={scrollToTop}
            className={buttonClasses}
            aria-label="Scroll to top"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
                <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
            </svg>


        </button>
    );
}
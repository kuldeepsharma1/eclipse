import Footer from '@/components/Base/Footer'
import HeaderWrapper from '@/components/Base/HeaderWrapper'
import React from 'react'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <HeaderWrapper />
            {children}
            <Footer />
        </>
    )
}

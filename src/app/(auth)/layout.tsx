import { AuthLayout } from '@/components/auth/AuthLayout';
import React from 'react'

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthLayout>
        {children}
      </AuthLayout>
    </>
  )
}

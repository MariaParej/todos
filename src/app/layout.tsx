import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'TAREAS',
  description: 'Gestión de tareas con next.js y Supabase'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='es'>
      <body className='bg-slate-50'>
        <Header />
        <Toaster position='top-center' offset='100px' />
        <main>{children}</main>
      </body>
    </html>
  )
}

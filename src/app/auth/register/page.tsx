'use client'

import { AuthView } from '@daveyplate/better-auth-ui'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <main className='min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6'>
      <div className='w-full max-w-[420px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden'>
        
        <div className='px-2 pt-4'>
          <AuthView
            view="SIGN_UP"
            redirectTo='/login'
            className='!shadow-none !border-none !bg-transparent !p-0 !max-w-md md:!max-w-lg lg:!max-w-xl'
            localization={{
              SIGN_UP: 'Crear cuenta',
              SIGN_UP_DESCRIPTION: 'Introduce tus datos para empezar',
              NAME: 'Nombre completo',
              EMAIL: 'Correo electrónico',
              PASSWORD: 'Contraseña',
              SIGN_UP_ACTION: 'Registrarme',
              ALREADY_HAVE_AN_ACCOUNT: '',
              SIGN_IN: ''
            }}
          />
        </div>

        <div className="px-10 mt-2">
          <div className="border-t border-slate-100"></div>
        </div>

        {/* direccionar a mano */}
        <div className='py-8 text-center'>
          <p className='text-sm text-gray-600'>
            ¿Ya tienes cuenta?{' '}
            <Link
              href='/auth/login'
              className='text-blue-600 hover:underline font-medium'
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
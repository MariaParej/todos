'use client'

import { AuthView } from '@daveyplate/better-auth-ui'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <main className='min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6'>
      <div className='w-full max-w-[420px] bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden'>
        <div className='px-2 pt-4'>
          <AuthView
            redirectTo='/'
            className='!shadow-none !border-none !bg-transparent !p-0 !max-w-md md:!max-w-lg lg:!max-w-xl'
            localization={{
              SIGN_IN: 'Iniciar sesión',
              SIGN_IN_DESCRIPTION: 'Escribe tu email debajo',
              SIGN_UP: '',
              EMAIL: 'Correo electrónico',
              PASSWORD: 'Contraseña',
              FORGOT_PASSWORD_LINK: '¿Olvidate tu contraseña?',
              SIGN_IN_ACTION: 'Entrar',
              DONT_HAVE_AN_ACCOUNT: ''
            }}
          />
        </div>
        <div className='px-10 mt-2'>
          <div className='border-t border-slate-100'></div>
        </div>
        {/* direccionar a mano */}
        <div className='py-8 text-center'>
          <p className='text-sm text-gray-600'>
            ¿No tienes cuenta?{' '}
            <Link
              href='/auth/register'
              className='text-blue-600 hover:underline font-medium'
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}

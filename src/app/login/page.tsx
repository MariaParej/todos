'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await authClient.signIn.magicLink({
        email,
        callbackURL: '/'
      })

      if (error) {
        toast.error(error.message || 'Error al enviar el enlace')
      } else {
        setSent(true)
        toast.success('¡Revisa tu correo! Te hemos enviado un enlace de acceso.')
      }
    } catch {
      toast.error('Error al enviar el enlace')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <main className='min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900'>
        <div className='max-w-2xl mx-auto bg-white shadow-xl rounded-xl border border-slate-100 overflow-hidden p-8 text-center'>
          <h2 className='text-3xl font-bold text-slate-900 mt-4 mb-4'>
            REVISA TU CORREO
          </h2>
          <p className='text-slate-500 mb-6'>
            Hemos enviado un enlace de acceso a <strong>{email}</strong>.
            Haz clic en el enlace del correo para iniciar sesión.
          </p>
          <button
            onClick={() => setSent(false)}
            className='text-orange-900 hover:underline text-sm'
          >
            Usar otro email
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className='min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900'>
      <div className='max-w-2xl mx-auto bg-white shadow-xl rounded-xl border border-slate-100 overflow-hidden p-8'>
        <h2 className='text-3xl font-bold text-slate-900 text-center mt-4 mb-8'>
          INICIAR SESIÓN
        </h2>
        <p className='text-center text-slate-500 mb-8'>
          Introduce tu email y te enviaremos un enlace para acceder.
        </p>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='email-input'
              className='block text-sm font-medium mb-2'
            >
              Email
            </label>
            <input
              id='email-input'
              type='email'
              value={email}
              autoComplete='username'
              className='w-full bg-slate-900 border rounded-lg p-3 text-white focus:outline-none focus:border-orange-900 transition-colors'
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Introduce aquí tu email'
              required
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-slate-900 text-orange-900 font-bold py-3 rounded hover:bg-orange-900 hover:text-white transition-colors tracking-widest cursor-pointer disabled:opacity-50'
          >
            {loading ? 'ENVIANDO...' : 'ENVIAR ENLACE DE ACCESO'}
          </button>
        </form>
        <p className='mt-6 text-center text-sm'>
          ¿No tienes cuenta?{' '}
          <Link href='/register' className='text-orange-900 hover:underline'>
            Regístrate aquí
          </Link>
        </p>
      </div>
    </main>
  )
}

'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState} from 'react'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'

function RegisterCompleted() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') //captura el JWT del email, lo coge de la URL
  const [password, setPassword] = useState('')
  const [confimrPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confimrPassword) {
      return toast.error('Las contraseñas no coinciden')
    }
    if (password.length < 6) {
      return toast.error('La contraseña debe de tener al menos 6 caracteres')
    }

    setLoading(true)

    try {
      const { data, error } = await authClient.signUp.email({
        email: email,
        password: password,
        name: name,
        callbackURL: '/login'
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success('¡Cuenta creada!')
        router.push('/login')
      }
    } catch (error) {
      toast.error('Error')
    } finally {
      setLoading(false)
    }
  }
  //no muestra el formulario si no hay token
  if (!token) {
    return (
      <p className='text-center p-8'>
        Enlace de registro no válido o expirado.
      </p>
    )
  }

  return (
    <main className='min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900'>
      <div className='max-w-2xl mx-auto bg-white shadow-xl rounded-xl border border-slate-100 overflow-hidden p-8'>
        <h2 className='text-3xl font-bold text-slate-900 text-center mt-4 mb-8'>
          ESTABLECE TU CONTRASEÑA
        </h2>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium mb-2'>Nombre</label>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full bg-slate-900 border rounded-lg p-3 text-white'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>Email</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full bg-slate-900 border rounded-lg p-3 text-white'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>
              Nueva Contraseña
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full bg-slate-900 border rounded-lg p-3 text-white focus:outline-none focus:border-orange-900'
              placeholder='Mínimo 6 caracteres'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium mb-2'>
              Confirmar Contraseña
            </label>
            <input
              type='password'
              value={confimrPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full bg-slate-900 border rounded-lg p-3 text-white focus:outline-none focus:border-orange-900'
              placeholder='Repite tu contraseña'
              required
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-slate-900 text-orange-900 font-bold py-3 rounded hover:bg-orange-900 hover:text-white transition-colors disabled:opacity-50'
          >
            {loading ? 'GUARDANDO...' : 'FINALIZAR REGISTRO'}
          </button>
        </form>
      </div>
    </main>
  )
}

// next.js lo necesita
export default function RegisterCompletedPage() {
  return (
    <main className='min-h-screen bg-slate-50 p-4 md:p-8 flex items-center justify-center'>
      <div className='max-w-md w-full bg-white shadow-xl rounded-xl p-8 border border-slate-100'>
        <h2 className='text-2xl font-bold text-slate-900 text-center mb-6'>
          ESTABLECE TU CONTRASEÑA
        </h2>
        <Suspense fallback={<p className='text-center'>Cargando...</p>}>
          <RegisterCompleted />
        </Suspense>
      </div>
    </main>
  )
}

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function Register() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    email: ''
  })
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // EVITA QUE PARPADEE
    setLoading(true)

    try {
      const response = await fetch('/api/register/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Revisa tu correo para completar el registro')
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error('Error al enviar:', error)
      toast.error('Hubo un problema con el servidor.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <main className='min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900'>
      <div className='max-w-2xl mx-auto bg-white shadow-xl rounded-xl border border-slate-100 overflow-hidden p-8'>
        <h2 className='text-3xl font-bold text-slate-900 text-center mt-4 mb-8'>
          CREAR CUENTA
        </h2>
        <p className='text-center text-slate-500 mb-8'>
          Introduce tus datos y te enviaremos un enlace para configurar tu
          contraseña.
        </p>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className='block text-sm font-medium mb-2'>Nombre</label>
            <input
              name='firstName'
              type='text'
              value={formData.firstName}
              className='w-full bg-slate-900 border rounded-lg p-3 text-white focus:outline-none focus:border-orange-900 transition-colors'
              onChange={handleChange}
              placeholder='Nombre'
              required
            />
          </div>
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
              value={formData.email}
              name='email'
              autoComplete='username'
              className='w-full bg-slate-900 border rounded-lg p-3 text-white focus:outline-none focus:border-orange-900 transition-colors'
              onChange={handleChange}
              placeholder='Introduce aquí tu email'
              required
            />
          </div>
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-slate-900 text-orange-900 font-bold py-3 rounded hover:bg-orange-900 hover:text-white transition-colors tracking-widest cursor-pointer disabled:opacity-50'
          >
            {loading ? 'ENVIANDO...' : 'ENVIAR ENLACE DE CONFIRMACIÓN'}
          </button>
        </form>
        <p className='mt-6 text-center text-sm'>
          ¿Ya tienes cuenta?{' '}
          <Link href='/login' className='text-orange-900 hover:underline'>
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </main>
  )
}

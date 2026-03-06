'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

export default function Login() {
  const router = useRouter()
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Bienvenido')
        router.push('/')
        router.refresh()
      } else {
        toast.error('Error de acceso')
      }
    } catch (error) {
      console.error('Error en el login')
    }
  }
  return (
    <main className='min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900'>
      <div className='max-w-2xl mx-auto bg-white shadow-xl rounded-xl border border-slate-100 overflow-hidden p-8'>
        <h2 className='text-3xl font-bold text-slate-900 text-center mt-4 mb-8'>
          INICIAR SESIÓN
        </h2>
        <form
          onSubmit={handleSubmit}
          className='space-y-6'
          name='login'
          id='login-form'
        >
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
              value={loginData.email}
              name='email'
              autoComplete='username'
              className='w-full bg-slate-900 border rounded-lg p-3 text-white focus:outline-none focus:border-orange-900 transition-colors'
              onChange={handleChange}
              placeholder='Introduce aquí tu email'
              required
            />
          </div>
          <div>
            <label
              htmlFor='password-input'
              className='block text-sm font-medium mb-2'
            >
              Contraseña
            </label>
            <input
              id='password-input'
              type='password'
              value={loginData.password} name='password'
              autoComplete='current-password'
              className='w-full bg-slate-900 border rounded-lg p-3 text-white focus:outline-none focus:border-orange-900 transition-colors'
              onChange={handleChange} placeholder='Introduce aquí tu contraseña'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-slate-900 text-orange-900 font-bold py-3 rounded hover:bg-orange-900 hover:text-white transition-colors tracking-widest cursor-pointer disabled:opacity-50'
          >
            Enviar
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

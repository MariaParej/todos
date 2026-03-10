'use client'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const res = await fetch('/api/logout', { method: 'POST' })
    if (res.ok) {
      router.push('/login')
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleLogout}
      className='text-xl hover:text-red-400 transition-all font-medium'
    >
      Cerrar sesión
    </button>
  )
}

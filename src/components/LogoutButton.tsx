'use client'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export default function LogoutButton() {
  const router = useRouter()

async function handleLogout() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          alert('Sesión cerrada')
          router.push('/login')
          router.refresh()
        },
        onError: (error) => {
          alert(error.error.message)
        }
      }
    })
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

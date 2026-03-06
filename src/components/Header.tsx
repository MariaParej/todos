import Link from 'next/link'

export default function Header() {
  return (
    <header className='w-full bg-slate-900 text-white shadow-lg mb-8'>
      <div className='max-w-4xl mx-auto px-4 py-6 flex justify-between items-center'>
        <div className='flex-1'></div>
        <div className='flex-1 text-center'>
        <h1 className='text-2xl font-bold tracking-tight'>
          LISTA DE TAREAS ✍️
        </h1>
        </div>
        <nav className='flex-1 flex justify-end gap-8'>
        <Link href='/login' className='text-xl hover:text-orange-900 transition-all'>
          Iniciar sesión
        </Link>
        <Link href='/register' className='text-xl hover:text-orange-900 transition-all'>
          Regístrate
        </Link>
        </nav>
      </div>
    </header>
  )
}

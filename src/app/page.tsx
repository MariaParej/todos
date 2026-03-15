'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { authClient } from '@/lib/auth-client'

interface Todo {
  id: number
  task: string
  done: boolean
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState('')
  const router = useRouter()

  // hook de better auth para la sesión
  const { data: session, isPending } = authClient.useSession()
  // obtención datos API (GET)
  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')

      if (response.status === 401) return

      if (!response.ok) throw new Error('Error al obtener las tareas')

      const data = await response.json()
      setTodos(data)
    } catch (error) {
      alert('Error cargando tareas.')
      console.error('Error cargando tareas:', error)
    } finally {
      setLoading(false)
    }
  }

  // actualización estado (PATCH)
  const handleToggle = async (id: number, currentState: boolean) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, done: !currentState })
      })

      if (!response.ok) {
        throw new Error('Error al actulizar la tarea en el servidor.')
      }
    } catch (error) {
      alert('No se pudo actualizar la tarea.')
      console.log('Error en la actualización del estado: ', error)
    } finally {
      await fetchTodos()
    }
  }

  // nueva tarea
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault() // evita que pa página se recargue al pulsar enter
    if (!newTask.trim()) return

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: newTask })
      })

      if (response.ok) {
        setNewTask('')
        fetchTodos()
      }
    } catch (error) {
      alert('Error al añadir la nueva tarea.')
      console.log('Error al añadir la nueva tarea: ', error)
    }
  }

  // eliminar tarea
  const deleteTodo = async (id: number) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
    } catch (error) {
      alert('Error al eliminar la tarea.')
      console.log('Error al eliminar tarea: ', error)
    } finally {
      fetchTodos()
    }
  }

  // ejecuta la carga
  useEffect(() => {
    if (session) {
      fetchTodos()
    } else if (!isPending) {
      setLoading(false)
    }
  }, [session, isPending]) //solo carga tareas si hay sesión

  //estado de carga de la sesión
  if (isPending) {
    return (
      <div className='flex h-screen items-center justify-center'>
        Verificando...
      </div>
    )
  }

  if (!session) {
    return (
      <main className='min-h-screen flex items-center justify-center bg-slate-50 p-4'>
        <div className='text-center p-8 bg-white shadow-xl rounded-2xl max-w-sm'>
          <h2 className='text-xl font-bold text-slate-800 mb-2'>
            Acceso Restringido
          </h2>
          <p className='text-slate-500 mb-6'>
            Debes iniciar sesión para gestionar tus tareas.
          </p>
          <button
            onClick={() => router.push('/login')}
            className='w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
          >
            Ir al Login
          </button>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50'>
        <p className='text-slate-500 animate-pulse'>Cargando tus tareas...</p>
      </div>
    )
  }

  return (
    <main className='min-h-screen bg-slate-50 p-4 md:p-8 font-sans'>
      <div className='max-w-2xl mx-auto bg-white shadow-xl rounded-xl border border-slate-100 overflow-hidden'>
        <div className='p-6 border-b flex justify-between items-center bg-slate-900 text-white'>
          <div>
            <p className='text-xs text-slate-400'>Hola </p>
            <h1 className='text-lg font-bold'>{session.user.name}</h1>
          </div>
        </div>

        <div className='p-6'>
          {/* FORMULARIO NUEVA TAREA */}
          <form onSubmit={addTodo} className='flex gap-2 mb-8'>
            <input
              type='text'
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder='Añade la nueva tarea'
              className='flex-1 p-2 border rounded shadow-sm text-slate-800'
            />
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
            >
              Añadir
            </button>
          </form>
          {/* LISTA TAREAS*/}
          <ul className='space-y-2'>
            {todos.map((todo) => (
              <li
                key={todo.id}
                className='flex items-center justify-between gap-2 p-2 border rounded hover:bg-gray-50'
              >
                <div className='flex items-center gap-3'>
                  <input
                    type='checkbox'
                    className='w-5 h-5 cursor-pointer'
                    checked={todo.done}
                    onChange={() => handleToggle(todo.id, todo.done)}
                  />
                  <span
                    className={todo.done ? 'line-through text-gray-400' : ''}
                  >
                    {todo.task}
                  </span>
                </div>
                {/* BOTÓN ELIMINAR TAREA */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className='text-red-400 hover:text-red-600 font-medium text-sm px-5 py-1 hover:bg-red-50 transition-all border'
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>

          {todos.length === 0 && <p>No hay tareas por ahora 👏</p>}
        </div>
      </div>
    </main>
  )
}

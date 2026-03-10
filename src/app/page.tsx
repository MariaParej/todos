'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

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

  // OBTENCIÓN DATOS API (GET)
  const fetchTodos = async () => {
    try {
      const response = await fetch('/api/todos')

      if(response.status === 401){
        return
      } 

      if(!response.ok)throw new Error('Error al obtener las tareas')

      const data = await response.json()
      setTodos(data)
    } catch (error) {
      alert('Error cargando tareas.')
      console.error('Error cargando tareas:', error)
    } finally {
      setLoading(false)
    }
  }

  // ACTUALIZACIÓN ESTADO (PATCH)
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

  // NUEVA TAREA
  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault() // EVITA QUE LA PÁGINA SE RECARGUE AL PULSAR ENTER
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

  // ELIMINAR TAREA
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

  // EJECUTA LA CARGA LA PRIMERA VEZ
  useEffect(() => {
    fetchTodos()
  }, [])

  if (loading) return <p className='p-4'>Cargando tareas...</p>

  return (
    <main className='min-h-screen bg-slate-50 p-4 md:p-8 font-sans'>
      <div className='max-w-2xl mx-auto bg-white shadow-xl rounded-xl border border-slate-100 overflow-hidden'>
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
            <span className={todo.done ? 'line-through text-gray-400' : ''}>
              {todo.task}
            </span>
            </div>
            {/* BOTÓN ELIMINAR TAREA */}
            <button
              onClick={()=> deleteTodo(todo.id)}
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

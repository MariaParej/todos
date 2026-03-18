import { createAuthClient } from 'better-auth/react'
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  //parece que no funcionan (los he puesto a mano)
  secondaryActions: {
    signUp: {
      href: '/register' 
    },
    signIn: {
      href: '/login'
    }
  }
})

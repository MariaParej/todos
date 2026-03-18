import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db'
import * as schema from '@/db/schema'
import EmailTemplate from '@/components/EmailTemplate'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const baseUrl = process.env.BETTER_AUTH_URL!
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // postgre de Supabase
    schema: schema
  }),
  //mis páginas reales
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register'
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    callbackURL: `${baseUrl}/`,
    async sendVerificationEmail({ user, url }) {
      const fixedUrl = new URL(url)
      fixedUrl.searchParams.set('callbackURL', `${baseUrl}/`)
      await resend.emails.send({
        from: 'Registro ToDos <onboarding@resend.dev>',
        to: user.email,
        subject: 'Confirma tu registro en ToDos',
        react: EmailTemplate({
          firstName: user.name || 'Usuario',
          confirmLink: fixedUrl.toString()
        })
      })
    }
  }
})

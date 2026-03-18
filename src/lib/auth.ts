import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '@/db'
import * as schema from '@/db/schema'
import EmailTemplate from '@/components/EmailTemplate'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg', // postgre de Supabase
    schema: schema
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({
      user,
      url
    }: {
      user: { email: string; name?: string | null }
      url: string
    }) {
      const { data, error } = await resend.emails.send({
        from: 'Registro ToDos <onboarding@resend.dev>',
        to: user.email,
        subject: 'Confirma tu registro en ToDos',
        react: EmailTemplate({
          firstName: user.name || 'Usuario',
          confirmLink: url
        })
      })
    }
  }
})

import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { magicLink } from 'better-auth/plugins'
import { Resend } from 'resend'
import { db } from '@/db'
import * as schema from '@/db/schema'

const resend = new Resend(process.env.RESEND_API_KEY)

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: schema
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await resend.emails.send({
          from: 'ToDos App <onboarding@resend.dev>',
          to: email,
          subject: 'Tu enlace de acceso a ToDos',
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h1>Accede a ToDos</h1>
              <p>Haz clic en el siguiente enlace para acceder a tu cuenta:</p>
              <a href="${url}" style="background: #2563eb; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block;">
                Acceder a ToDos
              </a>
              <p style="margin-top: 16px; color: #666; font-size: 14px;">
                Este enlace expira en 5 minutos.
              </p>
            </div>
          `
        })
      }
    })
  ]
})

import { AuthView } from '@daveyplate/better-auth-ui'
import { authViewPaths } from '@daveyplate/better-auth-ui/server'
import { notFound } from 'next/navigation'

export const dynamicParams = false

export function generateStaticParams() {
  return Object.values(authViewPaths)
    .filter(
      (path) =>
        path !== 'login' &&
        path !== 'register' &&
        path !== 'sign-in' &&
        path !== 'sign-up'
    )
    .map((path) => ({ path }))
}

export default async function AuthPage({
  params
}: {
  params: Promise<{ path: string }>
}) {
  const { path } = await params

  if (
    path === 'login' ||
    path === 'register' ||
    path === 'sign-in' ||
    path === 'sign-up'
  ) {
    notFound()
  }

  return (
    <main className='container flex grow flex-col items-center justify-center self-center p-4 md:p-6'>
      <AuthView path={path} />
    </main>
  )
}

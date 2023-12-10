'use client'

import Hero from './yhaas/Hero'
import Form from './yhaas/Form'
import useWhoami from '@/hooks/siwe/useWhoami'
import useNonce from '@/hooks/siwe/useNonce'
import { useEffect } from 'react'

export default function Home() {
  const { fetchNonce } = useNonce()
  const { whoami, fetchWhoami } = useWhoami()

  useEffect(() => {
    fetchNonce()
    fetchWhoami()
  }, [fetchNonce, fetchWhoami])

  if(whoami) return <main className={`
    relative w-6xl max-w-6xl mx-auto pt-[6rem]
    flex min-h-screen flex-col items-center justify-start gap-8`}>
    <Hero />
    <Form />
  </main>

  return <main className={`
    relative w-6xl max-w-6xl mx-auto pt-[6rem]
    flex min-h-screen flex-col items-center justify-start gap-8`}>
    <Hero />
    <Form />
  </main>

}

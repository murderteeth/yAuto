'use client'

import Hero from './yhaas/Hero'
import Form from './yhaas/Form'
import { useUser } from '@/hooks/useUser'
import Strategies from '@/components/Strategies'

export default function Home() {
  const { hasStrategies } = useUser()

  if(hasStrategies) return <main className={`
    relative w-6xl max-w-6xl mx-auto pt-[6rem]
    flex flex-col items-start justify-start gap-8`}>
    <h1>Your strategies</h1>
    <Strategies />
  </main>

  return <main className={`
    relative w-6xl max-w-6xl mx-auto pt-[6rem]
    flex flex-col items-center justify-start gap-8`}>
    <Hero />
    <Form />
  </main>
}

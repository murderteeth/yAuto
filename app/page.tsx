'use client'

import Hero from './yhaas/Hero'
import Form from './yhaas/Form'
import { useSiwe } from '@/hooks/useSiwe'

export default function Home() {
  const { whoami } = useSiwe()

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

'use client'

import Image from 'next/image'
import { WithYearn } from '@yearn-finance/web-lib/contexts/WithYearn'
import { localhost, mainnet } from '@wagmi/chains'

export default function Home() {
  return <WithYearn supportedChains={[mainnet, localhost]}>
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      <Image priority={true} src="/otto.png" alt="yAuto" width={200} height={200} />
      <h1 className="font-[900] text-6xl">yAuto</h1>
    </main>
  </WithYearn>
}

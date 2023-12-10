'use client'

import { WithYearn } from '@yearn-finance/web-lib/contexts/WithYearn'
import { localhost, mainnet, polygon } from '@wagmi/chains'
import Header from '@/components/header'

export default function YWrapper ({ children }: { children: React.ReactNode }) {
  return <WithYearn supportedChains={[mainnet, polygon, localhost]}>
    <>
      <Header />
      {children}
    </>
  </WithYearn>
}

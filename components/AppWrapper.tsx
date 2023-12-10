'use client'

import { WithYearn } from '@yearn-finance/web-lib/contexts/WithYearn'
import { localhost, mainnet, polygon } from '@wagmi/chains'
import Header from '@/components/header'
import SiweProvider from '@/hooks/useSiwe'

export default function AppWrapper ({ children }: { children: React.ReactNode }) {
  return <WithYearn supportedChains={[mainnet, polygon, localhost]}>
    <SiweProvider>
      <Header />
      {children}
    </SiweProvider>
  </WithYearn>
}

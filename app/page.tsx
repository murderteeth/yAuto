'use client'

import Image from 'next/image'
import { WithYearn } from '@yearn-finance/web-lib/contexts/WithYearn'
import { Button } from '@yearn-finance/web-lib/components/Button'
import { localhost, mainnet, polygon } from '@wagmi/chains'
import Header from '@/components/header'
import AddressInput, { TInputAddressLike } from '@/components/fields/AddressInput'
import { useState } from 'react'

export default function Home() {
  const [address, setAddress] = useState<TInputAddressLike>({ address: undefined, label: '', isValid: false })
  return <WithYearn supportedChains={[mainnet, polygon, localhost]}>
    <>
      <Header />
      <main className="relative w-6xl max-w-6xl mx-auto flex min-h-screen pt-[6rem] flex-col items-center justify-start gap-8">
        <div className="w-full flex items-center justify-between">
          <div className="w-1/2 flex flex-col gap-8">
            <h1 className="font-[900] text-6xl">yHaaS Whitelist</h1>
            <div className="pl-4 flex flex-col gap-2 border-l-4 border-pink-400">
              <p className="text-xl">
                You have no strategy anon. Let's fix that!
              </p>
              <p>
                Here's some more info about yHaaS. IE, what it stands for, what it does, why that's important, and how to register.
              </p>
            </div>
          </div>
          <div className="w-1/2 py-8 flex items-center justify-center rounded">
            <Image priority={true} src="/otto.png" alt="yAuto" width={280} height={280} className="p-2 border-2 border-pink-400 rounded" />
          </div>
        </div>

        <div className="w-full p-8 flex flex-col gap-4 bg-pink-900/20 rounded">
          <AddressInput value={address} onChangeValue={setAddress} />
          <div className="py-4 flex justify-end">
            <Button
              onClick={() => {}}
              isBusy={false}
              isDisabled={false}
              className={'w-fit border-none'}>
              Apply for yHaaS whitelist
            </Button>
          </div>
        </div>
      </main>
    </>
  </WithYearn>
}

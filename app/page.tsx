'use client'

import Image from 'next/image'
import { WithYearn } from '@yearn-finance/web-lib/contexts/WithYearn'
import { Button } from '@yearn-finance/web-lib/components/Button'
import { localhost, mainnet, polygon } from '@wagmi/chains'
import Header from '@/components/header'
import AddressInput, { TInputAddressLike } from '@/components/fields/AddressInput'
import { useState } from 'react'
import Input from '@/components/fields/Input'
import Select from '@/components/fields/Select'

export default function Home() {
  const [address, setAddress] = useState<TInputAddressLike>({ address: undefined, label: '', isValid: false })
  return <WithYearn supportedChains={[mainnet, polygon, localhost]}>
    <>
      <Header />
      <main className="relative w-6xl max-w-6xl mx-auto flex min-h-screen pt-[6rem] flex-col items-center justify-start gap-8">
        <div className="w-full px-4 flex items-center justify-between gap-4 bg-pink-900/20 rounded">
          <div className="w-[40%] py-8 flex items-center justify-center rounded">
            <Image priority={true} src="/otto.png" alt="yAuto" width={425} height={256} className="p-2 border-2 border-pink-400 rounded" />
          </div>
          <div className="w-[60%] flex flex-col gap-8">
            <h1 className="font-[900] text-6xl">yHaaS Whitelist</h1>
            <div className="pl-4 flex flex-col gap-2 border-l-4 border-pink-400">
              <p className="text-xl">
                You have no strategy anon. Let&apos;s fix that!
              </p>
              <p>
                Here&apos;s some more info about yHaaS. IE, what it stands for, what it does, why that&apos;s important, and how to register.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full px-2 sm:px-64 py-6 sm:py-8 flex flex-col gap-4 bg-pink-900/20 rounded">
          <Input type="text" defaultValue="" placeholder="Strategy name" />
          <Select>
            <option value="" selected>Select a network..</option>
            <option value="mainnet">Mainnet</option>
            <option value="polygon">Polygon</option>
          </Select>
          <AddressInput value={address} placeholder='Strategy address 0x..' onChangeValue={setAddress} />
          <Input type="text" defaultValue="" placeholder="Strategy repo url" />
          <Select>
            <option value="" selected>Select automation frequency..</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </Select>
          <div className="mt-6 flex justify-end">
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

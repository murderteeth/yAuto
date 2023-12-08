'use client'

import Image from 'next/image'
import { WithYearn } from '@yearn-finance/web-lib/contexts/WithYearn'
import { Button } from '@yearn-finance/web-lib/components/Button'
import { localhost, mainnet, polygon } from '@wagmi/chains'
import Header from '@/components/header'
import AddressInput, { TInputAddressLike } from '@/components/fields/AddressInput'
import { useCallback, useMemo, useState } from 'react'
import Input from '@/components/fields/Input'
import Select from '@/components/fields/Select'

export default function Home() {
  const [name, setName] = useState<string | undefined>(undefined)
  const [chainId, setChainId] = useState<string | undefined>(undefined)
  const [address, setAddress] = useState<TInputAddressLike>({ address: undefined, label: '', isValid: false })
  const [repo, setRepo] = useState<string | undefined>(undefined)
  const [frequency, setFrequency] = useState<string | undefined>(undefined)

  const disabled = useMemo(() => 
    !(name && chainId && address.isValid && repo && frequency)
  , [name, chainId, address, repo, frequency])

  const submit = useCallback(async () => {
		await fetch('/api/whitelist', {
			method: 'POST', 
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ 
        name, chainId, address: address.address, repo, frequency 
      })
		})
  }, [name, chainId, address, repo, frequency])

  return <WithYearn supportedChains={[mainnet, polygon, localhost]}>
    <>
      <Header />
      <main className="relative w-6xl max-w-6xl mx-auto flex min-h-screen pt-[6rem] flex-col items-center justify-start gap-8">
        <div className="w-full p-4 sm:px-12 sm:py-0 flex items-center justify-between gap-12 bg-pink-900/20 rounded">
          <div className="sm:w-[40%] py-8 hidden sm:flex items-center justify-center rounded">
            <Image priority={true} src="/otto.png" alt="yAuto" width={425} height={256} className="p-4 border border-pink-400 rounded" />
          </div>
          <div className="w-full sm:w-[60%] flex flex-col gap-8">
            <h1 className="font-[900] text-6xl">yHaaS Whitelist</h1>
            <div className="pl-4 flex flex-col gap-2 border-l border-pink-400">
              <p className="text-xl rainbow-text">
                You have no strategy anon. Let&apos;s fix that!
              </p>
              <p>
                TODO: Here&apos;s some more info about yHaaS. IE, what it stands for, what it does, why that&apos;s important, and how to register.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full px-2 sm:px-64 py-6 sm:py-8 flex flex-col gap-4 bg-pink-900/20 rounded">
          <Input type="text" placeholder="Strategy name" defaultValue={name} onChange={(e) => setName(e.target.value)} />
          <Select defaultValue={chainId} onChange={(e) => setChainId(e.target.value)}>
            <option value="">Select a network..</option>
            <option value="1">Mainnet</option>
            <option value="137">Polygon</option>
          </Select>
          <AddressInput value={address} placeholder='Strategy address 0x..' onChangeValue={setAddress} />
          <Input type="text" placeholder="Strategy repo url" defaultValue={repo} onChange={(e) => setRepo(e.target.value)} />
          <Select defaultValue={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option value="">Select automation frequency..</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </Select>
          <div className="mt-6 flex justify-end">
            <Button
              onClick={submit}
              isBusy={false}
              isDisabled={disabled}
              className={'w-fit border-none'}>
              Apply for yHaaS whitelist
            </Button>
          </div>
        </div>
      </main>
    </>
  </WithYearn>
}

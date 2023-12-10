import Signin from '@/components/Signin'
import AddressInput, { TInputAddressLike } from '@/components/controls/AddressInput'
import Input from '@/components/controls/Input'
import Select from '@/components/controls/Select'
import { useSiwe } from '@/hooks/useSiwe'
import { Button } from '@yearn-finance/web-lib/components/Button'
import { useCallback, useMemo, useState } from 'react'
import { toast } from '@yearn-finance/web-lib/components/yToast'

export default function Form() {
  const [name, setName] = useState<string | undefined>(undefined)
  const [chainId, setChainId] = useState<string | undefined>(undefined)
  const [address, setAddress] = useState<TInputAddressLike>({ address: undefined, label: '', isValid: false })
  const [repo, setRepo] = useState<string | undefined>(undefined)
  const [frequency, setFrequency] = useState<string | undefined>(undefined)
  const { whoami, signedIn } = useSiwe()
  const [submitting, setSubmitting] = useState(false)

  const disabled = useMemo(() => 
    !(whoami && name && chainId && address.isValid && repo && frequency)
  , [whoami, name, chainId, address, repo, frequency])

  const submit = useCallback(async () => {
    setSubmitting(true)
    try {
      const response = await fetch('/api/whitelist', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, chainId, address: address.address, repo, frequency 
        })
      })
      toast({ type: 'success', content: `You have succesfully applied for yHaaS whitelisting. Your application will be reviewed soon!` })
    } catch (error) {
      console.error(error)
      toast({ type: 'error', content: `error: ${error}}` })
    } finally {
      setSubmitting(false)
    }
  }, [setSubmitting, name, chainId, address, repo, frequency])

  return <div className="w-full px-2 sm:px-64 py-6 sm:py-8 flex flex-col gap-4 bg-pink-900/20 rounded">
    <p className="text-neutral-400">Sign in and fill out this form to apply for the yHaaS whitelist!</p>

    <div className="px-4 py-2 flex items-center justify-between bg-pink-800/40 text-neutral-400 border border-transparent">
      <div className={signedIn ? 'text-neutral-0' : ''}>
        {signedIn ? `${whoami}` : 'Strategist'}
      </div>
      <div><Signin hideSignOut={true} /></div>
    </div>

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
        isBusy={submitting}
        isDisabled={disabled}
        className={'w-fit border-none'}>
        Apply for yHaaS whitelist
      </Button>
    </div>
  </div>
}

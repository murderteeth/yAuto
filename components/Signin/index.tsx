'use client'

import useNonce from '@/hooks/siwe/useNonce'
import useWhoami from '@/hooks/siwe/useWhoami'
import { useWeb3 } from '@yearn-finance/web-lib/contexts/useWeb3'
import { useAccountModal, useChainModal, useConnectModal } from '@rainbow-me/rainbowkit'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'
import { IconWallet } from '@yearn-finance/web-lib/icons/IconWallet'
import { truncateHex } from '@yearn-finance/web-lib/utils/address'
import { siweSignal } from './signals'
import { useSignalValue } from 'signals-react-safe'
import { AnimatePresence, motion } from 'framer-motion'

export default function Signin({ hideSignOut }: { hideSignOut?: boolean }) {
	const { connectModalOpen } = useConnectModal()
	const { openAccountModal, accountModalOpen } = useAccountModal()
	const { openChainModal, chainModalOpen } = useChainModal()
	const { isActive, address, chainID: chainId, ens, lensProtocolHandle, openLoginModal } = useWeb3()
	const [walletIdentity, set_walletIdentity] = useState<string | undefined>(undefined)
	const { signMessageAsync } = useSignMessage()
	const { nonce, fetchNonce } = useNonce()
	const { whoami, fetchWhoami } = useWhoami()
	const [accountModelOpened, set_accountModelOpened] = useState<boolean>(false)
  const siweState = useSignalValue(siweSignal)

	useEffect(() => {
		siweSignal.value = { ...siweSignal.value, signingIn: connectModalOpen || accountModalOpen || chainModalOpen }
	}, [connectModalOpen, accountModalOpen, chainModalOpen])

	useEffect(() => {
		siweSignal.value = { ...siweSignal.value, signedIn: Boolean(whoami), address: whoami || undefined }
	}, [whoami])

	const signIn = useCallback(async () => {
		if(!(address && chainId)) return
		siweSignal.value = { ...siweSignal.value, signingIn: true }

		const message = new SiweMessage({
			domain: window.location.host,
			address,
			statement: 'This message confirms that you want to sign in to yAuto.',
			uri: window.location.origin,
			version: '1',
			chainId,
			nonce
		})

		const signature = await signMessageAsync({
			message: message.prepareMessage()
		})

		const verify = await fetch('/api/siwe/verify', {
			method: 'POST', 
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message, signature })
		})

		if(!verify.ok) throw new Error('Bad message!!')

		siweSignal.value = { ...siweSignal.value, signingIn: false, signedIn: true, address }

    fetchWhoami()
	}, [address, chainId, nonce, signMessageAsync, fetchWhoami])

	const signOut = useCallback(async () => {
		await fetch('/api/siwe/signout', {
			method: 'POST', 
			headers: { 'Content-Type': 'application/json' }
		})

		siweSignal.value = { ...siweSignal.value, signingIn: false, signedIn: false, address: undefined }

    fetchNonce()
    fetchWhoami()
	}, [fetchNonce, fetchWhoami])

	useEffect((): void => {
		if (!isActive && address) {
			set_walletIdentity('Invalid Network')
		} else if (ens) {
			set_walletIdentity(ens)
		} else if (lensProtocolHandle) {
			set_walletIdentity(lensProtocolHandle)
		} else if (address) {
			set_walletIdentity(truncateHex(address, 4))
		} else {
			set_walletIdentity(undefined)
			if(accountModelOpened) signOut()
		}
	}, [ens, lensProtocolHandle, address, isActive, accountModelOpened, signOut])

	const label = useMemo(() => {
		if(!walletIdentity) return 'Connect wallet'
		if(!siweState.signedIn) return `Sign in to yAuto as ${walletIdentity}`
		return `signed in as ${walletIdentity}`
	}, [walletIdentity, siweState])

	return (
		<div className={`relative ${siweState.signedIn && hideSignOut ? 'hidden' : ''}`}
			onClick={() => {
				if (isActive) {
					if(siweState.signedIn) {
						openAccountModal?.()
						set_accountModelOpened(true)
					} else {
						signIn()
					}
				} else if (!isActive && address) {
					openChainModal?.()
				} else {
					openLoginModal()
				}
			}}>
      <AnimatePresence initial={false}>
        {isActive && !siweState.signedIn && <motion.div 
          transition={{type: 'spring', stiffness: 2000, damping: 32}}
          initial={{y: 6, opacity: 0}}
          animate={{y: 0, opacity: 1}}
          exit={{y: 6, opacity: 0}}
          className={'absolute top-2 -left-12 text-xs text-neutral-0/20 whitespace-nowrap'}>
          step 2
        </motion.div>}
      </AnimatePresence>
			<p suppressHydrationWarning className={'yearn--header-nav-item !text-xs md:!text-sm'}>
				{siweState.signedIn ? label : (
					<span>
						<IconWallet className={'yearn--header-nav-item mt-0.5 block h-4 w-4 md:hidden'} />
						<span className={`relative hidden md:flex h-8 cursor-pointer items-center justify-center
              border border-transparent bg-neutral-0 
              px-2 text-xs font-normal text-neutral-900 transition-all rounded`}>
							{label}
						</span>
					</span>
				)}
			</p>
		</div>
	)
}

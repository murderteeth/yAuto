import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useAccountModal, useChainModal } from '@rainbow-me/rainbowkit'
import { ModalMobileMenu } from '@yearn-finance/web-lib/components/ModalMobileMenu'
import { useWeb3 } from '@yearn-finance/web-lib/contexts/useWeb3'
import { IconWallet } from '@yearn-finance/web-lib/icons/IconWallet'
import { truncateHex } from '@yearn-finance/web-lib/utils/address'
import { LogoPopover } from './HeaderPopover'
import type { ReactElement } from 'react'
import { usePathname } from 'next/navigation'
import { useSignMessage } from 'wagmi'
import { SiweMessage } from 'siwe'

type TMenu = {path: string, label: string | ReactElement, target?: string}
type TNavbar = {nav: TMenu[], currentPathName: string}

function Navbar({nav, currentPathName}: TNavbar): ReactElement {
	return (
		<nav className={'yearn--nav'}>
			{nav.map(
				(option): ReactElement => (
					<Link
						key={option.path}
						target={option.target}
						href={option.path}>
						<p className={`yearn--header-nav-item ${currentPathName === option.path ? 'active' : ''}`}>
							{option?.label || 'Unknown'}
						</p>
					</Link>
				)
			)}
		</nav>
	)
}

function useNonce() {
	const [state, set_state] = useState<string | undefined>(undefined)
	const updateState = useCallback(async () => {
		set_state((await(await fetch('/api/siwe/nonce')).json()).nonce)
	}, [set_state])
	useEffect(() => { updateState() }, [updateState])
	return { nonce: state, refreshNonce: updateState }
}

function useWhoami() {
	const [state, set_state] = useState<string | undefined>(undefined)
	const updateState = useCallback(async () => {
		set_state((await(await fetch('/api/siwe/whoami')).json()).address)
	}, [set_state])
	useEffect(() => { updateState() }, [updateState])
	return state
}

type SiweState = { 
	signingIn: boolean
	signedIn: boolean
}

function WalletSelector(): ReactElement {
	const {openAccountModal} = useAccountModal()
	const {openChainModal} = useChainModal()
	const {isActive, address, chainID: chainId, ens, lensProtocolHandle, openLoginModal} = useWeb3()
	const [walletIdentity, set_walletIdentity] = useState<string | undefined>(undefined)
	const { signMessageAsync } = useSignMessage()
	const { nonce, refreshNonce } = useNonce()
	const whoami = useWhoami()
	const [siweState, set_siweState] = useState<SiweState>({ signingIn: false, signedIn: false })
	const [accountModelOpened, set_accountModelOpened] = useState<boolean>(false)

	useEffect(() => {
		set_siweState(current => ({ ...current, signedIn: Boolean(whoami) }))
	}, [whoami, set_siweState])

	const signIn = useCallback(async () => {
		if(!(address && chainId)) return
		set_siweState(current => ({ ...current, signingIn: true }))

		const message = new SiweMessage({
			domain: window.location.host,
			address,
			statement: 'Sign in to yAuto with your wallet',
			uri: window.location.origin,
			version: '1',
			chainId,
			nonce
		})

		const signature = await signMessageAsync({
			message: message.prepareMessage(),
		})

		const verify = await fetch('/api/siwe/verify', {
			method: 'POST', 
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message, signature })
		})

		if(!verify.ok) throw new Error('Bad message!!')

		set_siweState(current => ({ ...current, signingIn: false, signedIn: true }))
	}, [address, chainId, nonce])

	const signOut = useCallback(async () => {
		await fetch('/api/siwe/signout', {
			method: 'POST', 
			headers: { 'Content-Type': 'application/json' }
		})
		set_siweState(current => ({ ...current, signedIn: false }))
		refreshNonce()
	}, [set_siweState, refreshNonce])

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
		<div
			onClick={(): void => {
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
			<p
				suppressHydrationWarning
				className={'yearn--header-nav-item !text-xs md:!text-sm'}>
				{walletIdentity && siweState.signedIn ? label : (
					<span>
						<IconWallet className={'yearn--header-nav-item mt-0.5 block h-4 w-4 md:hidden'} />
						<span
							className={`relative hidden md:flex h-8 cursor-pointer items-center justify-center
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

const nav: TMenu[] = [
	{path: 'https://github.com/mil0xeth/yHaaS', label: 'GitHub', target: '_blank'}
]

function Header(): ReactElement {
  const pathname = usePathname()
	const [isMenuOpen, set_isMenuOpen] = useState<boolean>(false)

	return (
		<div
			id={'head'}
			className={'fixed inset-x-0 top-0 z-50 w-full'}>
			<div className={'mx-auto max-w-6xl'}>
				<header className={'yearn--header bg-neutral-900/90'}>
					<Navbar
						currentPathName={pathname || ''}
						nav={nav}
					/>
					<div className={'flex w-1/3 md:hidden'}>
						<button onClick={(): void => set_isMenuOpen(!isMenuOpen)}>
							<span className={'sr-only'}>{'Open menu'}</span>
							<svg
								className={'text-neutral-500'}
								width={'20'}
								height={'20'}
								viewBox={'0 0 24 24'}
								fill={'none'}
								xmlns={'http://www.w3.org/2000/svg'}>
								<path
									d={
										'M2 2C1.44772 2 1 2.44772 1 3C1 3.55228 1.44772 4 2 4H22C22.5523 4 23 3.55228 23 3C23 2.44772 22.5523 2 22 2H2Z'
									}
									fill={'currentcolor'}
								/>
								<path
									d={
										'M2 8C1.44772 8 1 8.44772 1 9C1 9.55228 1.44772 10 2 10H14C14.5523 10 15 9.55228 15 9C15 8.44772 14.5523 8 14 8H2Z'
									}
									fill={'currentcolor'}
								/>
								<path
									d={
										'M1 15C1 14.4477 1.44772 14 2 14H22C22.5523 14 23 14.4477 23 15C23 15.5523 22.5523 16 22 16H2C1.44772 16 1 15.5523 1 15Z'
									}
									fill={'currentcolor'}
								/>
								<path
									d={
										'M2 20C1.44772 20 1 20.4477 1 21C1 21.5523 1.44772 22 2 22H14C14.5523 22 15 21.5523 15 21C15 20.4477 14.5523 20 14 20H2Z'
									}
									fill={'currentcolor'}
								/>
							</svg>
						</button>
					</div>
					<div className={'flex w-1/3 justify-center'}>
						<LogoPopover />
					</div>
					<div className={'flex w-1/3 items-center justify-end'}>
						<WalletSelector />
					</div>
				</header>
			</div>
			<ModalMobileMenu
				shouldUseWallets={true}
				shouldUseNetworks={true}
				isOpen={isMenuOpen}
				onClose={(): void => set_isMenuOpen(false)}>
				{nav?.map(
					(option): ReactElement => (
						<Link
							key={option.path}
							href={option.path}>
							<div
								className={'mobile-nav-item'}
								onClick={(): void => set_isMenuOpen(false)}>
								<p className={'font-bold'}>{option.label}</p>
							</div>
						</Link>
					)
				)}
			</ModalMobileMenu>
		</div>
	)
}

export default Header

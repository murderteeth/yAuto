import { signal } from 'signals-react-safe'

export const siweSignal = signal({
  signingIn: false,
	signedIn: false
} as {
	signingIn: boolean
	signedIn: boolean
	address: string | undefined
})

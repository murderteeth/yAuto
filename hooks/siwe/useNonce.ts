import { useCallback } from 'react'
import { signal, useSignalValue } from 'signals-react-safe'

const _signal = signal<string | undefined>(undefined)

export default function useNonce() {
	const value = useSignalValue(_signal)
	const _fetch = useCallback(async () => {
		_signal.value = (await(await fetch('/api/siwe/nonce')).json()).nonce
	}, [])
	return { nonce: value, fetchNonce: _fetch }
}

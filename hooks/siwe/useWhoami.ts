import { useCallback } from 'react'
import { signal, useSignalValue } from 'signals-react-safe'

const _signal = signal<string | undefined>(undefined)

export default function useWhoami() {
	const value = useSignalValue(_signal)
	const _fetch = useCallback(async () => {
		_signal.value = (await(await fetch('/api/siwe/whoami')).json()).address || undefined
	}, [])
	return { whoami: value, fetchWhoami: _fetch }
}

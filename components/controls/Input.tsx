import React, { forwardRef, InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input ref={ref} {...props} className={`
    rounded px-4 py-2
		bg-pink-800/40
		border border-transparent
    hover:border-pink-800
    focus:border-pink-700
    disabled:text-neutral-800 hover:disabled:border-neutral-900 disabled:placeholder-neutral-800
    outline-none focus:ring-0 focus:outline-none
  ${className}`} />
))

Input.displayName = 'Input'

export default Input

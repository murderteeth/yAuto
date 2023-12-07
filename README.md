# yAuto
Vault and strategy automation.

## get started
```sh
bun install
bun dev
```

## production
```sh
bun run build
```

## sign in with ethereum
yAuto uses [next-auth](https://next-auth.js.org/) to implement Sign-In with Ethereum, [EIP-4361](https://eips.ethereum.org/EIPS/eip-4361).

### generate NEXTAUTH_SECRET
```sh
openssl rand -base64 32
```

import { networks } from '@/lib/networks'

export default function makeIssueMarkdown(
  name: string, 
  chainId: number, 
  address: `0x${string}`, 
  repo: string, 
  frequency: string
) {
  const network = networks(chainId)

  return `
**Strategy name**
${name}

**Network**
${network?.name}

**Strategy repo**
${repo}

**Strategy address**
[${network.blockExplorers.default.url}/address/${address}](${network.blockExplorers.default.url}/address/${address})

**Automation frequency**
${frequency}
`
}

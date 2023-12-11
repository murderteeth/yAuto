import { z } from 'zod'

export const StrategySchema = z.object({
  chainId: z.number(),
  strategistAddress: z.string(),
  strategyAddress: z.string(),
  strategyName: z.string(),
  strategyCodeUrl: z.string(),
  harvestFrequency: z.string(),
  githubIssueUrl: z.string(),
  githubIssueHtmlUrl: z.string(),
  githubIssueLabels: z.array(z.string()),
  githubIssueState: z.string(),
  createTime: z.date(),
  updateTime: z.date(),
})

export type Strategy = z.infer<typeof StrategySchema>

import { getIronSession } from 'iron-session'
import { NextRequest, NextResponse } from 'next/server'
import { SessionData, sessionOptions } from '../../siwe/session'
import { cookies } from 'next/headers'
import { db } from '../../db'
import { Strategy, StrategySchema } from '@/lib/types/Strategy'
import { fetchInstallationToken, fetchIssue } from '@/lib/github'
import { useMemo } from 'react'

export async function POST(request: NextRequest) {  
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  const strategist = session.siwe?.data.address
  if(!strategist) throw new Error('!strategist')
  const strategies = await fetchStrategies(strategist)
  await syncWithGithub(strategies)
  return NextResponse.json({ strategies })
}

async function fetchStrategies(strategist: string) {
  const result = await db.query(`
  SELECT
    chain_id AS "chainId",
    strategist_address AS "strategistAddress",
    strategy_address AS "strategyAddress",
    strategy_name AS "strategyName",
    strategy_code_url AS "strategyCodeUrl",
    harvest_frequency AS "harvestFrequency",
    github_issue_url AS "githubIssueUrl",
    github_issue_html_url AS "githubIssueHtmlUrl",
    github_issue_labels AS "githubIssueLabels",
    github_issue_state AS "githubIssueState",
    create_time AS "createTime",
    update_time AS "updateTime"
  FROM yhaas_whitelist_form 
  WHERE strategist_address = $1
  ORDER BY update_time DESC;`, 
  [strategist])

  return StrategySchema.array().parse(result.rows)
}

async function syncWithGithub(strategies: Strategy[]) {
  const token = await fetchInstallationToken()
  const open = strategies.filter(s => s.githubIssueState === 'open')
  for(const strategy of open) {
    const { labels, state } = await fetchIssue(strategy.githubIssueUrl, token)

    await db.query(`
    UPDATE yhaas_whitelist_form 
    SET github_issue_labels = $1, github_issue_state = $2 
    WHERE chain_id = $3 AND strategist_address = $4 AND strategy_address = $5 AND github_issue_url = $6;`, 
    [labels, state, strategy.chainId, strategy.strategistAddress, strategy.strategyAddress, strategy.githubIssueUrl])

    strategy.githubIssueLabels = labels
    strategy.githubIssueState = state
  }
}

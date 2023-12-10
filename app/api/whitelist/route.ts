import { getIronSession } from 'iron-session'
import { NextRequest, NextResponse } from 'next/server'
import { SessionData, sessionOptions } from '../siwe/session'
import { cookies } from 'next/headers'
import { db } from '../db'
import { postIssue } from './gh'
import makeIssueMarkdown from './issue'
import { networks } from '@/lib/networks'

export async function POST(request: NextRequest) {  
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  const strategist = session.siwe?.data.address
  const { name, chainId, address, repo, frequency } = await request.json()
  const network = networks(parseInt(chainId))
  const md = makeIssueMarkdown(name, parseInt(chainId), address, repo, frequency)
  const { url, html_url, labels } = await postIssue(name, md, [network.name.toLowerCase()])

  await db.query(`INSERT INTO yhaas_whitelist_form (
    chain_id, 
    strategist_address, 
    strategy_address, 
    strategy_name, 
    strategy_code_url, 
    harvest_frequency, 
    github_issue_url,
    github_issue_html_url, 
    github_issue_labels,
    create_time
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP
  );`, [
    chainId, 
    strategist, 
    address, 
    name, 
    repo, 
    frequency, 
    url,
    html_url,
    labels
  ])

  return NextResponse.json({ ok: true })
}

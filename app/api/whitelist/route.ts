import { getIronSession } from 'iron-session'
import { NextRequest, NextResponse } from 'next/server'
import { SessionData, sessionOptions } from '../siwe/session'
import { cookies } from 'next/headers'
import { db } from '../db'

export async function POST(request: NextRequest) {  
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  const strategist = session.siwe?.data.address
  const issueId = 0

  const { name, chainId, address, repo, frequency } = await request.json()

  console.log('strategist, name, chainId, address, repo, frequency, issueId')
  console.log(strategist, name, chainId, address, repo, frequency, issueId)

  await db.query(`INSERT INTO yhaas_whitelist_form (
    chain_id, 
    strategist_address, 
    strategy_address, 
    strategy_name, 
    strategy_code_url, 
    harvest_frequency, 
    github_issue_id, 
    approved, 
    create_time
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP
  );`, [
    chainId, 
    strategist, 
    address, 
    name, 
    repo, 
    frequency, 
    issueId,
    false
  ])

  return NextResponse.json({ ok: true })
}

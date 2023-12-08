import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getIronSession } from 'iron-session'
import { SessionData, sessionOptions } from '../session'

// TODO: Before going to production, you likely want to invalidate nonces on logout to prevent replay attacks through session duplication (e.g. store expired nonce and make sure they can't be used again).
// https://wagmi.sh/examples/sign-in-with-ethereum
async function handler() {  
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  await session.destroy()
  return NextResponse.json({ ok: true })
}

export { handler as POST }

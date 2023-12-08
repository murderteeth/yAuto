import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { SiweMessage } from 'siwe'
import { SessionData, sessionOptions } from '../session'

async function handler(request: NextRequest, response: NextResponse) {  
  const { message, signature } = await request.json()
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  const siweMessage = new SiweMessage(message)
  const fields = await siweMessage.verify({signature})

  if (fields.data.nonce !== session.nonce) {
    return NextResponse.json({ error: 'bad nonce' }, { status: 422 })
  }

  session.siwe = fields
  await session.save()
  return NextResponse.json({ ok: true })
}

export { handler as POST }

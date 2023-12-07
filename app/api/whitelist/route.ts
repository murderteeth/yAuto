import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {  
  const body = await request.json()
  const userPrompt = body['userPrompt']
  console.log('userPrompt', userPrompt)
  
  return NextResponse.json({})
}

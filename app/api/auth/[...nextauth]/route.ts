// import { NextRequest, NextResponse } from 'next/server'
// import { NextAuthOptions } from 'next-auth'
// import CredentialsProvider from 'next-auth/providers/credentials'
// import { getCsrfToken } from 'next-auth/react'
// import { SiweMessage } from 'siwe'

// export async function POST(request: NextRequest) {  
//   const body = await request.json()
//   const userPrompt = body['userPrompt']
//   console.log('userPrompt', userPrompt)
  
//   return NextResponse.json({})
// }

// function makeOptions(request: NextRequest): NextAuthOptions {
//   return {
//     secret: process.env.NEXTAUTH_SECRET,
//     providers: [makeProvider(request)]
//   }
// }

// function makeProvider(request: NextRequest) {
//   return CredentialsProvider({
//     name: "Ethereum",
//     credentials: {
//       message: {
//         label: "Message",
//         type: "text",
//         placeholder: "0x0",
//       },
//       signature: {
//         label: "Signature",
//         type: "text",
//         placeholder: "0x0",
//       },
//     },

//     async authorize(credentials) {
//       const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
//       const nextAuthUrl = new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000')

//       const result = await siwe.verify({
//         signature: credentials?.signature || "",
//         domain: nextAuthUrl.host,
//         nonce: await getCsrfToken({ request }),
//       })

//       if (result.success) {
//         return { id: siwe.address }
//       }

//       return null
//     },
//   })
// }
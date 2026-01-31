import { NextResponse } from 'next/server'
import { createJob } from '@/src/services/jobService'

export async function POST(req: Request) {
  const body = await req.json()

  if (typeof body.type !== 'string') {
    return NextResponse.json(
      { error: 'Invalid job type' },
      { status: 400 }
    )
  }

  const job = await createJob(body.type, body.payload)

  return NextResponse.json(job, { status: 201 })
}
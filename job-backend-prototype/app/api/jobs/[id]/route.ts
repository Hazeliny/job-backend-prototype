import { NextResponse } from 'next/server'
import { findJobById } from '@/src/repositories/jobRepository'

// API doesn't care about worker but only data
export async function GET(
  req: Request,
//  { params }: { params: { id: string } }
    { params }: { params: Promise<{ id: string }> }
) {
//  const jobId = params.id
    const { id } = await params

  if (!id) {
    return NextResponse.json(
      { error: 'Job id is required' },
      { status: 400 }
    )
  }

  const job = await findJobById(id)

  if (!job) {
    return NextResponse.json(
      { error: 'Job not found' },
      { status: 404 }
    )
  }

  return NextResponse.json(job)
}
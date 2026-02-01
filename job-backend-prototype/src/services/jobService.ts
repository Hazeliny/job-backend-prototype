import { randomUUID } from 'crypto'
import { Job } from '@/src/types/job'
import { processJob } from '@/src/workers/jobWorker'
import * as repo from '@/src/repositories/jobRepository'

export async function createJob(
  type: string,
  payload: unknown
): Promise<Job> {
  const job: Job = {
    id: randomUUID(),
    type,
    payload,
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await repo.createJob(job)

  // Publish event (trigger worker)
  // No await here, otherwise it would block HTTP response
  processJob(job.id)

  return job
}
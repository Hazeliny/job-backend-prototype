import { randomUUID } from 'crypto'
import { Job } from '@/src/types/job'
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

  return job
}
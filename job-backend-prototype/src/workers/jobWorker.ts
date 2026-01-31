import { updateJobStatus } from '@/src/repositories/jobRepository'

export async function processJob(jobId: string) {
  await updateJobStatus(jobId, 'processing')

  setTimeout(async () => {
    await updateJobStatus(jobId, 'completed')
  }, 3000)
}
import { updateJobStatus } from '@/src/repositories/jobRepository'

// processJob returns immediately
// job still runs in background after HTTP request is completed
export async function processJob(jobId: string) {
  await updateJobStatus(jobId, 'processing')

  // setTimeout passes job to event loop to simulate async processing
  setTimeout(async () => {
    try {
        // Simulate job processing logic
        // If successful, update status to 'completed'
        await updateJobStatus(jobId, 'completed')
    } catch (err) {
    await updateJobStatus(jobId, 'failed')
    }
  }, 30000)
}
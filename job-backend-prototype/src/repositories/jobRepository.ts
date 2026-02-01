import { db } from '@/src/db'
import { Job, JobStatus } from '@/src/types/job'

export async function createJob(job: Job): Promise<void> {
  await db.query(
    `INSERT INTO jobs (id, type, payload, status)
     VALUES ($1, $2, $3, $4)`,
    [job.id, job.type, job.payload, job.status]
  )
}

export async function updateJobStatus(
  id: string,
  status: JobStatus
): Promise<void> {
  await db.query(
    `UPDATE jobs 
    SET status = $1, updated_at = NOW()
    WHERE id = $2`,
    [status, id]
  )
}

export async function findJobById(id: string) {
  const result = await db.query(
    `SELECT * FROM jobs WHERE id = $1`,
    [id]
  )

  return result.rows[0] ?? null
}
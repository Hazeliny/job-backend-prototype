export type JobStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'

export interface Job {
  id: string
  type: string
  payload: unknown
  status: JobStatus
  createdAt: Date
  updatedAt: Date
}
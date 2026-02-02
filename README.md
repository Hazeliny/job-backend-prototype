# 📦 Job Backend Prototype

Event-driven backend prototype using Next.js, TypeScript, PostgreSQL, Docker, and future GCP integration.

## 🚀 Overview

This project is a backend-oriented prototype that demonstrates how to design and implement an asynchronous, event-driven job processing system, aligned with modern backend practices and cloud-native architectures.

The system allows clients to:

	•	Create background jobs via HTTP API
	•	Process jobs asynchronously using a worker
	•	Track job state transitions through a well-defined state machine
	•	Query job status at any time

Although implemented as a single service for simplicity, the architecture is intentionally designed to **map directly to a microservices + Pub/Sub setup on Google Cloud Platform (GCP)**.

The project also includes a local automated testing script that simulates job creation, asynchronous processing, and loop status querying, allowing for easy demonstration of the event-driven workflow without relying on cloud infrastructure.

## 🧠 Key Concepts Demonstrated

	•	Event-driven architecture
	•	Asynchronous job processing
	•	Explicit state machine modeling
	•	Type-safe backend with TypeScript
	•	Clean separation of concerns
	•	Containerized local development
	•	Cloud-ready design (GCP / Cloud Run / Pub/Sub)

## 🏗️ Architecture Overview

```
Client
  |
  | HTTP
  v
Next.js API Routes
  |
  | Create Job (Publish Event)
  v
PostgreSQL  <------ Worker (Subscriber)
  |               |
  |               | Async processing
  |               v
  +---------- Job Status Updates
```

### Job Lifecycle (State Machine)

```
type JobStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
```
State transitions:
```
pending → processing → completed
                    ↘ failed
```

## Automated Testing

An automated testing script (`scripts/test_jobs.js`) is included to facilitate demonstration of the asynchronous job processing:

- The script automatically creates a new job via `POST /api/jobs`.
- It parses the returned `job_id` and repeatedly queries `GET /api/jobs/:id` at configurable intervals to track status changes (`pending → processing → completed`).
- Each execution automatically increments counters in the job type and payload (e.g., `email1 → email2`, `test1@example.com → test2@example.com`) for easy repeated demonstrations.
- This enables terminal-based, reproducible visualization of the backend workflow, without requiring external services like GCP Pub/Sub or jq for JSON parsing.

### Usage

Run the script via the provided Makefile target:

```
make test
```

This will:

	1.	Create a new job and print the returned job details.
	2.	Display the initial job status - pending.
    3.  Track the job status at multiple intervals until completion.
	4.	Automatically increment identifiers for subsequent runs, allowing repeated demonstrations.

This provides a fully local, cloud-ready demonstration of the event-driven architecture.

Result:

![AUTOTEST](https://github.com/Hazeliny/job-backend-prototype/blob/main/assets/Autotest.png)

## 🛠️ Tech Stack

### Core Technologies
```
	•	TypeScript – Strict typing and domain modeling
	•	Next.js (App Router) – API routes and server runtime
	•	PostgreSQL – Persistent job storage
	•	Docker & Docker Compose – Local environment orchestration
	•	Makefile – Automation (migrations, local setup, automated testing)
```

### Planned / Future Integrations
```
	•	Google Cloud Run – Containerized backend deployment
	•	Google Cloud Pub/Sub – Event publishing & subscription
	•	Cloud SQL (PostgreSQL) – Managed database
	•	GitHub Actions / Cloud Build – CI/CD automation
```

## 📁 Project Structure

```
.
├── app/
│   └── api/
│       └── jobs/
│           ├── route.ts        # POST /api/jobs
│           └── [id]/
│               └── route.ts    # GET /api/jobs/:id
│
├── src/
│   ├── db/
│   │   └── index.ts            # PostgreSQL connection pool
│   ├── repositories/
│   │   └── jobRepository.ts    # Data access layer
│   ├── services/
│   │   └── jobService.ts       # Business logic
│   ├── workers/
│   │   └── jobWorker.ts        # Async job processor
│   └── types/
│       └── job.ts              # Domain types
│
├── migrations/
│   └── 001_create_jobs_table.sql
├── scripts/
│   ├── test_jobs.js            # For auto-testing
│   └── counter.json            # For auto-testing
│
├── docker-compose.yml
├── Dockerfile
├── Makefile
├── package.json
└── README.md
```

## 📦 API Endpoints

### Create Job

**POST** /api/jobs
```
{
  "type": "email",
  "payload": {
    "to": "user@example.com"
  }
}
```

Response:
```
{
  "id": "uuid",
  "status": "pending"
}
```

Response after insert a record into database:

![CREATEJOB0](https://github.com/Hazeliny/job-backend-prototype/blob/main/assets/ResponseAfterInsert.png)

### Get Job Status

**GET** /api/jobs/{id}

Response:
```
{
  "id": "uuid",
  "type": "email",
  "status": "completed",
  "createdAt": "...",
  "updatedAt": "..."
}
```

Check job status through reading table before worker is triggered:

![READDB0](https://github.com/Hazeliny/job-backend-prototype/blob/main/assets/ReadDB0.png)

![READDB1](https://github.com/Hazeliny/job-backend-prototype/blob/main/assets/ReadDB1.png)

Check job status through reading table after worker is triggered:

![WORKERVALIDATED](https://github.com/Hazeliny/job-backend-prototype/blob/main/assets/WorkerValidated.png)

Check job status change through method GET job ID after worker is triggered:

![JOBSTATUSAUTOCHANGE](https://github.com/Hazeliny/job-backend-prototype/blob/main/assets/JobStatusAutoChange.png)

## ⚙️ Local Development

### Prerequisites

Check installed tools:
```
node -v
docker -v
docker compose version
```

### Start Local Environment

```
docker compose up -d
npm install
npm run dev
```

The API will be available at:
```
http://localhost:3000
```

### Run Database Migration

```
make migrate
```

Verify migration:
```
docker exec -it <postgres_container> psql -U jobuser -d jobs
```
```
\dt
SELECT * FROM jobs;
```

## 🔄 Asynchronous Processing Model

	•	Job creation publishes an internal event
	•	A worker subscribes and processes jobs asynchronously
	•	HTTP requests are **never blocked**
	•	Job state is persisted and observable

Current implementation uses an in-process worker (setTimeout) to simulate async behavior.
This is intentionally designed to be **replaceable by a real message broker**.

## ☁️ GCP Deployment (Planned)

### Target Architecture on GCP

	•	Cloud Run – Backend service
	•	Cloud Pub/Sub – Event bus
	•	Cloud SQL (PostgreSQL) – Managed database

```
Client
  ↓
Cloud Run (API)
  ↓ publish
Pub/Sub Topic
  ↓ subscribe
Worker (Cloud Run)
  ↓
Cloud SQL
```

### Why This Design Scales

	•	Stateless services
	•	Event-driven workload
	•	Horizontal scaling via Cloud Run
	•	At-least-once delivery via Pub/Sub

## 🔁 CI/CD Automation (Planned)

Planned pipeline:

	1.	Push to main
	2.	GitHub Actions / Cloud Build triggered
	3.	Docker image built
	4.	Image pushed to Artifact Registry
	5.	Cloud Run service updated automatically

This enables **zero-downtime deployments** and fast iteration.

## 🧪 Future Improvements

	•	Replace in-process worker with GCP Pub/Sub subscriber
	•	Add retry & dead-letter queue (DLQ)
	•	Add schema validation (Zod)
	•	Introduce observability (logs, metrics)
	•	Implement authentication & authorization
	•	Add load testing & benchmarks

## 🎯 Purpose of This Project

This project is intentionally built as a **backend-focused prototype**, prioritizing:

	•	Correctness
	•	Architecture clarity
	•	Scalability
	•	Cloud readiness

It is suitable for:

	•	Technical interviews
	•	Architecture discussions
	•	Cloud-native backend demonstrations

## 👤 Author
Built by Lin - a backend engineer with experience across:

	•	Banking systems (mainframe & financial software)
	•	Modern full-stack development
	•	Cloud-native architectures
	•	Distributed and event-driven systems

#!/usr/bin/env node

const fs = require('fs')
const { execSync } = require('child_process')

// count file
const COUNTER_FILE = './scripts/counter.json'

// read the current counter
let counter = { x: 1, y: 1 }
if (fs.existsSync(COUNTER_FILE)) {
  counter = JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf-8'))
}

// splice emailX and testY@example.com
const emailType = `email${counter.x}`
const payloadEmail = `test${counter.y}@example.com`

// generate POST data
const postData = JSON.stringify({
  type: emailType,
  payload: { to: payloadEmail }
})

console.log(`\n▉▉▉▉▉▉▉▉▉▉ START ASYNCHRONOUS EVENT-DRIVEN JOB PROCESSING TESTING! ▉▉▉▉▉▉▉▉▉▉\n`)

// execute curl POST
console.log(`Creating job: type=${emailType}, payload.to=${payloadEmail}`)
const response = execSync(
  `curl -s -X POST http://localhost:3000/api/jobs -H "Content-Type: application/json" -d '${postData}'`
).toString()

console.log('POST response:', response)

console.log(`\n▉▉▉▉▉▉▉▉▉▉ INITIAL JOB INFORMATION ▉▉▉▉▉▉▉▉▉▉\n`)

// parse job_id
const jobId = JSON.parse(response).id
console.log('Job ID:', jobId)

// parse initial job status
const jobStatus = JSON.parse(response).status
console.log('Initial Job Status:', jobStatus)

console.log(`\n▉▉▉▉▉▉▉▉▉▉ JOB STATUS TRANSITION ▉▉▉▉▉▉▉▉▉▉\n`)

// Query status interval (seconds)
const delays = [0.3, 6, 36]

// Loop query status
for (const delay of delays) {
  console.log(`Sleeping ${delay} seconds...`)
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delay * 1000) // sleep
  const status = execSync(`curl -s http://localhost:3000/api/jobs/${jobId}`).toString()
  console.log(`Job status after ${delay}s: ${JSON.parse(status).status}`)
}

// counter+1 and write back to file
counter.x += 1
counter.y += 1
fs.writeFileSync(COUNTER_FILE, JSON.stringify(counter))
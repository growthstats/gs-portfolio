#!/usr/bin/env node
// Prints how long this Claude Code session actually worked, from its transcript.
//
// Wall-clock time from claim to merge also counts the hours a session sat
// waiting for a human (a blocked merge, a question, a stop). Here a gap that
// ends with a human message counts as idle, and any other gap (a slow tool, a
// stalled API call) counts for at most 15 minutes.
//
// Usage: node scripts/agent/active-time.mjs [--since <ISO time>] [transcript.jsonl]
// Without a path it reads the current session's transcript, found by
// $CLAUDE_CODE_SESSION_ID under ~/.claude/projects.

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

const MAX_GAP_MS = 15 * 60 * 1000

const args = process.argv.slice(2)
const sinceAt = args.indexOf('--since')
const since = sinceAt === -1 ? null : Date.parse(args.splice(sinceAt, 2)[1])
if (since !== null && Number.isNaN(since)) fail('--since needs an ISO time')

const path = args[0] ?? findTranscript(process.env.CLAUDE_CODE_SESSION_ID)

const events = readFileSync(path, 'utf8')
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line))
  .filter((e) => e.timestamp && (e.type === 'user' || e.type === 'assistant'))
  .map((e) => ({ at: Date.parse(e.timestamp), human: isHuman(e) }))
  .filter((e) => since === null || e.at >= since)
  .sort((a, b) => a.at - b.at)

if (events.length < 2) fail(`not enough events in ${path}`)

let active = 0
for (let i = 1; i < events.length; i++) {
  if (events[i].human) continue
  active += Math.min(events[i].at - events[i - 1].at, MAX_GAP_MS)
}

const start = events[0].at
const end = events.at(-1).at
console.log(
  `Active: ${duration(active)} | Wall: ${duration(end - start)} (${iso(start)} → ${iso(end)} UTC)`,
)

// A message from a person (or the summary that resumes a compacted session),
// as opposed to a tool result or a background-task notification.
function isHuman(e) {
  if (e.type !== 'user' || e.isMeta) return false
  const content = e.message?.content
  if (typeof content === 'string') return !content.trimStart().startsWith('<task-notification>')
  if (!Array.isArray(content)) return false
  if (content.some((part) => part?.type === 'tool_result')) return false
  const text = content.map((part) => part?.text ?? '').join(' ')
  return !text.trimStart().startsWith('<task-notification>')
}

function findTranscript(sessionId) {
  if (!sessionId) fail('pass a transcript path, or run inside a Claude Code session')
  const root = join(homedir(), '.claude', 'projects')
  for (const dir of readdirSync(root)) {
    const file = join(root, dir, `${sessionId}.jsonl`)
    if (existsSync(file)) return file
  }
  fail(`no transcript for session ${sessionId} under ${root}`)
}

function duration(ms) {
  const minutes = Math.round(ms / 60000)
  const h = Math.floor(minutes / 60)
  return h ? `${h}h ${minutes % 60}m` : `${minutes}m`
}

function iso(ms) {
  return new Date(ms).toISOString().replace(/\.\d{3}Z$/, 'Z')
}

function fail(message) {
  console.error(`active-time: ${message}`)
  process.exit(1)
}

# Mission Control 🦊

Nick's personal dashboard — built and maintained by Fox.

## Running Locally

You need **two terminal tabs**:

**Tab 1 — Convex backend:**
```bash
cd ~/Projects/mission-control
npx convex dev
```
Choose "Start without an account (run Convex locally)" → Yes. Keep this running.

**Tab 2 — Next.js frontend:**
```bash
cd ~/Projects/mission-control
npm run dev
```

Then open: **http://localhost:3000**

## Seed Sample Data

After both servers are running, hit this once to populate sample tasks and calendar entries:
```bash
curl -X POST http://localhost:3000/api/calendar/seed
```

## Fox's API (how I log activities)

### Log a calendar entry
```bash
curl -X POST http://localhost:3000/api/calendar \
  -H "Content-Type: application/json" \
  -d '{"title": "Ran web search", "type": "completed", "scheduledAt": <timestamp>, "status": "completed"}'
```

### Create/update a task
```bash
# Create
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "New task", "assignee": "fox", "status": "in_progress"}'

# Update status
curl -X PATCH http://localhost:3000/api/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"status": "done"}'
```

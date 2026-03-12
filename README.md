# Personal Apps

An assortment of personal apps built to track my daily life and to experiment with hosting my own stuff on a home server

## Features

### Auth

Basic auth, single account, my account, using better-auth.

### Fitness Tracker

Personal workout tracking, inspired by Hevy

- Should be able to add routines that correspond to a specific day of the week
- Active routine for that day should be highlighted, and have a calendar for all the routines
- Each routine should be able to be edited or updated, and each routine is a set of exercises, with each exercise having a target rep
- I can start a routine that would track how many reps ive gone in the workout
- Routines can also be sports, so if a routine is "bouldering", there shouldn't be any reps inside the routine.

### Finance Tracker

Personal finance tracking, customized and simplified cuz I was sick of notion

- Default view should aggregate over current month, have a time picker to pick all time, per-month, etc.
- Should be simple, have a pie chart for expenses and income
- Have a button that opens a dialog that i could input an expense or income, each cashflow item should be taggable with a tag like "grocery" or "gym".
- Have a table for expenses and income based on date added, descending
- Be able to edit and delete cashflow items
- Aggregate view should update upon any changes

### Chatbot

Powered by local llm hosted on LM Studio

- should have a history of previous chat i've made and i could make a new chat
- should be able to handle markdown, latex, or code blocks
- if i dont like the answer, should be able to easily resend the same prompt and get a different result
- thumbs-up and thumbs-down on chat response
- have a pop-up in the chat area to load, eject, and switch models

### Media Server

Custom Front-end UI to host jellyfin media server

- Should be able to connect to jellyfin
- Should be able to upload file/folder like cloud drive
- should be able to categorize into folders files like cloud drive
- right click, should open custom context menu depending on the item it is right clicked on
- should have 2 different views i can switch from, a list, or tiles with thumbnails.

### Excalidraw

I-frame/canvas to access locally hosted excalidraw
https://docs.excalidraw.com/docs/@excalidraw/excalidraw/installation

### Penpot

Probably just link, self-hosted Figma alternative

## Infra

### Front-end

- **Next.js 15** (App Router, Turbopack)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** — component library
- **tRPC v11** — end-to-end type-safe API layer
- **TanStack Query v5** — server state management
- **Zod v4** — schema validation
- **Recharts** — charting
- **Better Auth** — authentication (client-side)
- **@dnd-kit** — drag and drop
- **Phosphor Icons** + **Lucide React** — icons

### Back-end

- **Next.js API Routes** — HTTP layer
- **tRPC v11** — typed RPC routers
- **Drizzle ORM** — type-safe SQL query builder
- **PostgreSQL** — primary database
- **Better Auth** — session-based auth with Drizzle adapter

### CI/CD

Hosted on a homeserver via Docker Compose, exposed to the internet via Tailscale Funnel.
Deployments are automated via a **GitHub Actions self-hosted runner** — no inbound ports or webhooks needed. The runner connects outbound to GitHub and triggers on every push to `main`.

**Stack:**

- **Docker Compose** — orchestrates app, PostgreSQL, and `tailscaled`
- **Tailscale Funnel** — punches through NAT, no open ports, no payment method required, serves a public HTTPS URL at `https://<hostname>.ts.net`
- **GitHub Actions (self-hosted runner)** — CI/CD triggered on push to `main`

**First-time setup:**

1. Enable Funnel for your tailnet at [Tailscale ACLs](https://login.tailscale.com/admin/acls) — add `"funnel": ["tag:container"]` or your device's tag
2. Generate a reusable auth key at [Tailscale Keys](https://login.tailscale.com/admin/settings/keys)
3. Copy `.env.example` to `.env` and fill in all values, then store it at `~/secrets/personal-apps/.env` on the homeserver
4. Register a self-hosted runner on the homeserver:
   - GitHub repo → Settings → Actions → Runners → New self-hosted runner
   - Follow the setup instructions to install and start the runner as a service
5. `docker compose up -d`

**Deploy flow (automatic):**

```
git push origin main
  → GitHub notifies the self-hosted runner
  → runner: docker compose up --build -d
  → runner: bun run db:migrate
```

You can also deploy manually from the homeserver with `./deploy.sh`.

## Set up home server on new device

### clone repository

```
git clone
```

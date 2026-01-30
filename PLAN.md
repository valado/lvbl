# Lovable Remote Controller — MVP Plan

## Overview

A system that lets users schedule Lovable.dev tasks from Telegram, with a React/MUI dashboard for queue management. Tasks are stored in Supabase PostgreSQL, and at execution time the system generates ready-to-click Lovable "Build with URL" links delivered back to chat.

**Lovable API constraint**: Only "Build with URL" exists (`https://lovable.dev/?autosubmit=true#prompt=...`). No server-side build execution — the system generates and delivers clickable URLs. Future-proofed for when Lovable expands their API.

**Platforms**: Telegram (MVP), Slack and WhatsApp deferred to follow-up.
**Users**: Multi-user with Supabase Auth and Row Level Security from day one.

---

## Architecture

```
Telegram Bot (grammY)  ──►  Supabase Edge Function (telegram-bot)
                                        │
React Dashboard (MUI)  ──►  Supabase Edge Function (api)
                                        │
                                        ▼
                              Supabase PostgreSQL
                              (tasks, profiles, projects)
                                        │
                              pg_cron + pg_net (scheduler)
                                        │
                                        ▼
                              Edge Function (task-executor)
                              → Generates Lovable URLs
                              → Delivers back to Telegram
```

---

## Phase 1: Project Scaffolding & Database

### 1.1 Initialize Supabase
- `supabase init` in project root
- Configure `supabase/config.toml`

### 1.2 Initialize React frontend
- Vite + React + TypeScript
- Install: `@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`, `@mui/x-data-grid`, `@mui/x-date-pickers`, `@supabase/supabase-js`, `react-router-dom`, `dayjs`

### 1.3 Database migrations

**Types (enums)**:
- `task_status`: pending, ready, generating, completed, failed, cancelled
- `task_priority`: low, normal, high, urgent
- `platform_type`: telegram, slack, dashboard
- `task_type`: new_project, existing_project

**Tables**:

`profiles` — extends auth.users:
- `id` (UUID PK → auth.users), `display_name`, `avatar_url`, `telegram_id` (BIGINT UNIQUE), `slack_user_id` (TEXT UNIQUE), timestamps

`projects` — user's registered Lovable projects:
- `id` (UUID PK), `owner_id` (FK profiles), `name`, `lovable_url`, `description`, timestamps

`tasks` — core task queue:
- `id` (UUID PK), `owner_id` (FK profiles), `project_id` (FK projects, nullable)
- `task_type`, `status`, `priority`, `title`, `prompt` (TEXT, max 50k), `image_urls` (TEXT[])
- `scheduled_at` (nullable), `executed_at`, `lovable_url` (result), `error_message`
- `source_platform`, `source_chat_id`, `source_message_id`, timestamps

`task_logs` — audit trail:
- `id`, `task_id` (FK tasks), `action`, `details` (JSONB), `created_at`

`platform_connections` — links chat accounts to profiles:
- `id`, `profile_id` (FK profiles), `platform`, `platform_user_id`, `platform_data` (JSONB), `is_active`, UNIQUE(platform, platform_user_id)

**RLS policies**: Each table scoped to `auth.uid() = owner_id` (or via join for task_logs).

**Triggers**: auto-update `updated_at`, auto-log task status changes to `task_logs`.

**Realtime**: Enable on `tasks` and `task_logs` tables.

---

## Phase 2: Shared Edge Function Code

Location: `supabase/functions/_shared/`

| File | Purpose |
|------|---------|
| `types.ts` | Shared TypeScript interfaces: Task, Project, CreateTaskInput, etc. |
| `supabase-client.ts` | Factory for service-role and anon Supabase clients |
| `lovable-url-builder.ts` | Builds `https://lovable.dev/?autosubmit=true#prompt=...&images=...` URLs. Validates prompt length (50k max) and image count (10 max). |
| `task-repository.ts` | DB operations: createTask, getTasksByOwner, updateTaskStatus, etc. |
| `platform-resolver.ts` | Resolves a platform user ID to a profile |
| `validation.ts` | Input validation for prompts, image URLs, dates |
| `cors.ts` | CORS headers for dashboard API |
| `logger.ts` | Structured logging |

**Write unit tests first** for `lovable-url-builder.ts` and `validation.ts` (TDD per CLAUDE.md).

---

## Phase 3: Telegram Bot

File: `supabase/functions/telegram-bot/index.ts`
Framework: **grammY** (Deno-native, official Supabase Edge Functions support)
JWT verification: disabled (Telegram uses bot token for auth)

### Commands

| Command | Description |
|---------|-------------|
| `/start` | Welcome, register profile if new |
| `/help` | List all commands |
| `/quick <prompt>` | One-shot task creation (text = title + prompt) |
| `/newtask <title>` | Interactive multi-step creation (bot asks for prompt, images, priority, schedule) |
| `/queue` | Show pending tasks with inline keyboard actions |
| `/status <id>` | Check task status |
| `/cancel <id>` | Cancel a pending task |
| `/schedule <datetime> <prompt>` | Schedule a future task |
| `/projects` | List registered projects |
| `/addproject <name> <url>` | Register a Lovable project |
| `/link` | Generate one-time code to link to dashboard account |

**Plain text** messages → treated as quick prompts with confirmation inline keyboard.

### Webhook setup
- Deploy edge function
- Set Telegram webhook: `https://<project>.supabase.co/functions/v1/telegram-bot?secret=<BOT_TOKEN>`

---

## Phase 4: Task Executor

File: `supabase/functions/task-executor/index.ts`
JWT verification: enabled (called with service role key)

### Flow
1. **pg_cron** runs every minute → calls `mark_ready_tasks()` SQL function (moves pending tasks past their `scheduled_at` to `ready` status)
2. **pg_cron** invokes `task-executor` edge function via `pg_net`
3. Executor fetches all `status = 'ready'` tasks (limit 10, ordered by priority)
4. For each task:
   - Set status → `generating`
   - Build Lovable URL via `lovable-url-builder.ts`
   - Set status → `completed`, store `lovable_url`
   - Deliver URL back to Telegram chat (using grammY's `bot.api.sendMessage`)
5. On error: set status → `failed` with `error_message`

### For `existing_project` task type
- Send both the project's `lovable_url` AND the prompt text as a copyable message
- User opens their project and pastes the prompt manually

---

## Phase 5: React Dashboard

### Pages & Components

**Auth** (`/login`, `/signup`):
- `LoginPage` — email/password via `supabase.auth.signInWithPassword()`
- `SignUpPage` — registration
- `AuthGuard` — route protection wrapper

**Dashboard** (`/`):
- `DashboardPage` — 4 stats cards (Total, Pending, Completed Today, Failed) + recent tasks list
- `StatsCard` — single metric
- `RecentTasksList` — last 10 tasks, real-time updates

**Tasks** (`/tasks`):
- `TasksPage` — main view with filters + table
- `TaskTable` — MUI DataGrid, sortable/paginated
- `TaskStatusChip` / `TaskPriorityChip` — colored status badges
- `TaskFilters` — status, priority, date range, search
- `TaskDetailDrawer` — slide-out: full prompt, Lovable URL (clickable + copy button), image previews, audit log timeline
- `CreateTaskDialog` — form: title, prompt (with char counter), task type toggle, project selector, image URLs, priority, schedule datetime
- `ScheduleTaskDialog` — date/time picker for rescheduling

**Projects** (`/projects`):
- `ProjectsPage` — card grid of registered Lovable projects
- `ProjectCard` — name, URL, task count
- `CreateProjectDialog` — register a new project

**Settings** (`/settings`):
- `SettingsPage` — account info
- `PlatformLinkSection` — show linking code for Telegram, link/unlink status

**Layout**:
- `AppLayout` — MUI Drawer sidebar + AppBar header + Outlet
- `Sidebar` — navigation links
- `Header` — user avatar + menu

### API Edge Function

File: `supabase/functions/api/index.ts` (fat function, multiple routes)
JWT verification: enabled

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/tasks` | List tasks (with filters/pagination) |
| POST | `/api/tasks` | Create task from dashboard |
| PATCH | `/api/tasks/:id` | Update (cancel, reschedule, edit) |
| DELETE | `/api/tasks/:id` | Delete task |
| POST | `/api/tasks/:id/execute` | Manually trigger execution |
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Register project |
| PATCH | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| GET | `/api/stats` | Dashboard statistics |

### Real-time
- `useRealtimeTasks` hook subscribes to `tasks` table via Supabase Realtime
- INSERT/UPDATE/DELETE events merged into local state for live dashboard updates

---

## Phase 6: Account Linking & Polish

1. **Account linking flow**: Dashboard generates one-time code → user sends `/link <code>` in Telegram → bot validates and stores `telegram_id` on profile
2. Error handling and retry logic in edge functions
3. Rate limiting per user (simple counter in DB)
4. Loading/empty/error states in all dashboard components
5. Input sanitization across bot and dashboard

---

## Environment Variables

### Supabase Secrets (`supabase secrets set`)
- `TELEGRAM_BOT_TOKEN` — from BotFather

### Auto-populated by Supabase
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### Frontend `.env`
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

---

## File Structure

```
lvbl/
├── supabase/
│   ├── config.toml
│   ├── seed.sql
│   ├── migrations/
│   │   ├── 001_create_types.sql
│   │   ├── 002_create_tables.sql
│   │   ├── 003_create_indexes.sql
│   │   ├── 004_enable_rls.sql
│   │   ├── 005_create_functions.sql
│   │   ├── 006_setup_cron.sql
│   │   └── 007_enable_realtime.sql
│   └── functions/
│       ├── _shared/
│       │   ├── types.ts
│       │   ├── supabase-client.ts
│       │   ├── lovable-url-builder.ts
│       │   ├── task-repository.ts
│       │   ├── platform-resolver.ts
│       │   ├── validation.ts
│       │   ├── cors.ts
│       │   └── logger.ts
│       ├── telegram-bot/
│       │   └── index.ts
│       ├── task-executor/
│       │   └── index.ts
│       └── api/
│           └── index.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── config/
│   │   ├── supabase.ts
│   │   ├── theme.ts
│   │   └── routes.ts
│   ├── types/
│   │   ├── task.ts
│   │   └── api.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTasks.ts
│   │   ├── useProjects.ts
│   │   ├── useRealtimeTasks.ts
│   │   └── useTaskStats.ts
│   ├── services/
│   │   ├── api.ts
│   │   └── supabase-auth.ts
│   └── components/
│       ├── layout/ (AppLayout, Sidebar, Header)
│       ├── auth/ (LoginPage, SignUpPage, AuthGuard)
│       ├── dashboard/ (DashboardPage, StatsCard, RecentTasksList)
│       ├── tasks/ (TasksPage, TaskTable, TaskDetailDrawer, CreateTaskDialog, etc.)
│       ├── projects/ (ProjectsPage, ProjectCard, CreateProjectDialog)
│       └── settings/ (SettingsPage, PlatformLinkSection)
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── .env
├── CLAUDE.md
└── TECHSTACK.md
```

---

## Verification Plan

1. **Database**: Run `supabase db reset` — all migrations apply cleanly
2. **Shared modules**: Run Deno tests for `lovable-url-builder` and `validation`
3. **Telegram bot**: Send `/start`, `/quick test prompt`, `/queue` — verify tasks appear in DB
4. **Task executor**: Create a task with `scheduled_at = NOW()`, wait 1 min, verify Lovable URL is generated and delivered to Telegram
5. **Dashboard**: Log in, verify task list loads with real-time updates, create a task via dialog, verify it appears in Telegram bot's `/queue`
6. **Account linking**: Generate code in dashboard settings, send `/link <code>` in Telegram, verify profile is linked
7. **End-to-end**: Send prompt in Telegram → task appears on dashboard in real-time → executor generates URL → URL delivered back to Telegram as clickable link

---

## Key Sources

- [Lovable API: Build with URL](https://docs.lovable.dev/integrations/build-with-url)
- [grammY on Supabase Edge Functions](https://grammy.dev/hosting/supabase)
- [Supabase Telegram Bot Guide](https://supabase.com/docs/guides/functions/examples/telegram-bot)
- [grammY Supabase Example](https://github.com/grammyjs/examples/blob/main/setups/supabase-edge-functions/supabase/functions/telegram-bot/index.ts)
- [slack-edge Framework](https://github.com/seratch/slack-edge) (for future Slack phase)

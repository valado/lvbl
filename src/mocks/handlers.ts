import { http, HttpResponse, delay } from 'msw'
import {
  MOCK_USER_ID,
  MOCK_PROFILE,
  MOCK_PROJECTS,
  MOCK_TASKS,
  MOCK_TASK_LOGS,
  MOCK_STATS,
} from './data'
import type { Task, Project } from '@/types/database'

const BASE = import.meta.env.VITE_SUPABASE_URL as string

// Mutable copies for CRUD operations
let tasks = [...MOCK_TASKS]
let projects = [...MOCK_PROJECTS]
let nextTaskNum = 7
let nextProjectNum = 4

export const handlers = [
  // ── Auth ──────────────────────────────────────────────────────
  http.post(`${BASE}/auth/v1/token`, async ({ request }) => {
    const url = new URL(request.url)
    const grantType = url.searchParams.get('grant_type')

    if (grantType === 'password') {
      await delay(300)
      return HttpResponse.json({
        access_token: 'mock-access-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'mock-refresh-token',
        user: {
          id: MOCK_USER_ID,
          email: 'demo@example.com',
          role: 'authenticated',
          user_metadata: { display_name: 'Demo User' },
        },
      })
    }

    // refresh token
    await delay(100)
    return HttpResponse.json({
      access_token: 'mock-refreshed-token',
      token_type: 'bearer',
      expires_in: 3600,
      refresh_token: 'mock-refresh-token-2',
      user: {
        id: MOCK_USER_ID,
        email: 'demo@example.com',
        role: 'authenticated',
        user_metadata: { display_name: 'Demo User' },
      },
    })
  }),

  http.post(`${BASE}/auth/v1/signup`, async () => {
    await delay(300)
    return HttpResponse.json({
      id: MOCK_USER_ID,
      email: 'demo@example.com',
      role: 'authenticated',
      user_metadata: { display_name: 'Demo User' },
    })
  }),

  http.post(`${BASE}/auth/v1/logout`, () => {
    return HttpResponse.json({})
  }),

  http.get(`${BASE}/auth/v1/user`, () => {
    return HttpResponse.json({
      id: MOCK_USER_ID,
      email: 'demo@example.com',
      role: 'authenticated',
      user_metadata: { display_name: 'Demo User' },
    })
  }),

  // ── Profiles ──────────────────────────────────────────────────
  http.get(`${BASE}/rest/v1/profiles`, ({ request }) => {
    const url = new URL(request.url)
    const idFilter = url.searchParams.get('id')
    if (idFilter) {
      return HttpResponse.json([MOCK_PROFILE])
    }
    return HttpResponse.json([MOCK_PROFILE])
  }),

  // ── Tasks ─────────────────────────────────────────────────────
  http.get(`${BASE}/rest/v1/tasks`, ({ request }) => {
    const url = new URL(request.url)
    let result = [...tasks]

    const statusFilter = url.searchParams.get('status')
    if (statusFilter && statusFilter.startsWith('eq.')) {
      result = result.filter(t => t.status === statusFilter.slice(3))
    }

    const priorityFilter = url.searchParams.get('priority')
    if (priorityFilter && priorityFilter.startsWith('eq.')) {
      result = result.filter(t => t.priority === priorityFilter.slice(3))
    }

    const titleFilter = url.searchParams.get('title')
    if (titleFilter && titleFilter.startsWith('ilike.')) {
      const search = titleFilter.slice(7, -1).toLowerCase()
      result = result.filter(t => t.title.toLowerCase().includes(search))
    }

    const order = url.searchParams.get('order')
    if (order) {
      const [field, dir] = order.split('.')
      result.sort((a, b) => {
        const aVal = a[field as keyof Task] ?? ''
        const bVal = b[field as keyof Task] ?? ''
        if (aVal < bVal) return dir === 'asc' ? -1 : 1
        if (aVal > bVal) return dir === 'asc' ? 1 : -1
        return 0
      })
    }

    const rangeHeader = request.headers.get('Range')
    if (rangeHeader) {
      const match = rangeHeader.match(/(\d+)-(\d+)/)
      if (match) {
        const start = parseInt(match[1]!)
        const end = parseInt(match[2]!)
        const total = result.length
        result = result.slice(start, end + 1)
        return HttpResponse.json(result, {
          headers: {
            'Content-Range': `${start}-${Math.min(end, total - 1)}/${total}`,
          },
        })
      }
    }

    return HttpResponse.json(result, {
      headers: { 'Content-Range': `0-${result.length - 1}/${result.length}` },
    })
  }),

  http.post(`${BASE}/rest/v1/tasks`, async ({ request }) => {
    await delay(200)
    const body = await request.json() as Partial<Task>
    const newTask: Task = {
      id: `task-${String(nextTaskNum++).padStart(3, '0')}`,
      owner_id: MOCK_USER_ID,
      project_id: body.project_id ?? null,
      task_type: body.task_type ?? 'new_project',
      status: body.scheduled_at ? 'pending' : 'ready',
      priority: body.priority ?? 'normal',
      title: body.title ?? 'Untitled',
      prompt: body.prompt ?? '',
      image_urls: body.image_urls ?? [],
      scheduled_at: body.scheduled_at ?? null,
      executed_at: null,
      lovable_url: null,
      error_message: null,
      source_platform: 'dashboard',
      source_chat_id: null,
      source_message_id: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      project: body.project_id ? projects.find(p => p.id === body.project_id) ?? null : null,
    }
    tasks.unshift(newTask)
    return HttpResponse.json(newTask, { status: 201 })
  }),

  http.patch(`${BASE}/rest/v1/tasks`, async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const idFilter = url.searchParams.get('id')
    if (!idFilter) return HttpResponse.json({ error: 'Missing id' }, { status: 400 })
    const taskId = idFilter.startsWith('eq.') ? idFilter.slice(3) : idFilter

    const body = await request.json() as Partial<Task>
    const idx = tasks.findIndex(t => t.id === taskId)
    if (idx === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 })

    tasks[idx] = { ...tasks[idx]!, ...body, updated_at: new Date().toISOString() }
    return HttpResponse.json(tasks[idx])
  }),

  http.delete(`${BASE}/rest/v1/tasks`, ({ request }) => {
    const url = new URL(request.url)
    const idFilter = url.searchParams.get('id')
    if (!idFilter) return HttpResponse.json({ error: 'Missing id' }, { status: 400 })
    const taskId = idFilter.startsWith('eq.') ? idFilter.slice(3) : idFilter

    tasks = tasks.filter(t => t.id !== taskId)
    return HttpResponse.json(null, { status: 204 })
  }),

  // ── Task Logs ─────────────────────────────────────────────────
  http.get(`${BASE}/rest/v1/task_logs`, ({ request }) => {
    const url = new URL(request.url)
    const taskIdFilter = url.searchParams.get('task_id')
    let result = [...MOCK_TASK_LOGS]
    if (taskIdFilter && taskIdFilter.startsWith('eq.')) {
      result = result.filter(l => l.task_id === taskIdFilter.slice(3))
    }
    return HttpResponse.json(result)
  }),

  // ── Projects ──────────────────────────────────────────────────
  http.get(`${BASE}/rest/v1/projects`, () => {
    return HttpResponse.json(projects)
  }),

  http.post(`${BASE}/rest/v1/projects`, async ({ request }) => {
    await delay(200)
    const body = await request.json() as Partial<Project>
    const newProject: Project = {
      id: `proj-${String(nextProjectNum++).padStart(3, '0')}`,
      owner_id: MOCK_USER_ID,
      name: body.name ?? 'Untitled Project',
      lovable_url: body.lovable_url ?? '',
      description: body.description ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    projects.push(newProject)
    return HttpResponse.json(newProject, { status: 201 })
  }),

  http.patch(`${BASE}/rest/v1/projects`, async ({ request }) => {
    await delay(200)
    const url = new URL(request.url)
    const idFilter = url.searchParams.get('id')
    if (!idFilter) return HttpResponse.json({ error: 'Missing id' }, { status: 400 })
    const projectId = idFilter.startsWith('eq.') ? idFilter.slice(3) : idFilter

    const body = await request.json() as Partial<Project>
    const idx = projects.findIndex(p => p.id === projectId)
    if (idx === -1) return HttpResponse.json({ error: 'Not found' }, { status: 404 })

    projects[idx] = { ...projects[idx]!, ...body, updated_at: new Date().toISOString() }
    return HttpResponse.json(projects[idx])
  }),

  http.delete(`${BASE}/rest/v1/projects`, ({ request }) => {
    const url = new URL(request.url)
    const idFilter = url.searchParams.get('id')
    if (!idFilter) return HttpResponse.json({ error: 'Missing id' }, { status: 400 })
    const projectId = idFilter.startsWith('eq.') ? idFilter.slice(3) : idFilter

    projects = projects.filter(p => p.id !== projectId)
    return HttpResponse.json(null, { status: 204 })
  }),

  // ── Stats (RPC) ───────────────────────────────────────────────
  http.post(`${BASE}/rest/v1/rpc/get_dashboard_stats`, () => {
    const currentStats = {
      total_tasks: tasks.length,
      pending_tasks: tasks.filter(t => t.status === 'pending' || t.status === 'ready').length,
      completed_today: tasks.filter(t => t.status === 'completed' && t.executed_at && new Date(t.executed_at).toDateString() === new Date().toDateString()).length,
      failed_tasks: tasks.filter(t => t.status === 'failed').length,
    }
    return HttpResponse.json(currentStats)
  }),

  // Fallback for stats as a GET on a view
  http.get(`${BASE}/rest/v1/dashboard_stats`, () => {
    return HttpResponse.json([MOCK_STATS])
  }),
]

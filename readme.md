# 🧠 AI Agentic Whiteboard (WhizBoard)

An AI-powered collaborative whiteboard built with **Next.js 16** and **Excalidraw**. Describe what you want in plain English, such as a flowchart, a system architecture or a website wireframe, and the AI agent draws it directly onto your canvas as editable shapes.

Boards are saved automatically to a serverless Postgres database, and each user gets a small credit allowance for creating boards.

---

## ✨ Features

- **AI diagram generation**: turn a text prompt into Excalidraw elements using Google Gemini. Five built-in agents:
  - Generate Diagrams
  - Flowchart
  - Architecture
  - Web Mockup
  - Mobile Mockup
- **Full Excalidraw canvas**: selection, hand, rectangle, diamond, ellipse, arrow, line, free draw, text, image and eraser tools.
- **Floating properties panel**: when a single element is selected, edit stroke, fill, opacity, text alignment, layering, lock and duplicate/delete without leaving the canvas.
- **Auto-save**: changes are debounced (10 seconds after your last edit) and persisted to the database, along with a thumbnail preview.
- **Dashboard**: create, list and delete (soft delete) boards, each with a preview image and last-updated time.
- **Export**: download the current board as a PNG.
- **Authentication**: sign-in/sign-up via Clerk, with `/dashboard` protected by middleware.
- **Credits and payments**: every new user starts with 3 credits (1 per board). Stripe checkout and webhook routes are scaffolded for paid plans.

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Canvas | `@excalidraw/excalidraw` |
| AI | Google Gemini via `@google/genai` (structured JSON output) |
| Auth | Clerk |
| Database | Neon serverless Postgres + Drizzle ORM |
| Payments | Stripe |
| Styling / UI | Tailwind CSS v4, shadcn/ui components, Base UI, lucide-react |
| HTTP client | axios |

---

## 🏗️ How It Works

```
Prompt  ──►  /api/ai (Gemini, JSON schema)  ──►  Excalidraw-style elements + connections
                                                         │
                                          convertToExcalidrawElements()
                                                         │
                                                         ▼
                                              Canvas  ──(10s debounce)──►  /api/whiteboard  ──►  Postgres
```

1. The user opens the AI sidebar, picks a tool (for example Flowchart) and describes the diagram.
2. `POST /api/ai` combines the tool's system prompt with the request and asks Gemini for a JSON response matching a strict schema (`title`, `width`, `height`, `elements[]`, `connections[]`).
3. The client converts the result into real Excalidraw elements and draws them on the canvas.
4. Every canvas change schedules a save. `POST /api/whiteboard` upserts the elements, app state, files and preview image.
5. When a board is opened, `GET /api/projects?projectId=...` loads the saved scene back into Excalidraw.

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── ai/                 # Gemini diagram generation
│   │   ├── checkout/stripe/    # Stripe checkout session
│   │   ├── projects/           # Board CRUD (create / list / get / soft-delete)
│   │   ├── users/              # Sync Clerk user into the DB
│   │   ├── webhooks/stripe/    # Stripe webhook handler
│   │   ├── whiteboard/         # Save (upsert) canvas data
│   │   └── workspace/[projectid]/page.tsx   # Workspace page (canvas + header)
│   ├── dashboard/              # Dashboard layout + page
│   ├── sign-in/ , sign-up/     # Clerk auth pages
│   ├── layout.tsx , provider.tsx
│   └── page.tsx                # Landing page
├── components/ui/
│   ├── custom/
│   │   ├── dashboard/          # AppSideBar, ProjectList, CreateNewBoardDialog, WelcomeBanner
│   │   └── workspace/          # Whiteboard, AIFloatingSidebar, FloatingProperties, WorkspaceHeader, SmartDoc
│   └── *.tsx                   # shadcn/ui primitives
├── db/
│   ├── schema.ts               # Drizzle schema
│   └── index.ts                # Neon + Drizzle client
├── context/UserDetailContext.tsx
├── lib/                        # stripe client, utils, code highlighter
├── utils/normalizeAppState.ts  # Rebuilds Excalidraw appState after JSON round-trip
├── proxy.ts                    # Clerk middleware (protects /dashboard)
└── drizzle.config.ts
```

---

## 🗄️ Database Schema

| Table | Purpose | Key columns |
| --- | --- | --- |
| `users` | App users (synced from Clerk) | `email` (unique), `name`, `credits` (default 3) |
| `projects` | Boards | `projectId` (UUID, unique), `userEmail`, `projectName`, `isDeleted` |
| `whiteboard_data` | Saved canvas per board | `projectId` (unique FK), `elements`, `appState`, `files` (JSONB), `previewImage` |
| `posts` | Starter-template table, currently unused | `title`, `content`, `authorId` |

---

## 🔌 API Reference

| Method | Route | Description |
| --- | --- | --- |
| `POST` | `/api/users` | Find or create the DB user for the signed-in Clerk user |
| `GET` | `/api/projects` | List the current user's boards (excludes deleted) |
| `GET` | `/api/projects?projectId=<id>` | Load one board and its saved canvas data |
| `POST` | `/api/projects` | Create a board (costs 1 credit) |
| `DELETE` | `/api/projects` | Soft-delete a board |
| `POST` | `/api/whiteboard` | Save elements, appState, files and preview image |
| `POST` | `/api/ai` | Generate a diagram from a prompt with Gemini |
| `POST` | `/api/checkout/stripe` | Create a Stripe subscription checkout session |
| `POST` | `/api/webhooks/stripe` | Receive Stripe webhook events |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A [Clerk](https://clerk.com) application
- A [Neon](https://neon.tech) Postgres database
- A [Google AI Studio](https://aistudio.google.com) API key (Gemini)
- *(Optional)* a [Stripe](https://stripe.com) account for payments

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/Ai-agentic-whiteboard.git
cd Ai-agentic-whiteboard
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Neon Postgres
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Google Gemini (required for AI generation, not listed in .env.example)
GEMINI_API_KEY=your_gemini_api_key

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Set up the database

```bash
npm run db:push
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), sign up, and create your first board from the dashboard.

---

## 📜 Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the codebase |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:push` | Push the schema to the database |
| `npm run db:studio` | Open Drizzle Studio |

---

## 🗺️ Roadmap / Known Gaps

- [ ] **Doc tab**: `SmartDoc` is a placeholder, and the header tab switch isn't wired to the view yet.
- [ ] **Sharing and Shared/Archived views**: the buttons and sidebar entries exist but have no backend yet.
- [ ] **Stripe fulfilment**: the webhook currently only logs `checkout.session.completed` and doesn't grant credits.
- [ ] **Authorization on delete**: `DELETE /api/projects` should also verify the board belongs to the signed-in user.
- [ ] **Landing page**: still contains the starter-template copy.
- [ ] **Workspace route**: the page lives under `app/api/workspace/[projectid]/`, but the dashboard navigates to `/workspace/<id>`, so it likely belongs under `app/workspace/[projectId]/`.

---

## 👤 Author

**aktrips36**

---

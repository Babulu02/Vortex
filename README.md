# 🚀 ApexIntel — Autonomous Sales Intelligence Engine

<div align="center">

![ApexIntel Banner](https://img.shields.io/badge/ApexIntel-Autonomous%20Sales%20Engine-blueviolet?style=for-the-badge&logo=lightning&logoColor=white)

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Built with n8n](https://img.shields.io/badge/Automation-n8n-orange?logo=n8n)](https://n8n.io)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react)](https://react.dev)
[![Firebase](https://img.shields.io/badge/Database-Firebase%20Firestore-FFCA28?logo=firebase)](https://firebase.google.com)
[![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA%203.3%2070B-F55036?logo=groq)](https://groq.com)
[![VAPI](https://img.shields.io/badge/Voice-VAPI-5C3BC1)](https://vapi.ai)

**A fully autonomous, multi-agent sales pipeline that watches your SaaS users in real-time, scores their intent with LLM reasoning, drafts hyper-personalized outreach, and calls hot leads — all without a human in the loop.**

[Live Demo](https://vortex-dusky-delta.vercel.app/)    ·   [Video Presentation](https://drive.google.com/file/d/1xFNuPYd_wtmd1fKfpy7PQ3qOXzoif6gt/view)

</div>

---

## 🧠 What Is ApexIntel?

ApexIntel is a **webhook-triggered, multi-agent AI system** built for SaaS companies that want to convert trial users into paying customers automatically.

When a user fires a behavioral event in your product (hitting an API limit, inviting teammates, exploring a premium feature), ApexIntel's agent pipeline wakes up, evaluates the signal in real-time, scores the lead's upgrade intent using an LLM, writes a fully personalized sales email, routes the lead to the right tier, and — if they're hot enough — initiates an AI voice call via VAPI.

Everything is stored in Firestore and surfaced through a real-time React dashboard. **Zero human effort required.**

---

## ✨ Key Features

- **Real-time behavioral capture** — Listens to webhook events from your SaaS product
- **LLM-powered intent scoring** — Groq `llama-3.3-70b-versatile` classifies leads into `POWER_USER`, `EXPLORER`, and more tiers with a 0–100 intent score
- **Hyper-personalized email drafts** — AI Scriptwriter generates a bespoke email for every lead based on their exact usage context
- **Automated voice calls** — VAPI agent calls HOT leads every 30 minutes
- **Slack alerts** — Instant notifications for hot leads
- **Social Intel scraper** — Background agent scrapes Reddit + YouTube every 6 hours for market signals
- **Data hygiene** — Stale leads (>30 days) are automatically purged
- **Live React dashboard** — Real-time `onSnapshot` listeners for instant pipeline visibility
- **Demo mode** — Seed data toggle for safe demos without live Firebase

---

## 🏗️ Architecture

### System Overview

The system is split into two planes:

**Webhook-Triggered Plane** — Reacts instantly to user events from your SaaS product.

**Schedule-Triggered Plane** — Independent agents running on timers for proactive sales actions and data maintenance.

```
Your SaaS
    │
    │  POST /webhook/vortex-event
    ▼
Agent 1 — Behavioral Scout        ──► Normalizes event → activity atom → Firestore
    │
    ▼
Agent 7 — Executive Router        ──► Applies thresholds, routes to agents
    │                   │
    ▼                   ▼
Agent 2               Agent 3
Intent Architect      Persona Scriptwriter
Score → tier          Score + email draft
    │                   │
    └─────────┬──────────┘
              ▼
          Firestore
              │
              ▼
       React Dashboard
       (onSnapshot listeners)

─────────────────────────────────────────────
Schedule-Triggered (independent)

Agent 4 — VAPI Voice Caller       Every 30 min · HOT leads
Agent 5 — Data Custodian          Daily · deletes leads > 30 days  
Agent 6 — Social Intel Scraper    Every 6h · Reddit + YouTube → Firestore
```

### Architecture Diagram

![System Architecture](https://github.com/user-attachments/assets/4d256628-e2f1-416b-afb7-c65f36c1f325)

### n8n Master Pipeline Workflow

The core webhook pipeline as built in n8n:

![n8n Workflow](https://github.com/user-attachments/assets/39e617eb-e010-4312-9700-0bed592d0202)


**Pipeline steps:**
1. **Webhook Intake** — Receives POST from your SaaS
2. **Scout: Normalize** — Extracts and sanitizes the activity atom (user_id, event, feature, session_mins, etc.)
3. **Save User Profile** — PATCHes Firestore `users/` collection
4. **Respond Early** — Returns `200 OK` immediately (non-blocking)
5. **Architect: AI Score** — Calls Groq LLaMA 3.3 70B to score intent
6. **Parse Intent** — Extracts `tier` + `intent_score` from LLM JSON
7. **Scriptwriter: Draft** — Calls Groq again to write a personalized email
8. **Parse Email** — Extracts `subject` + `body`
9. **Router: Decision** — Applies threshold (`score ≥ 80` → `HOT_LEAD`)
10. **Save Lead Firestore** — Writes full lead record with debate log
11. **Slack Alert (Hot Only)** — Posts to Slack channel if HOT

---

## 🤖 Agent Roster

| Agent | Name | Trigger | Role |
|-------|------|---------|------|
| **Agent 1** | Behavioral Scout | Webhook | Normalizes raw events into structured activity atoms |
| **Agent 2** | Intent Architect | Webhook chain | LLM-scores intent, assigns tier (POWER_USER / EXPLORER / etc.) |
| **Agent 3** | Persona Scriptwriter | Webhook chain | Drafts personalized upgrade email per lead context |
| **Agent 4** | VAPI Voice Caller | Every 30 min | Calls HOT leads using an AI voice agent |
| **Agent 5** | Data Custodian | Daily | Hard-deletes Firestore records older than 30 days |
| **Agent 6** | Social Intel Scraper | Every 6h | Scrapes Reddit + YouTube for product signals |
| **Agent 7** | Executive Router | Webhook chain | Applies business thresholds, routes to correct agents, sets lead status |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Automation** | [n8n](https://n8n.io) (cloud) |
| **AI / LLM** | [Groq](https://groq.com) — `llama-3.3-70b-versatile` |
| **Voice AI** | [VAPI](https://vapi.ai) |
| **Database** | [Firebase Firestore](https://firebase.google.com/docs/firestore) |
| **Frontend** | React + Vite |
| **Alerts** | Slack Webhooks |
| **Social Scraping** | Reddit API + YouTube API |

---

## ⚡ Quick Start

### Prerequisites

- [n8n Cloud](https://app.n8n.cloud) account
- [Firebase](https://console.firebase.google.com) project with Firestore enabled
- [Groq](https://console.groq.com) API key
- [VAPI](https://dashboard.vapi.ai) account + phone number
- [Slack](https://api.slack.com/apps) incoming webhook URL
- Node.js 18+

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ApexIntel.git
cd ApexIntel
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# n8n Cloud — get from Webhook node → Production URL
VITE_N8N_WEBHOOK_URL=https://your-instance.app.n8n.cloud/webhook/vortex-event
VITE_N8N_VAPI_URL=https://your-instance.app.n8n.cloud/webhook/vapi-outcome

# Firebase — get from Firebase Console → Project Settings → Web App
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Demo mode — set to 'false' to use live Firebase data
VITE_USE_DEMO_DATA=true
```

### 4. Import the n8n workflow

1. Open your n8n Cloud instance
2. Go to **Workflows → Import from file**
3. Import `workflows/Master Apex Executive Pipeline.json`
4. Set the following credentials inside n8n (via the **Credentials** panel):

| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | Your Groq API key |
| `VAPI_API_KEY` | Your VAPI API key |
| `VAPI_PHONE_NUMBER_ID` | VAPI phone number ID |
| `SLACK_WEBHOOK_URL` | Slack incoming webhook URL |
| `FIREBASE_PROJECT_ID` | Your Firestore project ID |

5. Activate the workflow

### 5. Set up Firestore security rules

Deploy the included rules:

```bash
firebase deploy --only firestore:rules
```

Or copy the contents of `firestore.rules` into Firebase Console → Firestore → Rules.

### 6. Start the frontend

```bash
npm run dev
```

Visit `http://localhost:5173`

---

## 📡 Sending Events to the Pipeline

Fire a test event at your n8n webhook:

```bash
curl -X POST https://your-instance.app.n8n.cloud/webhook/vortex-event \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_123",
    "name": "Jane Doe",
    "email": "jane@acme.com",
    "company": "Acme Corp",
    "company_size": "50-200",
    "event": "api_limit_hit",
    "feature": "Data Export API",
    "session_duration_mins": 47,
    "teammates_invited": 3,
    "api_calls_today": 98,
    "plan": "free_trial",
    "phone": "+1234567890",
    "call_consent": true,
    "email_consent": true
  }'
```

### Supported Event Types

| Event | Signal Strength | Description |
|-------|----------------|-------------|
| `api_limit_hit` | 🔴 High | User hit usage ceiling |
| `team_invite` | 🟠 Medium-High | Expanding usage to teammates |
| `feature_explored` | 🟡 Medium | Browsed a premium feature |
| `session_long` | 🟡 Medium | Extended engagement session |
| `export_attempted` | 🟠 Medium-High | Tried to export data |

---

## 📊 Lead Tiers & Routing

| Tier | Intent Score | Routing |
|------|-------------|---------|
| `POWER_USER` | 80–100 | HOT_LEAD → Slack alert + Email + VAPI call |
| `GROWTH_SEEKER` | 60–79 | WARM_LEAD → Email only |
| `EXPLORER` | 40–59 | WARM_LEAD → Email only |
| `CASUAL` | < 40 | Stored, no outreach |

---

## 🗂️ Project Structure

```
ApexIntel/
├── .env.example              # Environment variable template
├── firestore.rules           # Firestore security rules
├── index.html                # App entry point
├── vite.config.js            # Vite configuration
├── package.json
├── workflows/
│   └── Master Apex Executive Pipeline.json   # n8n workflow export
└── src/
    ├── config/
    │   ├── firebase.js       # Firestore client init
    │   └── n8n.js            # Webhook trigger helpers
    ├── components/
    │   ├── LeadCard.jsx      # Individual lead display
    │   ├── LivePipeline.jsx  # Real-time pipeline feed
    │   ├── ProductIntelligence.jsx  # Social intel panel
    │   └── DemoButton.jsx    # Demo event trigger
    └── main.jsx / index.jsx  # App root
```

---

## 🎬 Demo Mode

The dashboard includes a **Demo Mode** that simulates a full pipeline run without live data:

1. Set `VITE_USE_DEMO_DATA=true` in your `.env`
2. Click the **"Run Demo"** button in the dashboard
3. Watch agents 1 → 2 → 3 → 7 activate in sequence with realistic output

The demo fires an actual n8n webhook in the background, so you can observe the real pipeline execution simultaneously.

---

## 🔒 Security Notes

> ⚠️ **Important before pushing to GitHub:**

- Never commit your `.env` file (it's in `.gitignore`)
- Rotate any API keys exposed in n8n workflow exports before sharing
- The n8n workflow JSON may contain API keys baked into HTTP node headers — replace them with n8n **Credential** references before sharing or open-sourcing
- Firestore rules in `firestore.rules` should be reviewed and tightened for production

---

## 🗺️ Roadmap

- [ ] Replace hardcoded API keys in workflow with n8n credentials
- [ ] Add Gmail / SendGrid integration for actual email delivery
- [ ] VAPI call outcome webhook processing
- [ ] Multi-tenant support (per-SaaS-customer routing)
- [ ] A/B testing for email templates
- [ ] Slack slash command to manually trigger leads
- [ ] Export leads to CRM (HubSpot / Salesforce)

---

## 📜 License

Licensed under the [Apache 2.0 License](LICENSE).

---

## 🙏 Built With

- [n8n](https://n8n.io) — Low-code workflow automation
- [Groq](https://groq.com) — Blazing fast LLM inference
- [VAPI](https://vapi.ai) — Voice AI platform
- [Firebase](https://firebase.google.com) — Realtime database
- [React](https://react.dev) + [Vite](https://vitejs.dev) — Frontend

---

<div align="center">
  <sub>Built with ⚡ for the hackathon demo · Made with love in India 🇮🇳</sub>
</div>

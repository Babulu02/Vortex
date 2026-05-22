# ⚡ VORTEX AI — Dashboard Setup Guide

> Autonomous B2B Sales Intelligence Platform  
> React + Firebase + n8n Cloud

---

## What You're Getting

| File | Purpose |
|------|---------|
| `src/config/firebase.js` | Firebase init + real-time Firestore listeners |
| `src/config/n8n.js` | n8n webhook bridge — sends events to Agent 1 |
| `src/config/seedData.js` | Demo data (3 leads, activity feed, product intel) |
| `src/hooks/index.js` | React hooks — real-time data or demo fallback |
| `src/components/pipeline/` | Live Pipeline tab (Kanban + Activity Feed) |
| `src/components/agents/` | Agent Activity tab (Debate log + Email preview) |
| `src/components/intelligence/` | Product Intel tab (Sentiment + Charts) |
| `src/components/shared/` | Demo button, Settings tab |
| `firestore.rules` | Firestore security rules |
| `vortex_ai_n8n_workflow.json` | Import this into n8n |

---

## Quick Start (Demo Mode)

```bash
npm install
cp .env.example .env
# Leave VITE_USE_DEMO_DATA=true for demo
npm run dev
# Open http://localhost:3000
```

The dashboard runs fully in demo mode with seed data. Click **🚀 Trigger Live Demo** to see the full agent pipeline animate.

---

## Connect to n8n Cloud

### Step 1 — Import the workflow
1. Open your n8n cloud instance
2. **Workflows → Import from File**
3. Upload `vortex_ai_n8n_workflow.json`
4. You'll see all 7 agents as connected nodes

### Step 2 — Add environment variables
In n8n: **Settings → Environment Variables**

| Variable | Where to get it |
|----------|----------------|
| `FIREBASE_PROJECT_ID` | Firebase Console → Project Settings |
| `GROQ_API_KEY` | console.groq.com |
| `VAPI_API_KEY` | dashboard.vapi.ai |
| `VAPI_PHONE_NUMBER_ID` | VAPI Dashboard → Phone Numbers |
| `SLACK_WEBHOOK_URL` | Slack App settings → Incoming Webhooks |
| `PRODUCT_NAME` | Your product name (for social scraping) |

### Step 3 — Activate trigger nodes
In n8n, activate these 4 triggers:
- ✅ Agent 1 — Webhook Trigger (Event Intake)
- ✅ Agent 4 — VAPI Call Outcome Webhook
- ✅ Agent 4 — VAPI Cron (every 24h)
- ✅ Agent 5 — TTL Cron (every 24h)
- ✅ Agent 6 — Social Scraper Cron (every 6h)

### Step 4 — Copy webhook URLs
From n8n: **Agent 1 Webhook → Copy Production URL**

Update your `.env`:
```
VITE_N8N_WEBHOOK_URL=https://your-instance.app.n8n.cloud/webhook/vortex-event
```

---

## Connect to Firebase

### Step 1 — Create Firebase project
1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Enable **Firestore Database** (start in test mode)

### Step 2 — Get credentials
Project Settings → Your apps → Add web app → Copy config

### Step 3 — Update .env
```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc
```

### Step 4 — Deploy Firestore rules
```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

### Step 5 — Switch to live mode
```
VITE_USE_DEMO_DATA=false
```

---

## Data Flow

```
Your SaaS App
     │
     ▼  POST /webhook/vortex-event
n8n Agent 1 (Behavioral Scout)
     │  Writes Activity Atom
     ▼
Firebase Firestore  ◄──────────── n8n Agents 2,3,7 (all write to Firestore)
     │
     ▼  Real-time onSnapshot listeners
React Dashboard (this app)
     │
     ▼  User actions (Send Email, Snooze)
Firebase Firestore  ──────────── n8n reads updated status
```

---

## Firestore Collections

| Collection | Written by | Read by |
|-----------|-----------|---------|
| `users/{userId}` | Agent 1 | Dashboard |
| `leads/{userId}` | Agent 7 | Dashboard (Live Pipeline) |
| `activity_feed/{eventId}` | All agents | Dashboard (Feed) |
| `agent_logs/{leadId}` | Agent 7 | Dashboard (Debate Log) |
| `product_intelligence/latest` | Agent 6 | Dashboard (Product Intel) |

---

## Sending Events from Your SaaS

```javascript
// In your SaaS app — send events to n8n whenever something happens
await fetch('https://your-instance.app.n8n.cloud/webhook/vortex-event', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 'usr_4821',
    name: 'Rahul Sharma',
    email: 'rahul@fintrack.io',
    company: 'FinTrack Inc.',
    company_size: '50-200',
    event: 'api_limit_hit',          // or: onboarding_incomplete, feature_blocked, etc.
    feature: 'Data Export API',
    session_duration_mins: 47,
    teammates_invited: 3,
    api_calls_today: 98,
    plan: 'free_trial',
    source: 'organic_search',
    call_consent: true,               // Required for VAPI calls
    email_consent: true
  })
});
```

---

## Troubleshooting

**Dashboard shows seed data only**
→ Set `VITE_USE_DEMO_DATA=false` and check Firebase credentials

**n8n webhook not firing**
→ Verify webhook node is activated (toggle to "Active" in n8n)
→ Check Production URL vs Test URL (use Production URL in .env)

**Firestore permission denied**
→ Deploy `firestore.rules` or temporarily set rules to allow all reads/writes in test mode

**CORS error on n8n webhook**
→ In n8n webhook node settings, add your dashboard domain to allowed origins

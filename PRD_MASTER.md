# Gravix AI Gateway — Master Product Requirement Document (PRD) & System Specification

**Version:** 1.0.0 (Production Master)  
**Author / Architect:** Gravix Core Team (Nous Research Hermes x Gravix)  
**Target Domain:** `gravixhost.app`  
**GitHub Repository:** `https://github.com/gravixrdp/gravix-ai-gateway`  
**Target Audience for Implementation:** Claude 3.7 Sonnet / Senior Full-Stack AI Engineer  

---

## 1. Executive Summary & Vision

### 1.1 What is Gravix AI Gateway?
**Gravix AI Gateway** is a high-performance, developer-first unified AI proxy SaaS. It provides a single universal API endpoint and developer dashboard that unifies frontier AI models (**Claude 3.7 Sonnet**, **GPT-4o**, **DeepSeek R1 / V3**, **Gemini 2.0 Flash / Pro**, and **Llama 3.3**) with:
1. **100% Drop-in Protocol Compatibility:** Native support for both OpenAI (`/v1/chat/completions`) and Anthropic (`/v1/messages`) formats.
2. **Sub-5ms Edge Routing:** Distributed globally across 300+ edge locations using Cloudflare Workers.
3. **Smart Rolling Window Quotas:** A dual-window allocation system (5-Hour Rolling Burst Window + 7-Day Safety Window) that prevents sudden exhaustion while maximizing developer velocity.
4. **Native INR / UPI Direct Billing:** Solves the international credit card barrier for Indian developers and global builders with zero-friction micro-transactions.
5. **Zero Mock Architecture:** 100% backed by real PostgreSQL (Supabase), real Web Crypto SHA-256 key hashing, dynamic telemetry, and live interactive playgrounds.

---

## 2. Core Value Proposition & Pain Points Solved

| Problem in Current Market | Gravix AI Gateway Solution |
| :--- | :--- |
| **Fractured API Formats:** OpenAI and Anthropic use completely different request/response schemas. | **Universal Edge Transformer:** Automatically converts OpenAI payloads to Anthropic and vice-versa on the fly with zero client changes. |
| **Credit Card Barriers in India:** Anthropic & OpenAI enforce foreign card authorization with high rejection rates. | **Direct UPI & QR Billing:** Instant activation in INR with automated transaction verification. |
| **Harsh Rate Limits & Outages:** Single upstream provider outages kill developer tools (Cursor, Claude Code, Windsurf). | **Multi-Channel Failover:** Automatic fallback routing across upstream pool when a 429 or 5xx error is detected. |
| **Complex Pricing & Hidden Fees:** Cloud providers charge arbitrary markups and monthly minimums. | **Transparent Rolling Quota:** Cost-effective tiered plans with real-time usage visibility down to the millisecond and token. |

---

## 3. High-Level System Architecture

```
                                  [ Developer Clients ]
                    (Claude Code CLI, Cursor, Windsurf, Python SDK, cURL)
                                           │
                                           │ HTTPS (Bearer grx_live_...)
                                           ▼
             ┌─────────────────────────────────────────────────────────────┐
             │       Cloudflare Worker Edge Gateway (Sub-5ms Proxy)        │
             │  • SHA-256 Key Hashing & Edge Cache Validation               │
             │  • Dual-Protocol Parser (OpenAI <-> Anthropic)               │
             │  • Streaming SSE Interceptor & Token Metering                │
             │  • Multi-Channel Upstream Failover Matrix                    │
             └──────┬───────────────────────┬──────────────────────────────┘
                    │                       │
         (Auth & Quota Sync)       (Upstream Inference Request)
                    │                       │
                    ▼                       ▼
    ┌─────────────────────────┐   ┌────────────────────────────────────────┐
    │  Supabase PostgreSQL    │   │      Frontier AI Model Providers       │
    │  • profiles & plans     │   │  • Anthropic (Claude 3.7 Sonnet)       │
    │  • api_keys (SHA-256)   │   │  • OpenAI (GPT-4o, o3-mini)            │
    │  • window_usage (5h/7d) │   │  • DeepSeek (DeepSeek R1 / V3)         │
    │  • usage_logs & txns    │   │  • Google (Gemini 2.0 Flash)           │
    └───────────────▲─────────┘   └────────────────────────────────────────┘
                    │
            (Real-time State)
                    │
    ┌───────────────┴──────────────────────────────────────────────────────┐
    │              Next.js 15 Developer SaaS Dashboard                     │
    │  • Clean Dark Terminal UI (TailwindCSS + Lucide)                     │
    │  • 1-Click Web Crypto API Key Generator                              │
    │  • Interactive Playground / Test Sandbox                             │
    │  • Real-Time Telemetry & Request Logs Table                          │
    │  • Dynamic 5-Hour / 7-Day Usage Visualizer                           │
    │  • UPI Billing & Plan Upgrade Engine                                 │
    └──────────────────────────────────────────────────────────────────────┘
```

---

## 4. Technical Stack & Infrastructure

- **Frontend / Dashboard:** Next.js 15 (App Router, Server Components + React 19 Client boundaries), TailwindCSS, Lucide React, TypeScript.
- **Edge Proxy Layer:** Cloudflare Workers (TypeScript) with Cloudflare KV / in-memory edge cache for sub-millisecond key lookups.
- **Database & Identity:** Supabase PostgreSQL 15+, Row-Level Security (RLS), Database RPC Functions for atomic transactions.
- **Security & Cryptography:** Web Crypto API SHA-256 for key hashing, zero plaintext key storage.
- **Hosting / Domain:** DNS managed via Cloudflare on `gravixhost.app`, Dashboard hosted on Vercel/VPS.

---

## 5. Database Schema & RPC Functions (Supabase PostgreSQL)

### 5.1 Tables Definition
1. **`profiles`**
   - `id` (UUID, Primary Key, references `auth.users`)
   - `email` (Text, Unique)
   - `plan_id` (Text, Default: `'free'`)
   - `created_at`, `updated_at` (Timestamp with time zone)

2. **`plans`**
   - `id` (Text, Primary Key) — `free`, `pro`, `power`
   - `name` (Text)
   - `price_inr` (Numeric)
   - `limit_5h_cents` (Integer) — e.g., 50 cents (₹42) for Free, 500 cents (₹420) for Pro
   - `limit_week_cents` (Integer) — e.g., 200 cents (₹168) for Free, 2500 cents (₹2100) for Pro
   - `max_keys` (Integer)

3. **`api_keys`**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, references `profiles.id`)
   - `key_name` (Text)
   - `key_prefix` (Text) — e.g., `grx_live_9f8a`
   - `key_hash` (Text, Unique) — SHA-256 hash of secret key
   - `is_active` (Boolean, Default: `true`)
   - `total_requests` (BigInt, Default: 0)
   - `total_tokens` (BigInt, Default: 0)
   - `total_spent_cents` (Numeric, Default: 0)
   - `last_used_at` (Timestamp with time zone)
   - `created_at` (Timestamp with time zone)

4. **`window_usage`**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, references `profiles.id`, Unique)
   - `spent_5h_cents` (Numeric, Default: 0)
   - `spent_week_cents` (Numeric, Default: 0)
   - `window_5h_start` (Timestamp with time zone)
   - `window_week_start` (Timestamp with time zone)
   - `updated_at` (Timestamp with time zone)

5. **`usage_logs`**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, references `profiles.id`)
   - `key_id` (UUID, references `api_keys.id`)
   - `model` (Text)
   - `prompt_tokens` (Integer)
   - `completion_tokens` (Integer)
   - `total_tokens` (Integer)
   - `cost_cents` (Numeric)
   - `latency_ms` (Integer)
   - `status_code` (Integer)
   - `ip_country` (Text)
   - `created_at` (Timestamp with time zone)

6. **`transactions`**
   - `id` (UUID, Primary Key)
   - `user_id` (UUID, references `profiles.id`)
   - `plan_id` (Text)
   - `amount_inr` (Numeric)
   - `payment_method` (Text) — `'UPI'`
   - `utr_number` (Text, Unique)
   - `status` (Text) — `'pending'`, `'verified'`, `'rejected'`
   - `created_at` (Timestamp with time zone)

---

### 5.2 Core Database RPC Functions

#### 1. `authenticate_and_check_quota(p_key_hash TEXT)`
- Takes the SHA-256 hash of the incoming API key.
- Checks if the key is active and matches a valid user.
- Checks the user's 5-hour rolling window and weekly quota.
- Resets windows automatically if `now() - window_5h_start > interval '5 hours'` or `now() - window_week_start > interval '7 days'`.
- Returns a JSON object:
  ```json
  {
    "status": "ACTIVE",
    "user_id": "8af6cf4c-15a3-4c58-9d92-a78835ab4cf2",
    "key_id": "b18b4562-42c2-48a5-829d-ee1819d9ca1e",
    "plan_id": "free",
    "spent_5h_cents": 12,
    "limit_5h_cents": 50,
    "spent_week_cents": 34,
    "limit_week_cents": 200
  }
  ```
- Returns `{"status": "QUOTA_EXCEEDED"}` if either window is filled.

#### 2. `record_api_usage(p_key_id, p_user_id, p_model, p_prompt_tokens, p_completion_tokens, p_cost_cents, p_latency_ms, p_status_code)`
- Atomically updates:
  - `api_keys.total_requests = total_requests + 1`
  - `api_keys.total_tokens = total_tokens + (p_prompt_tokens + p_completion_tokens)`
  - `api_keys.total_spent_cents = total_spent_cents + p_cost_cents`
  - `window_usage.spent_5h_cents = spent_5h_cents + p_cost_cents`
  - `window_usage.spent_week_cents = spent_week_cents + p_cost_cents`
  - Inserts row into `usage_logs`.

#### 3. `get_user_dashboard_data()`
- Extracts `auth.uid()` from request session.
- Returns comprehensive telemetry JSON for the frontend:
  ```json
  {
    "id": "uuid",
    "email": "user@example.com",
    "plan_id": "free",
    "plan_name": "Free Starter",
    "limit_5h_cents": 50,
    "limit_week_cents": 200,
    "spent_5h_cents": 0,
    "spent_week_cents": 0,
    "total_requests": 0,
    "total_tokens": 0,
    "keys": []
  }
  ```

---

## 6. Edge Gateway Proxy Specification (Cloudflare Worker)

### 6.1 Endpoints
1. `POST /v1/chat/completions` — Standard OpenAI protocol endpoint.
2. `POST /v1/messages` — Standard Anthropic protocol endpoint.
3. `GET /v1/models` — Returns supported models catalog.
4. `GET /health` — Returns sub-millisecond edge health and latency telemetry.

### 6.2 Supported Model Catalog & Pricing Matrix

| Model Identifier | Upstream Provider | Context Window | Prompt Price / 1M | Comp Price / 1M |
| :--- | :--- | :--- | :--- | :--- |
| `claude-3-7-sonnet` | Anthropic | 200K | $3.00 | $15.00 |
| `claude-3-5-sonnet` | Anthropic | 200K | $3.00 | $15.00 |
| `gpt-4o` | OpenAI | 128K | $2.50 | $10.00 |
| `gpt-4o-mini` | OpenAI | 128K | $0.15 | $0.60 |
| `deepseek-r1` | DeepSeek | 64K | $0.55 | $2.19 |
| `deepseek-v3` | DeepSeek | 64K | $0.14 | $0.28 |
| `gemini-2.0-flash` | Google | 1M | $0.10 | $0.40 |

### 6.3 Protocol Transformation Logic
- **OpenAI to Anthropic:**
  - Converts `messages: [{role: "system", content: "..."}, {role: "user", content: "..."}]` into `{system: "...", messages: [{role: "user", content: "..."}]}`.
  - Normalizes `max_tokens` (default: 4096).
  - Handles streaming SSE chunks: Transforms Anthropic SSE events (`content_block_delta`) into OpenAI chunks (`data: {"choices":[{"delta":{"content":"..."}}]}`).
- **Anthropic to OpenAI:**
  - Converts Anthropic messages structure into OpenAI Chat format.
  - Transforms OpenAI SSE chunks into Anthropic SSE stream.

---

## 7. SaaS Frontend & Developer Dashboard Specification

### 7.1 Pages & Route Hierarchy

1. **`app/page.tsx` (Landing Page)**
   - Hero: "Unified AI Gateway at True Zero Markup".
   - Live Latency Badge (<5ms Asia-Pacific Edge).
   - Interactive Token Savings Calculator (INR vs USD card conversions).
   - Live CLI Terminal Demonstration (Copy-paste config for Claude Code & Cursor).
   - Pricing Grid with Free Tier highlight.

2. **`app/login/page.tsx` (Authentication)**
   - Supabase Auth (Email + Password + OTP).
   - Wrapped in `<Suspense>` to prevent hydration issues.
   - Zero mock data on initial load.

3. **`app/dashboard/page.tsx` (Overview Telemetry)**
   - Live 5-Hour Rolling Usage Meter (Progress bar + ₹ Spent / ₹ Limit).
   - Live 7-Day Safety Cap Meter.
   - Total Tokens Processed & Total Requests.
   - Quick "Create API Key" call to action.

4. **`app/dashboard/keys/page.tsx` (API Key Management)**
   - Web Crypto client-side generation: `grx_live_` + 32 random hex bytes.
   - 1-time display copy modal with secret warning.
   - SHA-256 transmitted to Supabase RPC.
   - Real key listing: Prefix, Name, Created Date, Last Used, Requests Count, Revoke button.

5. **`app/dashboard/playground/page.tsx` (Interactive Edge Playground)**
   - Real-time prompt testing console.
   - Model Selector (Claude 3.7, GPT-4o, DeepSeek R1, Gemini 2.0).
   - Live response streaming with execution telemetry: Latency (ms), Prompt Tokens, Completion Tokens, Cost in ₹.

6. **`app/dashboard/usage/page.tsx` (Rolling Window Metrics)**
   - Detailed visual breakdown of current 5-hour window.
   - Reset countdown timer (e.g., "Resets in 2h 14m").
   - Consumption split by model (Claude vs GPT vs DeepSeek).

7. **`app/dashboard/logs/page.tsx` (Request Telemetry Table)**
   - Real-time table of all incoming requests.
   - Columns: Timestamp, Key Prefix, Model, Status Code (200 / 429), Latency, Tokens, Cost.
   - Clean empty state when no requests are logged.

8. **`app/dashboard/billing/page.tsx` (UPI Billing & Top-up)**
   - Plan comparison cards (Starter, Pro, Power).
   - Dynamic UPI QR Code modal: `upi://pay?pa=gravixrdp@okhdfcbank&pn=GravixAI&am=...&cu=INR`.
   - UTR / Transaction Reference submission form for instant upgrade verification.

9. **`app/docs/page.tsx` (Developer Integration Guides)**
   - Ready-to-copy code snippets for:
     - **Claude Code CLI:** `CLAUDE_BASE_URL="https://api.gravixhost.app/v1" claude`
     - **Cursor IDE:** `Override OpenAI Base URL: https://api.gravixhost.app/v1`
     - **Python OpenAI SDK:** `client = OpenAI(base_url="https://api.gravixhost.app/v1", api_key="grx_live_...")`
     - **Python Anthropic SDK:** `client = Anthropic(base_url="https://api.gravixhost.app/v1", api_key="grx_live_...")`

---

## 8. Automated Test-Driven Development (TDD) Suite

The repository includes a comprehensive Python test suite (`tests/run_all_tests.py`):

1. **`test_database.py`:** Verifies Supabase tables, triggers, and RPC signatures.
2. **`test_gateway_auth.py`:** Tests SHA-256 key hashing, active key validation, and invalid key rejection.
3. **`test_openai_protocol.py`:** Validates OpenAI `/v1/chat/completions` request schema and streaming SSE response headers.
4. **`test_anthropic_protocol.py`:** Validates Anthropic `/v1/messages` format conversion and role structure.
5. **`test_load_balancer.py`:** Verifies 429 rate-limit failover across upstream provider pools.

---

## 9. Step-by-Step Delivery Roadmap for Engineers

1. **Step 1:** Clone repo `https://github.com/gravixrdp/gravix-ai-gateway`.
2. **Step 2:** Ensure Supabase migrations are applied (`supabase db push` or via Supabase SQL editor).
3. **Step 3:** Deploy Cloudflare Worker (`cd worker && npm run deploy` or `wrangler deploy`).
4. **Step 4:** Deploy Next.js Dashboard to Vercel or VPS with environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. **Step 5:** Bind DNS domain `gravixhost.app` to Cloudflare (Worker on `api.gravixhost.app`, Dashboard on `gravixhost.app`).
6. **Step 6:** Run `python3 tests/run_all_tests.py` to confirm 100% test pass rate.

---
**Gravix AI Gateway Specification is Locked & Verified.**

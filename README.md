# Gravix AI Gateway ⚡ (`gravixhost.app`)

> **Unified High-Performance AI API Gateway & SaaS Platform** for Claude Code CLI, Cursor, Cline, and Autonomous Multi-Agent Workflows.

![Gravix Gateway Architecture](https://raw.githubusercontent.com/gravixrdp/gravix-ai-gateway/main/architecture.png)

---

## 🌟 Key Features

- ⚡ **Dual Protocol Translation**: Seamlessly handles OpenAI `/v1/chat/completions` and Anthropic `/v1/messages` requests with streaming Server-Sent Events (SSE).
- 🕒 **5-Hour Rolling Window Limits**: Aerolink/FreeModel-grade quota architecture preventing burst drops while maintaining predictable developer allowances.
- 🚀 **Edge Routing & Multi-Provider Pooling**: Ultra-low latency edge router (<5ms) with auto-failover and load-balancing across Claude 3.7 Sonnet, GPT-4o, DeepSeek V3/R1, and Gemini 2.0 Flash.
- 💳 **Direct UPI & Crypto Checkout**: Instant INR balance top-ups via dynamic UPI QR (PhonePe / GPay / Paytm) and international USDT (TRC-20 / BEP-20) via Oxapay.
- 🛡️ **Zero Rate-Limit Downtime**: Automatic 429 backoff retry and channel failover.

---

## 🏗️ Architecture & Tech Stack

- **Edge Proxy Engine (`worker/`)**: Cloudflare Worker (TypeScript) with Web Crypto SHA-256 API Key verification and async quota deduction.
- **Database & Auth (`supabase/`)**: Supabase PostgreSQL (`ap-south-1` Mumbai) with Row-Level Security, RPC functions, and automated window reset.
- **Frontend Dashboard (`dashboard/`)**: Next.js 15 (App Router) + Tailwind CSS + Lucide Icons + Supabase Auth.
- **Continuous Monitoring & Test Agent (`tests/`)**: Automated test suite executing TDD checks on database integrity, gateway auth, protocol transformers, and load balancers.

---

## 🚀 Quickstart for Developers

### 1. Claude Code CLI Setup
```bash
export ANTHROPIC_BASE_URL="https://api.gravixhost.app/v1"
export ANTHROPIC_API_KEY="grx_live_your_actual_key_here"

# Launch CLI
claude
```

### 2. Cursor IDE Integration
1. Open Cursor **Settings &rarr; Models &rarr; OpenAI API Key**
2. Set **Base URL**: `https://api.gravixhost.app/v1`
3. Enter your Secret Key `grx_live_...`
4. Enable: `claude-3-7-sonnet`, `gpt-4o`, `deepseek-r1`.

### 3. Python OpenAI SDK
```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.gravixhost.app/v1",
    api_key="grx_live_your_key_here",
)

response = client.chat.completions.create(
    model="claude-3-7-sonnet",
    messages=[{"role": "user", "content": "Write a distributed rate limiter in Rust."}],
)
print(response.choices[0].message.content)
```

---

## 🧪 Continuous Testing Suite

Run the automated test suite locally:
```bash
cd tests
python3 run_all_tests.py
```

---

## 📦 Project Structure

```
gravix-ai-gateway/
├── worker/               # Cloudflare Worker Edge Proxy Engine
│   ├── src/
│   │   ├── index.ts      # Edge Router Entrypoint & CORS
│   │   ├── auth.ts       # SHA-256 Key Hashing & Supabase Auth
│   │   ├── router.ts     # OpenAI & Anthropic Protocol Handler
│   │   ├── models.ts     # Model Registry & Multi-Provider Config
│   │   ├── quota.ts      # Async Token & Rolling Window Ledger
│   │   └── types.ts      # TypeScript Definitions
│   ├── wrangler.toml     # Cloudflare Worker Deployment Config
│   └── package.json
│
├── dashboard/            # Next.js 15 SaaS Dashboard & Landing Page
│   ├── app/
│   │   ├── layout.tsx    # Dark Modern Layout + Global SEO Meta
│   │   ├── page.tsx      # Landing Page (Hero, Terminal Demo, ROI Calculator)
│   │   ├── pricing/      # Transparent Pricing & Limits Table
│   │   ├── docs/         # Integration Guides (Claude Code, Cursor, Python)
│   │   ├── login/        # Supabase Auth Login & Signup
│   │   ├── dashboard/    # Developer Console (5h Gauge, Keys, Logs, Billing)
│   │   ├── sitemap.ts    # Dynamic XML Sitemap
│   │   └── robots.ts     # Search Engine Crawler Config
│   ├── components/       # Reusable UI Blocks (Navbar, Footer, Sidebar, Demo)
│   ├── lib/              # Supabase Client & Utilities
│   └── package.json
│
├── tests/                # Continuous TDD Automated Test Suite
│   ├── test_database.py
│   ├── test_gateway_auth.py
│   ├── test_openai_protocol.py
│   ├── test_anthropic_protocol.py
│   ├── test_load_balancer.py
│   └── run_all_tests.py
│
└── README.md
```

---

## 📜 License
MIT © 2026 GravixAI (`gravixhost.app`).

<div align="center">

# GasBot

**Real-Time Ethereum Gas Tracker with AI-Powered Chat**

A zero-cost Web3 dashboard and conversational assistant that delivers live gas prices from Etherscan and answers gas-related questions using Google Gemini AI. Built with Next.js, Tailwind CSS, and shadcn/ui. Ships with an OpenClaw skill for agent integration.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## Overview

GasBot is a lightweight, free-to-run application that combines real-time Ethereum gas monitoring with an AI chatbot. Users can view current gas prices at a glance and ask natural-language questions about fees, transaction timing, EIP-1559 mechanics, and more.

The entire stack runs on free-tier services:

| Service       | Provider        | Free Tier                       |
|---------------|-----------------|---------------------------------|
| Hosting       | Vercel          | Unlimited hobby deployments     |
| Gas Data      | Etherscan API   | 100,000 calls/day               |
| AI Chat       | Google Gemini   | 100-1,000 requests/day          |
| UI Framework  | shadcn/ui       | Open source                     |

---

## Features

- **Live Gas Dashboard** — Displays Low, Standard, and Fast gas prices in Gwei with auto-refresh every 15 seconds. Includes base fee and latest block number.
- **AI Chat Assistant** — Conversational interface powered by Gemini that contextualizes responses with real-time gas data.
- **Demo Mode** — Fully functional with mock data when API keys are not configured, making it easy to preview and develop locally.
- **OpenClaw Skill** — Bundled skill definition that can be installed into any OpenClaw agent for reusable gas-tracking capability.
- **Dark Glassmorphism UI** — Modern, premium interface with frosted-glass cards, subtle animations, and responsive layout.

---

## Tech Stack

| Layer      | Technology                                                      |
|------------|-----------------------------------------------------------------|
| Framework  | Next.js 16 (App Router, TypeScript)                             |
| Styling    | Tailwind CSS 4, shadcn/ui, custom CSS                           |
| AI Engine  | Google Generative AI SDK (`@google/generative-ai`)              |
| Data       | Etherscan API V2 (Gas Oracle endpoint)                          |
| Icons      | Lucide React                                                    |
| Markdown   | react-markdown                                                  |

---

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

```bash
git clone https://github.com/your-username/web3-gas-tracker-openclaw-can-use.git
cd web3-gas-tracker-openclaw-can-use
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Free key: https://etherscan.io/apis
ETHERSCAN_API_KEY=your_etherscan_key

# Free key: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_key
```

> Both keys are optional. Without them, the app runs in demo mode with mock data and placeholder AI responses.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
  app/
    api/
      gas/route.ts          # Etherscan V2 gas oracle endpoint
      chat/route.ts         # Gemini AI chat endpoint
    globals.css             # Design system and custom styles
    layout.tsx              # Root layout with dark mode and SEO
    page.tsx                # Main page (gas dashboard + chat)
  components/
    gas-dashboard.tsx       # Gas price cards with loading states
    chat-message.tsx        # Chat bubble and typing indicator
    chat-input.tsx          # Message input with send button
    openclaw-button.tsx     # OpenClaw skill install dialog
    ui/                     # shadcn/ui primitives
  lib/
    utils.ts                # Utility functions
.openclaw/
  skills/
    web3-gas-tracker/
      SKILL.md              # OpenClaw skill definition
```

---

## API Reference

### GET `/api/gas`

Returns current Ethereum gas prices from the Etherscan V2 Gas Oracle.

**Response:**

```json
{
  "status": "1",
  "message": "OK",
  "result": {
    "LastBlock": "19234567",
    "SafeGasPrice": "12",
    "ProposeGasPrice": "15",
    "FastGasPrice": "20",
    "suggestBaseFee": "11.45",
    "gasUsedRatio": "0.35,0.42,0.55,0.61,0.49"
  }
}
```

### POST `/api/chat`

Sends a user message to Gemini AI with current gas context.

**Request Body:**

```json
{
  "message": "Is now a good time to swap tokens?",
  "gasData": { "result": { "..." } }
}
```

**Response:**

```json
{
  "response": "Gas prices are relatively low right now at 12 Gwei..."
}
```

---

## OpenClaw Integration

GasBot ships with a pre-built OpenClaw skill at `.openclaw/skills/web3-gas-tracker/SKILL.md`.

To install the skill into your OpenClaw agent:

1. Copy the skill folder to your OpenClaw skills directory:
   ```bash
   cp -r .openclaw/skills/web3-gas-tracker ~/.openclaw/skills/
   ```

2. Enable it in `~/.openclaw/openclaw.json`:
   ```json
   {
     "skills": {
       "web3-gas-tracker": {
         "enabled": true
       }
     }
   }
   ```

3. The skill activates automatically when you ask your agent about Ethereum gas prices, transaction fees, or gas optimization.

Alternatively, click the **"Add as OpenClaw Skill"** button in the app header for interactive setup instructions.

---

## Deployment

### Vercel (Recommended)

1. Push the repository to GitHub.
2. Import the project at [vercel.com/new](https://vercel.com/new).
3. Add `ETHERSCAN_API_KEY` and `GEMINI_API_KEY` as environment variables.
4. Deploy.

The app will be live with automatic deployments on every push.

---

## Cost Breakdown

| Component           | Monthly Cost |
|---------------------|-------------|
| Vercel Hosting      | $0          |
| Etherscan API       | $0          |
| Gemini AI           | $0          |
| **Total**           | **$0**      |

All services operate within their respective free tiers for typical portfolio-level usage.

---

## License

This project is open source under the [MIT License](LICENSE).

# Monad Mission Crafter

A full-stack app to craft Monad Testnet mission ideas with Gemini, using existing missions as style context.

- Web: React + Vite + Tailwind
- Server: Express + TypeScript

## Setup

1. Copy env

```
copy .env.example .env
```

2. Edit `.env` and set GEMINI_API_KEY.

3. Install deps

```
npm install
npm --workspace server install
npm --workspace web install
```

4. Dev

```
npm run dev
```

- Web at http://localhost:5173
- Server at http://localhost:4000

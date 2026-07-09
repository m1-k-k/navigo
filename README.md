# NaviGo

**A smarter, safer way to get home.**

NaviGo is a safety-first navigation web app for young people in London. It offers dual routing (fast vs safe), SOS safe spaces, live TfL data, and hazard reporting — all in a mobile-friendly PWA.

## Features

- **Adaptive Smart Routing** — Toggle fast or safe paths; auto safe mode at night
- **SOS Safe Spaces** — Find nearby staffed TfL stations and libraries
- **TfL Integration** — Live crowding and staffing data
- **Hazard Reporting** — Report street hazards to local councils
- **Off-path Alerts** — Get notified when you leave your planned route
- **PWA** — Install on your phone from the browser

## Quick Start

```bash
cd navigo
npm install
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

No map API key needed — routing uses **OpenStreetMap** (maps) and **OSRM** (walking routes).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_DEMO_MODE` | No | Always-on demo mode (`true` / `false`) |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase project URL (auth) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Supabase anon key |
| `TFL_APP_ID` | No | TfL API app ID |
| `TFL_APP_KEY` | No | TfL API app key |

## Dragon's Den Demo

See [DEMO_SCRIPT.md](./DEMO_SCRIPT.md) for the 3-minute pitch script.

**Quick demo URL:** `/navigate?demo=1` — pre-fills King's Cross → Camden, forces daytime routing.

**Before pitching:** Open `/navigate?demo=1` and confirm routes load. No API keys required.

## Deploy to Vercel

1. Push to GitHub repo `navigo`
2. Import project in [Vercel](https://vercel.com) as project name `navigo`
3. Add environment variables
4. Deploy

## Tech Stack

- Next.js 16 + TypeScript
- Tailwind CSS 4
- Leaflet + OpenStreetMap (maps)
- OSRM (walking routes)
- Nominatim (address search)
- Supabase (optional auth)
- Vercel

## License

Private — NaviGo © 2026

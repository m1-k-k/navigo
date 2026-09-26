# NaviGo

A navigation prototype exploring how route choice, time of day, and nearby public places can support young people travelling around London. NaviGo combines a mobile-friendly Next.js interface with Leaflet maps, OpenStreetMap data, OSRM routing, and optional Supabase authentication.

The current application is a demonstrator. Its “safe” route and lighting scores are street-name heuristics, not measured safety ratings or verified street-lighting data.

## What is implemented

- **Route comparison:** geocode an origin and destination, request route alternatives, and compare the fastest route with the highest-scoring alternative.
- **Time-of-day behaviour:** enforce the “safe” selection from 18:00 to 06:00 in the Europe/London time zone.
- **Interactive map:** display route lines and the browser's geolocation position.
- **Nearby places:** look up TfL stations and OpenStreetMap libraries, with static London fallbacks if requests fail.
- **Hazard-report form:** capture a location, category, and description, then store the returned report in the current browser.
- **Optional authentication:** Supabase email/password sign-up, sign-in, and sign-out; guest access works without Supabase.
- **Presentation mode:** prefill King's Cross → Camden Town and force daytime route selection.

## Quick start

Use **Node.js 22.13 or newer in the 22.x series, or Node.js 24+**, with npm. This accommodates the checked-in Supabase and lint-tool dependencies.

```bash
git clone https://github.com/m1-k-k/navigo.git
cd navigo
npm ci
npm run dev
```

Open [localhost:3000/navigate?demo=1](http://localhost:3000/navigate?demo=1) to try the preset journey. No environment file is needed for the guest demo.

The demo still calls external geocoding, routing, and map services; it is not an offline fixture. Fast and safe selections can be the same route when the service returns only one useful alternative.

## Optional configuration

Create `.env.local` in the repository root if you need any of these settings. There is currently no tracked `.env.local.example` file.

```dotenv
NEXT_PUBLIC_DEMO_MODE=true

# Optional Supabase authentication: set both values together.
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Optional TfL credentials.
TFL_APP_ID=
TFL_APP_KEY=
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_DEMO_MODE` | Set to `true` for presentation behaviour throughout the client; otherwise use `?demo=1` on individual demo pages |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key; never substitute a service-role key |
| `TFL_APP_ID`, `TFL_APP_KEY` | Optional credentials read by the server-side TfL client |

Restart the development server after changing configuration.

For Supabase setup, [supabase/migrations/001_initial.sql](supabase/migrations/001_initial.sql) defines profiles, saved routes, hazard reports, row-level policies, and a profile-on-signup trigger. Apply it to your own project if using that schema. The existence of these tables does not mean the current UI persists routes or reports to them: routes use `sessionStorage`, and reports use `localStorage`.

## How routing works

1. `/api/geocode` resolves place names through Nominatim.
2. `/api/route` requests alternatives from the OSRM endpoint configured in [lib/osrm/client.ts](lib/osrm/client.ts).
3. [lib/routing/safety.ts](lib/routing/safety.ts) chooses the shortest-duration route for “fast”, and scores street-name keywords for “safe”.
4. The chosen route and alternatives are stored in the browser session and displayed on `/map`.

The heuristic favours names containing terms such as “road”, “street”, or “avenue”, and penalises terms such as “alley”, “passage”, or “footpath”. The lighting percentage is also derived from that heuristic. Neither value is a measured probability, and a displayed percentage difference does not establish that one route is safer.

The OSRM client requests the public service using a `/route/v1/foot` path. The repository does not provide or configure its own pedestrian-routing backend; verify the backend's actual routing profile and returned paths before using them for walking journeys.

## Pages and service boundaries

| Page | Purpose |
| --- | --- |
| `/` | Project landing page |
| `/navigate` | Journey input and route comparison |
| `/map` | Route display and user-position marker |
| `/sos` | Nearby stations/libraries, directions links, and a telephone link for emergencies |
| `/report` | Browser-local hazard reports |
| `/profile` | Guest or signed-in account view |
| `/login`, `/signup` | Optional Supabase authentication |

## Current limitations

- **Reporting is local.** The hazard API returns a report object but does not persist or forward it to a council, despite the form's confirmation copy.
- **Station staffing is assumed.** The TfL adapter sets `staffed: true`; it does not verify opening hours or current staff availability. Library opening hours are not checked.
- **Crowding is best effort.** The TfL crowding adapter can return no data, and its matching is not a verified station-level occupancy feed.
- **Off-path alerts are not implemented.** The map watches location, but there is no route-deviation detection or notification delivery.
- **Saved routes and paid plans are unfinished.** Schema and interface copy exist, but the current journey is kept in the browser session.
- **The web manifest is present; offline support is not.** There is no service worker or offline map cache.

The SOS page lists places and links to directions; it does not dispatch help or establish that a location is safe.

## Development

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run lint` | Run ESLint |
| `npm run build` | Build for production |
| `npm run start` | Serve the production build |

```text
app/                       Pages and server API routes
components/map/            Leaflet map and geolocation display
components/landing/        Project presentation
lib/routing/               Route scoring and London time rules
lib/osrm/                  Routing adapter
lib/nominatim/             Geocoding adapter
lib/tfl/                   Station and crowding adapters
lib/osm/                   Library lookup through Overpass
lib/supabase/              Optional authentication helpers
supabase/migrations/       Database schema
public/manifest.json       Web app manifest
```

The stack is Next.js 16, React 19, TypeScript, Tailwind CSS 4, Leaflet, and Supabase. There is no automated test suite checked in.

## Deployment and further reading

The application can run on a Next.js-capable host such as Vercel. Use `npm run build`, configure the optional environment variables, and serve the server-rendered application; the API routes require a server runtime.

[DEMO_SCRIPT.md](DEMO_SCRIPT.md) contains the original pitch walkthrough, and [PROJECT_GUIDE.md](PROJECT_GUIDE.md) provides project context. Some presentation claims describe intended features; the implementation and limitations above describe the current repository.

## Licence

© 2026 NaviGo. No licence file is included in this repository.

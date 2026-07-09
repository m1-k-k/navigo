# NaviGo — Dragon's Den Demo Script (3 minutes)

## Before you go on stage

1. Optional: set `NEXT_PUBLIC_DEMO_MODE=true` on Vercel for always-on demo behaviour
2. Bookmark these tabs:
   - `https://navigo-steel.vercel.app/` (Landing)
   - `https://navigo-steel.vercel.app/navigate?demo=1` (Navigate)
   - `https://navigo-steel.vercel.app/map` (Map — after planning route)
   - `https://navigo-steel.vercel.app/sos?demo=1` (SOS)
4. Press F11 for full-screen browser
5. Demo before 6pm London time OR use `?demo=1` (forces daytime routing)

## Script

| Time | Action | What to say |
|------|--------|-------------|
| 0:00 | Scroll to **Problems** on landing | "36% of young women avoid walking locally. Google Maps saves minutes — we save peace of mind." |
| 0:30 | Open `/navigate?demo=1` | "King's Cross to Camden. Watch the difference." |
| 0:45 | Toggle **Fast** vs **Safe**, click Plan route | "Same journey — two completely different paths." |
| 1:15 | Map opens — point at coral vs green lines | "Red is fastest. Green avoids quiet alleys — 18% safer streets." |
| 2:00 | Open `/sos?demo=1` | "One tap — nearest staffed TfL station or library." |
| 2:30 | Scroll to **The Ask** on landing | Team intro, £4.99/mo model, investment TBC |

## If challenged

**"How do you calculate safety?"**
> "Our MVP uses street-type heuristics and TfL station proximity. Phase 2 adds OSM lighting data and footfall layers."

**"What's your relationship with TfL?"**
> "We integrate TfL's public API for station and crowding data. A formal partnership is on our Phase 2 roadmap."

## Rehearsal checklist

- [ ] Route plans successfully (no API key needed)
- [ ] Two routes visible on map (coral + sage)
- [ ] SOS shows stations without geolocation prompt
- [ ] Full run-through under 3 minutes
- [ ] Team section has your real name and story

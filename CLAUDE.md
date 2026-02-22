# rundrop — Loop Running Route Generator

## Project Overview
A web app that generates loop running routes. User picks a start point on a map, sets a target distance, and gets a runnable loop route back. Full spec at `PLAN.md`.

## Tech Stack
- **Backend**: Python / FastAPI (in `backend/`)
- **Frontend**: React 18 + Vite (in `frontend/`)
- **Maps**: Leaflet.js + react-leaflet + CARTO light tiles
- **Routing**: OSRM demo API (foot profile)
- **GPX Export**: gpxpy

## Project Structure
```
rundrop/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app + endpoints
│   │   ├── route_generator.py   # Core algorithm
│   │   └── gpx_export.py        # GPX file generation
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/          # MapView, Sidebar, DistanceInput, RouteStats
│   │   ├── hooks/               # useRouteGenerator
│   │   └── styles/              # app.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── PLAN.md
├── Procfile
└── CLAUDE.md
```

## Development
```bash
# Backend (terminal 1)
cd backend && pip install -r requirements.txt
cd app && uvicorn main:app --reload --port 8000

# Frontend (terminal 2)
cd frontend && npm install && npm run dev
# Vite dev server on :5173, proxies /api to :8000
```

## Key Conventions
- Orange accent colour: `#e8772e`
- Default map centre: Coleraine, NI (55.133, -6.677)
- OSRM demo API for routing (no API key needed)
- No TypeScript — plain JSX
- Minimal dependencies, no numpy/shapely/geopy

## GitHub Issues
Issues #1-#8 track all implementation steps. Labels indicate ownership:
- `lead` — Orchestrator (scaffolding, styling, deployment)
- `backend` — Backend Engineer (algorithm, API endpoints)
- `frontend` — Frontend Engineer (map, sidebar, state management)

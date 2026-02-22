# Route Generator — Phase 1 MVP Implementation Plan

## Context

Building a loop running route generator as specified in `SPEC.md` (on Desktop). The user validated all tech choices with one change: **React (via Vite)** replaces vanilla HTML/CSS/JS for the frontend, to support long-term UI complexity growth (training modes, multiple routes, Strava integration).

The backend (Python/FastAPI), routing engine (OSRM), maps (Leaflet + CARTO), GPX export (gpxpy), and hosting (Railway) all remain as specified.

---

## Final Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python / FastAPI |
| **Frontend** | React 18 + Vite |
| **Maps** | Leaflet.js + react-leaflet + CARTO light tiles |
| **Routing Engine** | OSRM demo API |
| **GPX Export** | gpxpy |
| **Hosting** | Railway |

---

## Project Structure

```
rundrop/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI — API endpoints + serves built frontend
│   │   ├── route_generator.py   # Core algorithm
│   │   └── gpx_export.py        # GPX file generation
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Root component
│   │   ├── main.jsx             # Entry point
│   │   ├── components/
│   │   │   ├── MapView.jsx      # Leaflet map (react-leaflet)
│   │   │   ├── Sidebar.jsx      # Controls panel
│   │   │   ├── DistanceInput.jsx # Slider + number + chips
│   │   │   └── RouteStats.jsx   # Distance + time display
│   │   ├── hooks/
│   │   │   └── useRouteGenerator.js  # API call + state management
│   │   └── styles/
│   │       └── app.css          # All styles (CSS custom properties)
│   ├── index.html
│   ├── vite.config.js           # Proxy /api to FastAPI in dev
│   └── package.json
├── Procfile                     # Railway: build frontend + run backend
├── .gitignore
└── README.md
```

---

## Implementation Steps

### Step 1: Project scaffolding
- Initialise git repo
- Create `backend/` with FastAPI app skeleton (`main.py` with health check)
- Create `frontend/` with Vite + React (`npm create vite@latest`)
- Install frontend deps: `react-leaflet`, `leaflet`
- Configure Vite dev proxy: `/api` → `http://localhost:8000`
- Configure FastAPI to serve `frontend/dist/` as static files (production)
- Add `.gitignore` (Python + Node)

### Step 2: Core algorithm (backend)
- `route_generator.py`: Waypoint generation with circular placement + randomness
- OSRM integration via `httpx` (async calls to `/route/v1/foot/`)
- Iterative distance adjustment (up to 8 attempts, 10% tolerance)
- `gpx_export.py`: Convert coordinates to GPX file using `gpxpy`

### Step 3: API endpoints (backend)
- `GET /api/generate` — single route generation (lat, lng, distance params)
- `GET /api/export-gpx` — generate route + return as GPX download
- `POST /api/export-gpx-from-coords` — convert existing coordinates to GPX
- Error handling with clear user-facing messages
- FastAPI serves `frontend/dist/` for all non-API routes (SPA catch-all)

### Step 4: Map component (frontend)
- `MapView.jsx`: Leaflet map with CARTO light tiles, centred on Coleraine
- Click handler to place start marker (orange, pulsing CSS animation)
- Route polyline rendering (orange, from API response)
- Auto-fit bounds when route is displayed
- "Use my location" geolocation button

### Step 5: Sidebar + controls (frontend)
- `Sidebar.jsx`: Container for all controls
- `DistanceInput.jsx`: Slider (1–50km), number input, quick-pick chips (3k, 5k, 10k, 15k, Half)
- Generate Route button with loading state
- `RouteStats.jsx`: Display actual distance + estimated time
- Download GPX button
- Regenerate button

### Step 6: State management + API integration (frontend)
- `useRouteGenerator` hook: manages start point, distance, route data, loading/error states
- Fetch from `/api/generate`, handle success/error
- GPX download via `/api/export-gpx-from-coords`
- UI states: default → ready → loading → results → error (as specified)

### Step 7: Styling
- CSS custom properties matching the spec's colour palette
- Light, clean, minimal aesthetic with orange accents
- Mobile responsive: sidebar stacks below map on small screens
- System font stack as specified

### Step 8: Deployment setup
- `Procfile`: build frontend + run backend as single service
- FastAPI mounts `frontend/dist` as static files and serves `index.html` as SPA fallback
- `requirements.txt` in `backend/`

---

## Dev Workflow

```bash
# Terminal 1: Backend
cd backend
pip install -r requirements.txt
cd app
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev    # Vite dev server on :5173, proxies /api to :8000
```

---

## Verification Checklist

- [ ] Click map in Coleraine → orange marker appears
- [ ] Set distance to 5km → click Generate → route polyline appears
- [ ] Route distance is within ~10% of 5km
- [ ] Stats panel shows distance + estimated time
- [ ] Download GPX → file opens in Strava/Garmin Connect
- [ ] Regenerate → different route appears
- [ ] Test distances: 1km, 5km, 10km, 21km
- [ ] Test mobile layout (sidebar below map)
- [ ] Geolocation button works (grant + deny)
- [ ] Error state displays when clicking in ocean/remote area

---

## Key Decisions Made

- **React + Vite over vanilla JS**: Future-proofing for Phase 3+ UI complexity (training modes, multiple routes, Strava)
- **React SPA over Next.js**: App is a tool, not a content site. No need for SSR. Keeps single-service deployment with FastAPI.
- **SEO**: Handled by FastAPI serving proper meta/OG tags in the HTML shell. No framework-level SSR needed.
- **Full spec**: `\\SM2019DC\Folder Redirection\mcgoniglem\Desktop\SPEC.md`

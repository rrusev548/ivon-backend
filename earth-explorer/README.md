# 🌍 Earth Explorer

A Google Earth-style 3D globe in the browser: photorealistic satellite imagery,
real elevation terrain, 3D buildings, place search, markers, measurement tools,
a sun/time simulator, and recordable cinematic camera tours.

Built with **Vite + TypeScript (strict)**, **CesiumJS**, **Tailwind CSS**, and
**Zustand** — no backend, all data from public APIs.

## Quick start

```bash
cd earth-explorer
npm install
cp .env.example .env   # optional but recommended — see below
npm run dev            # → http://localhost:5173
```

### Getting a free Cesium Ion token (recommended)

The photorealistic stack — Bing satellite imagery, Cesium World Terrain, and
OSM 3D Buildings — streams from [Cesium Ion](https://ion.cesium.com):

1. Create a free account at <https://ion.cesium.com/signup>
2. Open **Access Tokens** → copy your *Default Token* (or create one with the
   default scopes)
3. Put it in `.env`:

   ```
   VITE_CESIUM_ION_TOKEN=eyJhbGci...
   ```

**Without a token** the app still runs in a degraded mode: OpenStreetMap street
tiles on a smooth (non-terrain) ellipsoid, with the 3D buildings toggle
disabled. Everything else works.

## Features

- **Globe viewer** — world terrain + satellite imagery, atmosphere, fog, sun
  lighting with a live day/night terminator, smooth inertial orbit/pan/zoom/
  tilt, double-click to dive toward a point
- **Search** — Nominatim (OpenStreetMap) autocomplete with 300 ms debounce,
  keyboard navigation, and graceful error/empty states; Enter flies to the
  result with easing
- **Places** — arm the pin tool and click the globe to drop a marker; edit
  title, notes, and color; reorder by dragging in the sidebar; click a row to
  select, double-click to fly there. Persisted to `localStorage`; export and
  import as GeoJSON
- **Measure** — geodesic distance (polyline) and area (polygon) with a live
  label while drawing; finish with double-click/right-click, cancel with ESC,
  clear all from the dock; km/mi toggle
- **Sun & time** — a 24 h solar-time slider driving `viewer.clock`, with Now /
  Sunrise / Noon / Sunset / Midnight presets (sunrise/sunset are the ideal
  06:00/18:00 solar times — an equinox approximation)
- **Camera tours** — record keyframes from the current view or saved places,
  set per-leg durations, and play back a smooth cinematic flight with
  play / pause / stop. Camera input is locked while a tour plays; pause or
  stop to take back control
- **UI** — dark glassmorphic overlay, collapsible sidebar, tool dock,
  coordinate + altitude HUD (throttled to ~10 fps), streaming-tiles indicator,
  responsive/touch-friendly layout

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `/` | Focus search |
| `P` | Pin tool (drop a place) |
| `D` | Measure distance |
| `A` | Measure area |
| `ESC` | Cancel tool / drawing / selection |
| `B` | Toggle 3D buildings |
| `T` | Toggle sun & time panel |
| `U` | Toggle km / mi |
| `S` | Toggle sidebar |

Mouse: drag to orbit, right-drag or `Ctrl`+drag to tilt, wheel to zoom,
double-click to fly toward a point. Touch: one finger orbits, two fingers
zoom/tilt.

## Architecture

```
src/
  main.ts          # bootstrap + error screen
  app/             # shell: layout, sidebar, dock, shortcuts
  cesium/          # viewer factory, camera helpers, buildings, ion token
  features/
    search/        # nominatim client + search bar
    places/        # markers, globe interaction, sidebar panel, editor
    measure/       # distance/area state machine + entity helpers
    time/          # sun & time panel
    tour/          # keyframe recorder + playback engine
  store/           # zustand vanilla store (slices; places/tours persisted)
  ui/              # dom builder, icons, hud, loading indicator
  lib/             # debounce, formatting, geodesy, geojson, solar time
  types/           # shared domain types
```

Rules the codebase follows: one responsibility per file (≤ ~200 lines), all
Cesium access flows through `useViewer()` (`src/cesium/viewerContext.ts`),
strict TypeScript with no `any`.

## Performance

- `requestRenderMode: true` — frames render only when something changes;
  mutations call `requestRender()` explicitly
- HUD and coordinate readouts throttled to ~10 fps
- The OSM Buildings tileset is lazy-loaded the first time it's toggled on
- MSAA ×4, default LOD (`maximumScreenSpaceError = 2`)

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server at `localhost:5173` |
| `npm run build` | Typecheck + production build to `dist/` |
| `npm run preview` | Serve the production build |

## Data sources & attribution

- Imagery/terrain/buildings: [Cesium Ion](https://cesium.com/platform/cesium-ion/)
  (Bing Maps imagery, Cesium World Terrain, OpenStreetMap buildings)
- Fallback imagery: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors
- Geocoding: [Nominatim](https://nominatim.org/) — please respect its
  [usage policy](https://operations.osmfoundation.org/policies/nominatim/)

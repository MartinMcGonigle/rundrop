from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse, Response
from pydantic import BaseModel
from pathlib import Path
from .route_generator import generate_route
from .gpx_export import create_gpx

app = FastAPI(title="rundrop")


class CoordsRequest(BaseModel):
    coordinates: list[list[float]]


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(status_code=400, content={"error": str(exc)})


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.get("/api/generate")
async def generate(lat: float, lng: float, distance: float):
    result = await generate_route(lat, lng, distance * 1000)
    return {
        "coordinates": result["coordinates"],
        "distance": round(result["distance"] / 1000, 2),
        "duration": round(result["duration"]),
    }


@app.get("/api/export-gpx")
async def export_gpx(lat: float, lng: float, distance: float):
    result = await generate_route(lat, lng, distance * 1000)
    gpx_xml = create_gpx(result["coordinates"])
    return Response(
        content=gpx_xml,
        media_type="application/gpx+xml",
        headers={"Content-Disposition": "attachment; filename=rundrop-route.gpx"},
    )


@app.post("/api/export-gpx-from-coords")
async def export_gpx_from_coords(body: CoordsRequest):
    if len(body.coordinates) < 2:
        raise ValueError("At least 2 coordinates are required.")
    gpx_xml = create_gpx(body.coordinates)
    return Response(
        content=gpx_xml,
        media_type="application/gpx+xml",
        headers={"Content-Disposition": "attachment; filename=rundrop-route.gpx"},
    )


# Production: serve built frontend
frontend_dist = Path(__file__).resolve().parent.parent.parent / "frontend" / "dist"
if frontend_dist.exists():
    app.mount("/assets", StaticFiles(directory=frontend_dist / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file = frontend_dist / full_path
        if file.exists() and file.is_file():
            return FileResponse(file)
        return FileResponse(frontend_dist / "index.html")

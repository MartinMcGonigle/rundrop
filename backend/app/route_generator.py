import math
import random

import httpx
import polyline

OSRM_BASE_URL = "http://router.project-osrm.org/route/v1/foot"
MAX_ITERATIONS = 8
DISTANCE_TOLERANCE = 0.10  # 10%
DEFAULT_WAYPOINT_COUNT = 6


def _generate_waypoints(
    lat: float,
    lng: float,
    radius_km: float,
    count: int,
) -> list[tuple[float, float]]:
    """
    Generate waypoints in a rough circle around the start point.
    Returns a list of (lat, lng) tuples.
    """
    waypoints = []
    base_angle_step = 360.0 / count
    start_offset = random.uniform(0, 360)
    lat_rad = math.radians(lat)

    for i in range(count):
        angle = start_offset + i * base_angle_step
        angle += random.uniform(-15, 15)
        angle_rad = math.radians(angle)

        r = radius_km * random.uniform(0.75, 1.25)

        dlat = r * math.cos(angle_rad) / 111.32
        dlng = r * math.sin(angle_rad) / (111.32 * math.cos(lat_rad))

        waypoints.append((lat + dlat, lng + dlng))

    return waypoints


def _build_osrm_coords(
    start: tuple[float, float],
    waypoints: list[tuple[float, float]],
) -> str:
    """
    Build OSRM coordinate string: start -> waypoints -> start (loop).
    OSRM uses lng,lat order.
    """
    points = [start] + waypoints + [start]
    return ";".join(f"{lng},{lat}" for lat, lng in points)


async def _query_osrm(coords_str: str) -> dict:
    """
    Query the OSRM routing API and return the parsed JSON response.
    Raises ValueError on timeout, missing routes, or API errors.
    """
    url = f"{OSRM_BASE_URL}/{coords_str}?overview=full&geometries=polyline"

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
    except httpx.TimeoutException:
        raise ValueError("Route service timed out. Please try again.")
    except httpx.HTTPError:
        raise ValueError("Route service error. Please try again later.")

    if response.status_code != 200:
        raise ValueError("Route service error. Please try again later.")

    data = response.json()

    if data.get("code") != "Ok" or not data.get("routes"):
        raise ValueError("No route found. Try a different start point.")

    return data


def _decode_route(geometry: str) -> list[list[float]]:
    """
    Decode an OSRM polyline geometry into a list of [lat, lng] coordinates.
    """
    decoded = polyline.decode(geometry)
    return [[lat, lng] for lat, lng in decoded]


async def generate_route(
    lat: float,
    lng: float,
    target_distance: float,
    waypoint_count: int = DEFAULT_WAYPOINT_COUNT,
) -> dict:
    """
    Generate a loop running route from a start point with a target distance.

    Args:
        lat: Start latitude (-90..90)
        lng: Start longitude (-180..180)
        target_distance: Target distance in meters (200..100000)
        waypoint_count: Number of intermediate waypoints (default 6)

    Returns:
        dict with keys: coordinates, distance, duration, within_tolerance
    """
    # Validate inputs
    if not (-90 <= lat <= 90):
        raise ValueError("Latitude must be between -90 and 90 degrees.")
    if not (-180 <= lng <= 180):
        raise ValueError("Longitude must be between -180 and 180 degrees.")
    if not (200 <= target_distance <= 100000):
        raise ValueError(
            "Target distance must be between 200 and 100,000 meters."
        )

    # Initial radius estimate: circumference = 2 * pi * r
    radius_km = (target_distance / 1000) / (2 * math.pi)

    best_route = None
    best_distance_diff = float("inf")
    start = (lat, lng)

    for _ in range(MAX_ITERATIONS):
        waypoints = _generate_waypoints(lat, lng, radius_km, waypoint_count)
        coords_str = _build_osrm_coords(start, waypoints)
        data = await _query_osrm(coords_str)

        route = data["routes"][0]
        actual_distance = route["distance"]
        duration = route["duration"]
        coordinates = _decode_route(route["geometry"])

        distance_diff = abs(actual_distance - target_distance)

        # Track best route
        if distance_diff < best_distance_diff:
            best_distance_diff = distance_diff
            best_route = {
                "coordinates": coordinates,
                "distance": actual_distance,
                "duration": duration,
                "within_tolerance": True,
            }

        # Check if within tolerance
        if distance_diff / target_distance <= DISTANCE_TOLERANCE:
            return best_route

        # Adjust radius proportionally
        if actual_distance > 0:
            radius_km *= target_distance / actual_distance

    # All iterations exhausted — return best route with tolerance flag
    best_route["within_tolerance"] = False
    return best_route

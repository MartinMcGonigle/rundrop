import gpxpy
import gpxpy.gpx


def create_gpx(
    coordinates: list[list[float]],
    name: str = "rundrop route",
) -> str:
    """
    Convert a list of [lat, lng] coordinates into a GPX XML string.
    Creates a single track with a single segment containing all points.
    Returns the GPX as a string (XML).
    """
    gpx = gpxpy.gpx.GPX()

    track = gpxpy.gpx.GPXTrack(name=name)
    gpx.tracks.append(track)

    segment = gpxpy.gpx.GPXTrackSegment()
    track.segments.append(segment)

    for coord in coordinates:
        point = gpxpy.gpx.GPXTrackPoint(latitude=coord[0], longitude=coord[1])
        segment.points.append(point)

    return gpx.to_xml()

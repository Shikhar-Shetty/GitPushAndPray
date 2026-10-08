from os import environ

import httpx

OVERPASS_API_URL = "https://overpass-api.de/api/interpreter"
FACILITY_SEARCH_RADIUS_METRES = int(
    environ.get("FACILITY_SEARCH_RADIUS_METRES", "5000")
)
FACILITY_AMENITIES = {"school", "college", "university", "hospital"}


class FacilityServiceError(RuntimeError):
    pass


def _facility_coordinates(element: dict) -> tuple[float, float]:
    if element.get("type") == "node":
        latitude = element.get("lat")
        longitude = element.get("lon")
    else:
        center = element.get("center")
        if not isinstance(center, dict):
            raise ValueError("facility has no center coordinates")
        latitude = center.get("lat")
        longitude = center.get("lon")

    return float(latitude), float(longitude)


async def fetch_nearby_facilities(latitude: float, longitude: float) -> list[dict]:
    query = f"""
    [out:json][timeout:15];
    (
      nwr(around:{FACILITY_SEARCH_RADIUS_METRES},{latitude},{longitude})
        ["amenity"~"^(school|college|university|hospital)$"];
    );
    out center tags;
    """

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(OVERPASS_API_URL, data={"data": query})
            response.raise_for_status()
            payload = response.json()
    except (httpx.HTTPError, ValueError) as error:
        raise FacilityServiceError("Unable to fetch nearby facilities from Overpass") from error

    elements = payload.get("elements") if isinstance(payload, dict) else None
    if not isinstance(elements, list):
        raise FacilityServiceError("Overpass returned an unexpected response")

    facilities = []
    seen = set()
    for element in elements:
        try:
            if not isinstance(element, dict):
                continue

            tags = element.get("tags")
            if not isinstance(tags, dict):
                continue

            facility_type = tags.get("amenity")
            if facility_type not in FACILITY_AMENITIES:
                continue

            facility_latitude, facility_longitude = _facility_coordinates(element)
            name = str(tags.get("name") or f"Unnamed {facility_type}")
            facility_key = (facility_type, name, facility_latitude, facility_longitude)
            if facility_key in seen:
                continue
            seen.add(facility_key)

            facilities.append(
                {
                    "name": name,
                    "type": facility_type,
                    "latitude": facility_latitude,
                    "longitude": facility_longitude,
                }
            )
        except (TypeError, ValueError):
            continue

    return facilities

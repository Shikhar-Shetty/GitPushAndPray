from os import environ

import httpx

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
NEIGHBOUR_OFFSET_DEGREES = 0.05
WATER_LEVEL_RUNOFF_SCALE = float(environ.get("WATER_LEVEL_RUNOFF_SCALE", "1"))

CONSTANT_WATER_LEVEL = float(environ.get("CONSTANT_WATER_LEVEL", "5.0"))


class WeatherServiceError(RuntimeError):
    pass


def nearby_coordinates(latitude: float, longitude: float) -> list[dict[str, float]]:
    offset = NEIGHBOUR_OFFSET_DEGREES
    return [
        {"latitude": latitude, "longitude": longitude},
        {"latitude": latitude + offset, "longitude": longitude},
        {"latitude": latitude - offset, "longitude": longitude},
        {"latitude": latitude, "longitude": longitude + offset},
        {"latitude": latitude, "longitude": longitude - offset},
    ]


async def fetch_weather(
    locations: list[dict[str, float]],
) -> list[dict[str, float]]:
    params = {
        "latitude": ",".join(str(location["latitude"]) for location in locations),
        "longitude": ",".join(str(location["longitude"]) for location in locations),
        "current": "temperature_2m,relative_humidity_2m,precipitation",
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(OPEN_METEO_URL, params=params)
            response.raise_for_status()
            payload = response.json()
    except (httpx.HTTPError, ValueError) as error:
        raise WeatherServiceError("Unable to fetch weather data from Open-Meteo") from error

    if not isinstance(payload, list) or len(payload) != len(locations):
        raise WeatherServiceError("Open-Meteo returned an unexpected response")

    weather = []
    for location, item in zip(locations, payload):
        try:
            current = item["current"]
            water_level = CONSTANT_WATER_LEVEL
            
            weather.append(
                {
                    "Latitude": location["latitude"],
                    "Longitude": location["longitude"],
                    "Rainfall (mm)": float(current["precipitation"]),
                    "Temperature (°C)": float(current["temperature_2m"]),
                    "Humidity (%)": float(current["relative_humidity_2m"]),
                    "Water Level (m)": water_level,
                    "water_level_estimate_m": water_level,
                    "Elevation (m)": float(item["elevation"]),
                }
            )
        except (KeyError, TypeError, ValueError) as error:
            raise WeatherServiceError("Open-Meteo returned incomplete weather data") from error

    return weather
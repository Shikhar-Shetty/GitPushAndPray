from os import environ

import httpx

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
NEIGHBOUR_OFFSET_DEGREES = 0.05
WATER_LEVEL_RUNOFF_SCALE = float(environ.get("WATER_LEVEL_RUNOFF_SCALE", "1"))


class WeatherServiceError(RuntimeError):
    pass


def _estimate_water_level(hourly: dict) -> float:
    if not isinstance(hourly, dict):
        raise WeatherServiceError("Open-Meteo did not return water-level inputs")

    precipitation = hourly.get("precipitation")
    soil_moisture = hourly.get("soil_moisture_0_to_7cm")
    if not isinstance(precipitation, list) or not isinstance(soil_moisture, list):
        raise WeatherServiceError("Open-Meteo did not return water-level inputs")

    recent_precipitation_mm = sum(float(value or 0) for value in precipitation[-24:])
    soil_values = [float(value) for value in soil_moisture[-24:] if value is not None]
    if not soil_values:
        raise WeatherServiceError("Open-Meteo did not return soil-moisture data")

    average_soil_moisture = sum(soil_values) / len(soil_values)
    saturation = min(max((average_soil_moisture - 0.2) / 0.25, 0.0), 1.0)
    runoff_fraction = 0.5 + (0.5 * saturation)
    return (recent_precipitation_mm / 1000) * runoff_fraction * WATER_LEVEL_RUNOFF_SCALE


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
        "hourly": "precipitation,soil_moisture_0_to_7cm",
        "past_days": 1,
        "forecast_days": 1,
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
            water_level = _estimate_water_level(item["hourly"])
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
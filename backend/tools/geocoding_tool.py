import httpx


def reverse_geocode(lat: float, lon: float) -> dict:
    """Get human-readable location name from coordinates using Nominatim (free, no key)."""
    try:
        response = httpx.get(
            "https://nominatim.openstreetmap.org/reverse",
            params={"format": "json", "lat": lat, "lon": lon, "accept-language": "en"},
            headers={
                "User-Agent": "DzukaAgri/1.0 (agricultural AI assistant)",
                "Accept-Language": "en",
            },
            timeout=5,
        )
        data = response.json()
        address = data.get("address", {})

        city = (
            address.get("city")
            or address.get("town")
            or address.get("village")
            or address.get("county")
            or ""
        )
        state = address.get("state") or address.get("region") or ""
        country = address.get("country") or ""

        parts = [p for p in [city, state, country] if p]
        display = ", ".join(parts) if parts else f"Lat {lat}, Lon {lon}"

        return {
            "city": city,
            "state": state,
            "country": country,
            "display": display,
        }
    except Exception:
        return {
            "city": "",
            "state": "",
            "country": "",
            "display": f"Lat {lat}, Lon {lon}",
        }

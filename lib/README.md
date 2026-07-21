Third-party libraries vendored locally (instead of a CDN) so the natal
chart engine has no external runtime dependency besides the Nominatim
geocoding API.

- `astronomy-engine.min.js` — [Astronomy Engine](https://github.com/cosinekitty/astronomy)
  by Don Cross, MIT License. High-precision Sun/Moon/planet ecliptic
  positions (VSOP87/ELP2000-based).
- `tz-lookup.js` — [tz-lookup](https://github.com/darkskyapp/tz-lookup)
  by The Dark Sky Company, CC0 1.0 (public domain). Offline latitude/longitude
  → IANA time zone name lookup, used to resolve the real civil time zone of
  the birth place (not just its geographic longitude).

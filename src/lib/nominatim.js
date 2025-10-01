const BASE = "https://nominatim.openstreetmap.org";

export async function searchPlaces(q, { countryCodes = "id", limit = 6 } = {}) {
  const url = new URL(`${BASE}/search`);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("q", q);
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("accept-language", "id");
  if (countryCodes) url.searchParams.set("countrycodes", countryCodes);

  const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
  if (!res.ok) return [];
  const data = await res.json();
  return (data || []).map(d => ({
    label: d.display_name,
    lat: parseFloat(d.lat),
    lon: parseFloat(d.lon),
  }));
}

export async function reverseGeocode(lat, lon) {
  const url = `${BASE}/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1&accept-language=id`;
  const res = await fetch(url);
  if (!res.ok) return { label: `Lat ${lat.toFixed(4)}, Lng ${lon.toFixed(4)}` };
  const data = await res.json();
  return { label: data?.display_name || `Lat ${lat.toFixed(4)}, Lng ${lon.toFixed(4)}`, raw: data };
}

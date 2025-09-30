import { NextResponse } from "next/server";
export const runtime = "nodejs";

const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

const buildQuery = (lat, lon, radius = 5000) => `
[out:json][timeout:25];
(
  node["landuse"="landfill"](around:${radius},${lat},${lon});
  way ["landuse"="landfill"](around:${radius},${lat},${lon});
  relation["landuse"="landfill"](around:${radius},${lat},${lon});

  node["amenity"="waste_transfer_station"](around:${radius},${lat},${lon});
  way ["amenity"="waste_transfer_station"](around:${radius},${lat},${lon});

  node["amenity"="waste_disposal"](around:${radius},${lat},${lon});
  way ["amenity"="waste_disposal"](around:${radius},${lat},${lon});

  node["amenity"="recycling"]["recycling_type"="centre"](around:${radius},${lat},${lon});
  way  ["amenity"="recycling"]["recycling_type"="centre"](around:${radius},${lat},${lon});

  node["amenity"="recycling"](around:${radius},${lat},${lon});
  way  ["amenity"="recycling"](around:${radius},${lat},${lon});
);
out center tags;
`;

function addrFromTags(tags = {}) {
  const parts = [
    [tags["addr:street"], tags["addr:housenumber"]].filter(Boolean).join(" "),
    tags["addr:neighbourhood"],
    tags["addr:village"] || tags["addr:suburb"],
    tags["addr:city"] || tags["addr:town"],
    tags["addr:state"],
    tags["addr:postcode"],
  ].filter(Boolean);
  return parts.join(", ");
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  const radius = Number(searchParams.get("radius") ?? 5000);

  if (!isFinite(lat) || !isFinite(lon)) {
    return NextResponse.json({ error: "lat/lon required" }, { status: 400 });
  }
  const safeRadius = Math.min(Math.max(radius, 500), 10000);

  try {
    const body = new URLSearchParams({
      data: buildQuery(lat, lon, safeRadius),
    });
    const r = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "GreenCycle/1.0 (+contact@example.com)",
      },
      body,
    });

    const text = await r.text();
    if (!r.ok) {
      return NextResponse.json(
        { error: `Overpass ${r.status}`, detail: text.slice(0, 300) },
        { status: r.status }
      );
    }

    let json;
    try {
      json = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON from Overpass", detail: text.slice(0, 300) },
        { status: 502 }
      );
    }

    const facilities = (json.elements || [])
      .map((el) => {
        const tags = el.tags || {};
        const la = el.lat || el.center?.lat;
        const lo = el.lon || el.center?.lon;

        if (!la || !lo) return null;

        let type = "Lokasi Sampah";
        if (tags.landuse === "landfill") type = "TPA (Tempat Pembuangan Akhir)";
        else if (tags.amenity === "waste_transfer_station")
          type = "TPS (Tempat Pembuangan Sementara)";
        else if (tags.amenity === "recycling")
          type =
            tags.recycling_type === "centre"
              ? "Bank Sampah"
              : "Titik Daur Ulang";
        else if (tags.amenity === "waste_disposal")
          type = "Tempat Pembuangan Sampah";

        return {
          id: String(el.id),
          type,
          name: tags.name || tags["name:id"] || `${type} (Tanpa Nama)`,
          lat: la,
          lon: lo,
          address: addrFromTags(tags) || null, // dari OSM tags saja
          tags,
          priority:
            tags.landuse === "landfill"
              ? 1
              : tags.amenity === "waste_transfer_station"
              ? 2
              : tags.recycling_type === "centre"
              ? 3
              : tags.amenity === "recycling"
              ? 4
              : 5,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.priority - b.priority);

    return NextResponse.json({ facilities, count: facilities.length });
  } catch (e) {
    console.error("Overpass API error:", e);
    return NextResponse.json(
      { error: e.message || "Overpass failed" },
      { status: 500 }
    );
  }
}

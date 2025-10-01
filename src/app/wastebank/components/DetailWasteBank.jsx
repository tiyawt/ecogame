"use client";
import { useWasteStore } from "@/store/wasteBankStore";
import { MapPin, ExternalLink } from "lucide-react";
import MapLeaflet from "./MapLeaflet";

function extractStreet(address) {
  if (!address) return "";
  const parts = address.split(",");
  const jalan = parts.find((p) => /\b(Jl\.?|Jalan)\b/i.test(p)) || parts[0];
  return jalan.trim();
}

export default function DetailWasteBank({ facility: facilityProp }) {
  const selectedFacility = useWasteStore((s) => s.selectedFacility);
  const f = facilityProp || selectedFacility;

  if (!f) {
    return (
      <div className="p-4 text-sm text-slate-600">
        Belum ada TPA yang dipilih. Silakan pilih dari daftar dulu.
      </div>
    );
  }

  const street = extractStreet(f.address);

  return (
    <section className="w-full">
      <MapLeaflet
        mapId="detail-wastebank-map"
        center={{ lat: f.lat, lon: f.lon }}
        accuracy={0}
        draggable={false}
        clickToMove={false}
        markerIcon="pin" 
        markerColor="#059669" 
        markerSize={34} 
        onReady={({ marker }) => {
          marker.bindPopup(`<b>${f.name || "Lokasi"}</b>`).openPopup();
        }}
      />

      {/* INFO */}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {f.name || "Tempat Pembuangan Sampah"}
            </h2>
            <p className="mt-1 text-sm text-slate-700">
              {street || f.address || "Alamat tidak tersedia"}
            </p>
          </div>

          <a
            href={`https://www.google.com/maps?q=${encodeURIComponent(
              `${f.lat},${f.lon} (${f.name || "TPA"})`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
            title="Buka di Google Maps"
          >
            <ExternalLink className="h-4 w-4" />
            Buka di Maps
          </a>
        </div>

        {f.phone || f.website ? (
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            {f.phone && <span className="text-slate-600">📞 {f.phone}</span>}
            {f.website && (
              <a
                className="text-blue-600 underline truncate"
                href={f.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                🌐 {f.website}
              </a>
            )}
          </div>
        ) : null}

        <div className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-700">
          <MapPin className="h-4 w-4" />
          {f.lat.toFixed(4)}, {f.lon.toFixed(4)}
        </div>
      </div>
    </section>
  );
}

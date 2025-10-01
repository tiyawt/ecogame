"use client";
import { Loader2, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FacilityList({
  facilities, loading, error,
  selected, onSelect, distanceFromUser,
  geocodingSet
}) {
  const router = useRouter();

  return (
    <div className="rounded-xl border border-slate-200 divide-y max-h-72 overflow-auto">
      {loading && (
        <div className="p-3 text-sm text-slate-500 flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" /> Mengambil data…
        </div>
      )}

      {!loading && facilities.length === 0 && !error && (
        <div className="p-3 text-sm text-slate-500">Belum ada hasil. Klik "Cari TPA" untuk mencari.</div>
      )}

      {facilities.map((f) => {
        const dist = distanceFromUser(f).toFixed(2);
        const active = selected?.id === f.id;
        const isGeocoding = geocodingSet?.has(f.id);

        return (
          <button
            key={f.id}
            onClick={() => { onSelect?.(f); router.push("/wastebank/detail"); }}
            className={`w-full text-left p-3 flex items-start gap-3 hover:bg-slate-50 transition ${active ? "bg-emerald-50" : ""}`}
          >
            <div className="mt-0.5"><MapPin className="h-4 w-4 text-emerald-600" /></div>
            <div className="flex-1">
              <div className="font-medium text-slate-900">{f.name}</div>
              <div className="text-xs text-slate-600 mt-0.5">{f.type} • {dist} km</div>
              {isGeocoding ? (
                <div className="text-xs text-slate-400 italic mt-1 flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" /> Mengambil alamat…
                </div>
              ) : f.address ? (
                <div className="text-xs text-slate-600 mt-1">{f.address}</div>
              ) : (
                <div className="text-xs text-slate-400 italic mt-1">Alamat tidak tersedia</div>
              )}
            </div>
            {active && <span className="text-xs text-emerald-700 font-semibold">✓</span>}
          </button>
        );
      })}

      {error && (
        <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200">
          <p className="text-sm text-rose-700 font-medium">{String(error)}</p>
          <p className="text-xs text-rose-600 mt-1">Coba perbesar radius atau pindahkan lokasi pencarian.</p>
        </div>
      )}
    </div>
  );
}

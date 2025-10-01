"use client";
import { useMemo, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { debounce } from "@/lib/debounce";
import { searchPlaces } from "@/lib/nominatim";

export default function SearchBox({ countryCodes = "id", onSelect }) {
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const doSearch = useMemo(() => debounce(async (value) => {
    if (!value || value.trim().length < 3) {
      setSuggestions([]);
      setBusy(false);
      return;
    }
    setBusy(true);
    try {
      const res = await searchPlaces(value, { countryCodes, limit: 6 });
      setSuggestions(res);
    } finally {
      setBusy(false);
    }
  }, 350), [countryCodes]);

  return (
    <div className="relative">
      <label className="relative block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          value={q}
          onChange={(e) => { setQ(e.target.value); setBusy(true); doSearch(e.target.value); }}
          placeholder="Cari lokasi (cth: Alun-alun Bandung)"
          className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-3 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        />
      </label>

      {q.length >= 3 && (busy || suggestions.length > 0) && (
        <div className="absolute z-10 mt-2 w-full rounded-xl border border-slate-200 text-black bg-white shadow-lg max-h-64 overflow-auto">
          {busy && (
            <div className="flex items-center gap-2 p-3 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Mencari…
            </div>
          )}
          {!busy && suggestions.map((s, idx) => (
            <button
              key={`${s.lat}-${s.lon}-${idx}`}
              onClick={() => { onSelect?.(s); setQ(s.label); setSuggestions([]); }}
              className="block w-full text-left p-3 text-sm hover:bg-slate-50"
            >
              {s.label}
            </button>
          ))}
          {!busy && suggestions.length === 0 && (
            <div className="p-3 text-sm text-slate-500">Tidak ada hasil.</div>
          )}
        </div>
      )}
    </div>
  );
}

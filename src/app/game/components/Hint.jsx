"use client";

import trashData from "@/data/trash";
import { useMemo, useState } from "react";

const CAT_INFO = {
  green: {
    label: "Hijau (Organik)",
    chip: "bg-emerald-500",
    note: "Sisa makanan & daun. Cepat busuk, jadi pisahkan ya.",
  },
  yellow: {
    label: "Kuning (Plastik/Kaca)",
    chip: "bg-yellow-400",
    note: "Bersihkan dulu biar gampang didaur ulang.",
  },
  blue: {
    label: "Biru (Logam)",
    chip: "bg-sky-500",
    note: "Kaleng & logam ringan. Hancurkan/penyet kalau bisa.",
  },
  red: {
    label: "Merah (B3)",
    chip: "bg-rose-500",
    note: "Berbahaya (baterai, elektronik kecil). Jangan campur!",
  },
};

const FILTERS = [
  { id: "all", label: "Semua" },
  { id: "green", label: "Hijau" },
  { id: "yellow", label: "Kuning" },
  { id: "blue", label: "Biru" },
  { id: "red", label: "Merah" },
];

export default function Hint({ onClose }) {
  const [filter, setFilter] = useState("all");

  const list = useMemo(
    () =>
      filter === "all"
        ? trashData
        : trashData.filter((t) => t.category === filter),
    [filter]
  );
  const [selected, setSelected] = useState(list[0] ?? trashData[0]);

  useMemo(() => {
    if (!list.find((x) => x.id === selected?.id))
      setSelected(list[0] ?? trashData[0]);
  }, [filter]); 

  return (
    <div className="mx-auto w-[92vw] max-w-[1000px] mt-6">
      <button
        onClick={onClose}
        aria-label="Tutup Hints"
        className="absolute -top-[-3] -right-42 w-9 h-9 rounded-full bg-white
                   shadow ring-1 ring-black/10 hover:bg-zinc-50"
      >
        ✕
      </button>
      <div className="rounded-t-3xl bg-[#f2c4c6] text-center py-3 tracking-widest text-stone-700 font-bold shadow">
        HINTS
      </div>

      <div className="rounded-b-3xl bg-[#FAF7EF] border border-[#e8e2cf] shadow-xl p-4 md:p-6">
        <div className="flex gap-4">
          <div className="hidden md:flex md:flex-col gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full text-sm border
                  ${
                    filter === f.id
                      ? "bg-white shadow font-semibold"
                      : "bg-[#f4efdf] hover:bg-white"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pr-1 md:pr-4 max-h-[320px] overflow-y-auto">
              {list.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className={`group rounded-xl border bg-white/90 p-3 text-left transition
                    ${
                      selected?.id === item.id
                        ? "ring-2 ring-emerald-400 border-emerald-200"
                        : "hover:shadow"
                    }`}
                >
                  <div className="w-full aspect-square grid place-items-center">
                  
                    <img
                      src={item.image}
                      alt={item.name}
                      className="max-h-20 object-contain"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-700 truncate">
                      {item.name}
                    </span>
                    <span
                      className={`inline-block w-3 h-3 rounded-full ${
                        CAT_INFO[item.category].chip
                      }`}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block w-[300px] shrink-0">
            {selected && <DetailCard item={selected} />}
          </div>
        </div>
        <div className="md:hidden mt-4">
          {selected && <DetailCard item={selected} />}
        </div>
      </div>
    </div>
  );
}

function DetailCard({ item }) {
  const info = CAT_INFO[item.category];
  return (
    <div className="rounded-2xl bg-white/90 border border-[#e8e2cf] p-4">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 grid place-items-center rounded-xl bg-[#f7f3e6] border">
          <img
            src={item.image}
            alt={item.name}
            className="max-h-12 object-contain"
          />
        </div>
        <div>
          <div className="text-stone-800 font-bold">{item.name}</div>
          <div className="text-xs text-stone-500 flex items-center gap-2">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${info.chip}`}
            />
            {info.label}
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-stone-700">{item.reason}</p>
    </div>
  );
}


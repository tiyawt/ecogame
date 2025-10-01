"use client";

import { AlertTriangle, Info } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const DEFAULT_MATERIALS = [
  {
    id: "plastic",
    label: "Plastik",
    info: "Botol/gelas PET/PP/HDPE, bersih & kering, tutup dipisah.",
  },
  {
    id: "paper",
    label: "Kertas",
  },
  {
    id: "glass",
    label: "Kaca",
  },
  {
    id: "oil",
    label: "Jelantah",
  },
  {
    id: "metal",
    label: "Metal",
  },
];

export default function MaterialSection({
  titleFacility = "Bank Sampah",
  materials = DEFAULT_MATERIALS,
  defaultSelected = [],
  onChange,
  onNext,
}) {
  const [selected, setSelected] = useState(new Set(defaultSelected));
  const router = useRouter();
  const list = useMemo(() => materials ?? [], [materials]);

  const toggle = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
    onChange?.(Array.from(next));
  };

  const selectedArr = Array.from(selected);

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-slate-800">
      <div className="flex items-center gap-2">
        <div className="h-6 w-6 grid place-items-center rounded-full bg-emerald-50 border border-emerald-200">
          <span className="text-emerald-600 text-sm">ℹ</span>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">
            Material
          </p>
          <p className="text-sm">
            Berikut adalah material yang bisa kamu kirim ke{" "}
            <span className="font-semibold">{titleFacility}</span>
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800">Perhatian</p>
            <ul className="mt-1 list-disc pl-5 text-amber-800/90 space-y-0.5">
              <li>Hanya kirim jenis sampah sesuai daftar ini.</li>
              <li>Pastikan sampah bersih, kering, dan tidak berbau.</li>
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-700">
        Pilih opsi berikut sesuai jenis sampah yang akan kamu kirim:
      </p>

      {/* Checklist */}
      <div className="mt-3 space-y-2">
        {list.map((m) => {
          const checked = selected.has(m.id);
          return (
            <div
              key={m.id}
              className={`flex items-center justify-between rounded-xl border p-3 transition
                ${
                  checked
                    ? "border-emerald-300 bg-emerald-50"
                    : "border-slate-200 bg-white"
                }`}
            >
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(m.id)}
                  className="h-4 w-4 accent-emerald-600"
                />
                <span className="font-medium">{m.label}</span>
              </label>

              <button
                className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 text-sm"
                aria-label={`Info ${m.label}`}
              ></button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1 text-sm text-slate-600">
          {selectedArr.length === 0 ? (
            <span className="italic">Belum ada material dipilih.</span>
          ) : (
            <>
              <span className="text-slate-700 font-medium">Dipilih:</span>{" "}
              {selectedArr
                .map((id) => list.find((m) => m.id === id)?.label || id)
                .join(", ")}
            </>
          )}
        </div>
        <button
          onClick={() => router.push("/wastebank/detail/sent")}
          disabled={selectedArr.length === 0}
          className="rounded-xl bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Lanjut
        </button>
      </div>
    </section>
  );
}

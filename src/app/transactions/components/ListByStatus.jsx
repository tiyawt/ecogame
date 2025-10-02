"use client";

import { useEffect } from "react";
import { useWasteStore } from "@/store/wasteBankStore";
import { useRouter } from "next/navigation";
import { Clock, MapPin } from "lucide-react";

const timeAgo = (ts) => {
  const s = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return "baru saja";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} menit yang lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam yang lalu`;
  const d = Math.floor(h / 24);
  return d === 1 ? "sehari yang lalu" : `${d} hari yang lalu`;
};

export default function ListByStatus({
  status,
  detailBasePath = "/wastebank/detail/sent/transaction",
  emptyText = "Belum ada transaksi.",
}) {
  const router = useRouter();
  const transactions = useWasteStore((s) => s.transactions) ?? [];
  const purgeExpired = useWasteStore((s) => s.purgeExpired);

  useEffect(() => {
    purgeExpired();
    const t = setInterval(purgeExpired, 60_000);
    return () => clearInterval(t);
  }, [purgeExpired]);

  const items = transactions.filter((t) => (t?.status || "waiting") === status);

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-slate-600 mb-30">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="mx-auto w-[92%] max-w-[820px] pb-10 gap-5 flex flex-col">
      {items.map((t) => (
        <button
          key={t.id}
          onClick={() => router.push(`${detailBasePath}/${t.id}`)}
          className="w-full bg-white text-left rounded-xl border border-slate-200 
                     p-4 shadow-sm hover:shadow transition
                     focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-sm text-black font-semibold tracking-wide whitespace-normal break-words">
                {t.code}
              </div>

              <div className="mt-2 text-[11px] text-slate-500">Drop Point</div>
              <div className="text-sm text-slate-900 whitespace-normal break-words">
                {t.receiver?.name || "-"}
              </div>

              <div className="mt-2 text-[11px] text-slate-500">Program</div>
              <div className="text-sm text-slate-900">
                {t.shipping?.mode === "courier"
                  ? ["gosend", "grab"].includes(t.shipping?.provider)
                    ? "Instant"
                    : "Reguler"
                  : "Reguler"}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {timeAgo(t.createdAt)}
                </span>
                {typeof t.distanceKm === "number" && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {t.distanceKm} km
                  </span>
                )}
              </div>
            </div>

            <span
              className={[
                "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium",
                status === "waiting"
                  ? "bg-amber-100 text-amber-700"
                  : status === "done"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-rose-100 text-rose-700",
              ].join(" ")}
            >
              {status === "waiting"
                ? "Menunggu Pengiriman"
                : status === "done"
                ? "Selesai"
                : "Dibatalkan"}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

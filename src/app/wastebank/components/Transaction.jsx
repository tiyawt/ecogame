"use client";

import React, { useEffect, useState } from "react";
import {
  MapPin,
  Share2,
  Clipboard,
  PackageCheck,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useWasteStore } from "@/store/wasteBankStore";
import ShareModal from "./ShareModal";
import MaterialSection from "./MaterialSection";

const formatID = (d) =>
  new Intl.DateTimeFormat("id-ID", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(d);

const currency = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n || 0);

const COURIERS = [
  { code: "gosend", label: "GoSend", eta: "< 1 jam sampai di mitra" },
  { code: "grab", label: "GrabExpress", eta: "< 1 jam sampai di mitra" },
  { code: "jne", label: "JNE Express", eta: "±3 hari sampai di mitra" },
  { code: "pos", label: "POS Indonesia", eta: "±3 hari sampai di mitra" },
  { code: "jnt", label: "J&T Express", eta: "±3 hari sampai di mitra" },
];

const estimatePrice = (code, km) => {
  if (!km) return 0;
  const round500 = (x) => Math.round(x / 500) * 500;
  if (code === "gosend") return round500(Math.max(15000, 9000 + 3800 * km));
  if (code === "grab") return round500(Math.max(15000, 10000 + 3600 * km));
  return 0;
};

export default function Transaction({ tx }) {
  const router = useRouter();
  const updateTransaction = useWasteStore((s) => s.updateTransaction);

  const code = tx.code;
  const createdAt = new Date(tx.createdAt);
  const distKm = Number(tx.distanceKm ?? 0);

  const [courier, setCourier] = useState(() =>
    tx.shipping?.provider
      ? COURIERS.find((c) => c.code === tx.shipping.provider) || COURIERS[2]
      : COURIERS[2]
  );
  const [resi, setResi] = useState(tx.resi || "");

  useEffect(() => {
    updateTransaction?.(tx.id, {
      shipping: {
        ...(tx.shipping || {}),
        provider: courier.code,
        label: courier.label,
      },
    });
  }, [courier.code]);

  const handleResiBlur = () => {
    updateTransaction?.(tx.id, { resi });
  };

  const copyAllAddresses = async () => {
    const text =
      `PENGIRIM:\n${tx.sender?.name}\n${tx.sender?.address}\n` +
      (tx.sender?.note ? `Catatan: ${tx.sender.note}\n` : "") +
      `\nPENERIMA:\n${tx.receiver?.name}\n${tx.receiver?.address || "-"}`;
    try {
      await navigator.clipboard.writeText(text);
      alert("Alamat sudah disalin.");
    } catch {
      alert("Gagal menyalin alamat.");
    }
  };

  const [open, setOpen] = useState(false);

  const share = () => setOpen(true);

  return (
    <div className="mx-auto w-[92%] max-w-[820px] pb-10">
      <div className="flex items-center justify-between">
        <div className="text-sm text-black font-semibold tracking-wide whitespace-normal break-words">
          ID Pengiriman - {tx.code}
        </div>
        <span className="rounded-full bg-amber-100 text-amber-700 text-xs px-3 py-1.5">
          {tx.status === "waiting" ? "Menunggu Pengiriman" : tx.status}
        </span>
      </div>

      <section className="mt-4 rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="bg-emerald-50 h-1 w-full" />
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 grid place-items-center rounded-full bg-emerald-100">
              <PackageCheck className="h-5 w-5 text-emerald-700" />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-slate-900">
                Segera Kirim Paketmu
              </h2>
              <p className="text-sm text-slate-700 mt-1">
                Bawa paket ke agen kurir terdekat.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium text-slate-900">
              Bantu kami memantau paketmu
            </p>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-sm text-black">
                <span className="block text-slate-600 mb-1">Kurir</span>
                <div className="relative">
                  <select
                    value={courier.code}
                    onChange={(e) =>
                      setCourier(
                        COURIERS.find((c) => c.code === e.target.value) ||
                          COURIERS[2]
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2 pr-9 text-sm"
                  >
                    {COURIERS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
              </label>

              <label className="text-sm text-black">
                <span className="block text-slate-600 mb-1">Nomor Resi</span>
                <input
                  value={resi}
                  onChange={(e) => setResi(e.target.value)}
                  onBlur={handleResiBlur}
                  placeholder="Masukkan Resi Pengiriman"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
              </label>
            </div>

            <div className="mt-3 w-full flex flex-col md:flex-row gap-2">
              <button
                onClick={() => router.push("/wastebank/detail/sent")}
                className="inline-flex w-full md:flex-1 items-center justify-center
               rounded-xl border border-slate-200 px-4 py-2
               text-sm text-slate-700 hover:bg-slate-50"
              >
                Ubah Pengiriman
              </button>

              <button
                onClick={() =>
                  alert(
                    resi
                      ? `Tracking ${courier.label} untuk resi ${resi} (dummy)`
                      : "Isi nomor resi dulu ya."
                  )
                }
                className="inline-flex w-full md:flex-1 items-center justify-center
               rounded-xl bg-cyan-500 text-white px-4 py-2
               text-sm font-semibold hover:bg-cyan-600"
              >
                Lacak Pengiriman
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-4 space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs text-slate-500">Tanggal</p>
          <p className="mt-1 text-slate-800">{formatID(createdAt)} WIB</p>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-900">PENGIRIMAN</h3>

          <div className="mt-3 grid gap-4">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 grid place-items-center rounded-full bg-amber-50 border border-amber-200">
                <span className="text-amber-700 font-semibold">•</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-black">
                  {tx.sender?.name || "—"}
                </p>
                <p className="text-sm text-slate-700">
                  {tx.sender?.address || "-"}
                </p>
                <p className="text-sm text-slate-500">
                  Keterangan alamat: {tx.sender?.note || "-"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-8 w-8 grid place-items-center rounded-full bg-emerald-50 border border-emerald-200">
                <MapPin className="h-4 w-4 text-emerald-700" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-black">
                  {tx.receiver?.name} ({tx.receiver?.type})
                </p>
                {tx.receiver?.phone && (
                  <p className="text-sm text-slate-700">{tx.receiver.phone}</p>
                )}
                <p className="text-sm text-slate-700">
                  {tx.receiver?.address || "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              onClick={copyAllAddresses}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <Clipboard className="h-4 w-4" /> Salin Alamat
            </button>
            <button
              onClick={share}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <Share2 className="h-4 w-4" /> Bagikan
            </button>
            <ShareModal
              open={open}
              onClose={() => setOpen(false)}
              message="Saya baru berpartisipasi di program GreenCycle. Yuk kelola sampah dengan bijak dan dukung Indonesia Bebas Sampah."
              url="https://greencycle-perempuan-inovasi.netlify.app/"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Jasa Pengiriman
          </h3>
          <div className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 p-3">
            <div>
              <p className="text-sm font-medium text-black">{courier.label}</p>
              <p className="text-xs text-slate-600">
                {["gosend", "grab"].includes(courier.code)
                  ? "< 1 jam sampai di mitra"
                  : "±3 hari sampai di mitra"}
              </p>
            </div>
            <div className="text-sm font-semibold">
              {["gosend", "grab"].includes(courier.code)
                ? currency(estimatePrice(courier.code, distKm))
                : "Bayar di agen kurir"}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

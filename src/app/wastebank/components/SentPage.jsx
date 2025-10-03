"use client";

import { useEffect, useState } from "react";
import { useWasteStore } from "@/store/wasteBankStore";
import { MapPin, Pencil, Truck, ChevronDown, X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const currency = (n) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n || 0);

function priceEstimate(provider, km) {
  if (!km || Number.isNaN(km)) return 0;
  switch (provider) {
    case "gosend": {
      let p = 9000 + 3800 * km;
      p = Math.max(p, 15000);
      return Math.round(p / 500) * 500;
    }
    case "grab": {
      let p = 10000 + 3600 * km;
      p = Math.max(p, 15000);
      return Math.round(p / 500) * 500;
    }
    case "jne":
      return 18000;
    case "pos":
      return 16000;
    case "jnt":
      return 17000;
    default:
      return 0;
  }
}

const PROVIDERS = [
  {
    code: "gosend",
    label: "GoSend",
    eta: "< 1 jam sampai di mitra",
    payNote: "Bayar langsung ke driver",
    kind: "instant",
  },
  {
    code: "grab",
    label: "GrabExpress",
    eta: "< 1 jam sampai di mitra",
    payNote: "Bayar langsung ke driver",
    kind: "instant",
  },
  {
    code: "jne",
    label: "JNE",
    eta: "±3 hari sampai di mitra",
    payNote: "Bayar di agen kurir",
    kind: "regular",
  },
  {
    code: "pos",
    label: "POS Indonesia",
    eta: "±3 hari sampai di mitra",
    payNote: "Bayar di agen kurir",
    kind: "regular",
  },
  {
    code: "jnt",
    label: "J&T Express",
    eta: "±3 hari sampai di mitra",
    payNote: "Bayar di agen kurir",
    kind: "regular",
  },
];

export default function SentPage() {
  const router = useRouter();
  const {
    senderName,
    userLoc,
    address,
    selectedFacility,
    distanceFromUser,
    addTransaction,
    setCurrentTxId,
  } = useWasteStore();

  const distKm = selectedFacility ? distanceFromUser(selectedFacility) : 0;

  useEffect(() => {
    if (!selectedFacility) router.replace("/wastebank");
  }, [selectedFacility, router]);

  if (!selectedFacility) return null;

  const [selfDropoff, setSelfDropoff] = useState(false);
  const [openChoose, setOpenChoose] = useState(false);
  const [courier, setCourier] = useState(() => {
    const first = PROVIDERS[0];
    return {
      ...first,
      price: priceEstimate(first.code, distKm),
    };
  });

  useEffect(() => {
    setCourier((c) => ({ ...c, price: priceEstimate(c.code, distKm) }));
  }, [distKm]);

  const handlePick = (p) => {
    setCourier({ ...p, price: priceEstimate(p.code, distKm) });
    setOpenChoose(false);
  };

  const handleConfirm = () => {
    if (!senderName?.trim()) {
      alert("Nama pengirim belum diisi.");
      return;
    }
    if (!userLoc || !address) {
      alert("Alamat pengirim belum diset.");
      return;
    }
    if (!selectedFacility) {
      alert("Mitra belum dipilih.");
      return;
    }

    const tx = {
      sender: {
        name: senderName,
        address,
        loc: userLoc,
      },
      receiver: {
        id: selectedFacility.id,
        name: selectedFacility.name,
        type: selectedFacility.type,
        address: selectedFacility.address,
        phone: selectedFacility.phone,
        lat: selectedFacility.lat,
        lon: selectedFacility.lon,
      },
      distanceKm: Number(distKm?.toFixed?.(2) ?? 0),
      // Simpan courier yang dipilih user
      shipping: selfDropoff
        ? { mode: "self", provider: null, label: "Antar Sendiri" }
        : {
            mode: "courier",
            provider: courier.code,
            label: courier.label,
            eta: courier.eta,
            payNote: courier.payNote,
          },
      resi: "",
    };

    const id = addTransaction(tx);
    setCurrentTxId(id);
    router.push(`/wastebank/detail/sent/transaction/${id}`);
  };

  return (
    <div className="mx-auto w-[92%] sm:w-[640px] py-4 space-y-4">
      {/* PENGIRIM */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">PENGIRIM</h2>
          <button
            className="text-emerald-700 text-sm inline-flex items-center gap-1 hover:underline"
            onClick={() => router.push("/wastebank")}
            title="Ganti data pengirim"
          >
            Ganti <Pencil className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2">
          <p className="font-semibold text-slate-900">{senderName || "—"}</p>
          <p className="text-sm text-slate-700">
            {address || "Alamat belum diatur"}
          </p>
        </div>
      </section>

      {/* PENERIMA */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">PENERIMA</h2>
          <button
            className="text-emerald-700 text-sm inline-flex items-center gap-1 hover:underline"
            onClick={() => router.push("/wastebank/detail")}
            title="Ganti mitra penerima"
          >
            Ganti <Pencil className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-2">
          <p className="font-semibold text-slate-900">
            {selectedFacility.name} ({selectedFacility.type})
          </p>
          {selectedFacility.phone && (
            <p className="text-sm text-slate-700">{selectedFacility.phone}</p>
          )}
          <p className="text-sm text-slate-700">
            {selectedFacility.address || "Alamat mitra belum tersedia"}
          </p>
        </div>

        <div className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-700">
          <MapPin className="h-4 w-4" />
          Perkiraan jarak {distKm.toFixed(1)} KM
        </div>
      </section>

      {/* JASA PENGIRIMAN */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">
            JASA PENGIRIMAN
          </h2>
          {!selfDropoff && (
            <button
              className="text-slate-700 text-sm inline-flex items-center gap-1"
              onClick={() => setOpenChoose(true)}
              title="Pilih kurir lain"
            >
              Pilih Kurir Lainnya <ChevronDown className="h-4 w-4" />
            </button>
          )}
        </div>

        <div
          className={`mt-2 rounded-xl border p-3 flex items-center justify-between ${
            selfDropoff ? "opacity-40 pointer-events-none" : "border-slate-200"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 grid place-items-center rounded-full bg-emerald-50 border border-emerald-200">
              <Truck className="h-5 w-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-sm text-black font-medium">{courier.label}</p>
              <p className="text-xs text-slate-600">{courier.eta}</p>
              <p className="text-[11px] text-slate-500">{courier.payNote}</p>
            </div>
          </div>
          <div className="text-sm font-semibold">
            {currency(selfDropoff ? 0 : courier.price)}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <label htmlFor="selfDrop" className="text-sm text-slate-800">
            Saya bawa sendiri ke mitra tujuan
          </label>
          <input
            id="selfDrop"
            type="checkbox"
            checked={selfDropoff}
            onChange={(e) => setSelfDropoff(e.target.checked)}
            className="h-5 w-5 accent-emerald-600"
          />
        </div>
      </section>

      <div className="pt-2">
        <button
          onClick={handleConfirm}
          className="w-full rounded-xl bg-emerald-600 text-white px-4 py-3 text-sm font-semibold hover:bg-emerald-700 cursor-pointer"
        >
          Konfirmasi & Lanjut
        </button>
      </div>

      {openChoose && !selfDropoff && (
        <div
          className="fixed inset-0 z-[60] text-black bg-black/40 grid place-items-center p-4"
          onClick={() => setOpenChoose(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-base font-semibold">Pilih Jasa Pengiriman</h3>
              <button
                className="text-slate-600 hover:text-slate-900"
                onClick={() => setOpenChoose(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-auto">
              <div className="px-4 pt-3 pb-1 text-xs uppercase tracking-wide text-slate-500">
                Instant
              </div>
              {PROVIDERS.filter((p) => p.kind === "instant").map((p) => {
                const price = priceEstimate(p.code, distKm);
                const active = courier.code === p.code;
                return (
                  <button
                    key={p.code}
                    onClick={() => handlePick(p)}
                    className={`w-full flex items-center justify-between px-4 py-3 border-t ${
                      active ? "bg-emerald-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-sm font-medium">
                        {p.label}{" "}
                        {active && (
                          <Check className="inline h-4 w-4 text-emerald-700 ml-1" />
                        )}
                      </p>
                      <p className="text-xs text-slate-600">{p.eta}</p>
                      <p className="text-[11px] text-slate-500">{p.payNote}</p>
                    </div>
                    <div className="text-sm font-semibold">
                      {currency(price)}
                    </div>
                  </button>
                );
              })}

              <div className="px-4 pt-4 pb-1 text-xs uppercase tracking-wide text-slate-500">
                Pilih Kurir Lainnya
              </div>
              {PROVIDERS.filter((p) => p.kind === "regular").map((p) => {
                const price = priceEstimate(p.code, distKm);
                const active = courier.code === p.code;
                return (
                  <button
                    key={p.code}
                    onClick={() => handlePick(p)}
                    className={`w-full flex items-center justify-between px-4 py-3 border-t ${
                      active ? "bg-emerag-50" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-left">
                      <p className="text-sm font-medium">
                        {p.label}{" "}
                        {active && (
                          <Check className="inline h-4 w-4 text-emerald-700 ml-1" />
                        )}
                      </p>
                      <p className="text-xs text-slate-600">{p.eta}</p>
                      <p className="text-[11px] text-slate-500">{p.payNote}</p>
                    </div>
                    <div className="text-sm font-semibold">
                      {currency(price)}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t flex justify-end">
              <button
                className="rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-700"
                onClick={() => setOpenChoose(false)}
              >
                Pilih
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

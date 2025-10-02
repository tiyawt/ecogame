"use client";

import { useState, useRef } from "react";
import { Crosshair, Copy, Loader2 } from "lucide-react";
import MapLeaflet from "./MapLeaflet";
import SearchBox from "./SearchBox";
import FacilityList from "./FacilityList";
import { useGeocodeFacilities } from "@/hooks/useGeocodeFacilities";
import { useReverseGeocode } from "@/hooks/useReverseGeocode";
import { useWasteStore } from "@/store/wasteBankStore";

const INITIAL = { lat: -6.889, lon: 107.641 };

export default function WasteBank() {
  const [isLocating, setIsLocating] = useState(false);
  const [center, setCenter] = useState(INITIAL);
  const [address, setAddress] = useState("Tap/drag di peta atau cari lokasi…");
  const [accuracy, setAccuracy] = useState(null);
  const mapApiRef = useRef(null);

  const setUserLoc = useWasteStore((s) => s.setUserLoc);
  const searchFacilities = useWasteStore((s) => s.searchFacilities);
  const facilities = useWasteStore((s) => s.facilities);
  const loadingFacilities = useWasteStore((s) => s.loadingFacilities);
  const radius = useWasteStore((s) => s.radius);
  const setRadius = useWasteStore((s) => s.setRadius);
  const distanceFromUser = useWasteStore((s) => s.distanceFromUser);
  const selectFacility = useWasteStore((s) => s.selectFacility);
  const selectedFacility = useWasteStore((s) => s.selectedFacility);
  const error = useWasteStore((s) => s.error);
  const updateFacilityAddress = useWasteStore((s) => s.updateFacilityAddress);
  const senderName = useWasteStore((s) => s.senderName);
  const setSenderName = useWasteStore((s) => s.setSenderName);

  const labeler = useReverseGeocode({
    onLabeled: (label) => {
      setAddress(label);
      setUserLoc({ lat: center.lat, lon: center.lon }, label);
    },
  });

  const geocodingSet = useGeocodeFacilities(facilities, {
    updateFacilityAddress,
  });

  const updateLocation = async (lat, lon, { reverse = true } = {}) => {
    setCenter({ lat, lon });
    setUserLoc({ lat, lon }, address);
    if (reverse) await labeler(lat, lon);
  };

  const onMapReady = (api) => {
    mapApiRef.current = api;
  };

  const onMapPick = (lat, lon) => {
    setAccuracy(null);
    updateLocation(lat, lon, { reverse: true });
  };

  const onSelectSuggestion = (s) => {
    setAccuracy(null);
    setAddress(s.label);
    updateLocation(s.lat, s.lon, { reverse: false });
  };

  const useMyLocation = () => {
    if (!navigator?.geolocation) return;
    setIsLocating(true);

    let stopped = false;
    const start = Date.now();
    const stopWatch = () => {
      if (stopped) return;
      stopped = true;
      if (watchId != null) navigator.geolocation.clearWatch(watchId);
      setIsLocating(false);
    };

    const opts = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    };

    const ACC_GOOD = 50; // dalam meter
    const HARD_CAP_MS = 10000;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy: acc } = pos.coords;
        setAccuracy(Number.isFinite(acc) ? acc : null);
        updateLocation(latitude, longitude, { reverse: true });

        if (acc && acc <= ACC_GOOD) {
          stopWatch();
        } else if (Date.now() - start > HARD_CAP_MS) {
          stopWatch();
        }
      },
      () => {
        stopWatch();
      },
      opts
    );
  };

  const copyCoord = async () => {
    try {
      await navigator.clipboard.writeText(
        `${address} (${center.lat.toFixed(4)}, ${center.lon.toFixed(4)})`
      );
      alert("Koordinat berhasil disalin!");
    } catch {
      alert("Gagal menyalin koordinat");
    }
  };

  return (
    <section className="w-full md:py-30 md:px-30 ">
      <div className="mx-auto max-w-3xl">
        <div className="md:rounded-2xl md:border md:border-slate-200 bg-white shadow-xl overflow-hidden">
          {/* CARD HEADER */}
          <div className="px-5 md:px-8 py-6 md:border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
              Lokasi Pembuangan Sampah
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Pilih lokasi kamu, atur radius, lalu cari TPA/Bank Sampah
              terdekat.
            </p>
          </div>

          {/* CARD BODY */}
          <div className="px-5 md:px-8 py-6 space-y-8">
            {/* SECTION: MAP */}
            <div className="space-y-3">
              <div className="text-sm font-medium text-slate-800">
                Peta Lokasi
              </div>
              <MapLeaflet
                center={center}
                accuracy={accuracy}
                onPick={onMapPick}
                onReady={onMapReady}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Pengirim */}
              <div className="rounded-xl border border-slate-200 p-4">
                <label className="block text-[11px] uppercase tracking-wide text-slate-500">
                  Nama Pengirim
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Tulis nama kamu…"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-black placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Dipakai saat membuat order ke mitra.
                </p>
              </div>

              {/* Search Lokasi */}
              <div className="rounded-xl border border-slate-200 p-4">
                <label className="block text-[11px] uppercase tracking-wide text-slate-500 mb-2">
                  Cari Lokasi
                </label>
                <SearchBox countryCodes="id" onSelect={onSelectSuggestion} />
                <button
                  onClick={useMyLocation}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                >
                  {isLocating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Crosshair className="h-4 w-4" />
                  )}
                  Gunakan lokasi saat ini
                </button>
              </div>
            </div>

            {/* Lokasi aktif */}
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">
                Titik Lokasi Kamu
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 justify-between">
                <p className="font-semibold text-slate-800">
                  {center.lat.toFixed(4)}, {center.lon.toFixed(4)}
                </p>
                <button
                  onClick={copyCoord}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                >
                  <Copy className="h-4 w-4" /> Salin
                </button>
              </div>

              <p className="mt-1 text-sm text-slate-600">{address} </p>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="w-full md:flex-1 min-w-0">
                <div className="flex items-center gap-2 w-full">
                  <span className="text-slate-600 shrink-0">Radius</span>
                  <input
                    type="range"
                    min={1000}
                    max={10000}
                    step={500}
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="flex-1 w-full min-w-0 accent-emerald-600"
                  />
                  <span className="text-slate-600 shrink-0 w-16 text-right">
                    {(radius / 1000).toFixed(1)} km
                  </span>
                </div>
              </div>

              <div className="w-full md:w-auto md:shrink-0 md:ml-auto">
                <button
                  onClick={searchFacilities}
                  disabled={loadingFacilities}
                  className="inline-flex w-full md:w-auto items-center justify-center
                 rounded-xl bg-emerald-600 text-white
                 px-4 py-4 md:px-6 md:py-3 text-sm font-medium
                 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingFacilities ? "Mencari..." : "Cari TPA"}
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-800 mb-2">
                TPA/Bank Sampah terdekat ({facilities.length})
              </p>
              <FacilityList
                facilities={facilities}
                loading={loadingFacilities}
                error={error}
                selected={selectedFacility}
                onSelect={selectFacility}
                distanceFromUser={distanceFromUser}
                geocodingSet={geocodingSet}
              />
            </div>
          </div>

          <div className="px-5 md:px-8 py-4 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-500">
              Tips: kalau titiknya belum pas, geser pin di peta atau ketikkan
              nama tempat di kolom pencarian.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

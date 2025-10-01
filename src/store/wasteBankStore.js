"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const haversineKm = (a, b) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const la1 = toRad(a.lat),
    la2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

const mkId = () => "tx_" + Math.random().toString(36).slice(2, 8) + Date.now();
const genCode = () => "SYW" + Math.floor(100000 + Math.random() * 900000);

export const useWasteStore = create(
  persist(
    (set, get) => ({
      // Input Profile
      senderName: "",
      setSenderName: (name) => set({ senderName: name }),
      senderNote: "",
      setSenderNote: (note) => set({ senderNote: note }),

      // Location
      userLoc: null, // {lat, lon}
      address: "",
      setUserLoc: (loc, addr) =>
        set({ userLoc: loc, address: addr ?? get().address }),

      // Search TPA
      radius: 3000,
      setRadius: (r) => set({ radius: r }),
      loadingFacilities: false,
      facilities: [],
      error: null,

      // Selection TPA
      selectedFacility: null,
      selectFacility: (f) => set({ selectedFacility: f }),

      updateFacilityAddress: (id, address) =>
        set((state) => ({
          facilities: state.facilities.map((f) =>
            f.id === id ? { ...f, address } : f
          ),
          selectedFacility:
            state.selectedFacility?.id === id
              ? { ...state.selectedFacility, address }
              : state.selectedFacility,
        })),

      // Distance
      distanceFromUser: (f) => {
        const { userLoc } = get();
        if (!userLoc || !f) return 0;
        return haversineKm(userLoc, { lat: f.lat, lon: f.lon });
      },

      // Api
      searchFacilities: async () => {
        const { userLoc, radius } = get();
        if (!userLoc) {
          set({ error: "Lokasi user belum diset" });
          return [];
        }

        set({ loadingFacilities: true, error: null, facilities: [] });

        try {
          const url = `/api/overpass?lat=${userLoc.lat}&lon=${userLoc.lon}&radius=${radius}`;
          const res = await fetch(url);
          const data = await res.json();

          if (!res.ok) {
            const errorMsg = data?.error || `HTTP ${res.status}`;
            set({ error: errorMsg, facilities: [] });
            return [];
          }

          const rawFacilities = data?.facilities || [];
          if (rawFacilities.length === 0) {
            set({
              facilities: [],
              error: `Tidak ditemukan TPA/Bank Sampah dalam radius ${radius}m. Coba perbesar radius.`,
            });
            return [];
          }

          const sorted = rawFacilities
            .filter((f) => f.lat && f.lon)
            .sort((a, b) => {
              const distA = haversineKm(userLoc, { lat: a.lat, lon: a.lon });
              const distB = haversineKm(userLoc, { lat: b.lat, lon: b.lon });
              return distA - distB;
            });

          set({ facilities: sorted, error: null });
          return sorted;
        } catch (e) {
          set({ error: e.message || "Gagal mengambil data", facilities: [] });
          return [];
        } finally {
          set({ loadingFacilities: false });
        }
      },

      // Transaksi
      currentTxId: null,
      setCurrentTxId: (id) => set({ currentTxId: id }),
      transactions: [],

      addTransaction: (tx) => {
        const id = mkId();
        const now = Date.now();
        const base = {
          id,
          code: genCode(),
          createdAt: now,
          expiresAt: now + 24 * 60 * 60 * 1000, // auto-hapus > 1 hari
          status: "waiting", // waiting | done | cancelled
          materials: [],
        };
        set((s) => ({ transactions: [{ ...base, ...tx }, ...s.transactions] }));
        return id;
      },

      getTransaction: (id) => get().transactions.find((t) => t.id === id),

      updateTransaction: (id, patch) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, ...patch } : t
          ),
        })),

      updateTransactionStatus: (id, status) =>
        set((s) => ({
          transactions: s.transactions.map((t) =>
            t.id === id ? { ...t, status } : t
          ),
        })),

      removeTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
        })),

      purgeExpired: () =>
        set((s) => ({
          transactions: s.transactions.filter(
            (t) => Date.now() - (t?.createdAt ?? 0) < 86400000
          ),
        })),
    }),
    {
      name: "greencycle:wastebank:v3",
      version: 3,
      storage: createJSONStorage(() => localStorage),
      migrate: (state) => ({
        ...state,
        transactions: Array.isArray(state?.transactions)
          ? state.transactions
          : [],
        currentTxId: state?.currentTxId ?? null,
      }),
      partialize: (s) => ({
        userLoc: s.userLoc,
        address: s.address,
        radius: s.radius,
        selectedFacility: s.selectedFacility,
        senderName: s.senderName,
        senderNote: s.senderNote,
        transactions: s.transactions,
        currentTxId: s.currentTxId,
      }),
    }
  )
);

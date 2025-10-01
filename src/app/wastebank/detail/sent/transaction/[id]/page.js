"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useWasteStore } from "@/store/wasteBankStore";
import Transaction from "@/app/wastebank/components/Transaction";

const GridMotionBg = dynamic(
  () => import("@/app/wastebank/components/GridMotionBg"),
  { ssr: false }
);

export default function TransactionByIdPage() {
  const router = useRouter();
  const { id } = useParams();

  const getTransaction = useWasteStore((s) => s.getTransaction);
  const purgeExpired = useWasteStore((s) => s.purgeExpired);

  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    if (useWasteStore.persist?.hasHydrated?.()) setHydrated(true);
    const unsub = useWasteStore.persist?.onFinishHydration?.(() =>
      setHydrated(true)
    );
    return () => unsub?.();
  }, []);

  const tx = React.useMemo(
    () => (hydrated && id ? getTransaction(String(id)) : null),
    [hydrated, id, getTransaction]
  );

  React.useEffect(() => {
    if (hydrated) purgeExpired();
  }, [hydrated, purgeExpired]);

  React.useEffect(() => {
    if (!hydrated) return;
    if (id && !tx) router.replace("/wastebank/transaction");
  }, [hydrated, id, tx, router]);

  return (
    <main className="relative min-h-dvh">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 hidden md:block"
      >
        <GridMotionBg className="h-full w-full" />
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />
      </div>

      <div
        aria-hidden
        className="fixed inset-0 -z-10 md:hidden bg-gradient-to-b from-slate-100 to-white"
      />

      <section className="w-full md:py-30 md:px-30 ">
        <div className="mx-auto max-w-3xl">
          <div className="md:rounded-2xl md:border md:border-slate-200 bg-white shadow-xl overflow-hidden">
            <div className="px-5 md:px-8 py-6 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                Detail Transaksi
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Ringkasan dan status transaksi kamu.
              </p>
            </div>

            <div className="px-5 md:px-8 py-6">
              {!hydrated ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-6 w-48 rounded bg-slate-200" />
                  <div className="h-4 w-64 rounded bg-slate-200" />
                  <div className="h-40 rounded bg-slate-200" />
                </div>
              ) : tx ? (
                <Transaction tx={tx} />
              ) : (
                <div className="text-sm text-slate-600">Memuat transaksi…</div>
              )}
            </div>

            <div className="px-5 md:px-8 py-4 border-t border-slate-200 bg-slate-50">
              <p className="text-xs text-slate-500">
                Tip: simpan tautan halaman ini atau cek lagi lewat menu
                Transaksi
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

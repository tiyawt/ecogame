"use client";

export default function ShareSheet({
  open,
  onClose,
  sharing,
  onSystem,
  onTwitter,
  onWhatsApp,
  onTelegram,
  onCopy,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px]" />
      <div
        className="absolute left-1/2 bottom-4 -translate-x-1/2 w-[92vw] max-w-md"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="rounded-2xl bg-white/95 shadow-xl border border-slate-200 p-4">
          <div className="mb-3 text-sm text-slate-700">
            {sharing ? "Menyiapkan konten..." : "Bagikan ke:"}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button onClick={onSystem} disabled={sharing} className="btn-share">System</button>
            <button onClick={onTwitter} disabled={sharing} className="btn-share">X / Twitter</button>
            <button onClick={onWhatsApp} disabled={sharing} className="btn-share">WhatsApp</button>
            <button onClick={onTelegram} disabled={sharing} className="btn-share">Telegram</button>
            <button onClick={onCopy} disabled={sharing} className="btn-share col-span-2">Copy Text</button>
          </div>
          <div className="mt-3 flex justify-end">
            <button onClick={onClose} className="px-3 py-1.5 text-sm rounded-md border border-slate-300 hover:bg-slate-50">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

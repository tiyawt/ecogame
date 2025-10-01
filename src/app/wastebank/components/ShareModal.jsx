"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const enc = (s) => encodeURIComponent(s);

export default function ShareModal({
  open,
  onClose,
  message = "Saya baru berpartisipasi di program GreenCycle. Yuk kelola sampah dengan bijak dan dukung Indonesia Bebas Sampah.",
  url = "https://greencycle-perempuan-inovasi.netlify.app/",
}) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();

    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const fullText = `${message} ${url}`;

  const links = {
    whatsapp: `https://wa.me/?text=${enc(fullText)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(
      url
    )}&quote=${enc(message)}`,
    twitter: `https://twitter.com/intent/tweet?text=${enc(message)}&url=${enc(
      url
    )}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
  };

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-50 grid place-items-center"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="relative z-10 w-[min(92vw,420px)] rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5">
        <button
          ref={closeBtnRef}
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
          aria-label="Tutup"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-6 pt-8 pb-6 text-center">
          <div className="mx-auto mb-5 h-28 w-full">
            <img
              src="/assets/share.png"
              alt="ilustrasi"
              className="mx-auto h-full object-contain pointer-events-none select-none"
              draggable="false"
            />
          </div>

          <h3 className="text-lg font-semibold text-slate-900">Bagikan</h3>
          <p className="mt-1 text-sm text-slate-600">
            Bagikan aksi baik kamu dan ajak orang sekitar untuk melakukan aksi
            bijak kelola sampah bersama.
          </p>

          <div className="mt-4 flex items-center justify-center gap-3">
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bagikan ke WhatsApp"
              className="grid h-11 w-11 place-items-center rounded-full bg-emerald-50 ring-1 ring-emerald-100 hover:bg-emerald-100"
              title="WhatsApp"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#10b981">
                <path d="M20.52 3.48A11.94 11.94 0 0012 .5C5.73.5.64 5.59.64 11.86c0 2.1.55 4.08 1.6 5.86L.5 23.5l5.92-1.7a11.38 11.38 0 005.58 1.46h.02c6.26 0 11.36-5.09 11.36-11.36 0-3.03-1.18-5.88-3.26-8.02zM12.02 21a9.47 9.47 0 01-4.83-1.32l-.35-.2-3.52 1.02 1-3.43-.23-.35A9.49 9.49 0 1121.5 11.86C21.5 17.05 17.21 21 12.02 21zm5.5-6.75c-.3-.15-1.75-.86-2.03-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.95 1.16-.17.2-.35.23-.64.08-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.73-1.64-2.02-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.53.08-.8.38-.27.3-1.05 1.02-1.05 2.48 0 1.46 1.08 2.87 1.23 3.06.15.2 2.13 3.25 5.16 4.55.72.31 1.29.5 1.73.64.73.23 1.38.2 1.9.12.58-.09 1.75-.72 2-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z" />
              </svg>
            </a>

            <a
              href={links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bagikan ke Facebook"
              className="grid h-11 w-11 place-items-center rounded-full bg-sky-50 ring-1 ring-sky-100 hover:bg-sky-100"
              title="Facebook"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#0ea5e9">
                <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07c0 5.03 3.68 9.2 8.48 9.93v-7.03H7.9v-2.9h2.43V9.97c0-2.4 1.43-3.72 3.62-3.72 1.05 0 2.16.19 2.16.19v2.37h-1.22c-1.2 0-1.58.75-1.58 1.52v1.83h2.69l-.43 2.9h-2.26V22c4.8-.72 8.48-4.9 8.48-9.93z" />
              </svg>
            </a>

            <a
              href={links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bagikan ke Twitter"
              className="grid h-11 w-11 place-items-center rounded-full bg-slate-50 ring-1 ring-slate-100 hover:bg-slate-100"
              title="Twitter / X"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#0f172a">
                <path d="M18.244 2.25h3.006l-6.57 7.51 7.72 11.99h-6.04l-4.73-6.91-5.41 6.91H3.164l7.03-8.98L2.75 2.25h6.19l4.27 6.18 5.034-6.18zm-1.06 17.5h1.66L7.9 3.86H6.14l11.044 15.89z" />
              </svg>
            </a>

            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bagikan ke LinkedIn"
              className="grid h-11 w-11 place-items-center rounded-full bg-cyan-50 ring-1 ring-cyan-100 hover:bg-cyan-100"
              title="LinkedIn"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="#06b6d4">
                <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5C0 2.12 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zm7.5 0h3.83v2.11h.05c.53-1.01 1.83-2.07 3.77-2.07 4.03 0 4.78 2.65 4.78 6.09V24h-4v-7.78c0-1.86-.03-4.26-2.6-4.26-2.6 0-3 2.03-3 4.12V24h-4V8.5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

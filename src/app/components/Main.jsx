import React from "react";

function Main() {
  return (
    <section
      className="
        relative overflow-hidden
        bg-white
        py-16 md:py-24
      "
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 items-start">
        {/* LEFT: copy + CTAs */}
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-amber-700/70">
            build once, share in a single short clip
          </p>

          <h2 className="mt-4 font-serif text-3xl md:text-5xl font-semibold text-amber-900 leading-tight">
            Luar Biasa, UI Intuitif
            <br className="hidden md:block" />
            untuk <span className="text-amber-600">pembuatan game</span>
          </h2>

          <p className="mt-5 text-sm md:text-base text-amber-900/80 max-w-xl">
            Desain level, kelola aset, dan publish tanpa ribet. Workflow
            yang smooth untuk pemula maupun pro—cukup fokus bikin yang seru.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-4">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-white bg-[#2b1c3d] shadow-[0_8px_24px_rgba(43,28,61,0.25)] hover:opacity-95 active:translate-y-[1px]"
            >
              Mulai Proyekmu
            </a>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium text-amber-900 border border-amber-900/30 bg-white/40 backdrop-blur hover:bg-white/60"
            >
              Lihat dokumentasi
            </a>
          </div>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { k: "Retention", v: "34.4%", d: "naik 12% year-over-year" },
            { k: "Completion", v: "28.3%", d: "dengan playtime > 30m" },
            { k: "Publish rate", v: "54.9%", d: "dalam 2-klik workflow" },
            { k: "FPS stable", v: "223↑", d: "optimasi draw calls" },
          ].map((card, i) => (
            <div
              key={i}
              className="
                relative rounded-2xl p-5
                bg-[rgba(255,255,255,0.55)]
                border border-white/40
                shadow-[0_10px_25px_rgba(164,109,38,0.15)]
                hover:shadow-[0_14px_30px_rgba(164,109,38,0.22)]
                transition-shadow
              "
            >
              
              <div className="absolute -top-2 -left-2 h-6 w-6 rounded-lg bg-amber-500/90" />
              <div className="absolute -top-2 -right-2 h-6 w-6 rounded-lg bg-amber-300/90" />

              <p className="text-[11px] uppercase tracking-wide text-amber-800/70">
                {card.k}
              </p>
              <p className="mt-2 text-3xl font-semibold text-amber-900">
                {card.v}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-amber-900/70">
                {card.d}
              </p>

              
              <div className="mt-4 flex items-center justify-between text-[11px] text-amber-900/60">
                <span className="inline-flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Stable
                </span>
                <span className="px-2 py-1 rounded-full bg-white/60 border border-white/70">
                  v1.0
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_10%,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0)_60%)]" />
    </section>
  );
}

export default Main;

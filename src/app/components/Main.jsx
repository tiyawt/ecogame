import React from "react";
import CircularGallery from "@/components/CircularGallery";

function Main() {
  return (
    <section
      className="
        relative overflow-hidden
        bg-white
        py-16 md:py-18
      "
    >
      <div className="max-w-7xl md:mb-25 md:mt-25 mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-green-700/70">
            Ibu Jadi Kunci Rumah Bersih, Lingkungan Sehat
          </p>

          <h2 className="mt-4 text-3xl md:text-5xl font-semibold text-green-900 leading-tight">
            Perubahan Besar
            <br className="hidden md:block" />
            Dimulai <span className="text-green-600">dari Ibu di Rumah</span>
          </h2>

          <p className="mt-5 text-sm md:text-base text-green-900/80 max-w-xl">
            Banyak masalah lingkungan bermula dari sampah rumah tangga yang
            tidak dipilah, sehingga menumpuk, berbau, mencemari tanah dan air.
            Green Cycle hadir untuk membantu ibu mengelola sampah dengan cara
            yang mudah dan menyenangkan. Mulai dari memilah sisa dapur hingga
            mengirimkannya ke tempat yang tepat, langkah kecil ibu di rumah bisa
            menciptakan perubahan besar bagi lingkungan dan generasi berikutnya.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              v: "53,74% sampah nasional berasal dari rumah tangga.",
              d: "Sistem Informasi Pengelolaan Sampah Nasional (SIPSN) KLHK",
            },
            {
              v: "Media edukasi interaktif efektif meningkatkan kebiasaan memilah sampah.",
              d: "Tresnawati, 2021",
            },
            {
              v: "Ibu rumah tangga berperan penting namun sering terkendala pengetahuan",
              d: "Munggaran, 2023",
            },
            {
              v: "Sampah yang tidak dikelola dapat mencemari lingkungan dan memicu penyakit",
              d: "Ompusunggu dkk, 2025",
            },
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
              <div className="absolute -top-2 -left-2 h-6 w-6 rounded-lg bg-[#5D8374]/90" />
              <div className="absolute -top-2 -right-2 h-6 w-6 rounded-lg bg-green-700/90" />

              <p className="mt-2 text-xl md:text-3xl font-semibold text-[#5D8374]">
                {card.v}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-green-900/70">
                {card.d}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-20" style={{ height: "650px", position: "relative" }}>
        <h1 className="text-green-700 text-center font-semibold text-2xl md:text-5xl leading-tight">
          Dari Rumah ke Bank Sampah
        </h1>
        <p className="mt-8 text-sm md:text-base text-center text-green-900/80 px-2 md:px-20 mb-5">
          Dari dapur hingga ke Bank Sampah, inilah potret kerja keras para
          pejuang lingkungan yang mengubah kebiasaan kecil menjadi dampak besar
          dari memilah sisa makanan, memisahkan plastik dan kertas, hingga
          mengedukasi warga sekitar. Mereka membuktikan bahwa langkah sederhana
          yang dilakukan dengan tekun dapat menjaga kebersihan rumah, mengurangi
          tumpukan sampah, dan membawa harapan bagi bumi yang lebih hijau untuk
          generasi mendatang
        </p>
        <div className="w-full h-76 sm:h-64 md:h-126 lg:h-[30rem] overflow-hidden">
          <CircularGallery
            bend={3}
            textColor="black"
            borderRadius={0.05}
            scrollEase={0.02}
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_20%_10%,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0)_60%)]" />
    </section>
  );
}

export default Main;

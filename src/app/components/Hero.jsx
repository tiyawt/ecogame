export default function Hero() {
  return (
    <section className="relative w-full">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="block w-full h-auto object-contain"
      >
        <source src="/video/large.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0" />

      <div className="absolute inset-0 grid place-content-center px-4 text-center text-black">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-[clamp(28px,6vw,56px)] font-extrabold leading-tight">
            Bersih Mulai dari Rumah
          </h1>
          <p className="mt-4 text-[clamp(14px,3vw,18px)] text-black">
            Bantu ibu kelola sampah rumah tangga dengan cara yang lebih mudah
            dan bertanggung jawab.
          </p>
          <div className="mt-8 flex sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 w-full sm:w-auto bg-[#AAC5B8] font-medium rounded hover:bg-[#dceee5] hover:cursor-pointer">
              Kirim Sampah
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
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
          <p className="mt-2 md:mt-4 text-[clamp(14px,3vw,18px)] text-black">
            Bantu ibu kelola sampah rumah tangga dengan cara yang lebih mudah
            dan bertanggung jawab.
          </p>
          <div className="mt-2 md:mt-5 flex sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/wastebank")}
              className="px-6 py-3 w-full sm:w-auto bg-[#AAC5B8] font-medium rounded hover:bg-[#dceee5] hover:cursor-pointer"
            >
              Kirim Sampah
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

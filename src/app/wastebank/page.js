"use client";

import dynamic from "next/dynamic";
import WasteBank from "./components/WasteBank";

const GridMotionBg = dynamic(() => import("./components/GridMotionBg"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <main className="relative min-h-dvh">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 hidden md:block"
      >
        <GridMotionBg className="h-full w-full" />
        <div className="absolute inset-0 bg-white" />
      </div>

      <div
        aria-hidden
        className="fixed inset-0 -z-10 md:hidden"
      />

      <WasteBank />
    </main>
  );
}

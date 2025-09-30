"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-transparent absolute top-0 left-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-neon">
          G<span className="text-yellow-400">Dev</span>
        </Link>

        <ul className="hidden md:flex gap-8 text-xs uppercase tracking-wider font-bold">
          <li>
            <Link
              href="/"
              className={`hover:text-neon ${
                pathname === "/" ? "text-[#287351]" : "text-[#6D974C]"
              }`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/wastebank"
              className={`hover:text-neon ${
                pathname.startsWith("/wastebank")
                  ? "text-[#287351]"
                  : "text-[#6D974C]"
              }`}
            >
              Kirim sampah
            </Link>
          </li>
          <li>
            <Link
              href="/game"
              className={`hover:text-neon ${
                pathname.startsWith("/game") ? "text-neon" : "text-[#6D974C]"
              }`}
            >
              Game
            </Link>
          </li>
        </ul>

        <Link
          href="/transactions"
          className="bg-neon text-[#6D974C] px-4 py-2 rounded shadow hover:opacity-90 font-bold"
        >
          Transaksi
        </Link>
      </div>
    </nav>
  );
}

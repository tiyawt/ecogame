"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const linkClass = (active) =>
    `hover:text-neon ${active ? "text-yellow-300" : "text-green-600"}`;

  return (
    <nav className="w-full bg-transparent absolute top-0 left-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 ">
        <Link
          href="/"
          className="text-xl font-bold text-green-600 hover:translate-y-1"
        >
          Green<span className="text-yellow-300">Cycle</span>
        </Link>

        {/* MENU DESKTOP */}
        <ul className="hidden md:flex gap-8 text-xs uppercase tracking-wider">
          <li className="hover:translate-y-1">
            <Link href="/" className={linkClass(pathname === "/")}>
              Home
            </Link>
          </li>
          <li className="hover:translate-y-1">
            <Link
              href="/wastebank"
              className={linkClass(pathname.startsWith("/wastebank"))}
            >
              Kirim sampah
            </Link>
          </li>
          <li className="hover:translate-y-1">
            <Link
              href="/game"
              className={linkClass(pathname.startsWith("/game"))}
            >
              Game
            </Link>
          </li>
        </ul>

        <Link
          href="/transactions"
          className="hidden md:inline-block bg-[#AAC5B8] text-black px-4 py-2 rounded font-medium shadow hover:bg-[#d3e9de] "
        >
          Transaksi
        </Link>

        {/* HAMBURGER MOBILE */}
        <button
          className="md:hidden text-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <HiX size={28} /> : <HiMenu size={28} />}
        </button>
      </div>

      {/* MENU MOBILE */}
      {open && (
        <div className="md:hidden bg-white backdrop-blur shadow-lg rounded-b-xl px-6 py-4">
          <ul className="flex flex-col items-center gap-4 text-sm font-bold uppercase tracking-wider">
            <li>
              <Link href="/" className={linkClass(pathname === "/")}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/wastebank"
                className={linkClass(pathname.startsWith("/wastebank"))}
              >
                Kirim Sampah
              </Link>
            </li>
            <li>
              <Link
                href="/game"
                className={linkClass(pathname.startsWith("/game"))}
              >
                Game
              </Link>
            </li>
            <li>
              <Link
                href="/transactions"
                className="block text-center bg-neon text-green-700 px-4 py-2 rounded font-medium"
              >
                Transaksi
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}

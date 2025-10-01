"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TransactionsLayout({ children }) {
  const pathname = usePathname();
  const tabs = [
    { href: "/transactions/process", label: "Proses" },
    { href: "/transactions/done", label: "Selesai" },
    { href: "/transactions/cancel", label: "Batal" },
  ];

  return (
    <div className="mx-auto mt-4 sm:mt-8 md:mt-30 sm:mb-12 w-full px-4 sm:w-[92%] lg:w-[75%] max-w-[900px]">
      <div className="flex gap-2 sm:gap-6 lg:gap-8 border-b bg-white sticky top-0 z-10 -mx-4 px-4 sm:mx-0 sm:px-0">
        {tabs.map((t) => {
          const active = pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`px-3 sm:px-5 lg:px-6 py-2.5 sm:py-3 text-xs sm:text-sm lg:text-base font-medium border-b-2 transition whitespace-nowrap
                ${
                  active
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
            >
              {t.label}
            </Link>
          );
        })}
      </div>
      <div className="mt-3 sm:mt-6 lg:mt-8">{children}</div>
    </div>
  );
}

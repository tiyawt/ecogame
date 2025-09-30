"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const hideNav = pathname.startsWith("/game");

  return (
    <>
      {!hideNav && <Navbar />}
      {children}
      {!hideNav && <Footer />}
    </>
  );
}

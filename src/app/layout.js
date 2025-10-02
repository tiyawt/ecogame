import "./globals.css";
import ClientWrapper from "./components/ClientWrapper";

export const metadata = {
  title: "GreenCycle",
  description: "Waste sorting web app",
  icons: {
    icon: [{ url: "/assets/waste-bin.png", type: "image/png", sizes: "32x32" }],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-pixel bg-night text-white pt-18 md:pt-0">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}

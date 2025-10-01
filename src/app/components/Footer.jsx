import {
  FaTwitter,
  FaYoutube,
  FaDiscord,
  FaApple,
  FaAndroid,
  FaFacebook,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#5D8374] text-white py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* Tagline */}
        <h2 className="text-2xl md:text-3xl font-semibold">
          Bersama ibu <span className="text-white">Mulai Perubahan dari Rumah</span>
        </h2>

        {/* Description */}
        <p className="mt-4 text-sm text-white leading-relaxed">
          Dengan langkah sederhana dari rumah, sampah bisa dikelola lebih baik.
          Green Cycle hadir untuk memudahkan setiap ibu membuat dampak besar.
        </p>

        {/* Social / platform icons */}
        <div className="mt-8 flex justify-center gap-6 text-2xl">
          <a href="https://x.com/" className="hover:text-[#cae2d9] transition-colors">
            <FaTwitter />
          </a>
          <a href="https://discord.com/" className="hover:text-[#cae2d9] transition-colors">
            <FaDiscord />
          </a>
          <a href="https://www.youtube.com/" className="hover:text-[#cae2d9] transition-colors">
            <FaYoutube />
          </a>
          <a href="http://facebook.com/" className="hover:text-[#cae2d9] transition-colors">
            <FaFacebook />
          </a>
        </div>
      </div>
    </footer>
  );
}

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
    <footer className="bg-[#161329] text-white py-16 px-4">
      <div className="max-w-3xl mx-auto text-center">
        {/* Tagline */}
        <h2 className="text-2xl md:text-3xl font-semibold">
          Publish your game <span className="text-cyan-400">in two clicks</span>
        </h2>

        {/* Description */}
        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Games created with <span className="font-medium">GDevelop</span> run
          anywhere and can be exported in a single click. On the web, as a
          mobile app for iOS and Android, or publish on Steam, Facebook Gaming,
          Itch.io, Newgrounds, the Microsoft Store, and more.
        </p>

        {/* Social / platform icons */}
        <div className="mt-8 flex justify-center gap-6 text-2xl">
          <a href="#" className="hover:text-cyan-400 transition-colors">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-cyan-400 transition-colors">
            <FaDiscord />
          </a>
          <a href="#" className="hover:text-cyan-400 transition-colors">
            <FaYoutube />
          </a>
          <a href="#" className="hover:text-cyan-400 transition-colors">
            <FaApple />
          </a>
          <a href="#" className="hover:text-cyan-400 transition-colors">
            <FaAndroid />
          </a>
          <a href="#" className="hover:text-cyan-400 transition-colors">
            <FaFacebook />
          </a>
        </div>
      </div>
    </footer>
  );
}

import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function Header() {
  return (
    <header className="relative w-full py-4 bg-gray-800">
      <h1 className="text-xl sm:text-3xl font-bold text-gray-200 text-center ">
        Search for a topic from your chosen channel(s)
      </h1>
      <div className="absolute flex gap-3 bottom-1 right-0 mr-2">
        <a href="https://linkedin.com/in/alokyadavcodes" target="_blank">
          <FaLinkedin />
        </a>
        <a href="https://github.com/AlokYadavCodes/youtube-channel-search">
          <FaGithub />
        </a>
        <a href="https://x.com/alokcodes" target="_blank">
          <FaXTwitter />
        </a>
      </div>
    </header>
  );
}

export default Header;

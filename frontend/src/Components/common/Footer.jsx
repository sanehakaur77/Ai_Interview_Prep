import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faTwitter,
  faGithub,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap');
        .footer-container * {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <footer className="footer-container w-full bg-white border-t py-14 px-6 md:px-16 lg:px-24">
        {/* INNER WRAPPER - Centered and constrained */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-12">
          {/* LEFT SECTION - Links Group */}
          <div className="flex flex-wrap gap-10 md:gap-[60px] xl:gap-[120px] flex-1">
            {/* LOGO */}
            <div className="min-w-[150px]">
              <a href="/">
                <h1 className="text-xl font-semibold text-emerald-600">
                  YourBrand
                </h1>
              </a>
            </div>

            {/* PRODUCT */}
            <div>
              <p className="text-gray-900 font-semibold mb-4">Product</p>
              <ul className="space-y-2 text-[13px] text-gray-600">
                {["Home", "Support", "Pricing", "Affiliate"].map((item) => (
                  <li key={item}>
                    <a
                      href="/"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* RESOURCES */}
            <div>
              <p className="text-gray-900 font-semibold mb-4">Resources</p>
              <ul className="space-y-2 text-[13px] text-gray-600">
                <li>
                  <a
                    href="/"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Company
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Blogs
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="hover:text-emerald-600 transition-colors inline-flex items-center"
                  >
                    Careers
                    <span className="text-[10px] text-white bg-emerald-500 rounded ml-2 px-2 py-0.5 font-medium">
                      Hiring
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    About
                  </a>
                </li>
              </ul>
            </div>

            {/* LEGAL */}
            <div>
              <p className="text-gray-900 font-semibold mb-4">Legal</p>
              <ul className="space-y-2 text-[13px] text-gray-600">
                <li>
                  <a
                    href="/"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Privacy
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="hover:text-emerald-600 transition-colors"
                  >
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT SECTION - Info & Socials */}
          <div className="flex flex-col items-start lg:items-end text-left lg:text-right gap-4 lg:min-w-[300px]">
            <p className="max-w-xs text-gray-500 text-[13px] leading-relaxed">
              Making every customer feel valued—no matter the size of your
              audience.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex items-center gap-5 mt-2 text-gray-400">
              {[faLinkedin, faTwitter, faGithub, faYoutube].map((icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="hover:text-emerald-600 transition-all transform hover:scale-110"
                >
                  <FontAwesomeIcon icon={icon} size="lg" />
                </a>
              ))}
            </div>

            {/* COPYRIGHT */}
            <div className="mt-2 text-[13px] text-gray-400">
              © 2026{" "}
              <span className="text-emerald-600 font-medium">YourBrand</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

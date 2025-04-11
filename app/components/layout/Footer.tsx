import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  FaTwitter,
  FaLinkedinIn,
  FaGithub,
  FaYoutube,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const currentDateTime = "2025-03-03 18:59:14";
  const currentUser = "vkhare2909";

  return (
    <footer className="relative z-10 mt-20">
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent -z-10" />

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="container mx-auto px-6 pt-16 pb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span
                className="text-xl font-bold"
                style={{
                  background:
                    "linear-gradient(to right, #4f46e5, #7e22ce, #ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                SkillBridge
              </span>
            </Link>
            <p className="text-gray-400 text-sm">
              AI-powered career navigation platform with blockchain-backed
              credentials to help you level up your career.
            </p>
            <div className="flex items-center space-x-4">
              <motion.a
                whileHover={{ y: -4 }}
                href="#"
                className="text-gray-400 hover:text-[#1DA1F2] transition-colors duration-300"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </motion.a>
              <motion.a
                whileHover={{ y: -4 }}
                href="#"
                className="text-gray-400 hover:text-[#0A66C2] transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={20} />
              </motion.a>
              <motion.a
                whileHover={{ y: -4 }}
                href="#"
                className="text-gray-400 hover:text-[#6e5494] transition-colors duration-300"
                aria-label="GitHub"
              >
                <FaGithub size={20} />
              </motion.a>
              <motion.a
                whileHover={{ y: -4 }}
                href="#"
                className="text-gray-400 hover:text-[#FF0000] transition-colors duration-300"
                aria-label="YouTube"
              >
                <FaYoutube size={20} />
              </motion.a>
              <motion.a
                whileHover={{ y: -4 }}
                href="#"
                className="text-gray-400 hover:text-[#EA4335] transition-colors duration-300"
                aria-label="Email"
              >
                <FaEnvelope size={20} />
              </motion.a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/career-guidance"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  AI Career Guidance
                </Link>
              </li>
              <li>
                <Link
                  href="/resume-builder"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  AI Resume Builder
                </Link>
              </li>
              <li>
                <Link
                  href="/credentials"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  Blockchain Credentials
                </Link>
              </li>
              <li>
                <Link
                  href="/visualization"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  3D Career Visualization
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  Job Matching
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/team"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  Our Team
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  Press
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-between text-gray-500 text-sm"
          >
            <p>&copy; {currentYear} SkillBridge. All rights reserved.</p>
            <div className="flex flex-wrap justify-center mt-4 md:mt-0">
              <span className="px-2 py-1 bg-gray-800/50 rounded-md mx-1 my-1">
                <span className="font-medium text-indigo-400">User:</span>{" "}
                {currentUser}
              </span>
              <span className="px-2 py-1 bg-gray-800/50 rounded-md mx-1 my-1">
                <span className="font-medium text-indigo-400">UTC:</span>{" "}
                {currentDateTime}
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-center mt-6"
          >
            <Link
              href="#"
              className="flex items-center px-4 py-2 rounded-full bg-gray-800/70 hover:bg-indigo-600/20 border border-indigo-500/30 transition-colors duration-300"
            >
              <span className="text-sm text-gray-300">Buy Me a Coffee</span>
              <span className="ml-2">☕</span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
}

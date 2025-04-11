"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  ChevronDown,
  ExternalLink,
  BookOpen,
  Rocket,
  LineChart,
  Zap,
  Globe,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ScrollProgress from "../ui/ScrollProgress";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState("2025-04-05 15:08:57");
  const [currentUser, setCurrentUser] = useState("vkhare2909");
  const pathname = usePathname();

  // Update date every minute
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const formatted = now.toISOString().replace("T", " ").substring(0, 19);
      setCurrentDateTime(formatted);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    {
      name: "For Students",
      href: "#",
      children: [
        {
          title: "Career Guidance",
          href: "/career-guidance",
          description: "Get personalized career advice and recommendations",
          icon: <LineChart className="h-5 w-5 text-indigo-400" />,
        },
        {
          title: "Skill Assessment",
          href: "/skill-assessment",
          description: "Verify and showcase your skills to investors",
          icon: <Zap className="h-5 w-5 text-purple-400" />,
        },
        {
          title: "Funding Options",
          href: "/funding",
          description: "Connect with investors and funding opportunities",
          icon: <Rocket className="h-5 w-5 text-pink-400" />,
        },
      ],
    },
    { name: "Resume Builder", href: "/resume-builder" },
    { name: "Marketplace", href: "/marketplace" },
    {
      name: "Community",
      href: "/community",
    },
    { name: "About", href: "/about" },
  ];

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  // Animation variants
  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const dropdownVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1], // Custom ease curve
        staggerChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: 10,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const dropdownItemVariants = {
    hidden: { opacity: 0, x: -5 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300 ${
          scrolled
            ? "bg-gray-900/80 backdrop-blur-lg shadow-lg"
            : "bg-transparent"
        }`}
        style={{
          boxShadow: scrolled ? "0 4px 30px rgba(0, 0, 0, 0.1)" : "none",
        }}
      >
        <ScrollProgress />
        <div className="container mx-auto flex items-center justify-between">
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

          {/* Desktop Navigation */}
          <motion.nav
            className="hidden lg:block"
            variants={navVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.ul className="flex items-center space-x-8">
              {navigation.map((item) => (
                <motion.li key={item.name} variants={itemVariants}>
                  {item.children ? (
                    <div className="relative group">
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        onMouseEnter={() => setActiveDropdown(item.name)}
                        className={`text-sm font-medium flex items-center gap-1 relative transition-colors duration-300 ${
                          activeDropdown === item.name
                            ? "text-indigo-400"
                            : "text-gray-300 hover:text-white"
                        }`}
                      >
                        {item.name}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform duration-200 ${
                            activeDropdown === item.name ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === item.name && (
                          <motion.div
                            variants={dropdownVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className="absolute left-0 mt-3 w-72 rounded-xl border border-gray-700/50 bg-gray-900/90 backdrop-blur-xl shadow-xl overflow-hidden"
                            onMouseLeave={() => setActiveDropdown(null)}
                            style={{
                              boxShadow:
                                "0 15px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
                            }}
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 z-0"></div>
                            <div className="relative z-10">
                              <div className="px-1 py-1">
                                {item.children.map((child) => (
                                  <motion.div
                                    key={child.title}
                                    variants={dropdownItemVariants}
                                  >
                                    <Link
                                      href={child.href}
                                      onClick={() => setActiveDropdown(null)}
                                      className="block rounded-lg m-1 p-3 hover:bg-white/5 transition-all duration-200 hover:scale-[1.02] group/item"
                                    >
                                      <div className="flex items-start">
                                        <div className="mr-3 mt-0.5">
                                          {child.icon || (
                                            <BookOpen className="h-5 w-5 text-indigo-400" />
                                          )}
                                        </div>
                                        <div>
                                          <div className="font-medium text-white text-sm flex items-center">
                                            {child.title}
                                            <ExternalLink className="h-3 w-3 ml-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity text-gray-400" />
                                          </div>
                                          {child.description && (
                                            <div className="text-xs text-gray-400 mt-1 group-hover/item:text-gray-300 transition-colors">
                                              {child.description}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </Link>
                                  </motion.div>
                                ))}
                              </div>
                              <div className="mt-1 px-3 py-3 bg-gray-800/50 border-t border-gray-700/30">
                                <Link
                                  href="/student-hub"
                                  className="text-xs flex items-center justify-between text-gray-400 hover:text-indigo-400 transition-colors"
                                >
                                  <span>View all student resources</span>
                                  <ChevronDown className="h-3 w-3 rotate-[-90deg]" />
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`text-sm font-medium relative transition-colors duration-300 ${
                        pathname === item.href
                          ? "text-indigo-400"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {item.name}
                      {pathname === item.href && (
                        <motion.span
                          layoutId="underline"
                          className="absolute left-0 right-0 bottom-[-5px] h-[2px] bg-indigo-400"
                        />
                      )}
                    </Link>
                  )}
                </motion.li>
              ))}
            </motion.ul>
          </motion.nav>

          <div className="flex items-center space-x-4">
            {/* Current datetime display */}
            <div className="hidden lg:block text-xs text-gray-400">
              <div>{currentDateTime}</div>
              <div className="text-right">{currentUser}</div>
            </div>

            {/* Auth buttons */}
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox:
                      "w-9 h-9 border-2 border-indigo-500/30",
                    userButtonTrigger:
                      "hover:scale-105 transition-transform duration-200",
                  },
                }}
              />
            </SignedIn>

            <SignedOut>
              <div className="flex items-center gap-3">
                <Link
                  href="/sign-in"
                  className="hidden sm:flex items-center gap-1 bg-transparent border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 transition-all duration-300 px-4 py-2 rounded-full text-sm"
                >
                  <span>Log In</span>
                  <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                  </motion.div>
                </Link>

                <Link
                  href="/sign-up"
                  className="hidden sm:block bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 px-4 py-2 rounded-full text-sm"
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative inline-block"
                  >
                    <span className="relative z-10">Sign Up</span>
                    <span className="absolute inset-0 bg-white/20 rounded-full blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  </motion.span>
                </Link>
              </div>
            </SignedOut>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors duration-300"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="lg:hidden fixed inset-0 z-40 bg-gray-900/95 backdrop-blur-lg pt-24"
          >
            <nav className="container mx-auto px-6 py-8">
              <ul className="space-y-6">
                {navigation.map((item) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.children ? (
                      <div className="space-y-3">
                        <button
                          className={`flex items-center text-lg font-medium transition-colors duration-300 ${
                            activeDropdown === item.name
                              ? "text-indigo-400"
                              : "text-gray-300 hover:text-white"
                          }`}
                          onClick={() => toggleDropdown(item.name)}
                        >
                          {item.name}
                          <ChevronDown
                            className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                              activeDropdown === item.name ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {activeDropdown === item.name && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 flex flex-col gap-4 border-l border-gray-700 mt-4">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.title}
                                    href={child.href}
                                    onClick={() => setIsOpen(false)}
                                    className="block p-2 rounded-lg bg-gray-800/30 hover:bg-gray-800/60 transition-colors"
                                  >
                                    <div className="flex items-start">
                                      <div className="mr-3 mt-0.5">
                                        {child.icon || (
                                          <BookOpen className="h-5 w-5 text-indigo-400" />
                                        )}
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-white">
                                          {child.title}
                                        </div>
                                        {child.description && (
                                          <div className="text-xs text-gray-400 mt-1">
                                            {child.description}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`text-lg font-medium block py-2 transition-colors duration-300 ${
                          pathname === item.href
                            ? "text-indigo-400"
                            : "text-gray-300 hover:text-white"
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </motion.li>
                ))}

                {/* Mobile auth buttons */}
                <div className="pt-6 space-y-4 border-t border-gray-800 mt-6">
                  <SignedIn>
                    <div className="flex justify-center">
                      <UserButton afterSignOutUrl="/" />
                    </div>
                  </SignedIn>

                  <SignedOut>
                    <Link
                      href="/sign-in"
                      className="w-full block text-center bg-transparent border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 transition-colors duration-300 px-4 py-3 rounded-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Log In
                    </Link>
                    <Link
                      href="/sign-up"
                      className="w-full block text-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 px-4 py-3 rounded-full"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </SignedOut>
                </div>
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes hover-effect {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
          100% {
            transform: translateY(0);
          }
        }

        a:hover {
          animation: hover-effect 0.5s ease;
        }

        /* Add shimmer effect to gradient text */
        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        /* Add glow effect to dropdown on hover */
        .dropdown-glow:hover {
          box-shadow: 0 0 15px rgba(79, 70, 229, 0.2);
        }
      `}</style>
    </>
  );
}

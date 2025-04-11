"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BarChart2,
  BookOpen,
  Users,
  Briefcase,
  DollarSign,
  Settings,
  Menu,
  X,
  Bell,
  LogOut,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<"student" | "investor" | null>(null);

  useEffect(() => {
    // Close sidebar on route change on mobile
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isLoaded && user) {
      // Fetch user role from API or use metadata
      const fetchUser = async () => {
        try {
          const response = await fetch(`/api/users/role?userId=${user.id}`);
          const data = await response.json();
          if (data.success) {
            setUserRole(data.role);
          } else {
            // Default to student if not found
            setUserRole("student");
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole("student");
        }
      };

      fetchUser();
    }
  }, [isLoaded, user]);

  const studentNavItems = [
    { href: "/dashboard/student", label: "Dashboard", icon: Home },
    { href: "/career/simulator", label: "Career Path", icon: BarChart2 },
    { href: "/career/assessments", label: "Skill Assessments", icon: BookOpen },
    { href: "/funding/apply", label: "Apply for Funding", icon: DollarSign },
    { href: "/community", label: "Community", icon: MessageSquare },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const investorNavItems = [
    { href: "/dashboard/investor", label: "Dashboard", icon: Home },
    {
      href: "/dashboard/investor/requests",
      label: "Funding Requests",
      icon: DollarSign,
    },
    {
      href: "/dashboard/investor/browse",
      label: "Browse Students",
      icon: Users,
    },
    {
      href: "/dashboard/investor/portfolio",
      label: "Investment Portfolio",
      icon: Briefcase,
    },
    { href: "/community", label: "Community", icon: MessageSquare },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const navItems = userRole === "investor" ? investorNavItems : studentNavItems;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <SignedIn>
        {/* Mobile Header */}
        <header className="lg:hidden bg-gray-800/80 backdrop-blur-md border-b border-gray-700/50 py-4 px-4 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white"
            >
              <Menu size={24} />
            </button>

            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                UpSkillr
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <button className="text-gray-400 hover:text-white relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                transition={{ type: "spring", damping: 25 }}
                className="absolute top-0 left-0 h-full w-80 bg-gray-800 border-r border-gray-700/50 overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-5 border-b border-gray-700/50 flex items-center justify-between">
                  <Link
                    href="/"
                    className="flex items-center gap-2"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                      UpSkillr
                    </span>
                  </Link>

                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700/50"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-5 border-b border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <UserButton afterSignOutUrl="/" />
                    <div>
                      <p className="font-medium">
                        {user?.fullName ||
                          `${user?.firstName} ${user?.lastName}`}
                      </p>
                      <p className="text-sm text-gray-400 capitalize">
                        {userRole || "User"}
                      </p>
                    </div>
                  </div>
                </div>

                <nav className="p-5">
                  <ul className="space-y-2">
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            pathname === item.href
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "hover:bg-gray-700/50 text-gray-300"
                          }`}
                          onClick={() => setSidebarOpen(false)}
                        >
                          <item.icon size={20} />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="p-5 mt-auto">
                  <button
                    onClick={() => router.push("/api/auth/signout")}
                    className="flex items-center gap-3 w-full p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <LogOut size={20} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Layout */}
        <div className="flex h-screen lg:overflow-hidden">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 border-r border-gray-700/50 bg-gray-800/80 backdrop-blur-md overflow-y-auto">
            <div className="p-5 border-b border-gray-700/50">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  UpSkillr
                </span>
              </Link>
            </div>

            <div className="p-5 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <UserButton afterSignOutUrl="/" />
                <div>
                  <p className="font-medium">
                    {user?.fullName || `${user?.firstName} ${user?.lastName}`}
                  </p>
                  <p className="text-sm text-gray-400 capitalize">
                    {userRole || "User"}
                  </p>
                </div>
              </div>
            </div>

            <nav className="p-5">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        pathname === item.href
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "hover:bg-gray-700/50 text-gray-300"
                      }`}
                    >
                      <item.icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-5 mt-auto border-t border-gray-700/50">
              <button
                onClick={() => router.push("/api/auth/signout")}
                className="flex items-center gap-3 w-full p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h1 className="text-2xl mb-4">
              You need to sign in to access this page
            </h1>
            <Link
              href="/sign-in"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium shadow-lg"
            >
              Sign In
            </Link>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}

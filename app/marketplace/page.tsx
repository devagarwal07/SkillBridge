"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
  Search,
  Filter,
  GraduationCap,
  Users,
  BookOpen,
  Star,
  Clock,
  DollarSign,
  ArrowUpRight,
  ChevronRight,
  Award,
  Sparkles,
  BadgeCheck,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import SparkleButton from "@/components/ui/SparkleButton";
import BackgroundGradient from "@/app/components/ui/Aurora";
import CategoryFilter from "./components/CategoryFilter";
import FeaturedItem from "./components/FeaturedItem";
import MarketplaceItem from "./components/MarketplaceItem";
import SearchBar from "./components/SearchBar";
import EmptyState from "./components/EmptyState";
import Layout from "../components/layout/Layout";

// Mock data fetch (reverted)
const fetchMarketplaceItems = async () => {
  try {
    const response = await fetch("/data/marketplace.json");
    return await response.json();
  } catch (error) {
    console.error("Error fetching marketplace items from JSON:", error);
    return [];
  }
};

export default function Marketplace() {
  const [items, setItems] = useState<any[]>([]);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [skillFilter, setSkillFilter] = useState<string | null>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  // Current user info
  const currentTime = "2025-03-28 07:02:12";
  const currentUser = "vkhare2909";

  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchMarketplaceItems();

      // Reverted: Assume data from JSON is always an array
      setItems(data);
      setFilteredItems(data);
      setLoading(false);
    };

    loadData();
  }, []);

  // Animation effect for the heading
  useEffect(() => {
    if (!loading && headlineRef.current) {
      // Animation timeline
      const tl = gsap.timeline();

      // Animate the headline
      tl.fromTo(
        headlineRef.current.querySelectorAll("span"),
        {
          opacity: 0,
          y: 30,
          rotationX: -40,
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          stagger: 0.12,
          duration: 1,
          ease: "power3.out",
        }
      );
    }
  }, [loading]);

  useEffect(() => {
    // Filter items based on search query, type, and skill
    if (items.length > 0) {
      let filtered = [...items];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.provider?.toLowerCase().includes(query) ||
            (item.skills &&
              item.skills.some((s: string) => s.toLowerCase().includes(query)))
        );
      }

      if (selectedType) {
        filtered = filtered.filter((item) => item.type === selectedType);
      }

      if (skillFilter) {
        filtered = filtered.filter(
          (item) =>
            item.skills &&
            item.skills.some(
              (s: string) => s.toLowerCase() === skillFilter.toLowerCase()
            )
        );
      }

      setFilteredItems(filtered);
    }
  }, [searchQuery, selectedType, skillFilter, items]);

  // Get unique skills from all items
  const allSkills = [
    ...new Set(items.flatMap((item) => item.skills || [])),
  ].sort();

  // Animate featured items
  useEffect(() => {
    if (!loading && featuredRef.current) {
      gsap.fromTo(
        featuredRef.current.querySelectorAll(".featured-item"),
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
        }
      );
    }
  }, [loading, filteredItems]);

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center py-24 overflow-hidden">
        {/* Background Elements */}
        <div
          className="absolute inset-0 -z-10 parallax-bg"
          style={{ height: "150%" }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(99, 102, 241, 0.2) 0%, rgba(79, 70, 229, 0.1) 25%, rgba(45, 212, 191, 0.05) 50%, transparent 80%)",
              height: "150%",
              width: "100%",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(14,165,233,0.15) 0, rgba(0,0,0,0) 80%)",
              height: "150%",
              width: "100%",
            }}
          />
        </div>

        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-gray-200">
            Loading marketplace...
          </p>
        </div>
      </div>
    );
  }

  // Featured items (premium or high rating)
  const featuredItems = filteredItems.filter(
    (item) => item.featured || item.premium
  );

  return (
    <Layout>
      <div className="relative min-h-screen py-24 overflow-hidden">
        <BackgroundGradient />

        <div className="container mx-auto px-6">
          <div className="mb-2">
            <span className="px-4 py-2 rounded-full bg-white/10 text-sm font-medium border border-white/20 inline-flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              {currentTime} • {currentUser}
            </span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1
                ref={headlineRef}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                <span className="gradient-text">Learning</span>{" "}
                <span className="text-white">Marketplace</span>
              </h1>
              <p className="text-gray-300 mt-2">
                Discover courses, mentorship opportunities, and peer-to-peer
                learning
              </p>
            </div>
            <Link href="/collections">
              <button className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-all flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-indigo-400" />
                Browse Collections
              </button>
            </Link>
          </div>

          {/* Search and filter section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md p-6 mb-8"
          >
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <div className="mt-6">
              <CategoryFilter
                selectedType={selectedType}
                setSelectedType={setSelectedType}
              />
            </div>

            <div className="mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-medium text-white">
                  Filter by Skill
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {skillFilter && (
                  <Badge
                    className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none cursor-pointer"
                    onClick={() => setSkillFilter(null)}
                  >
                    {skillFilter}
                    <button className="ml-1 text-indigo-300">×</button>
                  </Badge>
                )}

                {allSkills
                  .filter((skill) => skill !== skillFilter)
                  .slice(0, 10)
                  .map((skill, index) => (
                    <Badge
                      key={index}
                      className="bg-white/5 text-gray-300 hover:bg-indigo-500/10 hover:text-indigo-300 border border-white/10 hover:border-indigo-500/30 transition-colors cursor-pointer"
                      onClick={() => setSkillFilter(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}

                {allSkills.length > 10 && (
                  <Badge className="bg-white/5 text-gray-300 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                    +{allSkills.length - 10} more
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Badge>
                )}
              </div>
            </div>

            {/* Filter status and clear button */}
            {(searchQuery || selectedType || skillFilter) && (
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Showing {filteredItems.length} of {items.length} items
                </span>

                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedType(null);
                    setSkillFilter(null);
                  }}
                  className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </motion.div>

          {/* Featured items */}
          {featuredItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-12"
              ref={featuredRef}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-yellow-400" />
                  Featured Opportunities
                </h2>
                <Link href="/premium">
                  <span className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center group">
                    View Premium Content
                    <ArrowUpRight className="ml-1 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredItems.slice(0, 3).map((item, index) => (
                  <FeaturedItem
                    key={item.id}
                    item={item}
                    className="featured-item"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* All marketplace items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6 text-white">
              All Opportunities
            </h2>

            {filteredItems.length === 0 ? (
              <EmptyState
                onReset={() => {
                  setSearchQuery("");
                  setSelectedType(null);
                  setSkillFilter(null);
                }}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item, index) => (
                  <MarketplaceItem
                    key={item.id}
                    item={item}
                    delay={index * 0.05}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Global styles */}
        <style jsx global>{`
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
            100% {
              transform: translateY(0px);
            }
          }

          /* Gradient text styles */
          .gradient-text {
            background: linear-gradient(to right, #38bdf8, #d946ef, #2dd4bf);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
          }
        `}</style>
      </div>
    </Layout>
  );
}

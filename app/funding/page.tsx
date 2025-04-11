"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
  LineChart,
  Users,
  DollarSign,
  ArrowRight,
  Search,
  Filter,
  Star,
  Clock,
  Calendar,
  Building,
  BadgeCheck,
  TrendingUp,
  GraduationCap,
  Briefcase,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  ArrowUpRight,
  Shield,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SparkleButton from "@/components/ui/SparkleButton";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

// Import components
import InvestorCard from "./components/InvestorCard";
import EducationCreditScore from "./components/EducationCreditScore";
import SearchFilters from "./components/SearchFilters";
import ResourceCard from "./components/ResourceCard";
import ContractCard from "./components/ContractCard";
import BackgroundGradient from "@/app/components/ui/Aurora";
import Layout from "../components/layout/Layout";

// Mock data fetch - would be replaced with real API calls
const fetchUserData = async () => {
  try {
    const response = await fetch("/data/students.json");
    const students = await response.json();
    return students[0]; // Return the first student for demo purposes
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

const fetchInvestors = async () => {
  try {
    const response = await fetch("/data/investors.json");
    return await response.json();
  } catch (error) {
    console.error("Error fetching investors:", error);
    return [];
  }
};

export default function FundingPage() {
  const [userData, setUserData] = useState<any>(null);
  const [investors, setInvestors] = useState<any[]>([]);
  const [filteredInvestors, setFilteredInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [expandedInvestor, setExpandedInvestor] = useState<string | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Current user info
  const currentTime = "2025-03-28 06:48:47";
  const currentUser = "vkhare2909";

  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const user = await fetchUserData();
      const investorsData = await fetchInvestors();

      setUserData(user);
      setInvestors(investorsData);
      setFilteredInvestors(investorsData);
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
    // Filter investors based on search, field, and type
    if (investors.length > 0) {
      let filtered = [...investors];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (investor) =>
            investor.name.toLowerCase().includes(query) ||
            investor.description.toLowerCase().includes(query) ||
            investor.focusAreas.some((area: string) =>
              area.toLowerCase().includes(query)
            )
        );
      }

      if (selectedField) {
        filtered = filtered.filter(
          (investor) =>
            investor.focusAreas.includes(selectedField) ||
            investor.requirements.preferredFields.includes(selectedField)
        );
      }

      if (selectedType) {
        filtered = filtered.filter((investor) =>
          investor.fundingModels.some(
            (model: any) => model.type === selectedType
          )
        );
      }

      setFilteredInvestors(filtered);
    }
  }, [searchQuery, selectedField, selectedType, investors]);

  // Get all unique fields and funding types from investors
  const allFields = [
    ...new Set(
      investors.flatMap((investor: any) => [
        ...investor.focusAreas,
        ...investor.requirements.preferredFields,
      ])
    ),
  ].sort();

  const allFundingTypes = [
    ...new Set(
      investors.flatMap((investor: any) =>
        investor.fundingModels.map((model: any) => model.type)
      )
    ),
  ].sort();

  // Statistics animation with GSAP
  useEffect(() => {
    if (!loading && statsRef.current && userData) {
      const statValues = statsRef.current.querySelectorAll(".stat-value");

      gsap.fromTo(
        statValues,
        { textContent: 0 },
        {
          textContent: (i: number, target: Element) => {
            return target.getAttribute("data-value");
          },
          duration: 2,
          ease: "power2.out",
          snap: { textContent: 1 },
          stagger: 0.2,
          onUpdate: function () {
            // Format numbers with commas
            statValues.forEach((stat) => {
              const value = parseInt(stat.textContent || "0");
              const format = stat.getAttribute("data-format");
              if (format === "currency") {
                // @ts-ignore - textContent exists on HTMLElement
                stat.textContent = "$" + value.toLocaleString();
              } else {
                // @ts-ignore - textContent exists on HTMLElement
                stat.textContent = value.toLocaleString();
              }
            });
          },
        }
      );
    }
  }, [loading, userData]);

  // Toggle expanded investor details
  const toggleInvestorExpanded = (id: string) => {
    if (expandedInvestor === id) {
      setExpandedInvestor(null);
    } else {
      setExpandedInvestor(id);
    }
  };

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
            Loading funding options...
          </p>
        </div>
      </div>
    );
  }

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
                <span className="gradient-text">Funding</span>{" "}
                <span className="text-white">Opportunities</span>
              </h1>
              <p className="text-gray-300 mt-2">
                Discover investors and funding options aligned with your skills
                and career goals
              </p>
            </div>

            <SparkleButton
              href="/funding/apply"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
            >
              Start Application
              <ArrowRight className="ml-2 h-4 w-4" />
            </SparkleButton>
          </div>

          {/* Education Credit Score Card */}
          <EducationCreditScore userData={userData} ref={statsRef} />

          {/* Investor Search & Filter Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md p-6 mb-8"
          >
            <SearchFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedField={selectedField}
              setSelectedField={setSelectedField}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              allFields={allFields}
              allFundingTypes={allFundingTypes}
            />

            <div className="space-y-6 mt-6">
              {filteredInvestors.length === 0 ? (
                <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
                  <Users className="h-16 w-16 mx-auto text-indigo-400 mb-6" />
                  <h3 className="text-2xl font-semibold mb-4 text-white">
                    No investors found
                  </h3>
                  <p className="text-gray-300 max-w-md mx-auto mb-8">
                    We couldn't find any investors matching your search
                    criteria. Try adjusting your filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedField(null);
                      setSelectedType(null);
                    }}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                filteredInvestors.map((investor, index) => (
                  <InvestorCard
                    key={investor.id}
                    investor={investor}
                    isExpanded={expandedInvestor === investor.id}
                    onToggleExpand={() => toggleInvestorExpanded(investor.id)}
                    userData={userData}
                    delay={index * 0.1}
                  />
                ))
              )}
            </div>
          </motion.div>

          {/* Educational Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                Educational Resources
              </h2>
              <Link href="/funding/resources">
                <span className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors py-2 px-4 group">
                  View All Resources
                  <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ResourceCard
                title="Education Funding Guide"
                subtitle="Comprehensive guide to funding options"
                description="Learn about different funding models, their pros and cons, and how to choose the right option for your educational journey."
                imageSrc="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80"
                link="/funding/resources/guide"
                linkText="Read Guide"
              />

              <ResourceCard
                title="Application Workshop"
                subtitle="Interactive workshop on funding applications"
                description="Join our interactive workshop to learn how to create compelling funding applications that stand out to investors."
                imageSrc="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80"
                link="/funding/resources/workshop"
                linkText="Register Now"
              />

              <ResourceCard
                title="Boost Your Credit Score"
                subtitle="Strategies to improve your Education Credit Score"
                description="Learn effective strategies to boost your Education Credit Score and qualify for better funding opportunities."
                imageSrc="https://images.unsplash.com/photo-1553484771-047a44eee27c?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80"
                link="/funding/resources/credit-score"
                linkText="Read Guide"
              />
            </div>
          </motion.div>

          {/* Active Contracts */}
          {userData.funding.activeContracts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Your Active Contracts
                </h2>
                <Link href="/funding/contracts">
                  <span className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors py-2 px-4 group">
                    Manage Contracts
                    <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>

              <div className="space-y-6">
                {userData.funding.activeContracts.map(
                  (contract: any, index: number) => (
                    <ContractCard
                      key={contract.id}
                      contract={contract}
                      delay={index * 0.1}
                    />
                  )
                )}
              </div>
            </motion.div>
          )}
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

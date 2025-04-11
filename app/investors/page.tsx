"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import {
  Search,
  Filter,
  DollarSign,
  Building,
  TrendingUp,
  Users,
  ChevronRight,
  Globe,
  MapPin,
  Calendar,
  Star,
  ArrowRight,
  Briefcase,
  BadgeCheck,
  BarChart,
  ArrowUpRight,
  Award,
} from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import SparkleButton from "@/components/ui/SparkleButton";
import BackgroundGradient from "@/app/components/ui/Aurora";
import InvestorCard from "./components/InvestorCard";
import SearchFilters from "./components/SearchFilters";
import CallToAction from "./components/CallToAction";
import Layout from "../components/layout/Layout";

// Mock data fetch
const fetchInvestors = async () => {
  try {
    return [
      {
        id: "investor-001",
        name: "Future Talents Fund",
        type: "Venture Capital",
        description:
          "Investing in exceptional individuals with high growth potential in technology fields.",
        focusAreas: [
          "Computer Science",
          "Data Science",
          "AI & Machine Learning",
        ],
        investmentRange: { min: 15000, max: 75000 },
        averageROI: 22.5,
        successRate: 87,
        totalInvested: 8500000,
        activeInvestments: 42,
        location: "San Francisco, CA",
        foundedYear: 2018,
        logo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&h=150&fit=crop",
        website: "https://futuretalents.example.com",
        achievements: [
          "Funded 250+ students in the past 5 years",
          "92% employment rate for portfolio students",
          "Average salary increase of 65% post-education",
        ],
        fundingModels: [
          "Income Share Agreements",
          "Milestone-Based Funding",
          "Partial Scholarships",
        ],
        featuredTestimonial: {
          quote:
            "Future Talents Fund believed in me when traditional lenders wouldn't. Their ISA program was the launching pad for my career in AI.",
          author: "David Rodriguez",
          role: "AI Engineer",
          company: "TechInnovate",
          avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
        },
      },
      {
        id: "investor-002",
        name: "EduVentures",
        type: "Impact Investor",
        description:
          "Social impact fund focusing on democratizing access to quality education for underrepresented communities.",
        focusAreas: [
          "Software Engineering",
          "Healthcare Tech",
          "Green Technology",
        ],
        investmentRange: { min: 10000, max: 50000 },
        averageROI: 18.5,
        successRate: 82,
        totalInvested: 6200000,
        activeInvestments: 35,
        location: "Boston, MA",
        foundedYear: 2016,
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&h=150&fit=crop",
        website: "https://eduventures.example.com",
        achievements: [
          "Supported 180+ first-generation college students",
          "40% of portfolio students from underrepresented backgrounds",
          "Partner with 25+ top educational institutions",
        ],
        fundingModels: [
          "Income Share Agreements",
          "Fixed Term Loans",
          "Merit Scholarships",
        ],
        featuredTestimonial: {
          quote:
            "As a first-generation student, EduVentures not only provided financial support but also mentorship that was invaluable to my career journey.",
          author: "Maya Johnson",
          role: "Software Engineer",
          company: "TechSolutions Inc.",
          avatar:
            "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=100&h=100&fit=crop",
        },
      },
      {
        id: "investor-003",
        name: "TechTalent Capital",
        type: "Specialized Fund",
        description:
          "Focused exclusively on high-potential tech talent with a strong emphasis on practical skills and portfolio quality.",
        focusAreas: [
          "Web Development",
          "Mobile Development",
          "DevOps",
          "Cloud Computing",
        ],
        investmentRange: { min: 20000, max: 100000 },
        averageROI: 25.0,
        successRate: 90,
        totalInvested: 12000000,
        activeInvestments: 65,
        location: "Austin, TX",
        foundedYear: 2020,
        logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=150&h=150&fit=crop",
        website: "https://techtalent.example.com",
        achievements: [
          "Portfolio students at 45+ leading tech companies",
          "Average time to employment: 3.5 months",
          "85% of students exceed income projections",
        ],
        fundingModels: [
          "Income Share Agreements",
          "Results-Based Funding",
          "Apprenticeship Programs",
        ],
        featuredTestimonial: {
          quote:
            "TechTalent's results-based funding model aligned our incentives perfectly. They invested in my success, and the rigorous milestones pushed me to excel.",
          author: "James Chen",
          role: "Full Stack Developer",
          company: "InnovateTech",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
        },
      },
      {
        id: "investor-004",
        name: "NextGen Education Fund",
        type: "Education-Focused Fund",
        description:
          "Supporting ambitious students transitioning into high-growth fields with flexible funding options.",
        focusAreas: [
          "Data Analysis",
          "Digital Marketing",
          "UX/UI Design",
          "Project Management",
        ],
        investmentRange: { min: 8000, max: 45000 },
        averageROI: 19.8,
        successRate: 85,
        totalInvested: 5800000,
        activeInvestments: 38,
        location: "Chicago, IL",
        foundedYear: 2019,
        logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=150&h=150&fit=crop",
        website: "https://nextgenedu.example.com",
        achievements: [
          "Specialized in career-changers (65% of portfolio)",
          "93% program completion rate",
          "Partnerships with 15+ industry-leading bootcamps",
        ],
        fundingModels: [
          "Flexible Payment Plans",
          "Income Share Agreements",
          "Stipend Programs",
        ],
        featuredTestimonial: {
          quote:
            "NextGen made my career transition from marketing to UX design possible. Their flexible funding and industry connections were game-changers.",
          author: "Sarah Williams",
          role: "UX Designer",
          company: "DesignWorks",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        },
      },
    ];
  } catch (error) {
    console.error("Error fetching investors:", error);
    return [];
  }
};

export default function InvestorsPage() {
  const [investors, setInvestors] = useState<any[]>([]);
  const [filteredInvestors, setFilteredInvestors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusFilter, setFocusFilter] = useState<string | null>(null);
  const [fundingModelFilter, setFundingModelFilter] = useState<string | null>(
    null
  );

  // Current user info
  const currentTime = "2025-03-28 06:57:23";
  const currentUser = "vkhare2909";

  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const investorsData = await fetchInvestors();
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
    // Filter investors based on search query and filters
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

      if (focusFilter) {
        filtered = filtered.filter((investor) =>
          investor.focusAreas.some(
            (area: string) => area.toLowerCase() === focusFilter.toLowerCase()
          )
        );
      }

      if (fundingModelFilter) {
        filtered = filtered.filter((investor) =>
          investor.fundingModels.some(
            (model: string) =>
              model.toLowerCase() === fundingModelFilter.toLowerCase()
          )
        );
      }

      setFilteredInvestors(filtered);
    }
  }, [searchQuery, focusFilter, fundingModelFilter, investors]);

  // Get all unique focus areas and funding models from investors
  const allFocusAreas = [
    ...new Set(investors.flatMap((investor) => investor.focusAreas)),
  ].sort();
  const allFundingModels = [
    ...new Set(investors.flatMap((investor) => investor.fundingModels)),
  ].sort();

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
            Loading investors data...
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
                <span className="gradient-text">Education</span>{" "}
                <span className="text-white">Investors</span>
              </h1>
              <p className="text-gray-300 mt-2">
                Connect with investors who fund educational opportunities and
                career growth
              </p>
            </div>
            <SparkleButton
              href="/funding/apply"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
            >
              Apply for Funding
              <ArrowRight className="ml-2 h-4 w-4" />
            </SparkleButton>
          </div>

          {/* Search and filter section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md p-6 mb-8"
          >
            <SearchFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              focusFilter={focusFilter}
              setFocusFilter={setFocusFilter}
              fundingModelFilter={fundingModelFilter}
              setFundingModelFilter={setFundingModelFilter}
              allFocusAreas={allFocusAreas}
              allFundingModels={allFundingModels}
              totalInvestors={investors.length}
              filteredCount={filteredInvestors.length}
            />
          </motion.div>

          {/* Investors list */}
          <div className="space-y-8">
            {filteredInvestors.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 border border-white/10 rounded-xl p-12 text-center"
              >
                <Building className="h-16 w-16 mx-auto text-indigo-400 mb-6" />
                <h2 className="text-2xl font-semibold mb-4 text-white">
                  No investors found
                </h2>
                <p className="text-gray-300 max-w-md mx-auto mb-8">
                  We couldn't find any investors matching your search criteria.
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFocusFilter(null);
                    setFundingModelFilter(null);
                  }}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              filteredInvestors.map((investor, index) => (
                <InvestorCard
                  key={investor.id}
                  investor={investor}
                  delay={index * 0.1}
                />
              ))
            )}
          </div>

          {/* Call to action */}
          <CallToAction />
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

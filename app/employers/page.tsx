"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import {
  Search,
  Filter,
  Building,
  Briefcase,
  MapPin,
  Globe,
  Users,
  ArrowRight,
  Calendar,
  GraduationCap,
  CheckCircle2,
  BadgeCheck,
  Award,
  ChevronRight,
  User,
  Layers,
  FileCheck,
  ArrowUpRight,
  ExternalLink,
  Star,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SparkleButton from "@/components/ui/SparkleButton";
import { formatCurrency } from "@/lib/utils";
import Layout from "../components/layout/Layout";

const fetchEmployers = async () => {
  try {
    return [
      {
        id: "employer-001",
        name: "TechInnovate",
        industry: "Technology",
        description:
          "Leading AI technology company developing cutting-edge solutions for enterprises. We're constantly looking for exceptional talent to join our diverse and dynamic team.",
        logo: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=150&h=150&fit=crop",
        location: "San Francisco, CA",
        founded: 2018,
        size: "100-200 employees",
        website: "https://techinnovate.example.com",
        openPositions: 12,
        hiredFromPlatform: 8,
        sponsoredPrograms: 3,
        verifiedSkills: [
          "Machine Learning",
          "Python",
          "TensorFlow",
          "Data Analysis",
          "Software Engineering",
        ],
        programTypes: [
          "Internships",
          "Sponsored Education",
          "Skill-based Hiring",
        ],
        hiringProcess: [
          "Skills Verification Assessment",
          "Portfolio Review",
          "Technical Interview",
          "Team Fit Interview",
        ],
        successStories: [
          {
            name: "Sarah Johnson",
            role: "Machine Learning Engineer",
            avatar:
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
            quote:
              "TechInnovate recognized my verified skills despite not having a traditional CS background. Their focus on demonstrated abilities over credentials gave me an opportunity I wouldn't have had elsewhere.",
          },
        ],
        featuredProgram: {
          title: "AI Academy Sponsorship",
          description:
            "A 6-month intensive program where we sponsor promising talent to develop advanced AI skills while working on real projects.",
          benefits: [
            "Full tuition coverage",
            "Monthly stipend",
            "1:1 mentorship",
            "Job opportunity upon completion",
          ],
          nextCohort: "2025-06-01T00:00:00Z",
          applicationDeadline: "2025-04-15T23:59:59Z",
        },
      },
      {
        id: "employer-002",
        name: "FinTech Solutions",
        industry: "Finance",
        description:
          "Innovative financial technology company reinventing how people and businesses manage money. We combine the stability of finance with the innovation of technology.",
        logo: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=150&h=150&fit=crop",
        location: "New York, NY",
        founded: 2015,
        size: "500-1000 employees",
        website: "https://fintechsolutions.example.com",
        openPositions: 18,
        hiredFromPlatform: 15,
        sponsoredPrograms: 5,
        verifiedSkills: [
          "Financial Analysis",
          "Data Science",
          "Software Engineering",
          "Python",
          "SQL",
          "Risk Management",
        ],
        programTypes: [
          "Graduate Development",
          "Education Reimbursement",
          "Apprenticeships",
        ],
        hiringProcess: [
          "Skills Assessment",
          "Case Study",
          "Technical Interview",
          "Cultural Fit Interview",
          "Final Panel",
        ],
        successStories: [
          {
            name: "James Chen",
            role: "Data Engineer",
            avatar:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
            quote:
              "FinTech Solutions' Education Reimbursement program allowed me to complete my data engineering certification while working. The company's investment in my skills led to two promotions in just 18 months.",
          },
        ],
        featuredProgram: {
          title: "FinTech Academy",
          description:
            "A 12-month rotational program for graduates, combining structured learning with hands-on experience across our business units.",
          benefits: [
            "Competitive salary",
            "Education budget",
            "Rotation across departments",
            "Guaranteed placement",
          ],
          nextCohort: "2025-09-01T00:00:00Z",
          applicationDeadline: "2025-05-30T23:59:59Z",
        },
      },
      {
        id: "employer-003",
        name: "HealthTech Innovations",
        industry: "Healthcare Technology",
        description:
          "Pioneering healthtech company developing solutions to improve patient care and healthcare delivery. We're at the intersection of medicine, technology, and data science.",
        logo: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=150&h=150&fit=crop",
        location: "Boston, MA",
        founded: 2017,
        size: "50-100 employees",
        website: "https://healthtechinnovations.example.com",
        openPositions: 8,
        hiredFromPlatform: 6,
        sponsoredPrograms: 2,
        verifiedSkills: [
          "Healthcare Data Analysis",
          "Machine Learning",
          "Software Development",
          "HIPAA Compliance",
          "Electronic Health Records",
        ],
        programTypes: [
          "Specialized Training",
          "Tuition Support",
          "Research Partnerships",
        ],
        hiringProcess: [
          "Skills Verification",
          "Technical Assessment",
          "Domain Knowledge Interview",
          "Team Interview",
        ],
        successStories: [
          {
            name: "Emily Rodriguez",
            role: "Clinical Data Scientist",
            avatar:
              "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop",
            quote:
              "HealthTech Innovations' specialized training program provided me with both the technical and clinical knowledge I needed to bridge data science with healthcare applications.",
          },
        ],
        featuredProgram: {
          title: "Healthcare Analytics Fellowship",
          description:
            "A specialized 9-month program training data scientists to address unique healthcare challenges while working alongside clinical experts.",
          benefits: [
            "Certification",
            "Cutting-edge project work",
            "Clinical exposure",
            "Published research opportunity",
          ],
          nextCohort: "2025-07-15T00:00:00Z",
          applicationDeadline: "2025-05-01T23:59:59Z",
        },
      },
      {
        id: "employer-004",
        name: "GreenEnergy Solutions",
        industry: "Clean Energy",
        description:
          "Sustainable energy company developing renewable solutions for a greener future. We combine engineering excellence with environmental stewardship.",
        logo: "https://images.unsplash.com/photo-1473810394358-1534ff7474a7?w=150&h=150&fit=crop",
        location: "Austin, TX",
        founded: 2019,
        size: "100-250 employees",
        website: "https://greenenergy.example.com",
        openPositions: 14,
        hiredFromPlatform: 9,
        sponsoredPrograms: 4,
        verifiedSkills: [
          "Renewable Energy",
          "Electrical Engineering",
          "Sustainable Design",
          "Python",
          "Data Analysis",
          "Systems Engineering",
        ],
        programTypes: [
          "Green Energy Academy",
          "University Partnerships",
          "Reskilling Programs",
        ],
        hiringProcess: [
          "Skills Assessment",
          "Project Simulation",
          "Technical Interview",
          "Values Alignment Interview",
        ],
        successStories: [
          {
            name: "Michael Torres",
            role: "Renewable Systems Engineer",
            avatar:
              "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
            quote:
              "GreenEnergy's reskilling program helped me transition from traditional energy to renewable systems. Their investment in my education allowed me to pursue a more meaningful career that aligns with my values.",
          },
        ],
        featuredProgram: {
          title: "Renewable Engineering Accelerator",
          description:
            "A 6-month program helping engineers transition into renewable energy roles through specialized training and hands-on projects.",
          benefits: [
            "Training stipend",
            "Project-based learning",
            "Industry certification",
            "Job placement",
          ],
          nextCohort: "2025-05-01T00:00:00Z",
          applicationDeadline: "2025-03-30T23:59:59Z",
        },
      },
    ];
  } catch (error) {
    console.error("Error fetching employers:", error);
    return [];
  }
};

export default function EmployersPage() {
  const [employers, setEmployers] = useState<any[]>([]);
  const [filteredEmployers, setFilteredEmployers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);
  const [programFilter, setProgramFilter] = useState<string | null>(null);

  // Current user info
  const currentTime = "2025-03-28 06:20:48";
  const currentUser = "vkhare2909";

  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const employersData = await fetchEmployers();

      setEmployers(employersData);
      setFilteredEmployers(employersData);
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
    if (employers.length > 0) {
      let filtered = [...employers];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (employer) =>
            employer.name.toLowerCase().includes(query) ||
            employer.description.toLowerCase().includes(query) ||
            employer.industry.toLowerCase().includes(query) ||
            employer.verifiedSkills.some((skill: string) =>
              skill.toLowerCase().includes(query)
            )
        );
      }

      if (industryFilter) {
        filtered = filtered.filter(
          (employer) =>
            employer.industry.toLowerCase() === industryFilter.toLowerCase()
        );
      }

      if (programFilter) {
        filtered = filtered.filter((employer) =>
          employer.programTypes.some(
            (program: string) =>
              program.toLowerCase() === programFilter.toLowerCase()
          )
        );
      }

      setFilteredEmployers(filtered);
    }
  }, [searchQuery, industryFilter, programFilter, employers]);

  const allIndustries = [
    ...new Set(employers.map((employer) => employer.industry)),
  ].sort();
  const allProgramTypes = [
    ...new Set(employers.flatMap((employer) => employer.programTypes)),
  ].sort();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
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
            Loading employer partners...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="relative min-h-screen py-24 overflow-hidden">
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

        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <div className="mb-2">
                <span className="px-4 py-2 rounded-full bg-white/10 text-sm font-medium border border-white/20 inline-flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  {currentTime} • {currentUser}
                </span>
              </div>

              <h1
                ref={headlineRef}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                <span className="gradient-text">Partnered</span>{" "}
                <span>Employers</span>
              </h1>
              <p className="text-gray-300 mt-2 max-w-2xl">
                Discover innovative companies investing in education and
                skill-based hiring
              </p>
            </div>

            <SparkleButton
              href="/careers"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
            >
              Browse Job Opportunities
              <ArrowRight className="ml-2 h-4 w-4" />
            </SparkleButton>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 h-5 w-5" />
                <input
                  placeholder="Search by name, industry, or description..."
                  className="w-full pl-10 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm whitespace-nowrap text-gray-300">
                  Filter by:
                </span>
                <select
                  value={industryFilter || ""}
                  onChange={(e) => setIndustryFilter(e.target.value || null)}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-sm"
                >
                  <option value="" className="bg-gray-800">
                    All Industries
                  </option>
                  {allIndustries.map((industry) => (
                    <option
                      key={industry}
                      value={industry}
                      className="bg-gray-800"
                    >
                      {industry}
                    </option>
                  ))}
                </select>

                <select
                  value={programFilter || ""}
                  onChange={(e) => setProgramFilter(e.target.value || null)}
                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white text-sm"
                >
                  <option value="" className="bg-gray-800">
                    All Program Types
                  </option>
                  {allProgramTypes.map((program) => (
                    <option
                      key={program}
                      value={program}
                      className="bg-gray-800"
                    >
                      {program}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {(searchQuery || industryFilter || programFilter) && (
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-400">
                  Showing {filteredEmployers.length} of {employers.length}{" "}
                  employers
                </div>

                <button
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  onClick={() => {
                    setSearchQuery("");
                    setIndustryFilter(null);
                    setProgramFilter(null);
                  }}
                >
                  Clear Filters
                </button>
              </div>
            )}
          </motion.div>

          <div className="space-y-8">
            {filteredEmployers.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-12 text-center">
                <Building className="h-16 w-16 mx-auto text-indigo-400 mb-6" />
                <h2 className="text-2xl font-semibold mb-4 text-white">
                  No employers found
                </h2>
                <p className="text-gray-300 max-w-md mx-auto mb-8">
                  We couldn't find any employers matching your search criteria.
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setIndustryFilter(null);
                    setProgramFilter(null);
                  }}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              filteredEmployers.map((employer, index) => (
                <motion.div
                  key={employer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 overflow-hidden hover:bg-white/10 hover:border-indigo-500/40 transition-all"
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/20 bg-white/10">
                          <Image
                            src={employer.logo}
                            alt={employer.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                          <div>
                            <h2 className="text-2xl font-bold text-white">
                              {employer.name}
                            </h2>
                            <Badge className="mt-1 md:mt-0 w-fit bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none">
                              {employer.industry}
                            </Badge>
                          </div>

                          <div className="flex gap-3 text-sm text-gray-300">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-indigo-400" />
                              <span>{employer.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-purple-400" />
                              <span>{employer.size}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-300 mb-4">
                          {employer.description}
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center hover:bg-white/10 transition-all">
                            <div className="text-2xl font-bold text-white">
                              {employer.openPositions}
                            </div>
                            <div className="text-xs text-gray-400">
                              Open Positions
                            </div>
                          </div>

                          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center hover:bg-white/10 transition-all">
                            <div className="text-2xl font-bold text-white">
                              {employer.hiredFromPlatform}
                            </div>
                            <div className="text-xs text-gray-400">
                              Hired From Platform
                            </div>
                          </div>

                          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center hover:bg-white/10 transition-all">
                            <div className="text-2xl font-bold text-white">
                              {employer.sponsoredPrograms}
                            </div>
                            <div className="text-xs text-gray-400">
                              Sponsored Programs
                            </div>
                          </div>

                          <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center hover:bg-white/10 transition-all">
                            <div className="text-2xl font-bold text-white">
                              {employer.founded}
                            </div>
                            <div className="text-xs text-gray-400">Founded</div>
                          </div>
                        </div>

                        <div className="space-y-4 mb-4">
                          <div>
                            <h3 className="font-medium mb-2 text-white">
                              Verified Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {employer.verifiedSkills.map(
                                (skill: string, index: number) => (
                                  <Badge
                                    key={index}
                                    className="bg-white/5 text-gray-300 hover:bg-indigo-500/10 hover:text-indigo-300 border border-white/10 hover:border-indigo-500/30 transition-colors flex items-center gap-1"
                                  >
                                    <BadgeCheck className="h-3 w-3 text-indigo-400" />
                                    <span>{skill}</span>
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="font-medium mb-2 text-white">
                              Program Types
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {employer.programTypes.map(
                                (program: string, index: number) => (
                                  <Badge
                                    key={index}
                                    className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none"
                                  >
                                    {program}
                                  </Badge>
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-end">
                          <Link href={`/careers?company=${employer.name}`}>
                            <span className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-all">
                              <Briefcase className="mr-2 h-4 w-4 text-indigo-400" />
                              View Jobs
                            </span>
                          </Link>

                          <SparkleButton
                            href={`/employers/${employer.id}`}
                            className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all flex"
                          >
                            Company Profile
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </SparkleButton>
                        </div>
                      </div>
                    </div>

                    {employer.featuredProgram && (
                      <div className="mt-6 pt-6 border-t border-white/10">
                        <div className="bg-indigo-500/10 backdrop-blur-md border border-indigo-500/30 rounded-xl p-4">
                          <h3 className="font-semibold text-lg mb-2 text-white flex items-center gap-2">
                            <Award className="h-5 w-5 text-indigo-400" />
                            Featured Program: {employer.featuredProgram.title}
                          </h3>

                          <p className="text-sm text-gray-300 mb-3">
                            {employer.featuredProgram.description}
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2 text-white">
                                Key Benefits
                              </h4>
                              <ul className="space-y-1">
                                {employer.featuredProgram.benefits.map(
                                  (benefit: string, index: number) => (
                                    <li
                                      key={index}
                                      className="text-sm flex items-center gap-2 text-gray-300"
                                    >
                                      <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                                      <span>{benefit}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>

                            <div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-gray-300">
                                  <Calendar className="h-4 w-4 text-indigo-400" />
                                  <span className="text-sm">
                                    <span className="font-medium text-white">
                                      Next Cohort:
                                    </span>{" "}
                                    {formatDate(
                                      employer.featuredProgram.nextCohort
                                    )}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 text-gray-300">
                                  <Calendar className="h-4 w-4 text-purple-400" />
                                  <span className="text-sm">
                                    <span className="font-medium text-white">
                                      Application Deadline:
                                    </span>{" "}
                                    {formatDate(
                                      employer.featuredProgram
                                        .applicationDeadline
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Link href={`/employers/${employer.id}/programs`}>
                            <span className="inline-flex items-center bg-indigo-500/20 hover:bg-indigo-500/30 transition-colors px-4 py-2 rounded-lg text-white">
                              Learn More About This Program
                              <ArrowUpRight className="ml-2 h-4 w-4" />
                            </span>
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="mt-20 mb-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-white">
              How Employers{" "}
              <span className="gradient-text">Partner With Us</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 hover:border-indigo-500/30 transition-all group"
              >
                <div className="bg-indigo-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BadgeCheck className="h-8 w-8 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Skill-Based Hiring
                </h3>
                <p className="text-gray-300">
                  Identify candidates based on verified skills and abilities
                  rather than just credentials. Find talent that has proven
                  their competencies through our assessment platform.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 hover:border-purple-500/30 transition-all group"
              >
                <div className="bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Education Sponsorship
                </h3>
                <p className="text-gray-300">
                  Invest in future talent by sponsoring students' education in
                  fields relevant to your company. Build a pipeline of perfectly
                  trained candidates.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 hover:border-teal-500/30 transition-all group"
              >
                <div className="bg-teal-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Layers className="h-8 w-8 text-teal-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">
                  Talent Matching
                </h3>
                <p className="text-gray-300">
                  Our AI-powered platform matches your open positions with
                  candidates who have the exact skill profile you're looking
                  for, saving time and improving hiring outcomes.
                </p>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-20 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 md:p-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-white">
                  Become a{" "}
                  <span className="gradient-text">Partner Employer</span>
                </h2>
                <p className="text-gray-300 mb-6">
                  Join our network of forward-thinking companies investing in
                  education and skill-based hiring. Gain access to a pool of
                  talented individuals with verified skills and customized
                  training.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                    <span>Access to verified skill profiles</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                    <span>Create customized training programs</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-purple-400" />
                    <span>Improve diversity and inclusion in hiring</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 className="h-5 w-5 text-purple-400" />
                    <span>Reduce recruitment costs and time-to-hire</span>
                  </div>
                </div>

                <div className="mt-8">
                  <SparkleButton
                    href="/employers/join"
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
                  >
                    Join as an Employer
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </SparkleButton>
                </div>
              </div>

              <div className="relative h-64 md:h-full rounded-xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=800&auto=format&fit=crop"
                  alt="Employer partnership"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-70"></div>
                <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
                  <div className="bg-black/60 backdrop-blur-sm p-4 rounded-lg border border-white/10 shadow-lg">
                    <div className="font-semibold text-lg text-white">
                      Partner Success
                    </div>
                    <div className="text-sm text-gray-300">
                      Average hiring success rate
                    </div>
                    <div className="text-3xl font-bold gradient-text mt-2">
                      92%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="mt-20">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-white">
              What <span className="gradient-text">Employers Say</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredEmployers.slice(0, 2).map((employer, index) =>
                employer.successStories &&
                employer.successStories.length > 0 ? (
                  <motion.div
                    key={employer.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-indigo-500/30 transition-all"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="relative w-16 h-16 overflow-hidden rounded-lg flex-shrink-0 border border-white/20 bg-white/10">
                        <Image
                          src={employer.logo}
                          alt={employer.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-white">
                          {employer.name}
                        </h3>
                        <p className="text-sm text-gray-300">
                          {employer.industry}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl mb-4">
                      <p className="italic text-gray-300">
                        "{employer.successStories[0].quote}"
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 overflow-hidden rounded-full border-2 border-indigo-500/30">
                        <Image
                          src={employer.successStories[0].avatar}
                          alt={employer.successStories[0].name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {employer.successStories[0].name}
                        </div>
                        <div className="text-sm text-gray-300">
                          {employer.successStories[0].role}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : null
              )}
            </div>

            <div className="mt-8 text-center">
              <Link href="/employer-stories">
                <span className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors py-2 px-4 group">
                  View All Success Stories
                  <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>

          <div className="mt-20 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-white">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-indigo-500/30 transition-all"
              >
                <h3 className="text-lg font-semibold mb-3 text-white">
                  How do I verify skills?
                </h3>
                <p className="text-gray-300">
                  Our platform provides standardized assessments for various
                  skills. Candidates complete these assessments, and the results
                  are verified and recorded on their profiles, giving you
                  confidence in their abilities.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-indigo-500/30 transition-all"
              >
                <h3 className="text-lg font-semibold mb-3 text-white">
                  What is the cost to become a partner?
                </h3>
                <p className="text-gray-300">
                  We offer flexible partnership tiers based on your company's
                  size and hiring needs. Contact our employer partnerships team
                  for a customized quote and package details.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-indigo-500/30 transition-all"
              >
                <h3 className="text-lg font-semibold mb-3 text-white">
                  How does the sponsored education model work?
                </h3>
                <p className="text-gray-300">
                  You can sponsor students through their education in exchange
                  for a commitment to work with your company for a set period
                  after graduation, or through other flexible arrangements like
                  internships or project work.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-indigo-500/30 transition-all"
              >
                <h3 className="text-lg font-semibold mb-3 text-white">
                  Can we customize the skills we're looking for?
                </h3>
                <p className="text-gray-300">
                  Absolutely. Partner employers can define specific skill
                  profiles for their openings, and our platform will match and
                  recommend candidates who meet those exact requirements.
                </p>
              </motion.div>
            </div>

            <div className="mt-8 text-center">
              <Link href="/employers/faq">
                <span className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors py-2 px-4 group">
                  View All FAQs
                  <ChevronRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Global styles to match Hero.tsx */}
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

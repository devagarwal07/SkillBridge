"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Filter,
  ArrowRight,
  DollarSign,
  Building,
  Wifi,
  Users,
  ChevronsUpDown,
  SlidersHorizontal,
  GraduationCap,
  ArrowUpRight,
  CompassIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SparkleButton from "@/components/ui/SparkleButton";
import { formatCurrency } from "@/lib/utils";
import Layout from "../components/layout/Layout";

// Mock data fetch
const fetchJobs = async () => {
  try {
    return [
      {
        id: "job-001",
        title: "Machine Learning Engineer",
        company: "TechInnovate",
        location: "San Francisco, CA",
        remote: "Hybrid",
        salary: { min: 120000, max: 160000 },
        type: "Full-time",
        postedDate: "2025-03-15T14:30:00Z",
        description:
          "Join our AI team to develop cutting-edge machine learning models...",
        requirements: [
          "Python",
          "TensorFlow/PyTorch",
          "Computer Science degree",
          "3+ years experience",
        ],
        logo: "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVjaCUyMGxvZ298ZW58MHx8MHx8fDA%3D",
        skills: [
          "Machine Learning",
          "Python",
          "Data Science",
          "AI",
          "Deep Learning",
        ],
      },
      {
        id: "job-002",
        title: "Full Stack Developer",
        company: "WebSolutions Inc.",
        location: "New York, NY",
        remote: "Remote",
        salary: { min: 95000, max: 135000 },
        type: "Full-time",
        postedDate: "2025-03-20T09:15:00Z",
        description:
          "Looking for an experienced full stack developer to join our team...",
        requirements: [
          "JavaScript",
          "React",
          "Node.js",
          "MongoDB",
          "2+ years experience",
        ],
        logo: "https://images.unsplash.com/photo-1611162616475-46b635cb6620?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVjaCUyMGxvZ298ZW58MHx8MHx8fDA%3D",
        skills: ["JavaScript", "React", "Node.js", "MongoDB", "TypeScript"],
      },
      {
        id: "job-003",
        title: "Data Scientist",
        company: "DataCorp Analytics",
        location: "Boston, MA",
        remote: "On-site",
        salary: { min: 110000, max: 145000 },
        type: "Full-time",
        postedDate: "2025-03-22T11:45:00Z",
        description:
          "We're seeking a talented data scientist to help extract insights from our data...",
        requirements: [
          "Python",
          "SQL",
          "Statistics",
          "Data visualization",
          "Master's degree preferred",
        ],
        logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8dGVjaCUyMGxvZ298ZW58MHx8MHx8fDA%3D",
        skills: [
          "Data Science",
          "Python",
          "SQL",
          "Statistics",
          "Data Visualization",
        ],
      },
      {
        id: "job-004",
        title: "UX/UI Designer",
        company: "CreativeMinds",
        location: "Austin, TX",
        remote: "Hybrid",
        salary: { min: 85000, max: 120000 },
        type: "Full-time",
        postedDate: "2025-03-18T10:00:00Z",
        description:
          "Looking for a creative designer to improve our product user experience...",
        requirements: [
          "Figma",
          "Adobe XD",
          "User research",
          "Prototyping",
          "3+ years experience",
        ],
        logo: "https://images.unsplash.com/photo-1618588507085-c79565432917?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y3JlYXRpdmUlMjBsb2dvfGVufDB8fDB8fHww",
        skills: [
          "UI Design",
          "UX Research",
          "Figma",
          "Adobe Suite",
          "Prototyping",
        ],
      },
      {
        id: "job-005",
        title: "DevOps Engineer",
        company: "CloudTech Solutions",
        location: "Seattle, WA",
        remote: "Remote",
        salary: { min: 115000, max: 150000 },
        type: "Full-time",
        postedDate: "2025-03-25T15:20:00Z",
        description:
          "Join our team to improve and maintain our cloud infrastructure...",
        requirements: [
          "AWS/Azure/GCP",
          "Kubernetes",
          "CI/CD",
          "Linux",
          "4+ years experience",
        ],
        logo: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2xvdWQlMjBsb2dvfGVufDB8fDB8fHww",
        skills: ["DevOps", "AWS", "Kubernetes", "CI/CD", "Linux"],
      },
      {
        id: "job-006",
        title: "Product Manager",
        company: "InnovateTech",
        location: "Chicago, IL",
        remote: "Hybrid",
        salary: { min: 125000, max: 170000 },
        type: "Full-time",
        postedDate: "2025-03-16T09:30:00Z",
        description:
          "Seeking an experienced product manager to lead our product development lifecycle...",
        requirements: [
          "5+ years experience",
          "Agile methodologies",
          "Technical background",
          "Strong communication",
        ],
        logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29tcGFueSUyMGxvZ298ZW58MHx8MHx8fDA%3D",
        skills: [
          "Product Management",
          "Agile",
          "Strategy",
          "Roadmapping",
          "User Research",
        ],
      },
    ];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};

export default function CareersPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [remoteFilter, setRemoteFilter] = useState<string | null>(null);
  const [salaryFilter, setSalaryFilter] = useState<[number, number] | null>(
    null
  );
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Current user info
  const currentTime = "2025-03-28 06:08:31";
  const currentUser = "vkhare2909";

  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const jobsData = await fetchJobs();

      setJobs(jobsData);
      setFilteredJobs(jobsData);
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
    // Filter jobs based on search query and filters
    if (jobs.length > 0) {
      let filtered = [...jobs];

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (job) =>
            job.title.toLowerCase().includes(query) ||
            job.company.toLowerCase().includes(query) ||
            job.description.toLowerCase().includes(query) ||
            job.skills.some((skill: string) =>
              skill.toLowerCase().includes(query)
            )
        );
      }

      if (locationFilter) {
        const location = locationFilter.toLowerCase();
        filtered = filtered.filter((job) =>
          job.location.toLowerCase().includes(location)
        );
      }

      if (remoteFilter) {
        filtered = filtered.filter(
          (job) => job.remote.toLowerCase() === remoteFilter.toLowerCase()
        );
      }

      if (salaryFilter) {
        filtered = filtered.filter(
          (job) =>
            job.salary.min <= salaryFilter[1] &&
            job.salary.max >= salaryFilter[0]
        );
      }

      setFilteredJobs(filtered);
    }
  }, [searchQuery, locationFilter, remoteFilter, salaryFilter, jobs]);

  // Format date to "X days ago"
  const formatPostedDate = (dateString: string) => {
    const posted = new Date(dateString);
    const now = new Date();

    const diffTime = Math.abs(now.getTime() - posted.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return `${diffDays} days ago`;
    }
  };

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
                <span className="gradient-text">Career</span>{" "}
                <span>Opportunities</span>{" "}
              </h1>
              <p className="text-gray-300 mt-2 max-w-2xl">
                Find your next role in companies that value your verified skills
                and blockchain credentials
              </p>
            </div>

            <Link href="/career-simulator">
              <SparkleButton
                href="/career-simulator"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
              >
                <GraduationCap className="mr-2 h-5 w-5" />
                Career Simulator
              </SparkleButton>
            </Link>
          </div>

          {/* Search and filter section */}
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
                  placeholder="Search by job title, company, or skill..."
                  className="w-full px-10 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="relative w-full md:w-1/3">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 h-5 w-5" />
                <input
                  placeholder="Location (city, state, country)"
                  className="w-full px-10 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>

              <button
                className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-all flex items-center gap-2"
                onClick={() => setFiltersVisible(!filtersVisible)}
              >
                <Filter className="h-5 w-5 text-indigo-400" />
                Filters
                <ChevronsUpDown className="h-4 w-4" />
              </button>
            </div>

            {filtersVisible && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="pt-4 border-t border-white/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Remote Type
                    </label>
                    <select
                      value={remoteFilter || ""}
                      onChange={(e) => setRemoteFilter(e.target.value || null)}
                      className="w-full rounded-lg bg-white/5 border border-white/20 px-3 py-3 text-white"
                    >
                      <option value="" className="bg-gray-800">
                        Any Remote Type
                      </option>
                      <option value="Remote" className="bg-gray-800">
                        Remote
                      </option>
                      <option value="Hybrid" className="bg-gray-800">
                        Hybrid
                      </option>
                      <option value="On-site" className="bg-gray-800">
                        On-site
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Salary Range
                    </label>
                    <select
                      value={
                        salaryFilter
                          ? `${salaryFilter[0]}-${salaryFilter[1]}`
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          setSalaryFilter(null);
                        } else {
                          const [min, max] = value.split("-").map(Number);
                          setSalaryFilter([min, max]);
                        }
                      }}
                      className="w-full rounded-lg bg-white/5 border border-white/20 px-3 py-3 text-white"
                    >
                      <option value="" className="bg-gray-800">
                        Any Salary Range
                      </option>
                      <option value="0-80000" className="bg-gray-800">
                        Up to $80,000
                      </option>
                      <option value="80000-100000" className="bg-gray-800">
                        $80,000 - $100,000
                      </option>
                      <option value="100000-130000" className="bg-gray-800">
                        $100,000 - $130,000
                      </option>
                      <option value="130000-150000" className="bg-gray-800">
                        $130,000 - $150,000
                      </option>
                      <option value="150000-1000000" className="bg-gray-800">
                        $150,000+
                      </option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <button
                      className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                      onClick={() => {
                        setSearchQuery("");
                        setLocationFilter("");
                        setRemoteFilter(null);
                        setSalaryFilter(null);
                      }}
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Job listings */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-12 text-center">
              <Briefcase className="h-16 w-16 mx-auto text-indigo-400 mb-6" />
              <h2 className="text-2xl font-semibold mb-4 text-white">
                No jobs found
              </h2>
              <p className="text-gray-300 max-w-md mx-auto mb-8">
                We couldn't find any jobs matching your search criteria. Try
                adjusting your filters or search terms.
              </p>
              <button
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
                onClick={() => {
                  setSearchQuery("");
                  setLocationFilter("");
                  setRemoteFilter(null);
                  setSalaryFilter(null);
                }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredJobs.map((job, index) => (
                <Link href={`/careers/${job.id}`} key={job.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-6 hover:bg-white/10 hover:border-indigo-500/40 transition-all cursor-pointer group"
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-shrink-0">
                        <div className="relative w-16 h-16 overflow-hidden rounded-lg border border-white/20 bg-white/5">
                          <Image
                            src={job.logo}
                            alt={job.company}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-white">
                              {job.title}
                            </h2>
                            <Badge className="ml-2 hidden md:inline-flex bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none">
                              {job.type}
                            </Badge>
                          </div>
                          <div className="text-gray-400">{job.company}</div>
                        </div>

                        <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm">
                          <div className="flex items-center gap-1 text-gray-300">
                            <MapPin className="h-4 w-4 text-indigo-400" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-300">
                            <Wifi className="h-4 w-4 text-purple-400" />
                            <span>{job.remote}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-300">
                            <DollarSign className="h-4 w-4 text-teal-400" />
                            <span>
                              ${formatCurrency(job.salary.min)} - $
                              {formatCurrency(job.salary.max)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-300">
                            <Clock className="h-4 w-4 text-indigo-400" />
                            <span>
                              Posted {formatPostedDate(job.postedDate)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {job.skills
                            .slice(0, 5)
                            .map((skill: string, index: number) => (
                              <Badge
                                key={index}
                                className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none"
                              >
                                {skill}
                              </Badge>
                            ))}
                        </div>
                      </div>

                      <div className="flex flex-col justify-between items-end">
                        <Badge className="md:hidden mb-2 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none">
                          {job.type}
                        </Badge>
                        <span className="hidden md:flex items-center gap-1 text-indigo-400 group-hover:text-indigo-300 transition-colors">
                          View Job
                          <ArrowUpRight className="ml-1 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}

          {/* Floating explore element */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 1.2,
                duration: 0.5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <Link href="#explore-more">
                <span className="flex flex-col items-center text-gray-400 hover:text-white transition-colors duration-300">
                  <span className="text-sm mb-2">
                    Explore more opportunities
                  </span>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 5L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M19 12L12 19L5 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </motion.div>
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

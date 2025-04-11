"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import {
  Search,
  Filter,
  MessageSquare,
  Users,
  Calendar,
  Clock,
  ThumbsUp,
  Eye,
  Share2,
  Bookmark,
  BookOpen,
  Megaphone,
  Lightbulb,
  User,
  Tag,
  ChevronRight,
  ArrowRight,
  Plus,
  MapPin,
  ArrowUpRight,
  UserPlus,
  Globe,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SparkleButton from "@/components/ui/SparkleButton";
import Layout from "../components/layout/Layout";

// Mock data fetch
const fetchCommunityData = async () => {
  try {
    return {
      discussions: [
        {
          id: "disc-001",
          title: "How to prepare for a machine learning interview?",
          body: "I have an interview for a machine learning position coming up next week. Any advice on what to focus on?",
          author: {
            name: "Alex Johnson",
            avatar:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
            role: "Student",
          },
          tags: ["Career", "Machine Learning", "Interview Tips"],
          likes: 42,
          comments: 18,
          views: 356,
          createdAt: "2025-03-24T10:15:00Z",
        },
        {
          id: "disc-002",
          title: "Share your success stories with Income Share Agreements",
          body: "I recently completed my bootcamp funded through an ISA. The experience was great, and I'm now employed with a great salary. Who else has had success with ISAs?",
          author: {
            name: "Sarah Miller",
            avatar:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
            role: "Graduate",
          },
          tags: ["Funding", "ISA", "Success Stories"],
          likes: 87,
          comments: 36,
          views: 512,
          createdAt: "2025-03-25T08:30:00Z",
          isPinned: true,
        },
        {
          id: "disc-003",
          title: "Best online courses for blockchain development?",
          body: "I'm interested in learning blockchain development. Can anyone recommend online courses or resources that have helped them?",
          author: {
            name: "Mike Chen",
            avatar:
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
            role: "Student",
          },
          tags: ["Blockchain", "Learning Resources", "Courses"],
          likes: 28,
          comments: 24,
          views: 430,
          createdAt: "2025-03-23T14:45:00Z",
        },
        {
          id: "disc-004",
          title: "Negotiating with investors - what worked for you?",
          body: "I'm about to enter negotiations with an investor for my education funding. Any tips or strategies that worked well for others?",
          author: {
            name: "Jessica Taylor",
            avatar:
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop",
            role: "Student",
          },
          tags: ["Funding", "Negotiation", "Investors"],
          likes: 35,
          comments: 27,
          views: 389,
          createdAt: "2025-03-24T16:20:00Z",
        },
      ],
      events: [
        {
          id: "event-001",
          title: "Virtual Career Fair: Tech Startups Edition",
          description:
            "Connect with 30+ tech startups looking for talent in engineering, design, and product roles.",
          organizer: "SkillBridge Pro",
          date: "2025-04-15T09:00:00Z",
          endDate: "2025-04-15T17:00:00Z",
          location: "Virtual",
          image:
            "https://images.unsplash.com/photo-1591115765373-5207764f72e4?w=800&auto=format&fit=crop",
          attendees: 248,
          isFeatured: true,
        },
        {
          id: "event-002",
          title: "Workshop: Building Your Education Investment Pitch",
          description:
            "Learn how to create a compelling pitch to secure education funding from investors.",
          organizer: "Funding Experts Network",
          date: "2025-04-08T18:00:00Z",
          endDate: "2025-04-08T20:00:00Z",
          location: "Virtual",
          image:
            "https://images.unsplash.com/photo-1591115766055-5c23b0224227?w=800&auto=format&fit=crop",
          attendees: 112,
        },
        {
          id: "event-003",
          title: "Panel Discussion: The Future of Tech Education",
          description:
            "Industry leaders discuss emerging trends and the future of technical education.",
          organizer: "Tech Educators Alliance",
          date: "2025-04-20T15:00:00Z",
          endDate: "2025-04-20T17:00:00Z",
          location: "San Francisco + Virtual",
          image:
            "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&auto=format&fit=crop",
          attendees: 175,
        },
      ],
      meetups: [
        {
          id: "meetup-001",
          title: "San Francisco Machine Learning Enthusiasts",
          description:
            "Weekly meetup for ML practitioners and enthusiasts in the Bay Area.",
          organizer: "AI Community SF",
          nextMeeting: "2025-04-05T18:00:00Z",
          location: "San Francisco, CA",
          image:
            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop",
          members: 352,
        },
        {
          id: "meetup-002",
          title: "NYC Web Development Study Group",
          description:
            "Monthly meetup for web developers to share knowledge and collaborate.",
          organizer: "NYC Coders Club",
          nextMeeting: "2025-04-12T14:00:00Z",
          location: "New York, NY",
          image:
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop",
          members: 285,
        },
        {
          id: "meetup-003",
          title: "Remote Data Science Coffee Chats",
          description:
            "Virtual coffee meetings for data scientists to network and share insights.",
          organizer: "Global Data Science Network",
          nextMeeting: "2025-04-03T09:00:00Z",
          location: "Virtual",
          image:
            "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop",
          members: 421,
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching community data:", error);
    return {
      discussions: [],
      events: [],
      meetups: [],
    };
  }
};

export default function CommunityPage() {
  const [communityData, setCommunityData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDiscussions, setFilteredDiscussions] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("discussions");

  // Current user info
  const currentTime = "2025-03-28 06:13:49";
  const currentUser = "vkhare2909";

  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCommunityData();
      setCommunityData(data);
      setFilteredDiscussions(data.discussions);
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
    // Filter discussions based on search query
    if (communityData) {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        setFilteredDiscussions(
          communityData.discussions.filter(
            (discussion: any) =>
              discussion.title.toLowerCase().includes(query) ||
              discussion.body.toLowerCase().includes(query) ||
              discussion.tags.some((tag: string) =>
                tag.toLowerCase().includes(query)
              )
          )
        );
      } else {
        setFilteredDiscussions(communityData.discussions);
      }
    }
  }, [searchQuery, communityData]);

  // Format date to "X days ago"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffDays === 0) {
      if (diffHours === 0) {
        return "Just now";
      }
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else if (diffDays === 1) {
      return "Yesterday";
    } else {
      return `${diffDays} days ago`;
    }
  };

  // Format date to full format
  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
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
            Loading community...
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
                <span className="gradient-text">Community</span>{" "}
                <span>Hub</span>
              </h1>
              <p className="text-gray-300 mt-2">
                Connect with students, investors, and professionals in the
                UpSkillr community
              </p>
            </div>

            <div className="flex gap-3">
              <Link href="/community/my-events">
                <span className="inline-flex items-center px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-all">
                  <Calendar className="mr-2 h-4 w-4 text-indigo-400" />
                  My Events
                </span>
              </Link>
              <SparkleButton
                href="/community/new-discussion"
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Discussion
              </SparkleButton>
            </div>
          </div>

          {/* Main tabs for different sections */}
          <div className="mb-8 flex border-b border-white/10">
            <button
              onClick={() => setActiveTab("discussions")}
              className={`px-6 py-3 flex items-center gap-2 relative transition-colors ${
                activeTab === "discussions"
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              Discussions
              {activeTab === "discussions" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-6 py-3 flex items-center gap-2 relative transition-colors ${
                activeTab === "events"
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Events
              {activeTab === "events" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("meetups")}
              className={`px-6 py-3 flex items-center gap-2 relative transition-colors ${
                activeTab === "meetups"
                  ? "text-white"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              <Users className="h-4 w-4" />
              Groups
              {activeTab === "meetups" && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                />
              )}
            </button>
          </div>

          <div className="mt-8">
            {/* Search and filter for discussions */}
            {activeTab === "discussions" && (
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400 h-5 w-5" />
                  <input
                    placeholder="Search discussions..."
                    className="w-full pl-10 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 transition-all flex items-center gap-2">
                  <Filter className="h-5 w-5 text-indigo-400" />
                  Filter
                </button>
              </div>
            )}

            {/* Discussions Tab Content */}
            {activeTab === "discussions" && (
              <div className="space-y-6">
                {filteredDiscussions.length === 0 ? (
                  <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-12 text-center">
                    <MessageSquare className="h-16 w-16 mx-auto text-indigo-400 mb-6" />
                    <h2 className="text-2xl font-semibold mb-4 text-white">
                      No discussions found
                    </h2>
                    <p className="text-gray-300 max-w-md mx-auto mb-8">
                      We couldn't find any discussions matching your search. Try
                      different keywords or start a new discussion.
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Pinned discussions */}
                    {filteredDiscussions.some((d: any) => d.isPinned) && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                          <Megaphone className="h-5 w-5 text-indigo-400" />
                          Pinned Discussions
                        </h2>

                        {filteredDiscussions
                          .filter((d: any) => d.isPinned)
                          .map((discussion: any) => (
                            <Link
                              href={`/community/discussions/${discussion.id}`}
                              key={discussion.id}
                            >
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-indigo-500/10 backdrop-blur-md border border-indigo-500/30 rounded-xl p-6 hover:bg-indigo-500/20 transition-all"
                              >
                                <div className="flex items-center gap-3 mb-3">
                                  <Image
                                    src={discussion.author.avatar}
                                    alt={discussion.author.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
                                  <div>
                                    <div className="font-medium text-white">
                                      {discussion.author.name}
                                    </div>
                                    <div className="text-xs text-gray-300">
                                      {discussion.author.role}
                                    </div>
                                  </div>
                                  <div className="text-xs text-gray-300 ml-auto">
                                    {formatDate(discussion.createdAt)}
                                  </div>
                                </div>

                                <h3 className="text-xl font-semibold mb-2 text-white">
                                  {discussion.title}
                                </h3>
                                <p className="text-gray-300 mb-4 line-clamp-2">
                                  {discussion.body}
                                </p>

                                <div className="flex flex-wrap gap-2 mb-4">
                                  {discussion.tags.map(
                                    (tag: string, index: number) => (
                                      <Badge
                                        key={index}
                                        className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none"
                                      >
                                        {tag}
                                      </Badge>
                                    )
                                  )}
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-300">
                                  <div className="flex items-center gap-1">
                                    <ThumbsUp className="h-4 w-4 text-indigo-400" />
                                    <span>{discussion.likes}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <MessageSquare className="h-4 w-4 text-purple-400" />
                                    <span>{discussion.comments}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Eye className="h-4 w-4 text-teal-400" />
                                    <span>{discussion.views}</span>
                                  </div>
                                </div>
                              </motion.div>
                            </Link>
                          ))}
                      </div>
                    )}

                    {/* Regular discussions */}
                    <h2 className="text-lg font-semibold mb-4 text-white">
                      Recent Discussions
                    </h2>

                    <div className="space-y-4">
                      {filteredDiscussions
                        .filter((d: any) => !d.isPinned)
                        .map((discussion: any, index: number) => (
                          <Link
                            href={`/community/discussions/${discussion.id}`}
                            key={discussion.id}
                          >
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 hover:bg-white/10 hover:border-indigo-500/40 transition-all group"
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <Image
                                  src={discussion.author.avatar}
                                  alt={discussion.author.name}
                                  width={40}
                                  height={40}
                                  className="rounded-full"
                                />
                                <div>
                                  <div className="font-medium text-white">
                                    {discussion.author.name}
                                  </div>
                                  <div className="text-xs text-gray-300">
                                    {discussion.author.role}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-300 ml-auto">
                                  {formatDate(discussion.createdAt)}
                                </div>
                              </div>

                              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-indigo-300 transition-colors">
                                {discussion.title}
                              </h3>
                              <p className="text-gray-300 mb-4 line-clamp-2">
                                {discussion.body}
                              </p>

                              <div className="flex flex-wrap gap-2 mb-4">
                                {discussion.tags.map(
                                  (tag: string, index: number) => (
                                    <Badge
                                      key={index}
                                      className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none"
                                    >
                                      {tag}
                                    </Badge>
                                  )
                                )}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-300">
                                <div className="flex items-center gap-1">
                                  <ThumbsUp className="h-4 w-4 text-indigo-400" />
                                  <span>{discussion.likes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-4 w-4 text-purple-400" />
                                  <span>{discussion.comments}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-4 w-4 text-teal-400" />
                                  <span>{discussion.views}</span>
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Events Tab Content */}
            {activeTab === "events" && (
              <div className="space-y-8">
                {/* Featured event */}
                {communityData.events.some((e: any) => e.isFeatured) && (
                  <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-indigo-400" />
                      Featured Event
                    </h2>

                    {communityData.events
                      .filter((e: any) => e.isFeatured)
                      .slice(0, 1)
                      .map((event: any) => (
                        <Link
                          href={`/community/events/${event.id}`}
                          key={event.id}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="relative rounded-xl overflow-hidden group"
                          >
                            <div className="relative h-64 w-full">
                              <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                              <div className="absolute inset-0 bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h3 className="text-2xl font-bold mb-2 drop-shadow-md">
                                  {event.title}
                                </h3>
                                <div className="flex items-center gap-2 mb-2 text-gray-200">
                                  <Calendar className="h-4 w-4 text-indigo-400" />
                                  <span>{formatFullDate(event.date)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-200">
                                  <Users className="h-4 w-4 text-purple-400" />
                                  <span>{event.attendees} attending</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-b-xl">
                              <p className="text-gray-300 mb-4">
                                {event.description}
                              </p>

                              <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-300">
                                  Organized by{" "}
                                  <span className="text-indigo-400">
                                    {event.organizer}
                                  </span>
                                </div>
                                <SparkleButton
                                  href="/community/events/register"
                                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
                                >
                                  Register Now
                                </SparkleButton>
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                  </div>
                )}

                {/* Upcoming events */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 text-white">
                    Upcoming Events
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {communityData.events
                      .filter((e: any) => !e.isFeatured)
                      .map((event: any, index: number) => (
                        <Link
                          href={`/community/events/${event.id}`}
                          key={event.id}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-indigo-500/40 transition-all group"
                          >
                            <div className="relative h-48">
                              <Image
                                src={event.image}
                                alt={event.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                <h3 className="text-lg font-medium drop-shadow-md group-hover:text-indigo-300 transition-colors">
                                  {event.title}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-200">
                                  <Calendar className="h-3 w-3 text-indigo-400" />
                                  <span>{formatFullDate(event.date)}</span>
                                </div>
                              </div>
                            </div>

                            <div className="p-4">
                              <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                                {event.description}
                              </p>

                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                  <Users className="h-3 w-3 text-purple-400" />
                                  <span>{event.attendees} attending</span>
                                </div>
                                <Badge className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none">
                                  {event.location}
                                </Badge>
                              </div>
                            </div>
                          </motion.div>
                        </Link>
                      ))}
                  </div>

                  <div className="mt-8 text-center">
                    <Link href="/community/events">
                      <span className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors py-2 px-4 group">
                        View All Events
                        <ArrowRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Groups/Meetups Tab Content */}
            {activeTab === "meetups" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communityData.meetups.map((meetup: any, index: number) => (
                  <Link href={`/community/groups/${meetup.id}`} key={meetup.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 hover:border-indigo-500/40 transition-all h-full flex flex-col group"
                    >
                      <div className="relative h-48">
                        <Image
                          src={meetup.image}
                          alt={meetup.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                          <h3 className="text-xl font-semibold drop-shadow-md group-hover:text-indigo-300 transition-colors">
                            {meetup.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-200">
                            <MapPin className="h-3 w-3 text-indigo-400" />
                            <span>{meetup.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <p className="text-sm text-gray-300 mb-4 flex-1">
                          {meetup.description}
                        </p>

                        <div className="space-y-3 mt-auto">
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-white">
                              Next Meeting
                            </span>
                            <span className="text-gray-300">
                              {formatFullDate(meetup.nextMeeting)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <Users className="h-4 w-4 text-purple-400" />
                              <span>{meetup.members} members</span>
                            </div>
                            <button className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1 rounded-lg">
                              <UserPlus className="h-4 w-4" />
                              Join
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}

                {/* Create new group card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: communityData.meetups.length * 0.1,
                  }}
                  className="bg-white/5 backdrop-blur-md border border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-white/10 hover:border-indigo-500/30 transition-all cursor-pointer h-full"
                >
                  <div className="bg-indigo-500/20 rounded-full p-4 mb-4">
                    <Plus className="h-8 w-8 text-indigo-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    Create a Group
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Start your own community group for students with similar
                    interests
                  </p>
                  <SparkleButton
                    href="/community/create-group"
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
                  >
                    Get Started
                  </SparkleButton>
                </motion.div>
              </div>
            )}
          </div>

          {/* Trending topics section - bottom grid for all tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16">
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-indigo-400" />
                Trending Topics
              </h2>

              <div className="space-y-6">
                <div className="flex flex-wrap gap-3">
                  {[
                    "Education Funding",
                    "ISA Experiences",
                    "Career Transitions",
                    "Skill Verification",
                    "Data Science",
                    "Machine Learning",
                    "Job Search",
                    "Portfolio Building",
                    "Interview Prep",
                  ].map((topic, index) => (
                    <Link
                      href={`/community/topics/${topic
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      key={index}
                    >
                      <Badge className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none px-3 py-1.5 text-sm cursor-pointer transition-colors">
                        {topic}
                      </Badge>
                    </Link>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg transition-colors hover:bg-white/10 hover:border-indigo-500/30 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-white">
                        How to maximize your Education Credit Score?
                      </h3>
                      <Badge className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none">
                        Hot Topic
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      Community members are sharing strategies to improve
                      Education Credit Scores for better funding options.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3 text-indigo-400" />
                        <span>48 discussions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-purple-400" />
                        <span>125 contributors</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-teal-400" />
                        <span>Active today</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/10 rounded-lg transition-colors hover:bg-white/10 hover:border-indigo-500/30 cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-white">
                        Portfolio projects that impressed investors
                      </h3>
                      <Badge className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none">
                        Trending
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">
                      Students are sharing examples of projects that helped them
                      secure education funding.
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3 text-indigo-400" />
                        <span>32 discussions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 text-purple-400" />
                        <span>87 contributors</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-teal-400" />
                        <span>Active yesterday</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Member spotlight */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-400" />
                  Member Spotlight
                </h2>

                <div className="flex flex-col items-center text-center mb-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-indigo-500/30">
                    <Image
                      src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop"
                      alt="Sarah Miller"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-white">Sarah Miller</h3>
                  <div className="text-sm text-gray-300 mb-2">
                    Data Scientist @ TechCorp
                  </div>
                  <Badge className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none mb-3">
                    Community Champion
                  </Badge>
                  <p className="text-sm text-gray-300 mb-4">
                    Sarah used an ISA to fund her data science bootcamp and now
                    mentors students in the community.
                  </p>
                  <Link href="/community/members/sarah-miller">
                    <span className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1 rounded-lg group">
                      View Profile
                      <ArrowUpRight className="h-3 w-3 transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </div>
              </div>

              {/* Popular tags */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                  <Tag className="h-5 w-5 text-purple-400" />
                  Popular Tags
                </h2>

                <div className="flex flex-wrap gap-2">
                  {[
                    "Python",
                    "JavaScript",
                    "Machine Learning",
                    "Data Science",
                    "Web Development",
                    "UX/UI",
                    "Career Advice",
                    "ISA",
                    "Funding",
                    "Interview Prep",
                    "Portfolio",
                    "Bootcamp",
                    "Self-taught",
                    "Networking",
                  ].map((tag, index) => (
                    <Link
                      href={`/community/tags/${tag
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                      key={index}
                    >
                      <Badge className="bg-white/5 text-gray-300 hover:bg-indigo-500/10 hover:text-indigo-300 border border-white/10 hover:border-indigo-500/30 transition-colors">
                        {tag}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Community guidelines */}
              <div className="bg-indigo-500/10 backdrop-blur-md border border-indigo-500/30 rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-3 text-white">
                  Community Guidelines
                </h2>
                <p className="text-sm text-gray-300 mb-4">
                  Our community thrives on respect, collaboration, and knowledge
                  sharing. Please review our guidelines to help maintain a
                  positive environment.
                </p>
                <Link href="/community/guidelines">
                  <span className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1 rounded-lg group">
                    Read Guidelines
                    <ChevronRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </div>
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

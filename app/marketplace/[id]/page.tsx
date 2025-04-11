"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation"; // Added useRouter
import {
  ArrowLeft,
  Star,
  Clock,
  DollarSign,
  Users,
  GraduationCap,
  BookOpen,
  ExternalLink,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import Layout from "@/app/components/layout/Layout";

// Mock data fetch from marketplace.json
const fetchMarketplaceItem = async (id: string) => {
  try {
    const response = await fetch("/data/marketplace.json");
    const data = await response.json();
    return data.find((item: any) => item.id === id) || null;
  } catch (error) {
    console.error("Error fetching marketplace item:", error);
    return null;
  }
};

export default function MarketplaceItemPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? ""; // Use optional chaining and provide a default empty string
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false); // State for checkout loading
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        // Only fetch if id is available
        const itemData = await fetchMarketplaceItem(id);
        setItem(itemData);
      }
      // setItem(itemData); // This line was removed as it caused a ReferenceError
      setLoading(false);
    };

    loadData();
  }, [id]); // Keep dependency on id

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-24">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-gray-200">
            Loading item details...
          </p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen py-24">
        <div className="container mx-auto px-6">
          <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-12 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Item not found
            </h2>
            <p className="text-gray-300 max-w-md mx-auto mb-8">
              The marketplace item you're looking for doesn't exist.
            </p>
            <Link href="/marketplace">
              <span className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all inline-block">
                Browse Marketplace
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Handler for the Enroll button click
  const handleEnrollClick = async () => {
    if (!item) return;
    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item }), // Send item details to the API
      });

      if (!response.ok) {
        // If the response is not OK, maybe the server-side redirect failed
        // or there was another error. Log it and show an alert.
        const errorData = await response.json();
        console.error("Checkout failed:", errorData);
        alert(`Checkout failed: ${errorData.error || "Unknown error"}`);
        setIsCheckingOut(false);
        return;
      }

      // If the response is OK, parse the URL and redirect client-side
      const { url } = await response.json();
      if (url) {
        router.push(url); // Redirect the user to Stripe
      } else {
        // Handle case where URL is missing in the response
        console.error("Checkout failed: No session URL returned from API.");
        alert("Checkout failed: Could not retrieve payment session URL.");
        setIsCheckingOut(false);
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
      alert("An error occurred while initiating checkout. Please try again.");
      setIsCheckingOut(false);
    }
    // No need to set setIsCheckingOut(false) on success because the page will redirect.
  };

  return (
    <Layout>
      <div className="min-h-screen py-24">
        <div className="container mx-auto px-6">
          <div className="mb-6">
            <Link href="/marketplace">
              <span className="flex items-center text-gray-400 hover:text-white px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Marketplace
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-6">
                <div className="flex items-start gap-6 mb-6">
                  <div className="flex-shrink-0">
                    <div className="relative w-20 h-20 overflow-hidden rounded-lg border border-white/20 bg-white/10">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2 text-white">
                      {item.title}
                    </h1>
                    <div className="text-xl text-gray-300 mb-4">
                      {item.provider}
                    </div>

                    <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm">
                      {item.type === "course" && (
                        <div className="flex items-center gap-1 text-gray-300">
                          <GraduationCap className="h-4 w-4 text-indigo-400" />
                          <span>Course</span>
                        </div>
                      )}
                      {item.type === "mentorship" && (
                        <div className="flex items-center gap-1 text-gray-300">
                          <Users className="h-4 w-4 text-purple-400" />
                          <span>Mentorship</span>
                        </div>
                      )}
                      {item.type === "peer-teaching" && (
                        <div className="flex items-center gap-1 text-gray-300">
                          <BookOpen className="h-4 w-4 text-teal-400" />
                          <span>Peer Learning</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-gray-300">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="font-medium">{item.rating}</span>
                        <span className="text-gray-400">
                          ({item.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 text-white">
                    Description
                  </h2>
                  <p className="text-gray-300">{item.description}</p>
                </div>

                {/* Type-specific details */}
                {item.type === "job" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-3 text-white">
                        Job Details
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                            <CalendarDays className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">
                              Start Date
                            </div>
                            <div className="font-medium text-white">
                              {item.startDate}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                            <DollarSign className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">CTC</div>
                            <div className="font-medium text-white">
                              {formatCurrency(item.ctc)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="p-2 rounded-full bg-teal-500/20 text-teal-400">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">
                              Experience
                            </div>
                            <div className="font-medium text-white">
                              {item.experience}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="p-2 rounded-full bg-yellow-500/20 text-yellow-400">
                            <CalendarDays className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">
                              Apply By
                            </div>
                            <div className="font-medium text-white">
                              {item.applyBy}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2 text-white">
                          Job Description
                        </h3>
                        <p className="text-gray-300">{item.jobDescription}</p>
                      </div>
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2 text-white">
                          About the Organization
                        </h3>
                        <p className="text-gray-300">
                          {item.aboutOrganization}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {item.type === "course" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-3 text-white">
                        Course Details
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">
                              Duration
                            </div>
                            <div className="font-medium text-white">
                              {item.duration || "Self-paced"}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                            <DollarSign className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Price</div>
                            <div className="font-medium text-white">
                              ${formatCurrency(item.price)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {item.type === "mentorship" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-3 text-white">
                        Mentorship Details
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                            <DollarSign className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Rate</div>
                            <div className="font-medium text-white">
                              {formatCurrency(item.price)}/{item.priceType}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {item.type === "peer-teaching" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-3 text-white">
                        Session Details
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                            <Clock className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">
                              Session Length
                            </div>
                            <div className="font-medium text-white">
                              {item.sessionLength}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                            <Users className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">
                              Max Participants
                            </div>
                            <div className="font-medium text-white">
                              {item.maxParticipants}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Skills section */}
                {item.skills && item.skills.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-white">
                      Skills Covered
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {item.skills.map((skill: string, index: number) => (
                        <Badge
                          key={index}
                          className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Instructor/Mentor/Teacher section */}
              {(item.teacher || item.mentor) && (
                <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-6">
                  <h2 className="text-xl font-semibold mb-4 text-white">
                    {item.type === "mentorship" ? "Mentor" : "Teacher"} Details
                  </h2>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="relative w-20 h-20 overflow-hidden rounded-full border border-white/20 bg-white/10">
                        <Image
                          src={
                            item.teacher?.avatar ||
                            item.mentor?.avatar ||
                            "/default-avatar.png"
                          }
                          alt={item.teacher?.name || item.mentor?.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white">
                        {item.teacher?.name || item.mentor?.name}
                      </h3>
                      {item.mentor?.title && (
                        <p className="text-gray-300 mb-2">
                          {item.mentor.title} at {item.mentor.company}
                        </p>
                      )}
                      {item.teacher?.rating && (
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-medium">
                            {item.teacher.rating}
                          </span>
                          <span className="text-gray-400">
                            ({item.teacher.completedSessions} sessions)
                          </span>
                        </div>
                      )}
                      {item.mentor?.experience && (
                        <p className="text-gray-300">
                          {item.mentor.experience} years of experience
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-6 sticky top-20">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-white">
                    Quick Facts
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                        <Star className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Rating</div>
                        <div className="font-medium text-white">
                          {item.rating} ({item.reviewCount} reviews)
                        </div>
                      </div>
                    </div>

                    {item.type === "course" && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                          <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Price</div>
                          <div className="font-medium text-white">
                            ${formatCurrency(item.price)}
                          </div>
                        </div>
                      </div>
                    )}

                    {(item.type === "mentorship" ||
                      item.type === "peer-teaching") && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="p-2 rounded-full bg-teal-500/20 text-teal-400">
                          <DollarSign className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Rate</div>
                          <div className="font-medium text-white">
                            {formatCurrency(item.price)}/{item.priceType}
                          </div>
                        </div>
                      </div>
                    )}

                    {item.premium && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                        <div className="p-2 rounded-full bg-yellow-500/20 text-yellow-400">
                          <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="text-sm text-yellow-300">Premium</div>
                          <div className="font-medium text-white">
                            Exclusive content
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <button
                      onClick={handleEnrollClick}
                      disabled={isCheckingOut}
                      className="w-full block text-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCheckingOut ? "Processing..." : "Enroll Now"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

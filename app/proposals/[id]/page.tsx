"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Star,
  DollarSign,
  Users,
  GraduationCap,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

// Mock data fetch function (in real app, this would fetch from an API)
const fetchStudentData = async (id: string) => {
  const data = [
    {
      "id": "student-001",
      "name": "Priya Sharma",
      "avatar": "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop",
      "university": "IIT Delhi",
      "course": "B.Tech in Computer Science",
      "year": "2nd Year",
      "amountRequested": 50000,
      "amountRaised": 12000,
      "goalPurpose": "To cover semester tuition and buy a new laptop for coding assignments.",
      "skills": ["Python", "Machine Learning", "Data Structures"],
      "location": "New Delhi, India",
      "rating": 4.8,
      "supporters": 22,
      "verified": true,
      "featured": true
    },
    {
      "id": "student-002",
      "name": "Aditya Verma",
      "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      "university": "NIT Trichy",
      "course": "B.Tech in Mechanical Engineering",
      "year": "3rd Year",
      "amountRequested": 30000,
      "amountRaised": 8000,
      "goalPurpose": "Support for final-year project on renewable energy systems.",
      "skills": ["CAD", "SolidWorks", "Project Management"],
      "location": "Trichy, India",
      "rating": 4.6,
      "supporters": 15,
      "verified": false,
      "featured": true
    },
    {
      "id": "student-003",
      "name": "Meera Joshi",
      "avatar": "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop",
      "university": "BITS Pilani",
      "course": "B.E. in Electronics and Instrumentation",
      "year": "1st Year",
      "amountRequested": 40000,
      "amountRaised": 10000,
      "goalPurpose": "Need funds for hostel fees and study materials.",
      "skills": ["Embedded Systems", "C Programming", "Arduino"],
      "location": "Pilani, India",
      "rating": 4.9,
      "supporters": 28,
      "verified": true
    }
  ];
  return data.find((item) => item.id === id) || null;
};

export default function StudentInvestmentPage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const studentData = await fetchStudentData(id as string);
      setStudent(studentData);
      setLoading(false);
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-24">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-gray-200">
            Loading student details...
          </p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen py-24">
        <div className="container mx-auto px-6">
          <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-12 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Student not found
            </h2>
            <p className="text-gray-300 max-w-md mx-auto mb-8">
              The student profile you're looking for doesn't exist.
            </p>
            <Link href="/investment">
              <span className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all inline-block">
                Browse Students
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = (student.amountRaised / student.amountRequested) * 100;

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6">
        <div className="mb-6">
          <Link href="/marketplace">
            <span className="flex items-center text-gray-400 hover:text-white px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Investment Opportunities
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-6">
              <div className="flex items-start gap-6 mb-6">
                <div className="flex-shrink-0">
                  <div className="relative w-20 h-20 overflow-hidden rounded-full border border-white/20 bg-white/10">
                    <Image
                      src={student.avatar}
                      alt={student.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2 text-white">
                    {student.name}
                  </h1>
                  <div className="text-xl text-gray-300 mb-4">
                    {student.university}
                  </div>

                  <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-300">
                      <GraduationCap className="h-4 w-4 text-indigo-400" />
                      <span>{student.course}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300">
                      {/* <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{student.rating}</span> */}
                      <span className="text-gray-400">({student.supporters} supporters)</span>
                    </div>
                    {student.verified && (
                      <div className="flex items-center gap-1 text-gray-300">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-white">
                  Funding Goal
                </h2>
                <p className="text-gray-300">{student.goalPurpose}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-white">
                    Student Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Year</div>
                        <div className="font-medium text-white">
                          {student.year}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Location</div>
                        <div className="font-medium text-white">
                          {student.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {student.skills && student.skills.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-white">
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {student.skills.map((skill: string, index: number) => (
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-6 sticky top-20">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Funding Progress</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Amount Raised</div>
                      <div className="font-medium text-white">
                        ₹{formatCurrency(student.amountRaised)} / ₹{formatCurrency(student.amountRequested)}
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Supporters</div>
                      <div className="font-medium text-white">
                        {student.supporters}
                      </div>
                    </div>
                  </div>

                  {student.featured && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <div className="p-2 rounded-full bg-yellow-500/20 text-yellow-400">
                        <Star className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-yellow-300">Featured</div>
                        <div className="font-medium text-white">
                          High Potential Student
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <Link
                    href="#"
                    className="w-full block text-center px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
                  >
                    Invest Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
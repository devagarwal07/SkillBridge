import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  DollarSign,
  Star,
  Users,
  CheckCircle,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import SparkleButton from "@/components/ui/SparkleButton";

type StudentItem = {
  id: string;
  name: string;
  avatar: string;
  university: string;
  course: string;
  year: string;
  amountRequested: number;
  amountRaised: number;
  goalPurpose: string;
  skills: string[];
  location: string;
  rating: number;
  supporters: number;
  verified: boolean;
};

type FeaturedItemProps = {
  item: StudentItem;
  className?: string;
};

export default function FeaturedItem({
  item,
  className = "",
}: FeaturedItemProps) {
  const percentageRaised = Math.min(
    100,
    (item.amountRaised / item.amountRequested) * 100
  );

  return (
    <div
      className={`${className} group bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl overflow-hidden hover:shadow-indigo-500/30 transition-all`}
    >
      <div className="relative h-56">
        {item.avatar ? (
          <Image
            src={item.avatar}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          // Placeholder if no avatar is provided
          <div className="w-full h-full bg-gray-700 flex items-center justify-center">
            <GraduationCap className="w-16 h-16 text-gray-500" />
          </div>
        )}
        {item.verified && (
          <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Verified
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-4 left-4 z-10">
          <div className="bg-indigo-500/90 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm flex items-center">
            <GraduationCap className="h-4 w-4 mr-2" />
            Student Support
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-semibold text-white mb-1">{item.name}</h3>
        <p className="text-sm text-gray-300 mb-2 italic line-clamp-2">
          {item.goalPurpose}
        </p>

        <div className="text-sm text-gray-300 mb-2">
          <span className="text-white font-medium">{item.course}</span> -{" "}
          {item.university} ({item.year})
        </div>

        <div className="flex items-center justify-between text-sm mb-3">
          <div className="text-gray-300 flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{item.supporters} Supporters</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-400">
            {/* <Star className="h-4 w-4 fill-yellow-400" />
            <span>{item.rating}</span> */}
          </div>
        </div>

        {item.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.skills.map((skill, index) => (
              <span
                key={index}
                className="bg-gray-700/40 text-xs text-white px-2 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        <div className="bg-gray-800/60 p-3 rounded-lg mb-4">
          <div className="text-gray-400 text-sm mb-1">Funding Progress</div>
          <div className="text-white text-sm mb-1">
            {formatCurrency(item.amountRaised)} raised of{" "}
            {formatCurrency(item.amountRequested)}
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full"
              style={{ width: `${percentageRaised}%` }}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <SparkleButton
            href="/blockchain"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-medium shadow-lg shadow-emerald-500/30 hover:scale-105 transition-all"
          >
            Fund Now
          </SparkleButton>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MapPin, Star, ChevronRight, Users } from "lucide-react";

type StudentFundingItemProps = {
  item: any;
  delay?: number;
};

export default function MarketplaceItem({
  item,
  delay = 0,
}: StudentFundingItemProps) {
  const progressPercent = Math.min(
    (item.amountRaised / item.amountRequested) * 100,
    100
  ).toFixed(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:border-indigo-500/30 transition-all"
    >
      <div className="relative h-40">
        <Image
          src={item.avatar ?? "/placeholder-avatar.png"}
          alt={item.name ?? "User avatar"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute bottom-3 left-3 z-10">
          <div className="bg-indigo-500/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center">
            🎓 Student
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold mb-1 text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
          {item.name}
          {item.verified && (
            <span title="Verified">
              <CheckCircle className="text-green-400 w-4 h-4" />
            </span>
          )}
        </h3>

        <p className="text-sm text-gray-400 mb-1">
          {item.course}, {item.university}
        </p>
        <p className="text-xs text-gray-500 italic mb-3">{item.year}</p>

        <p className="text-sm text-gray-300 line-clamp-2 mb-3">
          {item.goalPurpose}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {(item.skills || []).slice(0, 3).map((skill: string, i: number) => (
            <Badge
              key={i}
              className="bg-white/5 text-gray-300 border border-white/10 text-xs"
            >
              {skill}
            </Badge>
          ))}
        </div>

        <div className="w-full bg-white/10 h-2 rounded-full mb-2 overflow-hidden">
          <div
            className="bg-indigo-500 h-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mb-4">
          <span>₹{(item.amountRaised ?? 0).toLocaleString()} raised</span>
          <span>Goal: ₹{(item.amountRequested ?? 0).toLocaleString()}</span>
        </div>

        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin className="w-4 h-4" />
            {item.location}
          </div>

          <div className="flex items-center gap-2 text-white">
            <Users className="w-4 h-4" />
            {item.supporters} supporters
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          {/* <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> */}
          {/* <span className="text-white">{item.rating}</span> */}
          {/* </div> */}

          <Link href={`/marketplace/${item.id}`}>
            <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center gap-1 group/btn">
              Details
              <ChevronRight className="h-4 w-4 transform transition-transform duration-300 group-hover/btn:translate-x-1" />
            </button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

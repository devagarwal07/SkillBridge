import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Star,
  GraduationCap,
  Users,
  BookOpen,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type MarketplaceItemProps = {
  item: any;
  delay?: number;
};

export default function MarketplaceItem({
  item,
  delay = 0,
}: MarketplaceItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:border-indigo-500/30 transition-all"
    >
      <div className="relative h-40">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {item.premium && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-md">
            Premium
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
        <div className="absolute bottom-3 left-3 z-10">
          {item.type === "course" && (
            <div className="bg-indigo-500/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center">
              <GraduationCap className="h-3 w-3 mr-1" />
              Course
            </div>
          )}
          {item.type === "mentorship" && (
            <div className="bg-purple-500/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center">
              <Users className="h-3 w-3 mr-1" />
              Mentorship
            </div>
          )}
          {item.type === "peer-teaching" && (
            <div className="bg-teal-500/90 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center">
              <BookOpen className="h-3 w-3 mr-1" />
              Peer Learning
            </div>
          )}
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-semibold mb-1 text-white group-hover:text-indigo-300 transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
          {item.description}
        </p>

        <div className="flex flex-wrap gap-1 mb-3">
          {(item.skills || []).slice(0, 3).map((skill: string, i: number) => (
            <Badge
              key={i}
              className="bg-white/5 text-gray-300 hover:bg-indigo-500/10 hover:text-indigo-300 border border-white/10 hover:border-indigo-500/30 transition-colors"
            >
              {skill}
            </Badge>
          ))}
          {(item.skills || []).length > 3 && (
            <Badge className="bg-white/5 text-gray-300 border border-white/10">
              +{(item.skills || []).length - 3}
            </Badge>
          )}
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-white">
              ${item.price}
            </span>
            {item.type !== "course" && (
              <span className="text-xs text-gray-400">/{item.priceType}</span>
            )}
          </div>

          <div className="flex items-center gap-1 text-sm">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-white">{item.rating}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm text-gray-400">
            {item.provider || item.teacher?.name || item.mentor?.name}
          </span>
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

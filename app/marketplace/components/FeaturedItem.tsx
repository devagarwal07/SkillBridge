import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  Clock,
  DollarSign,
  Users,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import SparkleButton from "@/components/ui/SparkleButton";

type FeaturedItemProps = {
  item: any;
  className?: string;
};

export default function FeaturedItem({
  item,
  className = "",
}: FeaturedItemProps) {
  return (
    <div
      className={`${className} group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md overflow-hidden hover:shadow-lg hover:border-indigo-500/30 transition-all`}
    >
      <div className="relative h-48">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {item.premium && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-md">
            Premium
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-4 left-4 z-10">
          {item.type === "course" && (
            <div className="bg-indigo-500/90 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm flex items-center">
              <GraduationCap className="h-3 w-3 mr-1" />
              Course
            </div>
          )}
          {item.type === "mentorship" && (
            <div className="bg-purple-500/90 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm flex items-center">
              <Users className="h-3 w-3 mr-1" />
              Mentorship
            </div>
          )}
          {item.type === "peer-teaching" && (
            <div className="bg-teal-500/90 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm flex items-center">
              <BookOpen className="h-3 w-3 mr-1" />
              Peer Learning
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-indigo-300 transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">
          {item.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="text-sm">
            {item.type === "course" ? (
              <span className="font-medium text-gray-300">{item.provider}</span>
            ) : (
              <div className="flex items-center gap-2">
                {item.teacher?.avatar ? (
                  <Image
                    src={item.teacher.avatar}
                    alt={item.teacher.name}
                    width={24}
                    height={24}
                    className="rounded-full border border-white/20"
                  />
                ) : item.mentor?.avatar ? (
                  <Image
                    src={item.mentor.avatar}
                    alt={item.mentor.name}
                    width={24}
                    height={24}
                    className="rounded-full border border-white/20"
                  />
                ) : null}
                <span className="text-gray-300">
                  {item.teacher?.name || item.mentor?.name}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="font-medium text-white">{item.rating}</span>
            <span className="text-gray-400">({item.reviewCount})</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-400 mb-1">
              {item.type === "course" ? (
                <Clock className="h-3 w-3 inline mr-1" />
              ) : (
                <DollarSign className="h-3 w-3 inline mr-1" />
              )}
              {item.type === "course"
                ? item.duration || "Self-paced"
                : `${formatCurrency(item.price)}/${item.priceType}`}
            </div>
            {item.type === "course" && (
              <div className="text-lg font-bold text-white">${item.price}</div>
            )}
          </div>

          <SparkleButton
            href={`/marketplace/${item.id}`}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
          >
            View Details
          </SparkleButton>
        </div>
      </div>
    </div>
  );
}

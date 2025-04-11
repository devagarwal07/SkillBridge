import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

type ResourceCardProps = {
  title: string;
  subtitle: string;
  description: string;
  imageSrc: string;
  link: string;
  linkText: string;
};

export default function ResourceCard({
  title,
  subtitle,
  description,
  imageSrc,
  link,
  linkText,
}: ResourceCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden transition-all hover:shadow-md hover:bg-white/10 hover:border-indigo-500/30 group">
      <div className="relative h-40">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-xs opacity-90">{subtitle}</p>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">{description}</p>

        <Link href={link}>
          <span className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors group-hover:underline">
            {linkText}
            <ChevronRight className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      </div>
    </div>
  );
}

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  DollarSign,
  ChevronRight,
  Globe,
  MapPin,
  Calendar,
  Star,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

type InvestorCardProps = {
  investor: any;
  delay?: number;
};

export default function InvestorCard({
  investor,
  delay = 0,
}: InvestorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl shadow-md overflow-hidden hover:border-indigo-500/30 transition-all"
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-shrink-0">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/20">
              <Image
                src={investor.logo}
                alt={investor.name}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
              <h2 className="text-2xl font-bold text-white">{investor.name}</h2>
              <Badge className="md:ml-2 w-fit bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none">
                {investor.type}
              </Badge>
            </div>

            <p className="text-gray-300 mb-4">{investor.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {investor.focusAreas.map((area: string, index: number) => (
                <Badge
                  key={index}
                  className="bg-white/5 text-gray-300 hover:bg-purple-500/10 hover:text-purple-300 border border-white/10 hover:border-purple-500/30 transition-colors"
                >
                  {area}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm mb-6">
              <div className="flex items-center gap-1 text-gray-300">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{investor.location}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-300">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span>Founded {investor.foundedYear}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-gray-400" />
                <a
                  href={investor.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 hover:underline transition-all flex items-center"
                >
                  Visit Website
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center hover:bg-white/10 transition-colors">
                <div className="text-2xl font-bold text-white">
                  ${formatCurrency(investor.totalInvested / 1000000)}M
                </div>
                <div className="text-xs text-gray-400">Total Invested</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center hover:bg-white/10 transition-colors">
                <div className="text-2xl font-bold text-white">
                  {investor.activeInvestments}
                </div>
                <div className="text-xs text-gray-400">Active Investments</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center hover:bg-white/10 transition-colors">
                <div className="text-2xl font-bold text-white">
                  {investor.averageROI}%
                </div>
                <div className="text-xs text-gray-400">Average ROI</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-center hover:bg-white/10 transition-colors">
                <div className="text-2xl font-bold text-white">
                  {investor.successRate}%
                </div>
                <div className="text-xs text-gray-400">Success Rate</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <h3 className="font-medium mb-2 text-white">Funding Models</h3>
                <ul className="space-y-1">
                  {investor.fundingModels.map(
                    (model: string, index: number) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-300"
                      >
                        <CheckCircle2 className="h-4 w-4 text-indigo-400" />
                        <span>{model}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="flex-1">
                <h3 className="font-medium mb-2 text-white">
                  Investment Range
                </h3>
                <div className="flex items-baseline gap-1 text-xl">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <span className="font-semibold text-white">
                    {formatCurrency(investor.investmentRange.min)}
                  </span>
                  <span className="text-gray-400">-</span>
                  <span className="font-semibold text-white">
                    {formatCurrency(investor.investmentRange.max)}
                  </span>
                </div>
              </div>

              <div className="self-end">
                <Link href={`/investors/${investor.id}`}>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-300 font-medium hover:bg-indigo-500/30 transition-colors group">
                    View Details
                    <ChevronRight className="h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {investor.featuredTestimonial && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-white/20">
                  <Image
                    src={investor.featuredTestimonial.avatar}
                    alt={investor.featuredTestimonial.author}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center mb-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>

                <p className="text-gray-300 italic mb-2">
                  "{investor.featuredTestimonial.quote}"
                </p>

                <div className="text-sm">
                  <span className="font-medium text-white">
                    {investor.featuredTestimonial.author}
                  </span>
                  <span className="text-gray-400">
                    {" "}
                    • {investor.featuredTestimonial.role} at{" "}
                    {investor.featuredTestimonial.company}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

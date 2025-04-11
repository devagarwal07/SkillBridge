import React from "react";
import { motion } from "framer-motion";
import { Building, Briefcase, DollarSign, MapPin } from "lucide-react";

interface JobRecommendation {
    id: number;
    companyName: string;
    jobRole: string;
    salary: string;
    location: string;
}

interface JobRecommendationCardProps {
    job: JobRecommendation;
    index: number;
}

const JobRecommendationCard: React.FC<JobRecommendationCardProps> = ({ job, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-6 hover:bg-white/10 hover:border-indigo-500/30 transition-all cursor-pointer"
        >
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                    {/* Placeholder for company logo - could fetch dynamically later */}
                    <Building className="h-6 w-6 text-indigo-300" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-white">{job.companyName}</h3>
                    <p className="text-sm text-gray-400">Top IT Company</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300">{job.jobRole}</span>
                </div>
                <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-teal-400 flex-shrink-0" />
                    <span className="text-gray-300">{job.salary}</span>
                </div>
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0" />
                    <span className="text-gray-300">{job.location}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default JobRecommendationCard;
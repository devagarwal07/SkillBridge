"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaCheck, FaEthereum, FaUser, FaClock } from "react-icons/fa";

// Current user data
const currentDateTime = "2025-03-03 19:15:13";
const currentUser = "vkhare2909";

type NFTCardProps = {
  name: string;
  issuer: string;
  image: string;
  date: string;
  tokenId: string;
};

export default function NFTCard({
  name,
  issuer,
  image,
  date,
  tokenId,
}: NFTCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div
      className="w-full h-[280px]"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card */}
        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-md border border-white/10 hover:border-indigo-400 transition-colors cursor-pointer"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="p-4 h-full flex flex-col">
            <div className="relative h-36 mb-4 overflow-hidden rounded-lg">
              <Image src={image} alt={name} fill className="object-cover" />
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-white flex items-center">
                <FaEthereum className="mr-1 text-purple-400" />
                NFT
              </div>

              {/* User viewing badge */}
              <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] text-gray-300 flex items-center">
                <FaUser className="mr-1 text-xs" />
                {currentUser}
              </div>
            </div>

            <h3 className="font-bold text-lg mb-1 truncate">{name}</h3>

            <div className="text-sm text-gray-400 mb-2">
              Issued by <span className="text-indigo-400">{issuer}</span>
            </div>

            <div className="mt-auto flex items-center justify-between">
              <span className="text-xs text-gray-500">{formatDate(date)}</span>

              <div className="flex items-center text-green-400">
                <FaCheck className="mr-1" size={12} />
                <span className="text-xs">Verified</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Back of card */}
        <motion.div
          className="absolute inset-0 rounded-xl overflow-hidden bg-gray-900/50 backdrop-blur-md border border-white/10 hover:border-indigo-400 transition-colors cursor-pointer"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="p-6 h-full flex flex-col">
            <h3 className="font-bold text-lg mb-4 text-center">{name}</h3>

            <div className="space-y-3 mb-4">
              <div>
                <div className="text-xs text-gray-400 mb-1">Issuer</div>
                <div className="text-sm">{issuer}</div>
              </div>

              <div>
                <div className="text-xs text-gray-400 mb-1">Issue Date</div>
                <div className="text-sm">{formatDate(date)}</div>
              </div>

              <div>
                <div className="text-xs text-gray-400 mb-1">Token ID</div>
                <div className="text-sm font-mono truncate">{tokenId}</div>
              </div>

              <div>
                <div className="text-xs text-gray-400 mb-1">
                  Last Verification
                </div>
                <div className="text-sm">2025-03-03 09:24:15</div>
              </div>

              {/* Viewer info */}
              <div>
                <div className="text-xs text-gray-400 mb-1">
                  Currently Viewing
                </div>
                <div className="text-xs flex items-center">
                  <span className="text-indigo-400 font-medium">
                    {currentUser}
                  </span>
                  <span className="mx-2 text-gray-500">•</span>
                  <span className="flex items-center text-gray-500">
                    <FaClock className="mr-1" size={10} />
                    {currentDateTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-auto flex justify-between">
              <button
                className="text-xs text-indigo-400 hover:text-indigo-300"
                onClick={(e) => {
                  e.stopPropagation();
                  // Open verification modal
                }}
              >
                Verify on Blockchain
              </button>

              <button
                className="text-xs text-pink-400 hover:text-pink-300"
                onClick={(e) => {
                  e.stopPropagation();
                  // Share credential
                }}
              >
                Share Credential
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

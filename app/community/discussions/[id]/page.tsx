"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  User,
  Clock,
  ArrowLeft,
} from "lucide-react";
import Layout from "../../../components/layout/Layout";

// Mock data for discussion and comments
const fetchDiscussionData = (id: string) => {
  const discussions = [
    {
      id: "disc-001",
      title: "How to prepare for a machine learning interview?",
      body: "I have an interview for a machine learning position coming up next week. Any advice on what to focus on? I'm particularly concerned about the technical portion. Should I focus more on theory or practical coding? Also, what kind of system design questions should I expect for ML roles?\n\nI've been going through common ML algorithms and practicing on Kaggle, but I'm not sure if that's enough. Any resources or tips would be greatly appreciated!",
      author: {
        name: "Alex Johnson",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
        role: "Student",
      },
      tags: ["Career", "Machine Learning", "Interview Tips"],
      likes: 42,
      comments: 18,
      views: 356,
      createdAt: "2025-03-24T10:15:00Z",
    },
    // Other discussions would be here...
  ];

  const comments = [
    {
      id: "comment-001",
      author: {
        name: "Sarah Chen",
        avatar:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop",
        role: "Senior ML Engineer",
      },
      content:
        "For ML interviews, I recommend focusing on both theory and practical aspects. Be prepared to explain algorithms like Random Forests, SVMs, and Neural Networks in detail. For coding, practice implementing these from scratch and using libraries like sklearn.",
      likes: 12,
      createdAt: "2025-03-24T11:30:00Z",
    },
    {
      id: "comment-002",
      author: {
        name: "Michael Rodriguez",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
        role: "Data Science Lead",
      },
      content:
        "Don't forget about system design for ML systems! You might be asked how you'd design a recommendation system or handle large-scale model training. The book 'Machine Learning System Design' is a great resource.",
      likes: 8,
      createdAt: "2025-03-24T14:45:00Z",
    },
    {
      id: "comment-003",
      author: {
        name: "Jamie Wilson",
        avatar:
          "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop",
        role: "ML Researcher",
      },
      content:
        "Make sure you can explain the math behind common algorithms. Interviewers often ask about gradient descent, backpropagation, and optimization techniques.",
      likes: 5,
      createdAt: "2025-03-24T16:20:00Z",
    },
    {
      id: "comment-004",
      author: {
        name: "Priya Patel",
        avatar:
          "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop",
        role: "Data Scientist",
      },
      content:
        "Practice coding on platforms like LeetCode (they have ML-specific problems now) and be ready to explain your thought process clearly.",
      likes: 7,
      createdAt: "2025-03-25T09:15:00Z",
    },
    {
      id: "comment-005",
      author: {
        name: "David Kim",
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
        role: "Engineering Manager",
      },
      content:
        "Behavioral questions are just as important! Be prepared to discuss past projects, challenges you faced, and how you worked in teams.",
      likes: 3,
      createdAt: "2025-03-25T11:40:00Z",
    },
    {
      id: "comment-006",
      author: {
        name: "Emma Zhang",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop",
        role: "AI Product Manager",
      },
      content:
        "Understand the business context too - how your models create value. Many companies look for ML engineers who can bridge technical and business needs.",
      likes: 9,
      createdAt: "2025-03-25T14:10:00Z",
    },
    {
      id: "comment-007",
      author: {
        name: "Thomas Brown",
        avatar:
          "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&h=150&fit=crop",
        role: "ML Infrastructure Engineer",
      },
      content:
        "Don't neglect MLOps questions - be ready to discuss model deployment, monitoring, and scaling considerations.",
      likes: 6,
      createdAt: "2025-03-26T10:05:00Z",
    },
  ];

  return {
    discussion: discussions.find((d) => d.id === id),
    comments,
  };
};

// Format date to "X days ago"
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

  if (diffDays === 0) {
    if (diffHours === 0) {
      return "Just now";
    }
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else if (diffDays === 1) {
    return "Yesterday";
  } else {
    return `${diffDays} days ago`;
  }
};

export default function DiscussionPage({ params }: { params: { id: string } }) {
  const { discussion, comments } = fetchDiscussionData(params.id);
  const [newComment, setNewComment] = useState("");
  const [commentReactions, setCommentReactions] = useState<
    Record<string, { likes: number; dislikes: number }>
  >(
    comments.reduce((acc, comment) => {
      acc[comment.id] = { likes: comment.likes, dislikes: 0 };
      return acc;
    }, {} as Record<string, { likes: number; dislikes: number }>)
  );
  const [userReactions, setUserReactions] = useState<
    Record<string, "like" | "dislike" | null>
  >({});

  if (!discussion) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p>Discussion not found</p>
        </div>
      </Layout>
    );
  }

  const handleReaction = (commentId: string, reaction: "like" | "dislike") => {
    setCommentReactions((prev) => {
      const current = { ...prev[commentId] };
      const currentUserReaction = userReactions[commentId];

      // Remove previous reaction if any
      if (currentUserReaction) {
        current[currentUserReaction === "like" ? "likes" : "dislikes"] -= 1;
      }

      // Add new reaction if different from current
      if (currentUserReaction !== reaction) {
        current[reaction === "like" ? "likes" : "dislikes"] += 1;
      }

      return { ...prev, [commentId]: current };
    });

    setUserReactions((prev) => ({
      ...prev,
      [commentId]: prev[commentId] === reaction ? null : reaction,
    }));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}/community/discussions/${discussion.id}`
    );
    // Would add toast notification in a real implementation
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        {/* Back button */}
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Community
        </Link>

        {/* Discussion content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Image
              src={discussion.author.avatar}
              alt={discussion.author.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <div className="font-medium text-white">
                {discussion.author.name}
              </div>
              <div className="text-sm text-gray-300">
                {discussion.author.role}
              </div>
            </div>
            <div className="text-sm text-gray-300 ml-auto">
              {formatDate(discussion.createdAt)}
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-4 text-white">
            {discussion.title}
          </h1>

          <div className="prose prose-invert text-gray-300 mb-6">
            {discussion.body.split("\n").map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {discussion.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-300 border-t border-white/10 pt-4">
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-5 w-5 text-indigo-400" />
              <span>{discussion.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-5 w-5 text-purple-400" />
              <span>{discussion.comments} comments</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 ml-auto hover:text-indigo-300 transition-colors"
            >
              <Share2 className="h-5 w-5" />
              Share
            </button>
          </div>
        </motion.div>

        {/* Comments section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-400" />
            Comments ({comments.length})
          </h2>

          <div className="space-y-6">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={comment.author.avatar}
                    alt={comment.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-medium text-white">
                      {comment.author.name}
                    </div>
                    <div className="text-xs text-gray-300">
                      {comment.author.role}
                    </div>
                  </div>
                  <div className="text-xs text-gray-300 ml-auto">
                    {formatDate(comment.createdAt)}
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{comment.content}</p>

                <div className="flex items-center gap-4 text-sm text-gray-300 border-t border-white/10 pt-4">
                  <button
                    onClick={() => handleReaction(comment.id, "like")}
                    className={`flex items-center gap-1 ${
                      userReactions[comment.id] === "like"
                        ? "text-indigo-400"
                        : ""
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{commentReactions[comment.id].likes}</span>
                  </button>
                  <button
                    onClick={() => handleReaction(comment.id, "dislike")}
                    className={`flex items-center gap-1 ${
                      userReactions[comment.id] === "dislike"
                        ? "text-red-400"
                        : ""
                    }`}
                  >
                    <ThumbsUp className="h-4 w-4 transform rotate-180" />
                    <span>{commentReactions[comment.id].dislikes}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Add comment form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6"
        >
          <h3 className="text-lg font-semibold mb-4 text-white">
            Add your comment
          </h3>
          <textarea
            className="w-full bg-white/5 border border-white/20 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
            rows={4}
            placeholder="Share your thoughts..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            disabled={!newComment.trim()}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post Comment
          </button>
        </motion.div>
      </div>
    </Layout>
  );
}

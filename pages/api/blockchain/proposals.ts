import type { NextApiRequest, NextApiResponse } from "next";
import { Proposal } from "@/types/blockchain";

// Sample proposals data (in a real app, this would come from a database or smart contract)
const PROPOSALS: Proposal[] = [
  {
    id: 1,
    title: "Community Education Fund",
    description:
      "Allocate 5 ETH for developing educational content for blockchain skills",
    amount: 5,
    status: "active",
    votes: { yes: 24, no: 7 },
    deadline: "2025-05-15",
  },
  {
    id: 2,
    title: "Developer Grants Program",
    description:
      "Fund promising developers to build tools for the SkillBridge ecosystem",
    amount: 10,
    status: "active",
    votes: { yes: 31, no: 12 },
    deadline: "2025-05-20",
  },
  {
    id: 3,
    title: "UX Improvements",
    description: "Hire a UX consultant to improve the platform user experience",
    amount: 3,
    status: "completed",
    votes: { yes: 42, no: 5 },
    deadline: "2025-04-01",
  },
  {
    id: 4,
    title: "Marketing Campaign",
    description:
      "Launch a targeted marketing campaign to attract more users to the platform",
    amount: 7,
    status: "rejected",
    votes: { yes: 15, no: 28 },
    deadline: "2025-03-20",
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Get all proposals or a specific one
    const { id } = req.query;

    if (id) {
      const proposal = PROPOSALS.find((p) => p.id.toString() === id);

      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }

      return res.status(200).json(proposal);
    }

    return res.status(200).json(PROPOSALS);
  } else if (req.method === "POST") {
    // Vote on a proposal
    // In a real app, this would update a database or call a smart contract
    const { proposalId, vote, address } = req.body;

    if (!proposalId || !vote || !address) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const proposal = PROPOSALS.find((p) => p.id === parseInt(proposalId));

    if (!proposal) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    if (proposal.status !== "active") {
      return res
        .status(400)
        .json({ message: "Cannot vote on inactive proposals" });
    }

    // Update votes (in a real app, would check if user already voted)
    if (vote === "yes") {
      proposal.votes.yes += 1;
    } else if (vote === "no") {
      proposal.votes.no += 1;
    } else {
      return res.status(400).json({ message: "Invalid vote type" });
    }

    return res.status(200).json({
      message: "Vote recorded successfully",
      proposal,
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

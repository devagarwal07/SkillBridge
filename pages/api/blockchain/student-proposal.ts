import type { NextApiRequest, NextApiResponse } from "next";

// This endpoint connects student proposals to blockchain proposals
// In a production system, this would interact with a database

type ProposalConnection = {
  blockchainId: number;
  title: string;
  ethAmount: number;
};

const proposalConnections: Record<string, ProposalConnection> = {
  "student-001": {
    blockchainId: 1,
    title: "Community Education Fund",
    ethAmount: 5,
  },
  "student-002": {
    blockchainId: 2,
    title: "Developer Grants Program",
    ethAmount: 10,
  },
  "student-003": {
    blockchainId: 3,
    title: "UX Improvements",
    ethAmount: 3,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { studentId } = req.query;

    if (studentId && typeof studentId === "string") {
      const connection = proposalConnections[studentId];

      if (connection) {
        return res.status(200).json(connection);
      } else {
        return res.status(404).json({
          message: "No blockchain proposal linked to this student",
        });
      }
    }

    // Return all connections
    return res.status(200).json(proposalConnections);
  } else if (req.method === "POST") {
    // Create a new connection (would require authentication in a real app)
    const { studentId, blockchainId, title, ethAmount } = req.body;

    if (!studentId || !blockchainId || !title || !ethAmount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // In a real app, we would save this to a database
    proposalConnections[studentId] = { blockchainId, title, ethAmount };

    return res.status(201).json({
      message: "Connection created successfully",
      data: proposalConnections[studentId],
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}

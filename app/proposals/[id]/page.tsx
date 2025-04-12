"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Star,
  DollarSign,
  Users,
  GraduationCap,
  MapPin,
  CheckCircle2,
  Wallet,
  AlertCircle,
  ArrowUpRight,
  Shield,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  fundStudentProposal,
  getBlockchainProposalId,
  verifyAadharWithZkp,
} from "@/lib/services/blockchain-integration";

// Modal components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock data fetch function (in real app, this would fetch from an API)
const fetchStudentData = async (id: string) => {
  const data = [
    {
      id: "student-001",
      name: "Priya Sharma",
      avatar:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop",
      university: "IIT Delhi",
      course: "B.Tech in Computer Science",
      year: "2nd Year",
      amountRequested: 50000,
      amountRaised: 12000,
      goalPurpose:
        "To cover semester tuition and buy a new laptop for coding assignments.",
      skills: ["Python", "Machine Learning", "Data Structures"],
      location: "New Delhi, India",
      rating: 4.8,
      supporters: 22,
      verified: true,
      featured: true,
    },
    {
      id: "student-002",
      name: "Aditya Verma",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
      university: "NIT Trichy",
      course: "B.Tech in Mechanical Engineering",
      year: "3rd Year",
      amountRequested: 30000,
      amountRaised: 8000,
      goalPurpose:
        "Support for final-year project on renewable energy systems.",
      skills: ["CAD", "SolidWorks", "Project Management"],
      location: "Trichy, India",
      rating: 4.6,
      supporters: 15,
      verified: false,
      featured: true,
    },
    {
      id: "student-003",
      name: "Meera Joshi",
      avatar:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=100&h=100&fit=crop",
      university: "BITS Pilani",
      course: "B.E. in Electronics and Instrumentation",
      year: "1st Year",
      amountRequested: 40000,
      amountRaised: 10000,
      goalPurpose: "Need funds for hostel fees and study materials.",
      skills: ["Embedded Systems", "C Programming", "Arduino"],
      location: "Pilani, India",
      rating: 4.9,
      supporters: 28,
      verified: true,
    },
  ];
  return data.find((item) => item.id === id) || null;
};

export default function StudentInvestmentPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [investAmount, setInvestAmount] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [txError, setTxError] = useState("");
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  // Check if the student's proposal is connected to blockchain
  const [blockchainProposalId, setBlockchainProposalId] = useState<
    number | null
  >(null);

  useEffect(() => {
    const loadData = async () => {
      const studentData = await fetchStudentData(id as string);
      setStudent(studentData);

      // Check blockchain connection
      if (studentData) {
        const proposalId = getBlockchainProposalId(studentData.id);
        setBlockchainProposalId(proposalId);
      }

      setLoading(false);
    };

    loadData();
  }, [id]);

  // Check if wallet is connected
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setIsWalletConnected(true);
            setWalletAddress(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };

    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setIsWalletConnected(true);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask to use blockchain features");
    }
  };

  const handleInvest = async () => {
    if (!investAmount || parseFloat(investAmount) <= 0) {
      alert("Please enter a valid amount to invest");
      return;
    }

    setIsProcessingPayment(true);
    setTxError("");
    setTxHash("");

    try {
      const result = await fundStudentProposal(
        student.id,
        parseFloat(investAmount)
      );

      if (result.success && result.txHash) {
        setTxHash(result.txHash);

        // Update student's raised amount (in a real app, this would be handled by a backend)
        setStudent({
          ...student,
          amountRaised: student.amountRaised + parseFloat(investAmount),
        });
      } else {
        setTxError(result.error || "Transaction failed");
      }
    } catch (error: any) {
      setTxError(error.message || "An error occurred during the transaction");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const verifyIdentity = async () => {
    setIsVerifying(true);
    setVerificationResult(null);

    // For demo purposes, we'll use a hardcoded Aadhar number and sample image
    const aadharNumber = "1234-5678-9012";
    const aadharImage =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzE3MjU0YyIvPjx0ZXh0IHg9IjUwJSIgeT0iMzUlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFBREhBUiBDQVJEPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjEyMzQtNTY3OC05MDEyPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjUlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNhbXBsZSBOYW1lPC90ZXh0Pjxwb2x5Z29uIHBvaW50cz0iMzIwLDgwIDM2MCw4MCAzNjAsMTYwIDMyMCwxNjAiIGZpbGw9IiMzMzMiLz48L3N2Zz4=";

    try {
      const result = await verifyAadharWithZkp(aadharNumber, aadharImage);
      setVerificationResult(result);
    } catch (error) {
      setVerificationResult({
        success: false,
        message: "Error processing verification request",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Format wallet address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center py-24">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium text-gray-200">
            Loading student details...
          </p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen py-24">
        <div className="container mx-auto px-6">
          <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-12 text-center">
            <h2 className="text-2xl font-semibold mb-4 text-white">
              Student not found
            </h2>
            <p className="text-gray-300 max-w-md mx-auto mb-8">
              The student profile you're looking for doesn't exist.
            </p>
            <Link href="/investment">
              <span className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all inline-block">
                Browse Students
              </span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage =
    (student.amountRaised / student.amountRequested) * 100;

  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-6">
        <div className="mb-6">
          <Link href="/proposals">
            <span className="flex items-center text-gray-400 hover:text-white px-3 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Investment Opportunities
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Student profile info */}
            <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-6">
              <div className="flex items-start gap-6 mb-6">
                <div className="flex-shrink-0">
                  <div className="relative w-20 h-20 overflow-hidden rounded-full border border-white/20 bg-white/10">
                    <Image
                      src={student.avatar}
                      alt={student.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2 text-white">
                    {student.name}
                  </h1>
                  <div className="text-xl text-gray-300 mb-4">
                    {student.university}
                  </div>

                  <div className="flex flex-wrap gap-y-2 gap-x-4 text-sm">
                    <div className="flex items-center gap-1 text-gray-300">
                      <GraduationCap className="h-4 w-4 text-indigo-400" />
                      <span>{student.course}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-300">
                      <span className="text-gray-400">
                        ({student.supporters} supporters)
                      </span>
                    </div>
                    {student.verified && (
                      <div className="flex items-center gap-1 text-gray-300">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 text-white">
                  Funding Goal
                </h2>
                <p className="text-gray-300">{student.goalPurpose}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3 text-white">
                    Student Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                        <GraduationCap className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Year</div>
                        <div className="font-medium text-white">
                          {student.year}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Location</div>
                        <div className="font-medium text-white">
                          {student.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {student.skills && student.skills.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-white">
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {student.skills.map((skill: string, index: number) => (
                      <Badge
                        key={index}
                        className="bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border-none"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {blockchainProposalId && (
                <div className="mt-4 py-2 px-3 bg-blue-900/20 rounded-lg border border-blue-800/40 flex items-center">
                  <Wallet className="h-4 w-4 text-blue-400 mr-2" />
                  <span className="text-blue-300 text-sm">
                    Connected to blockchain proposal #{blockchainProposalId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-md border border-white/10 p-6 sticky top-20">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">
                  Funding Progress
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-400">
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Amount Raised</div>
                      <div className="font-medium text-white">
                        ₹{formatCurrency(student.amountRaised)} / ₹
                        {formatCurrency(student.amountRequested)}
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Supporters</div>
                      <div className="font-medium text-white">
                        {student.supporters}
                      </div>
                    </div>
                  </div>

                  {student.featured && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <div className="p-2 rounded-full bg-yellow-500/20 text-yellow-400">
                        <Star className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-sm text-yellow-300">Featured</div>
                        <div className="font-medium text-white">
                          High Potential Student
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10 space-y-4">
                  {/* Wallet connection button */}
                  {!isWalletConnected ? (
                    <Button
                      onClick={connectWallet}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Wallet className="h-4 w-4 mr-2" />
                      Connect Wallet
                    </Button>
                  ) : (
                    <div className="bg-white/5 p-2 rounded-lg text-sm flex items-center justify-between">
                      <span className="text-gray-300">Wallet:</span>
                      <span className="text-white font-mono">
                        {formatAddress(walletAddress)}
                      </span>
                    </div>
                  )}

                  {/* Identity verification button */}
                  <Button
                    onClick={() => setIsVerificationModalOpen(true)}
                    className="w-full bg-indigo-600/50 hover:bg-indigo-600/70 text-white border border-indigo-500/30"
                    variant="outline"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Verify Identity with ZKP
                  </Button>

                  {/* Fund student button */}
                  <Button
                    onClick={() => setIsInvestModalOpen(true)}
                    className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
                    disabled={!isWalletConnected || !blockchainProposalId}
                  >
                    Invest Now
                  </Button>

                  {!isWalletConnected && (
                    <p className="text-amber-400 text-xs text-center">
                      Connect your wallet to invest in this student
                    </p>
                  )}

                  {!blockchainProposalId && isWalletConnected && (
                    <p className="text-amber-400 text-xs text-center">
                      This student proposal is not yet connected to the
                      blockchain
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      <Dialog open={isInvestModalOpen} onOpenChange={setIsInvestModalOpen}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Invest in {student?.name}</DialogTitle>
            <DialogDescription className="text-slate-400">
              Your contribution will help fund {student?.name}'s education goals
            </DialogDescription>
          </DialogHeader>

          {txHash ? (
            <div className="space-y-4">
              <div className="bg-green-900/20 p-4 rounded-lg border border-green-700">
                <h3 className="flex items-center text-green-400 font-medium">
                  <CheckCircle2 className="h-5 w-5 mr-2" /> Transaction
                  Submitted
                </h3>
                <p className="text-slate-300 text-sm mt-2">
                  Your investment of ₹{investAmount} has been sent to the
                  blockchain
                </p>
                <div className="mt-2 bg-slate-800 p-2 rounded text-xs text-slate-300 font-mono break-all">
                  {txHash}
                </div>
              </div>

              <div className="flex justify-end">
                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                >
                  View on Etherscan
                  <ArrowUpRight className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          ) : (
            <>
              {txError && (
                <div className="bg-red-900/20 p-3 rounded-lg border border-red-700 mb-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-2" />
                    <div>
                      <h3 className="text-red-400 font-medium">
                        Transaction Failed
                      </h3>
                      <p className="text-slate-300 text-sm">{txError}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-slate-300">
                    Amount (₹)
                  </Label>
                  <Input
                    id="amount"
                    placeholder="1000"
                    type="number"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white"
                  />
                  <p className="text-slate-400 text-sm">
                    Remaining goal: ₹
                    {formatCurrency(
                      student?.amountRequested - student?.amountRaised
                    )}
                  </p>
                </div>

                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/60 space-y-2">
                  <h4 className="text-sm text-slate-400">
                    Transaction details:
                  </h4>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Amount:</span>
                    <span className="text-white font-medium">
                      ₹{investAmount || "0"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Recipient:</span>
                    <span className="text-white font-mono text-sm">
                      0x39DA...8F0f
                    </span>
                  </div>
                </div>
              </div>

              <DialogFooter className="mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsInvestModalOpen(false)}
                  className="border-slate-700 text-slate-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleInvest}
                  disabled={isProcessingPayment || !investAmount}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-4 w-4 mr-2" /> Confirm Investment
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Identity Verification Modal */}
      <Dialog
        open={isVerificationModalOpen}
        onOpenChange={setIsVerificationModalOpen}
      >
        <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle>Identity Verification</DialogTitle>
            <DialogDescription className="text-slate-400">
              Verify your identity using zero-knowledge proof technology
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {verificationResult ? (
              <div
                className={`p-4 rounded-lg border ${
                  verificationResult.success
                    ? "bg-green-900/20 border-green-700 text-green-400"
                    : "bg-red-900/20 border-red-700 text-red-400"
                }`}
              >
                <h3 className="font-medium flex items-center">
                  {verificationResult.success ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Verification Successful
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Verification Failed
                    </>
                  )}
                </h3>
                <p className="text-slate-300 text-sm mt-2">
                  {verificationResult.message}
                </p>

                {verificationResult.success && (
                  <div className="mt-3 bg-slate-800 p-2 rounded text-xs text-slate-400 font-mono">
                    <p className="mb-1 text-slate-400 text-xs">
                      ZK Proof (truncated):
                    </p>
                    {verificationResult.proof
                      ? `${verificationResult.proof.substring(0, 20)}...`
                      : "● ● ● ● ● ● ● ●"}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/60">
                  <h4 className="text-sm text-slate-300 mb-2">
                    Sample Aadhar Card
                  </h4>
                  <div className="aspect-[4/2.5] relative bg-slate-800 rounded-lg overflow-hidden mb-2">
                    <img
                      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzE3MjU0YyIvPjx0ZXh0IHg9IjUwJSIgeT0iMzUlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFBREhBUiBDQVJEPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjEyMzQtNTY3OC05MDEyPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjUlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNhbXBsZSBOYW1lPC90ZXh0Pjxwb2x5Z29uIHBvaW50cz0iMzIwLDgwIDM2MCw4MCAzNjAsMTYwIDMyMCwxNjAiIGZpbGw9IiMzMzMiLz48L3N2Zz4="
                      alt="Sample Aadhar Card"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <p className="text-slate-400 text-xs">
                    For this demo, we'll use a sample Aadhar card with number
                    1234-5678-9012
                  </p>
                </div>

                <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-700/50 text-sm text-slate-300">
                  <p>
                    <span className="text-blue-400 font-medium">
                      Zero-Knowledge Proofs:
                    </span>{" "}
                    Allow verification without revealing sensitive data. Our
                    system will verify your identity without storing your Aadhar
                    details.
                  </p>
                </div>
              </>
            )}
          </div>

          <DialogFooter className="mt-4">
            {verificationResult ? (
              <Button
                onClick={() => setIsVerificationModalOpen(false)}
                className="bg-slate-700 hover:bg-slate-600 text-white"
              >
                Close
              </Button>
            ) : (
              <Button
                onClick={verifyIdentity}
                disabled={isVerifying}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" /> Verify with ZKP
                  </>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import {
  Shield,
  CheckCircle,
  X,
  AlertCircle,
  Upload,
  Loader2,
  Eye,
  EyeOff,
  Lock,
  FileText,
  User,
  Info,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

// Simulated ZKP verification logic
// In a real implementation, this would use actual ZKP libraries like snarkjs or circom
const verifyWithZKP = async (
  aadharNumber: string,
  image: string
): Promise<VerificationResult> => {
  return new Promise((resolve) => {
    // Simulate verification delay
    setTimeout(() => {
      // Hardcoded valid Aadhar details for demo
      const validAadhar = "1234-5678-9012";
      const isValid = aadharNumber === validAadhar;

      if (isValid) {
        resolve({
          success: true,
          message: "Identity verified successfully using zero-knowledge proof",
        });
      } else {
        // Provide more detailed error message based on the input
        if (!aadharNumber.match(/^\d{4}-\d{4}-\d{4}$/)) {
          resolve({
            success: false,
            message: "Invalid Aadhar format. Please use format XXXX-XXXX-XXXX",
          });
        } else {
          resolve({
            success: false,
            message:
              "Verification failed. The provided Aadhar number doesn't match our records",
          });
        }
      }
    }, 3000);
  });
};

// Sample hardcoded Aadhar image (base64 encoded placeholder)
const SAMPLE_AADHAR_IMAGE =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iIzE3MjU0YyIvPjx0ZXh0IHg9IjUwJSIgeT0iMzUlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkFBREhBUiBDQVJEPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjEyMzQtNTY3OC05MDEyPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjUlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiNmZmZmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPlNhbXBsZSBOYW1lPC90ZXh0Pjxwb2x5Z29uIHBvaW50cz0iMzIwLDgwIDM2MCw4MCAzNjAsMTYwIDMyMCwxNjAiIGZpbGw9IiMzMzMiLz48L3N2Zz4=";

interface VerificationResult {
  success: boolean;
  message: string;
}

export default function ZkpVerification() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [aadharNumber, setAadharNumber] = useState("");
  const [aadharImage, setAadharImage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [showSampleImage, setShowSampleImage] = useState(false);
  const [showProof, setShowProof] = useState(false);
  const [showIntroAnimation, setShowIntroAnimation] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  // For demo purposes we'll provide a sample value
  const SAMPLE_AADHAR_NUMBER = "1234-5678-9012";

  // Disable intro animation after initial render
  useEffect(() => {
    const timer = setTimeout(() => setShowIntroAnimation(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Format Aadhar number as user types (XXXX-XXXX-XXXX)
  const formatAadharNumber = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");

    // Format with dashes
    if (numericValue.length <= 4) {
      return numericValue;
    } else if (numericValue.length <= 8) {
      return `${numericValue.slice(0, 4)}-${numericValue.slice(4)}`;
    } else {
      return `${numericValue.slice(0, 4)}-${numericValue.slice(
        4,
        8
      )}-${numericValue.slice(8, 12)}`;
    }
  };

  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatAadharNumber(e.target.value);
    setAadharNumber(formattedValue.slice(0, 14)); // Limit to XXXX-XXXX-XXXX format
    setValidationError(null); // Clear validation error on change
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setValidationError("Image file size must be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      setValidationError("File must be an image");
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setAadharImage(reader.result);
          setValidationError(null); // Clear validation error on change
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const useSampleData = () => {
    setAadharNumber(SAMPLE_AADHAR_NUMBER);
    setAadharImage(SAMPLE_AADHAR_IMAGE);
    setValidationError(null); // Clear validation error when using sample data
  };

  const verifyIdentity = async () => {
    // Validate input fields
    if (!aadharNumber) {
      setValidationError("Please enter your Aadhar number");
      return;
    }

    if (!aadharNumber.match(/^\d{4}-\d{4}-\d{4}$/)) {
      setValidationError("Aadhar number must be in the format XXXX-XXXX-XXXX");
      return;
    }

    if (!aadharImage) {
      setValidationError("Please upload your Aadhar card image");
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);
    setValidationError(null);

    try {
      // In a real implementation, we would call the API with the actual data
      const result = await verifyWithZKP(aadharNumber, aadharImage);
      setVerificationResult(result);

      // If verification was successful, we could store a verification token in local storage
      if (result.success) {
        try {
          // Store verification status (in a real app, we'd use a secure token)
          localStorage.setItem("zkp_verified", "true");
          localStorage.setItem("zkp_timestamp", Date.now().toString());
        } catch (storageError) {
          console.error("Error storing verification status:", storageError);
        }
      }
    } catch (error) {
      setVerificationResult({
        success: false,
        message: "Verification process failed. Please try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Generate a simulated ZKP proof (for display purposes)
  const generateProof = () => {
    const chars = "0123456789abcdef";
    let proof = "";
    const parts = 8;

    for (let p = 0; p < parts; p++) {
      let section = "";
      for (let i = 0; i < 8; i++) {
        section += chars[Math.floor(Math.random() * chars.length)];
      }
      proof += section;
      if (p < parts - 1) proof += "-";
    }

    return proof;
  };

  // Reset the verification process
  const resetVerification = () => {
    setVerificationResult(null);
    setAadharNumber("");
    setAadharImage(null);
    setValidationError(null);
  };

  // Check if the user is already verified
  useEffect(() => {
    const checkExistingVerification = () => {
      const isVerified = localStorage.getItem("zkp_verified");
      const timestamp = localStorage.getItem("zkp_timestamp");

      // If verified and timestamp is recent (within 24 hours)
      if (isVerified === "true" && timestamp) {
        const verifiedTime = parseInt(timestamp);
        const currentTime = Date.now();
        const hoursDiff = (currentTime - verifiedTime) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
          // Show already verified message
          setVerificationResult({
            success: true,
            message:
              "Your identity has already been verified in the last 24 hours.",
          });
        }
      }
    };

    checkExistingVerification();
  }, []);

  // ... [rest of the component remains the same] ...
  return (
    <div className="max-w-5xl mx-auto">
      {/* Title and description */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-block p-3 bg-indigo-900/30 rounded-full mb-4"
        >
          <Shield className="h-8 w-8 text-indigo-400" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl font-bold text-white mb-2"
        >
          Zero-Knowledge Proof Identity Verification
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-400 max-w-2xl mx-auto"
        >
          Verify your identity without revealing sensitive information. Our ZKP
          system protects your privacy while still confirming your identity
          credentials.
        </motion.p>
      </div>

      {/* Main content */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left column: Input form */}
        <motion.div
          initial={showIntroAnimation ? { opacity: 0, x: -20 } : { opacity: 1 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-blue-900/30 border-blue-800/60 overflow-hidden">
            <div className="absolute h-40 w-40 bg-blue-600/20 rounded-full blur-3xl -top-20 -right-20 z-0"></div>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2 relative z-10">
                <Lock className="h-5 w-5 text-blue-400" />
                Aadhar Verification
              </CardTitle>
              <CardDescription className="text-slate-400 relative z-10">
                Submit your details securely using zero-knowledge proofs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              {/* Sample Data Info */}
              <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-800/50 text-blue-300 text-sm flex items-start gap-2">
                <Info className="h-5 w-5 flex-shrink-0 text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium">Demo Information</p>
                  <p className="mt-1">
                    For demo purposes, use the Aadhar number "
                    <span className="font-mono text-white">
                      {SAMPLE_AADHAR_NUMBER}
                    </span>
                    " to see a successful verification.
                  </p>
                </div>
              </div>

              {validationError && (
                <div className="bg-red-900/20 p-3 rounded-lg border border-red-800/50 text-red-300 text-sm flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400 mt-0.5" />
                  <span>{validationError}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="aadhar"
                  className="text-slate-300 flex items-center"
                >
                  <User className="h-4 w-4 mr-1.5" />
                  Aadhar Number
                </Label>
                <div className="relative">
                  <Input
                    id="aadhar"
                    placeholder="XXXX-XXXX-XXXX"
                    value={aadharNumber}
                    onChange={handleAadharChange}
                    maxLength={14}
                    className="bg-slate-800/70 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 pl-4"
                    disabled={isVerifying}
                  />
                  {aadharNumber && (
                    <button
                      onClick={() => setAadharNumber("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-500">Format: XXXX-XXXX-XXXX</p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="image"
                  className="text-slate-300 flex items-center"
                >
                  <FileText className="h-4 w-4 mr-1.5" />
                  Aadhar Card Image
                </Label>
                <Input
                  ref={fileInputRef}
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-slate-800/70 border-slate-700 text-white hover:bg-slate-800"
                    disabled={isVerifying}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-blue-900/30 border-blue-800 text-blue-400 hover:bg-blue-900/40"
                    onClick={useSampleData}
                    disabled={isVerifying}
                  >
                    Use Sample Data
                  </Button>
                </div>
              </div>

              {aadharImage && (
                <div className="mt-4 border border-slate-700 rounded-md overflow-hidden">
                  <div className="bg-slate-800 py-2 px-3 flex items-center justify-between">
                    <p className="text-slate-400 text-sm">Card Preview</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setShowSampleImage(!showSampleImage)}
                    >
                      {showSampleImage ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                  <div className="relative">
                    {!showSampleImage && (
                      <div className="absolute inset-0 bg-slate-800 flex items-center justify-center z-10">
                        <div className="text-slate-400 text-center px-4">
                          <Lock className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                          <p className="text-sm">
                            Card image hidden for security
                          </p>
                          <p className="text-xs mt-1">
                            Click the eye icon to reveal
                          </p>
                        </div>
                      </div>
                    )}
                    <img
                      src={aadharImage}
                      alt="Aadhar Card"
                      className="max-h-48 w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                onClick={verifyIdentity}
                disabled={isVerifying}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Verify with Zero-Knowledge Proof
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* ZKP explainer */}
          <div className="mt-6 p-4 bg-blue-900/30 rounded-xl border border-blue-900/30">
            <h3 className="text-sm font-medium text-blue-400 flex items-center mb-2">
              <Lock className="h-4 w-4 mr-1.5" /> How Zero-Knowledge Proofs Work
            </h3>
            <p className="text-slate-300 text-sm">
              Zero-knowledge proofs allow you to prove you possess certain
              information without revealing the information itself. Our system
              verifies your identity while keeping your personal data private.
            </p>
          </div>
        </motion.div>

        {/* Right column: Results */}
        <motion.div
          initial={showIntroAnimation ? { opacity: 0, x: 20 } : { opacity: 1 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-blue-900/30 border-blue-800/60 h-full">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-400" />
                Verification Results
              </CardTitle>
              <CardDescription className="text-slate-400">
                Your identity verification status and proof details
              </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[350px] flex items-center justify-center">
              {isVerifying ? (
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-700/30 border-t-indigo-500 animate-spin"></div>
                    <div className="absolute inset-3 rounded-full border-2 border-blue-700/30 border-t-blue-500 animate-spin"></div>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    Processing Verification
                  </h3>
                  <p className="text-slate-400 max-w-xs mx-auto">
                    Generating zero-knowledge proof and verifying your identity
                    securely...
                  </p>
                </div>
              ) : verificationResult ? (
                <div className="w-full space-y-6">
                  <div
                    className={`p-5 rounded-lg flex items-start gap-4 ${
                      verificationResult.success
                        ? "bg-green-900/20 border border-green-800"
                        : "bg-red-900/20 border border-red-800"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-full ${
                        verificationResult.success
                          ? "bg-green-900/40"
                          : "bg-red-900/40"
                      }`}
                    >
                      {verificationResult.success ? (
                        <CheckCircle className="h-6 w-6 text-green-400" />
                      ) : (
                        <X className="h-6 w-6 text-red-400" />
                      )}
                    </div>
                    <div>
                      <h4
                        className={`font-bold text-lg ${
                          verificationResult.success
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {verificationResult.success
                          ? "Verification Successful"
                          : "Verification Failed"}
                      </h4>
                      <p className="text-slate-300">
                        {verificationResult.message}
                      </p>

                      {!verificationResult.success && (
                        <div className="mt-3 bg-slate-800/70 p-2 rounded text-sm border border-slate-700">
                          <p className="text-slate-300 flex items-center">
                            <HelpCircle className="h-4 w-4 mr-1.5 text-amber-400" />
                            <span>
                              For demo purposes, use Aadhar number:{" "}
                              <span className="text-white font-mono">
                                {SAMPLE_AADHAR_NUMBER}
                              </span>
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {verificationResult.success && (
                    <div className="space-y-4">
                      <div className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                        <div className="bg-slate-700 p-3 flex justify-between items-center">
                          <h4 className="text-slate-300 text-sm font-medium flex items-center">
                            <Lock className="h-4 w-4 mr-1.5 text-blue-400" />
                            Zero-Knowledge Proof
                          </h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-slate-400 hover:text-white"
                            onClick={() => setShowProof(!showProof)}
                          >
                            {showProof ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <div className="font-mono text-xs text-slate-400 bg-slate-800 p-4 overflow-x-auto">
                          {showProof
                            ? generateProof()
                            : "● ● ● ● ● ● ● ● ● ● ● ● ●"}
                        </div>
                      </div>

                      <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-800/30">
                        <h4 className="text-blue-400 font-medium mb-2">
                          Verification Benefits:
                        </h4>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle className="h-3 w-3" />
                            </div>
                            <span className="text-slate-300 text-sm">
                              Your identity is now verified on the blockchain
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle className="h-3 w-3" />
                            </div>
                            <span className="text-slate-300 text-sm">
                              Unlocked access to funding opportunities
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="h-5 w-5 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <CheckCircle className="h-3 w-3" />
                            </div>
                            <span className="text-slate-300 text-sm">
                              Your personal data remains private and secure
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      onClick={resetVerification}
                      variant="outline"
                      size="sm"
                      className="text-slate-400 border-slate-700 hover:bg-slate-800"
                    >
                      Verify Another Identity
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-slate-800/70 flex items-center justify-center">
                    <Shield className="h-12 w-12 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No Verification Yet
                  </h3>
                  <p className="text-slate-400 max-w-xs mx-auto">
                    Enter your Aadhar details and submit for verification using
                    our secure zero-knowledge proof system.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { Check, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormattedReceiptData,
  generateReceiptFilename,
} from "@/lib/blockchain/receipt-service";

// Register fonts
Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hiA.woff2",
      fontWeight: 700,
    },
  ],
});

// PDF styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Inter",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  headerLeft: {
    flexDirection: "column",
  },
  headerRight: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  logo: {
    width: 180,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 10,
    color: "#111827",
  },
  receiptId: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 30,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#374151",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    borderBottom: "1pt solid #F3F4F6",
    paddingBottom: 8,
  },
  lastRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingBottom: 8,
  },
  label: {
    fontSize: 10,
    color: "#6B7280",
    width: "30%",
  },
  value: {
    fontSize: 10,
    color: "#111827",
    width: "70%",
    textAlign: "right",
  },
  watermark: {
    position: "absolute",
    top: 200,
    left: 100,
    opacity: 0.06,
    transform: "rotate(-45deg)",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#9CA3AF",
    borderTop: "1pt solid #F3F4F6",
    paddingTop: 20,
  },
  divider: {
    borderBottom: "1pt solid #E5E7EB",
    marginVertical: 15,
  },
  totalSection: {
    backgroundColor: "#F9FAFB",
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#111827",
  },
  totalValue: {
    fontSize: 12,
    fontWeight: 700,
    color: "#111827",
  },
  statusSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 30,
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#DCFCE7",
    borderRadius: 20,
    color: "#166534",
    fontSize: 10,
    fontWeight: 700,
  },
});

// Transaction Receipt PDF Document
const TransactionReceiptPDF = ({ data }: { data: FormattedReceiptData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Watermark */}
      <View style={styles.watermark}>
        <Text style={{ fontSize: 85, fontWeight: 700, color: "#4F46E5" }}>
          VERIFIED
        </Text>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Transaction Receipt</Text>
          <Text style={styles.receiptId}>Receipt ID: {data.receiptId}</Text>
          <Text style={styles.date}>
            Date: {data.formattedDate} at {data.formattedTime}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={{ fontSize: 18, fontWeight: 700, color: "#4F46E5" }}>
            SkillBridge
          </Text>
          <Text style={{ fontSize: 10, color: "#6B7280", marginTop: 5 }}>
            Student Funding Platform
          </Text>
        </View>
      </View>

      {/* Status Badge */}
      <View style={styles.statusSection}>
        <View style={styles.statusBadge}>
          <Text>✓ TRANSACTION SUCCESSFUL</Text>
        </View>
      </View>

      {/* Transaction Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transaction Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Transaction Hash</Text>
          <Text style={styles.value}>{data.txHash}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Network</Text>
          <Text style={styles.value}>{data.network}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>
            {data.status === "success" ? "Successful" : data.status}
          </Text>
        </View>
        <View style={styles.lastRow}>
          <Text style={styles.label}>Timestamp</Text>
          <Text style={styles.value}>
            {data.formattedDate} at {data.formattedTime}
          </Text>
        </View>
      </View>

      {/* Payment Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>From Address</Text>
          <Text style={styles.value}>{data.fromAddress}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>To Address</Text>
          <Text style={styles.value}>{data.toAddress}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Amount (ETH)</Text>
          <Text style={styles.value}>{data.amount} ETH</Text>
        </View>
        <View style={styles.lastRow}>
          <Text style={styles.label}>Amount (USD)</Text>
          <Text style={styles.value}>${data.amountUsd}</Text>
        </View>
      </View>

      {/* Fee Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fee Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Gas Used</Text>
          <Text style={styles.value}>{data.gasUsed}</Text>
        </View>
        <View style={styles.lastRow}>
          <Text style={styles.label}>Gas Fee</Text>
          <Text style={styles.value}>{data.gasFee} ETH</Text>
        </View>
      </View>

      {/* Total Section */}
      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>
            {data.amount} ETH (${data.amountUsd})
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text>
          This is an automatically generated receipt for your transaction on the
          SkillBridge platform.
        </Text>
        <Text>For any questions, please contact support@skillbridge.edu</Text>
      </View>
    </Page>
  </Document>
);

interface TransactionReceiptProps {
  data: FormattedReceiptData;
}

const TransactionReceipt: React.FC<TransactionReceiptProps> = ({ data }) => {
  const [isHovered, setIsHovered] = useState(false);

  const filename = generateReceiptFilename(data);

  return (
    <Card className="overflow-hidden bg-blue-900/30 border-blue-800/60">
      <CardHeader className="bg-gradient-to-r from-blue-900/70 to-indigo-900/70 border-b border-blue-800/60">
        <CardTitle className="text-white flex items-center gap-2">
          <Check className="h-5 w-5 text-green-400" />
          Transaction Receipt
        </CardTitle>
        <CardDescription className="text-slate-300">
          Your transaction has been confirmed on the blockchain
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="rounded-lg border border-blue-800/40 bg-blue-900/20 p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-400">Receipt ID:</span>
            <span className="text-sm font-medium text-white">
              {data.receiptId}
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-slate-400">Date:</span>
            <span className="text-sm text-white">
              {data.formattedDate} at {data.formattedTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-400">Status:</span>
            <span className="text-sm font-medium text-green-400">
              Successful
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-2">
              Transaction Details
            </h3>
            <div className="bg-slate-800/50 rounded-md p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">Hash:</span>
                <span className="text-xs font-mono text-white">
                  {data.shortTxHash}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">From:</span>
                <span className="text-xs font-mono text-white">
                  {data.shortFromAddress}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">To:</span>
                <span className="text-xs font-mono text-white">
                  {data.shortToAddress}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-300 mb-2">
              Payment Details
            </h3>
            <div className="bg-slate-800/50 rounded-md p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">Amount:</span>
                <span className="text-xs text-white">{data.amount} ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">Value:</span>
                <span className="text-xs text-white">${data.amountUsd}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">Network:</span>
                <span className="text-xs text-white">{data.network}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-blue-800/30 pt-4">
        <PDFDownloadLink
          document={<TransactionReceiptPDF data={data} />}
          fileName={filename}
          className="w-full"
        >
          {({ blob, url, loading, error }) => (
            <Button
              className={`w-full transition-all ${
                isHovered ? "bg-green-600" : "bg-indigo-600"
              } hover:bg-green-600`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </>
              )}
            </Button>
          )}
        </PDFDownloadLink>
      </CardFooter>
    </Card>
  );
};

export default TransactionReceipt;

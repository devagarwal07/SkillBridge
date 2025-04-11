"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
  CheckCircle2,
  ChevronDown,
  XCircle,
  BadgeCheck,
  Sparkles,
  ArrowRight,
  CreditCard,
  Star,
  Shield,
  Zap,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import Layout from "../components/layout/Layout";

// Mock data fetch
const fetchPremiumPlans = async () => {
  try {
    const response = await fetch("/data/premium-plans.json");
    return await response.json();
  } catch (error) {
    console.error("Error fetching premium plans:", error);
    return [];
  }
};

export default function PremiumPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">(
    "monthly"
  );
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchPremiumPlans();
      setPlans(data);
      setLoading(false);
    };

    loadData();
  }, []);

  // Animate testimonials
  useEffect(() => {
    if (!loading && testimonialRef.current) {
      gsap.fromTo(
        testimonialRef.current.querySelectorAll(".testimonial"),
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          stagger: 0.2,
          duration: 0.5,
          ease: "back.out(1.5)",
        }
      );
    }
  }, [loading]);

  // Toggle FAQ items
  const toggleFAQ = (index: number) => {
    if (expandedFAQ === index) {
      setExpandedFAQ(null);
    } else {
      setExpandedFAQ(index);
    }
  };

  // Filtered plans based on selected billing cycle
  const filteredPlans = plans.filter(
    (plan) =>
      plan.billingCycle === billingCycle ||
      (billingCycle === "annual" && plan.billingCycle === "annual")
  );

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium">Loading premium plans...</p>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="container py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center text-sm font-medium text-secondary-500 bg-secondary-50 dark:bg-secondary-950/30 px-3 py-1 rounded-full">
              <Sparkles className="h-4 w-4 mr-1" />
              Unlock Premium Features
            </span>
          </div>
          <h1 className="text-4xl font-extrabold mb-4">
            Supercharge Your Education Journey
          </h1>
          <p className="text-xl text-muted-foreground">
            Gain access to exclusive resources, enhanced tools, and priority
            support to accelerate your career growth.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-muted inline-flex p-1 rounded-full">
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setBillingCycle("monthly")}
            >
              Monthly Billing
            </button>
            <button
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === "annual"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setBillingCycle("annual")}
            >
              Annual Billing
              <span className="ml-2 text-xs font-bold text-secondary-500">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {filteredPlans.map((plan) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`bg-background border rounded-xl shadow-sm overflow-hidden ${
                plan.popular ? "ring-2 ring-primary shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <div className="bg-primary text-primary-foreground text-center text-sm font-medium py-1">
                  Most Popular
                </div>
              )}

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-1">{plan.name}</h2>
                <p className="text-muted-foreground mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">
                    /{plan.billingCycle}
                  </span>
                  {plan.discountPercentage && (
                    <span className="ml-2 text-xs font-medium text-secondary-500 bg-secondary-50 dark:bg-secondary-950/30 px-2 py-0.5 rounded-full">
                      Save {plan.discountPercentage}%
                    </span>
                  )}
                </div>

                <Button
                  className={`w-full mb-6 ${plan.color} hover:brightness-110`}
                  size="lg"
                >
                  {plan.popular ? "Get Started Now" : "Subscribe"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <div className="space-y-3">
                  {plan.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature comparison */}
        <div className="bg-background border rounded-xl shadow-sm p-8 mb-16">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Feature Comparison
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            See which plan is right for you
          </p>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4 font-medium">Feature</th>
                  <th className="text-center py-4 px-4 font-medium">Free</th>
                  <th className="text-center py-4 px-4 font-medium">
                    Premium Essentials
                  </th>
                  <th className="text-center py-4 px-4 font-medium">
                    Premium Professional
                  </th>
                  <th className="text-center py-4 px-4 font-medium">
                    Premium Elite
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4 px-4">Skill Assessments</td>
                  <td className="text-center py-4 px-4">3 per month</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">AI Career Recommendations</td>
                  <td className="text-center py-4 px-4">Basic</td>
                  <td className="text-center py-4 px-4">Standard</td>
                  <td className="text-center py-4 px-4">Advanced</td>
                  <td className="text-center py-4 px-4">Advanced + Custom</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">Access to Premium Courses</td>
                  <td className="text-center py-4 px-4">
                    <XCircle className="h-5 w-5 text-destructive mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <XCircle className="h-5 w-5 text-destructive mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle2 className="h-5 w-5 text-accent mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <CheckCircle2 className="h-5 w-5 text-accent mx-auto" />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">1-on-1 Career Advising</td>
                  <td className="text-center py-4 px-4">
                    <XCircle className="h-5 w-5 text-destructive mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <XCircle className="h-5 w-5 text-destructive mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">Monthly</td>
                  <td className="text-center py-4 px-4">Weekly</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">Investor Introductions</td>
                  <td className="text-center py-4 px-4">
                    <XCircle className="h-5 w-5 text-destructive mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">
                    <XCircle className="h-5 w-5 text-destructive mx-auto" />
                  </td>
                  <td className="text-center py-4 px-4">5 per month</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                </tr>
                <tr className="border-b">
                  <td className="py-4 px-4">Verified Digital Credentials</td>
                  <td className="text-center py-4 px-4">Basic</td>
                  <td className="text-center py-4 px-4">Enhanced</td>
                  <td className="text-center py-4 px-4">Advanced</td>
                  <td className="text-center py-4 px-4">
                    Premium + Blockchain
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4">Interview Preparation</td>
                  <td className="text-center py-4 px-4">Self-service</td>
                  <td className="text-center py-4 px-4">With AI feedback</td>
                  <td className="text-center py-4 px-4">
                    AI + Personal review
                  </td>
                  <td className="text-center py-4 px-4">Expert coaching</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16" ref={testimonialRef}>
          <h2 className="text-2xl font-bold mb-2 text-center">
            What Our Premium Members Say
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Join thousands of students who accelerated their careers
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="testimonial bg-background border rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="David K."
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="font-medium">David K.</div>
                  <div className="text-sm text-muted-foreground">
                    Software Engineer
                  </div>
                </div>
              </div>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 text-warning-500 fill-warning-500"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-2">
                "The Premium Professional plan was a game-changer. The AI career
                recommendations and interview coaching helped me land a job at a
                top tech company."
              </p>
              <p className="text-sm font-medium">Increased salary by 35%</p>
            </div>

            <div className="testimonial bg-background border rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Sarah M."
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="font-medium">Sarah M.</div>
                  <div className="text-sm text-muted-foreground">
                    Data Scientist
                  </div>
                </div>
              </div>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 text-warning-500 fill-warning-500"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-2">
                "The premium courses and investor introductions transformed my
                learning journey. I secured funding for my education and landed
                my dream job."
              </p>
              <p className="text-sm font-medium">
                Secured $25K in educational funding
              </p>
            </div>

            <div className="testimonial bg-background border rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Michael T."
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <div className="font-medium">Michael T.</div>
                  <div className="text-sm text-muted-foreground">
                    Product Manager
                  </div>
                </div>
              </div>
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 text-warning-500 fill-warning-500"
                  />
                ))}
              </div>
              <p className="text-muted-foreground mb-2">
                "As a career changer, Premium Elite gave me everything I needed
                to transition into tech. The weekly mentoring sessions were
                invaluable."
              </p>
              <p className="text-sm font-medium">
                Complete career change in 6 months
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-center mb-8">
            Everything you need to know about our premium plans
          </p>

          <div className="space-y-4">
            {[
              {
                question: "What happens when I upgrade to a premium plan?",
                answer:
                  "When you upgrade, you'll immediately gain access to all premium features included in your chosen plan. This includes additional skill assessments, advanced career recommendations, premium courses, and more, depending on your plan level.",
              },
              {
                question: "Can I switch between plans?",
                answer:
                  "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, the new features will be available immediately. If you downgrade, you'll retain your current plan until the end of your billing cycle.",
              },
              {
                question: "Is there a student discount available?",
                answer:
                  "Yes, we offer a 20% discount for verified students. Contact our support team with your student ID or .edu email address to receive your discount code.",
              },
              {
                question: "What payment methods do you accept?",
                answer:
                  "We accept major credit cards (Visa, Mastercard, American Express), PayPal, and in selected regions, bank transfers. All payments are securely processed and encrypted.",
              },
              {
                question: "Can I cancel my subscription at any time?",
                answer:
                  "Yes, you can cancel your subscription at any time from your account settings. Your premium access will remain active until the end of your current billing period.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-background border rounded-lg overflow-hidden"
              >
                <button
                  className="flex justify-between items-center w-full px-6 py-4 text-left font-medium transition-colors hover:bg-muted/50"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      expandedFAQ === index ? "transform rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {expandedFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-4 text-muted-foreground">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* CTA section */}
        <div className="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 text-white rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Accelerate Your Career?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have transformed their education and
            career journeys with our premium features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary-500 hover:bg-gray-100"
            >
              Get Started Today
              <Zap className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              View All Features
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

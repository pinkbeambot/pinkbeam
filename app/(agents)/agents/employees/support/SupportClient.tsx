"use client";

import { Headphones, Zap, BookOpen, MessageSquare, Users, Check, MessageCircle, Clock, TrendingDown, DollarSign, AlertCircle } from "lucide-react";
import { EmployeeHero } from "../components/EmployeeHero";
import { CapabilityCard } from "../components/CapabilityCard";
import { PricingCard } from "../components/PricingCard";
import { IntegrationShowcase } from "../components/IntegrationShowcase";
import { EmployeeProblemSection } from "../components/EmployeeProblemSection";
import { EmployeeVALISQuote } from "../components/EmployeeVALISQuote";
import { EmployeeCostComparison } from "../components/EmployeeCostComparison";
import { EmployeeFAQ } from "../components/EmployeeFAQ";
import { FadeIn } from "@/components/animations";
import { Quote } from "lucide-react";

const capabilities = [
  {
    icon: Zap,
    title: "Answers Tier 1 Support Instantly",
    description: "Alex responds to common questions in under 2 minutes, 24/7/365. No wait times, no 'we'll get back to you'.",
  },
  {
    icon: Check,
    title: "Resolves 70%+ Without Escalation",
    description: "Password resets, billing questions, feature guidance—Alex handles the majority without human intervention.",
  },
  {
    icon: BookOpen,
    title: "Learns From Your Knowledge Base",
    description: "Alex ingests your docs, FAQs, and past tickets to provide accurate answers that improve over time.",
  },
  {
    icon: MessageSquare,
    title: "Multi-Channel Support",
    description: "Works across email, chat widget, and Slack—meeting customers wherever they prefer to reach out.",
  },
  {
    icon: Users,
    title: "Seamless Handoff to Human Team",
    description: "Complex issues are routed to the right human with full context, conversation history, and suggested solutions.",
  },
];

const conversationFlow = [
  {
    sender: "customer",
    name: "Customer",
    message: "Hi, I was charged twice this month. Can you help?",
    time: "2:00 PM",
  },
  {
    sender: "alex",
    name: "Alex",
    message: "I can definitely help with that! Let me look up your account... I see the duplicate charge. I'm issuing a refund now—it will appear in 3-5 business days. You'll receive a confirmation email shortly.",
    time: "2:01 PM",
  },
  {
    sender: "customer",
    name: "Customer",
    message: "Great, thank you! Also, how do I reset my password?",
    time: "2:02 PM",
  },
  {
    sender: "alex",
    name: "Alex",
    message: "You can reset your password by clicking \"Forgot Password\" on the login page, or I can send you a reset link right now. Would you like me to do that?",
    time: "2:02 PM",
  },
  {
    sender: "customer",
    name: "Customer",
    message: "Yes please send the link",
    time: "2:03 PM",
  },
  {
    sender: "alex",
    name: "Alex",
    message: "Done! Check your email at sarah@company.com. The link expires in 1 hour. Is there anything else I can help with today?",
    time: "2:03 PM",
  },
];

const integrations = [
  { name: "Email", icon: "Em" },
  { name: "Chat Widget", icon: "CW" },
  { name: "Slack", icon: "Sl" },
  { name: "Zendesk", icon: "Zd" },
  { name: "Intercom", icon: "In" },
  { name: "Help Scout", icon: "HS" },
];

const problems = [
  {
    icon: Clock,
    title: "Slow Response Times",
    description: "Customers wait hours for basic support. Every delayed response risks churn and damages your brand reputation.",
  },
  {
    icon: TrendingDown,
    title: "Support Team Burnout",
    description: "Your team spends 80% of time on repetitive questions—password resets, billing inquiries, basic troubleshooting.",
  },
  {
    icon: DollarSign,
    title: "Expensive Support Hiring",
    description: "Each support rep costs $50K+/year, plus benefits and training. You need 5 reps for 24/7 coverage.",
  },
  {
    icon: AlertCircle,
    title: "Inconsistent Service Quality",
    description: "Support quality varies by rep, shift, and mood. Customers get different answers to the same questions.",
  },
];

const faqs = [
  {
    question: "How long does it take to set up Alex?",
    answer: "Initial setup takes about 45 minutes. You'll connect your knowledge base, configure response templates, and define escalation rules. Alex starts handling tickets within 2 hours.",
  },
  {
    question: "Can Alex integrate with our existing support system?",
    answer: "Yes! Alex integrates with Zendesk, Intercom, Help Scout, and most major support platforms. He also works via email, chat widget, and Slack.",
  },
  {
    question: "How does Alex know what answers to give?",
    answer: "Alex learns from your knowledge base, past tickets, and product documentation. He continuously improves based on feedback and learns from every interaction.",
  },
  {
    question: "What happens when Alex can't answer a question?",
    answer: "Alex seamlessly escalates to your human team with full context, conversation history, and suggested solutions. Your team gets involved only when needed.",
  },
  {
    question: "How many tickets can Alex handle?",
    answer: "Alex has no volume limits. He can handle 10 tickets per day or 10,000—response time stays under 2 minutes regardless of load.",
  },
  {
    question: "Can we customize Alex's responses?",
    answer: "Absolutely. You control Alex's tone, response templates, and escalation criteria. He adapts to your brand voice and support policies.",
  },
  {
    question: "What's your refund policy?",
    answer: "We offer a 30-day money-back guarantee. If Alex doesn't reduce your support workload in the first month, we'll refund your payment—no questions asked.",
  },
  {
    question: "Does Alex handle phone support?",
    answer: "Alex currently handles email, chat, and Slack. Phone support AI is coming soon. For now, he can draft responses for phone follow-ups.",
  },
];

export default function SupportClient() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <EmployeeHero
        name="Alex"
        role="Customer Support Specialist"
        tagline="Your 24/7 Customer Support Specialist"
        description="Alex provides instant, accurate support to your customers around the clock. He handles routine tickets autonomously and seamlessly escalates complex issues to your team."
        icon={Headphones}
        iconColor="bg-accent-cyan"
        ctaText="Configure Alex"
      />

      {/* Problem Section */}
      <EmployeeProblemSection
        title="Support That Never Sleeps"
        description="Deliver instant, 24/7 support without burning out your team"
        problems={problems}
        colorClass="text-cyan-500"
      />

      {/* VALIS Quote */}
      <EmployeeVALISQuote
        quote="Great support isn't about hiring more people—it's about being available instantly, consistently, and affordably. Alex does this 24/7 without the $250K team cost."
        colorClass="border-cyan-500/30 bg-cyan-500/5 text-cyan-400"
      />

      {/* Capabilities Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-h2 font-display font-bold mb-4">
              What Alex <span className="text-gradient-beam">Can Do</span>
            </h2>
            <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
              Complete customer support automation that keeps your customers happy and your team focused.
            </p>
          </FadeIn>

          {/* Featured Capabilities - Top 2 */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {capabilities.slice(0, 2).map((capability, index) => (
              <FadeIn key={index} delay={index * 0.05}>
                <CapabilityCard {...capability} iconColor="bg-accent-cyan" />
              </FadeIn>
            ))}
          </div>

          {/* Other Capabilities - Bottom 3 */}
          <div className="grid md:grid-cols-3 gap-6">
            {capabilities.slice(2).map((capability, index) => (
              <FadeIn key={index + 2} delay={(index + 2) * 0.05}>
                <CapabilityCard {...capability} iconColor="bg-accent-cyan" />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Conversation Section */}
      <section className="py-20 bg-surface-sunken">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-h2 font-display font-bold mb-4">
              See Alex in <span className="text-gradient-beam">Action</span>
            </h2>
            <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
              Real-time resolution with human-like conversation
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="bg-surface-elevated rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <div className="w-10 h-10 rounded-full bg-accent-cyan flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Support Chat</p>
                  <p className="text-xs text-muted-foreground">Alex is online</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-xs text-muted-foreground">Active</span>
                </div>
              </div>

              <div className="space-y-4">
                {conversationFlow.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${msg.sender === "customer" ? "flex-row" : "flex-row-reverse"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.sender === "customer" ? "bg-muted" : "bg-accent-cyan"
                      }`}
                    >
                      <span className={`text-xs font-bold ${msg.sender === "customer" ? "text-foreground" : "text-white"}`}>
                        {msg.sender === "customer" ? "C" : "A"}
                      </span>
                    </div>
                    <div className={`max-w-[80%] ${msg.sender === "customer" ? "" : "text-right"}`}>
                      <div
                        className={`inline-block p-3 rounded-2xl text-left ${
                          msg.sender === "customer"
                            ? "bg-muted text-foreground rounded-tl-none"
                            : "bg-accent-cyan/10 text-foreground rounded-tr-none border border-accent-cyan/30"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-muted rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent-cyan/50"
                  readOnly
                />
                <button className="w-10 h-10 rounded-full bg-accent-cyan flex items-center justify-center text-white">
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Channel Integrations */}
      <IntegrationShowcase
        title="Channel Integrations"
        description="Alex works across all your support channels"
        integrations={integrations}
      />

      {/* Cost Comparison */}
      <EmployeeCostComparison
        roleName="Alex (AI Support)"
        humanTitle="5 Support Reps (24/7)"
        humanCost={20000}
        aiCost={600}
        colorClass="text-cyan-500"
        savings={232800}
      />

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 bg-surface-sunken">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-h2 font-display font-bold mb-4">
              Simple <span className="text-gradient-beam">Pricing</span>
            </h2>
            <p className="text-lead text-muted-foreground">
              One flat monthly fee. Unlimited tickets. No per-seat pricing.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="max-w-md mx-auto">
              <PricingCard
                name="Alex — Support"
                price={600}
                description="24/7 customer support specialist"
                features={[
                  "Unlimited ticket volume",
                  "24/7 instant responses",
                  "Knowledge base integration",
                  "Multi-channel support",
                  "Smart escalation routing",
                  "Conversation analytics",
                  "Custom response training",
                ]}
                ctaText="Configure Alex"
                popular={true}
                iconColor="bg-accent-cyan"
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ Section */}
      <EmployeeFAQ faqs={faqs} />
    </main>
  );
}

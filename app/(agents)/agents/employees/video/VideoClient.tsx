"use client";

import { Video, Film, Scissors, Play, Clapperboard, MonitorPlay, Check, Clock, TrendingDown, DollarSign, AlertCircle, Quote } from "lucide-react";
import { EmployeeHero } from "../components/EmployeeHero";
import { CapabilityCard } from "../components/CapabilityCard";
import { PricingCard } from "../components/PricingCard";
import { IntegrationShowcase } from "../components/IntegrationShowcase";
import { EmployeeProblemSection } from "../components/EmployeeProblemSection";
import { EmployeeVALISQuote } from "../components/EmployeeVALISQuote";
import { EmployeeCostComparison } from "../components/EmployeeCostComparison";
import { EmployeeFAQ } from "../components/EmployeeFAQ";
import { FadeIn } from "@/components/animations";

const capabilities = [
  {
    icon: Film,
    title: "Product Explainers",
    description: "Create engaging animated videos that showcase your product features and benefits in a clear, compelling way.",
  },
  {
    icon: Scissors,
    title: "Social Video Cuts",
    description: "Transform long-form content into bite-sized clips optimized for TikTok, Instagram Reels, and YouTube Shorts.",
  },
  {
    icon: Clapperboard,
    title: "Motion Graphics",
    description: "Add professional motion graphics, transitions, and visual effects that elevate your video content.",
  },
  {
    icon: MonitorPlay,
    title: "Multi-Format Export",
    description: "Automatically generate videos in multiple aspect ratios and formats for every platform you publish on.",
  },
  {
    icon: Clock,
    title: "3-5 Day Turnaround",
    description: "Submit unlimited video requests with quick turnaround times. No more waiting months for production agencies.",
  },
];

const videoTypes = [
  {
    title: "Product Explainers",
    description: "2-3 minute animated videos that clearly communicate your value proposition",
    icon: Film,
  },
  {
    title: "Social Media Clips",
    description: "15-60 second vertical videos optimized for TikTok, Reels, and Shorts",
    icon: Scissors,
  },
  {
    title: "Tutorial Videos",
    description: "Step-by-step walkthroughs that help users get the most from your product",
    icon: Play,
  },
  {
    title: "Promotional Videos",
    description: "High-impact videos for product launches, announcements, and campaigns",
    icon: Clapperboard,
  },
];

const deliverables = [
  "1080p & 4K exports",
  "Multiple aspect ratios (16:9, 9:16, 1:1)",
  "Custom animations & motion graphics",
  "Background music & sound effects",
  "On-brand color schemes",
  "Subtitle/caption files",
  "Source project files",
];

const problems = [
  {
    icon: Clock,
    title: "Video Production Takes Months",
    description: "Agencies quote 6-8 weeks for a single explainer video. Your product launch is delayed waiting for video assets.",
  },
  {
    icon: TrendingDown,
    title: "Social Video Strategy is Nonexistent",
    description: "You know video content drives 10x engagement but creating short-form clips manually is impossible at scale.",
  },
  {
    icon: DollarSign,
    title: "Production Agencies Cost $15K+ Per Video",
    description: "A single 2-minute explainer video costs $15,000-$50,000 from agencies. Multiple videos per month is financially impossible.",
  },
  {
    icon: AlertCircle,
    title: "Format Inconsistency Across Platforms",
    description: "Your YouTube video doesn't work on TikTok. Instagram Reels need different cuts. Reformatting manually takes days.",
  },
];

const integrations = [
  { name: "YouTube", icon: "YT" },
  { name: "TikTok", icon: "TT" },
  { name: "Instagram", icon: "IG" },
  { name: "Vimeo", icon: "Vi" },
  { name: "Wistia", icon: "Wi" },
  { name: "After Effects", icon: "AE" },
];

const faqs = [
  {
    question: "How long does it take to set up FLUX?",
    answer: "Initial setup takes about 45 minutes. You'll provide brand assets (logos, colors, fonts), style references, and sample videos. FLUX starts creating within 48 hours.",
  },
  {
    question: "What video formats does FLUX deliver?",
    answer: "FLUX delivers MP4, MOV, and WebM formats in multiple resolutions (1080p, 4K) and aspect ratios (16:9, 9:16, 1:1). Source project files included.",
  },
  {
    question: "How does the unlimited request system work?",
    answer: "Submit as many video requests as you want via your dashboard. FLUX works through them in 3-5 day cycles. Most clients submit 2-4 videos per month.",
  },
  {
    question: "Can FLUX create videos from raw footage?",
    answer: "Yes! FLUX can edit raw footage, add motion graphics, create animations from scratch, or repurpose existing long-form content into clips.",
  },
  {
    question: "What if we need revisions?",
    answer: "Unlimited revisions are included. Submit feedback and FLUX will iterate until you're satisfied—typically 1-2 revision rounds.",
  },
  {
    question: "Can FLUX create live-action videos with actors?",
    answer: "FLUX specializes in motion graphics, animation, and editing. For live-action filming with actors, we recommend a video production company.",
  },
  {
    question: "What's your refund policy?",
    answer: "We offer a 30-day money-back guarantee. If FLUX doesn't deliver quality videos in the first month, we'll refund your payment—no questions asked.",
  },
  {
    question: "How is this different from hiring a video editor on Fiverr?",
    answer: "FLUX provides consistent quality, unlimited requests, brand learning, multi-format optimization, and reliable turnaround times—not one-off gigs.",
  },
];

export default function VideoClient() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <EmployeeHero
        name="FLUX"
        role="Motion Designer"
        tagline="Your Motion Graphics Producer"
        description="FLUX creates stunning video content that captures attention and drives engagement. From product explainers to social clips, bring your story to life."
        icon={Video}
        iconColor="bg-pink-400"
        ctaText="Configure FLUX"
      />

      {/* Problem Section */}
      <EmployeeProblemSection
        title="Video Production at Scale"
        description="Create unlimited professional videos without agency costs or long wait times"
        problems={problems}
        colorClass="text-pink-500"
      />

      {/* VALIS Quote */}
      <EmployeeVALISQuote
        quote="Great video marketing isn't about hiring expensive production agencies—it's about creating consistent, high-quality content at scale. FLUX delivers this for $500/month instead of $15K+ per video."
        colorClass="border-pink-500/30 bg-pink-500/5 text-pink-400"
      />

      {/* Capabilities Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-h2 font-display font-bold mb-4">
              What FLUX <span className="text-gradient-beam">Can Do</span>
            </h2>
            <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
              Professional video production that scales with your content needs.
            </p>
          </FadeIn>

          {/* Featured Capabilities - Top 2 */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {capabilities.slice(0, 2).map((capability, index) => (
              <FadeIn key={index} delay={index * 0.05}>
                <CapabilityCard {...capability} iconColor="bg-pink-400" />
              </FadeIn>
            ))}
          </div>

          {/* Other Capabilities - Bottom 3 */}
          <div className="grid md:grid-cols-3 gap-6">
            {capabilities.slice(2).map((capability, index) => (
              <FadeIn key={index + 2} delay={(index + 2) * 0.05}>
                <CapabilityCard {...capability} iconColor="bg-pink-400" />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Video Types Section */}
      <section className="py-20 bg-surface-sunken">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-h2 font-display font-bold mb-4">
              Video <span className="text-gradient-beam">Types</span>
            </h2>
            <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
              FLUX creates various video formats for different use cases
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            {videoTypes.map((video, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="group p-6 bg-surface-elevated rounded-xl border border-border hover:border-pink-400/30 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-pink-400 flex items-center justify-center shrink-0">
                      <video.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-h4 font-display font-semibold mb-2">{video.title}</h3>
                      <p className="text-body text-muted-foreground">{video.description}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Video Showcase */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-h2 font-display font-bold mb-4">
              Sample <span className="text-gradient-beam">Work</span>
            </h2>
            <p className="text-lead text-muted-foreground">
              Preview the quality and style of FLUX's video output
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Video Placeholder 1 */}
            <FadeIn>
              <div className="relative aspect-video bg-surface-elevated rounded-xl border border-border overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 to-purple-500/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-semibold">Product Explainer</p>
                  <p className="text-white/70 text-sm">2:30 • SaaS Platform Overview</p>
                </div>
              </div>
            </FadeIn>

            {/* Video Placeholder 2 */}
            <FadeIn delay={0.1}>
              <div className="relative aspect-[9/16] max-w-[200px] mx-auto bg-surface-elevated rounded-xl border border-border overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-pink-400/10 to-purple-500/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                    <Play className="w-5 h-5 text-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-sm font-semibold">Social Clip</p>
                  <p className="text-white/70 text-xs">0:30 • TikTok/Reels</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Deliverables Section */}
      <section className="py-20 bg-surface-sunken">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-h2 font-display font-bold mb-4">
              What's <span className="text-gradient-beam">Included</span>
            </h2>
            <p className="text-lead text-muted-foreground">
              Every video project includes these deliverables
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid md:grid-cols-2 gap-4">
              {deliverables.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 bg-surface-elevated rounded-lg border border-border hover:border-pink-400/30 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-pink-400/10 flex items-center justify-center">
                    <Check className="w-4 h-4 text-pink-400" />
                  </div>
                  <span className="text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Platform Integrations */}
      <IntegrationShowcase
        title="Platform Integrations"
        description="FLUX publishes directly to your video platforms"
        integrations={integrations}
      />

      {/* Cost Comparison */}
      <EmployeeCostComparison
        roleName="FLUX (AI Video)"
        humanTitle="Video Production Agency"
        humanCost={15000}
        aiCost={500}
        colorClass="text-pink-500"
        savings={174000}
      />

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-12">
            <h2 className="text-h2 font-display font-bold mb-4">
              Simple <span className="text-gradient-beam">Pricing</span>
            </h2>
            <p className="text-lead text-muted-foreground">
              One flat monthly fee. Unlimited video requests. No production costs.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="max-w-md mx-auto">
              <PricingCard
                name="FLUX — Video"
                price={500}
                description="Motion graphics producer"
                features={[
                  "Unlimited video requests",
                  "Product explainers",
                  "Social media clips",
                  "Motion graphics",
                  "Multi-format exports",
                  "3-5 day turnaround",
                  "All source files included",
                ]}
                ctaText="Configure FLUX"
                popular={true}
                iconColor="bg-pink-400"
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

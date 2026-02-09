"use client";

import { Video, Film, Scissors, Play, Clapperboard, MonitorPlay, Check } from "lucide-react";
import { EmployeeHero } from "../components/EmployeeHero";
import { CapabilityCard } from "../components/CapabilityCard";
import { PricingCard } from "../components/PricingCard";
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

          <div className="grid md:grid-cols-2 gap-6">
            {capabilities.map((capability, index) => (
              <FadeIn key={index} delay={index * 0.1}>
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
    </main>
  );
}

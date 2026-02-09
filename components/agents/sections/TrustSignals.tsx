"use client";

import { Shield, Lock, Database, Eye, FileCheck } from "lucide-react";
import { StaggerContainer, FadeIn } from "@/components/animations";

const securityFeatures = [
  {
    icon: Lock,
    title: "Enterprise-Grade Encryption",
    description: "AES-256 encryption at rest, TLS 1.3 in transit",
    color: "bg-pink-500",
  },
  {
    icon: Database,
    title: "Zero Data Retention",
    description: "Your proprietary data isn't used to train our models",
    color: "bg-accent-purple",
  },
  {
    icon: Shield,
    title: "Privacy-First Design",
    description: "Built with data protection at the core",
    color: "bg-accent-cyan",
  },
  {
    icon: Eye,
    title: "Complete Audit Logging",
    description: "Full activity logs for transparency and review",
    color: "bg-accent-amber",
  },
  {
    icon: FileCheck,
    title: "SOC 2 In Progress",
    description: "Working toward independent security certification",
    color: "bg-accent-indigo",
  },
];

export function TrustSignals() {
  return (
    <section className="py-20 md:py-32 bg-surface-sunken">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-500/10 mb-6">
            <Shield className="w-8 h-8 text-pink-500" />
          </div>
          <h2 className="text-h2 font-display font-bold mb-4">
            Enterprise-Grade Security,{" "}
            <span className="text-gradient-beam">Built In</span>
          </h2>
          <p className="text-lead text-muted-foreground max-w-2xl mx-auto">
            Your data security is our top priority. We implement industry-leading 
            protections at every layer.
          </p>
        </FadeIn>

        {/* Security Features Grid */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {securityFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title}
                className="bg-surface-elevated rounded-xl p-6 border border-border hover:border-pink-500/30 transition-colors"
              >
                <div className={`${feature.color} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-small text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </StaggerContainer>

        {/* Startup Transparency */}
        <FadeIn delay={0.3} className="mt-16">
          <div className="text-center">
            <p className="text-small text-muted-foreground">
              We're a startup building in public. Full security documentation coming soon.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

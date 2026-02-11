import type { CaseStudy, CaseStudyMetric } from "./case-studies";

// Mock case studies for development/demo when database is not available
export const mockCaseStudies: CaseStudy[] = [
  {
    id: "1",
    slug: "healthcare-ai-patient-triage",
    title: "AI-Powered Patient Triage Reduces Wait Times by 65%",
    clientName: "Metro Health Systems",
    industry: "Healthcare",
    isAnonymous: false,
    challenge:
      "Metro Health Systems was struggling with overwhelming patient volumes in their emergency department. Patients were experiencing average wait times of 4+ hours, leading to patient dissatisfaction, staff burnout, and occasional adverse outcomes due to delayed care. The existing triage process relied heavily on manual assessment by nursing staff, creating bottlenecks during peak hours.",
    solution:
      "We implemented an AI-powered patient triage system that analyzes patient symptoms, vital signs, and medical history to prioritize cases based on urgency. The system integrates with their existing EHR platform and provides real-time recommendations to triage nurses. We also trained staff on the new workflow and established protocols for handling AI recommendations.",
    results:
      "The AI triage system reduced average wait times by 65%, from 4.2 hours to 1.5 hours. Patient satisfaction scores increased by 40%, and staff reported significantly reduced stress levels. The system correctly identified high-priority cases 94% of the time, improving patient outcomes. Metro Health also saw a 25% reduction in patients leaving without being seen.",
    metrics: [
      { label: "Wait Time Reduction", value: "65%" },
      { label: "Patient Satisfaction", value: "+40%" },
      { label: "Accuracy Rate", value: "94%" },
      { label: "LWBS Reduction", value: "25%" },
    ],
    services: ["AI Strategy", "Process Automation", "Technology Assessment"],
    engagementType: "Project",
    testimonial:
      "The AI triage system has transformed our emergency department. Our staff can focus on what they do best—caring for patients—while the AI handles the initial assessment. The results have exceeded our expectations.",
    testimonialAuthor: "Dr. Sarah Chen",
    testimonialTitle: "Chief Medical Officer",
    published: true,
    featured: true,
    createdAt: new Date("2025-01-15"),
    updatedAt: new Date("2025-01-15"),
  },
  {
    id: "2",
    slug: "fintech-process-automation",
    title: "Process Automation Drives 80% Efficiency Gain for Fintech Startup",
    clientName: "PayFlow Technologies",
    industry: "Fintech",
    isAnonymous: false,
    challenge:
      "PayFlow was experiencing rapid growth but their manual onboarding and compliance processes couldn't scale. Each new merchant required 3-4 days of manual review, creating a significant bottleneck. The compliance team was overwhelmed, and the company was at risk of missing regulatory deadlines.",
    solution:
      "We designed and implemented an end-to-end automation platform that streamlines merchant onboarding, KYC verification, and compliance monitoring. The solution uses intelligent document processing, automated risk scoring, and integrated regulatory reporting.",
    results:
      "Merchant onboarding time decreased from 3-4 days to just 4 hours—an 80% efficiency improvement. The compliance team can now handle 5x the volume without additional headcount.",
    metrics: [
      { label: "Efficiency Gain", value: "80%" },
      { label: "Onboarding Time", value: "4 hours" },
      { label: "Volume Capacity", value: "5x" },
      { label: "Compliance Issues", value: "-90%" },
    ],
    services: ["Process Automation", "Digital Transformation", "Data Analytics"],
    engagementType: "Project",
    testimonial:
      "Working with Pink Beam was transformative. They understood our regulatory constraints and built a solution that actually works in the real world.",
    testimonialAuthor: "Michael Torres",
    testimonialTitle: "VP of Operations",
    published: true,
    featured: true,
    createdAt: new Date("2025-01-10"),
    updatedAt: new Date("2025-01-10"),
  },
  {
    id: "3",
    slug: "retail-digital-transformation",
    title: "Digital Transformation Drives 200% E-commerce Growth",
    clientName: "Urban Outfitters Co.",
    industry: "Retail",
    isAnonymous: false,
    challenge:
      "A traditional brick-and-mortar retailer with 50+ physical locations was struggling to compete in the digital age. Their e-commerce platform was outdated, mobile experience was poor, and they lacked a cohesive omnichannel strategy.",
    solution:
      "We led a comprehensive digital transformation initiative including platform modernization, mobile app development, and omnichannel integration. We implemented unified inventory management and personalized marketing automation.",
    results:
      "E-commerce revenue grew by 200% within 12 months. Mobile conversion rates improved by 150%. Customer lifetime value increased by 45% through personalized experiences.",
    metrics: [
      { label: "Revenue Growth", value: "200%" },
      { label: "Mobile Conversion", value: "+150%" },
      { label: "Online Revenue", value: "24%" },
      { label: "Customer LTV", value: "+45%" },
    ],
    services: ["Digital Transformation", "Growth Strategy", "Cloud Migration"],
    engagementType: "Retainer",
    testimonial:
      "Pink Beam didn't just build us a website—they transformed how we think about retail.",
    testimonialAuthor: "Jennifer Walsh",
    testimonialTitle: "Chief Digital Officer",
    published: true,
    featured: true,
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date("2025-01-05"),
  },
  {
    id: "4",
    slug: "saas-architecture-modernization",
    title: "Architecture Modernization Cuts Infrastructure Costs by 60%",
    clientName: "DataSync Pro",
    industry: "SaaS",
    isAnonymous: false,
    challenge:
      "DataSync Pro's monolithic application architecture was becoming increasingly difficult to maintain and scale. Infrastructure costs were spiraling and deployment frequency was limited.",
    solution:
      "We architected and executed a gradual migration from monolith to microservices, implemented containerization with Kubernetes, and established CI/CD pipelines.",
    results:
      "Infrastructure costs decreased by 60%. Deployment frequency increased from monthly to multiple times per day. Developer productivity improved by 50%.",
    metrics: [
      { label: "Cost Reduction", value: "60%" },
      { label: "Deploy Frequency", value: "10x" },
      { label: "Dev Productivity", value: "+50%" },
      { label: "Uptime", value: "99.99%" },
    ],
    services: ["Cloud Migration", "Fractional CTO", "Technology Assessment"],
    engagementType: "Advisory",
    testimonial:
      "The Pink Beam team brought enterprise-level expertise with a pragmatic approach.",
    testimonialAuthor: "David Kim",
    testimonialTitle: "CTO",
    published: true,
    featured: false,
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-20"),
  },
  {
    id: "5",
    slug: "manufacturing-predictive-maintenance",
    title: "Predictive Maintenance Prevents $2M in Downtime Costs",
    clientName: "Precision Manufacturing Inc.",
    industry: "Manufacturing",
    isAnonymous: true,
    challenge:
      "Unplanned equipment downtime was costing the company over $3M annually in lost production, emergency repairs, and missed delivery deadlines.",
    solution:
      "We implemented an IoT-based predictive maintenance platform that collects real-time sensor data and uses machine learning to predict failures 2-4 weeks in advance.",
    results:
      "Unplanned downtime decreased by 75%, saving approximately $2M in the first year. Maintenance costs decreased by 30% through better planning.",
    metrics: [
      { label: "Downtime Reduction", value: "75%" },
      { label: "Cost Savings", value: "$2M" },
      { label: "Maintenance Savings", value: "30%" },
      { label: "On-Time Delivery", value: "96%" },
    ],
    services: ["AI Strategy", "Process Automation", "Data Analytics"],
    engagementType: "Project",
    testimonial:
      "The predictive maintenance system has been a game-changer. We're now proactive instead of reactive.",
    testimonialAuthor: "Operations Director",
    testimonialTitle: "VP of Manufacturing",
    published: true,
    featured: false,
    createdAt: new Date("2024-12-15"),
    updatedAt: new Date("2024-12-15"),
  },
];

// Mock filter options
export const mockFilterOptions = {
  industries: ["Healthcare", "Fintech", "Retail", "SaaS", "Manufacturing"],
  services: [
    "AI Strategy",
    "Process Automation",
    "Technology Assessment",
    "Digital Transformation",
    "Data Analytics",
    "Growth Strategy",
    "Cloud Migration",
    "Fractional CTO",
  ],
  engagementTypes: ["Project", "Retainer", "Advisory", "Workshop", "Assessment"],
};

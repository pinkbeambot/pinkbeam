// Script to seed initial resources
import { prisma } from "@/lib/prisma";
import { ResourceType } from "@prisma/client";

const initialResources = [
  {
    slug: "ai-strategy-canvas",
    title: "AI Strategy Canvas",
    description: "A comprehensive framework for developing your organization's AI strategy. Includes sections for use case identification, capability assessment, data readiness, and implementation roadmap.",
    type: ResourceType.TEMPLATE,
    topics: ["AI Strategy", "Digital Transformation"],
    format: "PDF",
    fileUrl: "/resources/ai-strategy-canvas.pdf",
    fileSize: "2.4 MB",
    gated: true,
    featured: true,
    published: true,
  },
  {
    slug: "digital-transformation-readiness-checklist",
    title: "Digital Transformation Readiness Checklist",
    description: "Assess your organization's readiness for digital transformation across 8 key dimensions: Leadership, Culture, Technology, Data, Processes, Talent, Customer, and Partners.",
    type: ResourceType.CHECKLIST,
    topics: ["Digital Transformation", "Change Management"],
    format: "PDF",
    fileUrl: "/resources/digital-transformation-readiness-checklist.pdf",
    fileSize: "1.8 MB",
    gated: true,
    featured: true,
    published: true,
  },
  {
    slug: "automation-roi-calculator",
    title: "Process Automation ROI Calculator",
    description: "Interactive Excel calculator to estimate the return on investment for process automation initiatives. Includes labor cost savings, error reduction, and productivity gains.",
    type: ResourceType.CALCULATOR,
    topics: ["Process Automation", "Technology Architecture"],
    format: "XLSX",
    fileUrl: "/resources/automation-roi-calculator.xlsx",
    fileSize: "856 KB",
    gated: true,
    featured: true,
    published: true,
  },
  {
    slug: "technology-stack-evaluation-framework",
    title: "Technology Stack Evaluation Framework",
    description: "A structured approach to evaluating and selecting technology solutions. Includes scoring matrices for functional requirements, integration capabilities, vendor assessment, and total cost of ownership.",
    type: ResourceType.FRAMEWORK,
    topics: ["Technology Architecture", "Vendor Evaluation"],
    format: "PDF",
    fileUrl: "/resources/technology-stack-evaluation-framework.pdf",
    fileSize: "3.2 MB",
    gated: true,
    featured: false,
    published: true,
  },
  {
    slug: "workshop-facilitation-guide",
    title: "Workshop Facilitation Guide",
    description: "A complete guide for facilitating strategy and discovery workshops. Includes agenda templates, activity instructions, facilitation techniques, and follow-up frameworks.",
    type: ResourceType.TEMPLATE,
    topics: ["Workshop Facilitation", "Digital Transformation"],
    format: "PDF",
    fileUrl: "/resources/workshop-facilitation-guide.pdf",
    fileSize: "4.1 MB",
    gated: true,
    featured: false,
    published: true,
  },
  {
    slug: "change-management-playbook",
    title: "Change Management Playbook",
    description: "Practical playbook for managing organizational change during digital initiatives. Covers stakeholder mapping, communication planning, training design, and resistance management.",
    type: ResourceType.FRAMEWORK,
    topics: ["Change Management", "Digital Transformation"],
    format: "PDF",
    fileUrl: "/resources/change-management-playbook.pdf",
    fileSize: "5.3 MB",
    gated: true,
    featured: false,
    published: true,
  },
  {
    slug: "vendor-evaluation-scorecard",
    title: "Vendor Evaluation Scorecard",
    description: "Excel-based scorecard for comparing and selecting vendors. Includes weighted scoring for technical capabilities, financial stability, cultural fit, and implementation approach.",
    type: ResourceType.CALCULATOR,
    topics: ["Vendor Evaluation", "Technology Architecture"],
    format: "XLSX",
    fileUrl: "/resources/vendor-evaluation-scorecard.xlsx",
    fileSize: "1.2 MB",
    gated: true,
    featured: false,
    published: true,
  },
  {
    slug: "executive-presentation-template",
    title: "Executive Presentation Template",
    description: "Professional PowerPoint template for presenting digital transformation initiatives to executives. Includes slides for business case, roadmap, investment requirements, and expected outcomes.",
    type: ResourceType.TEMPLATE,
    topics: ["Executive Communication", "Digital Transformation"],
    format: "PPTX",
    fileUrl: "/resources/executive-presentation-template.pptx",
    fileSize: "8.5 MB",
    gated: true,
    featured: false,
    published: true,
  },
];

async function seedResources() {
  console.log("Seeding resources...");

  for (const resource of initialResources) {
    await prisma.resource.upsert({
      where: { slug: resource.slug },
      update: resource,
      create: resource,
    });
    console.log(`✓ ${resource.title}`);
  }

  console.log("\nSeeding complete!");
}

seedResources()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

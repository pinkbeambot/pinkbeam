import { PrismaClient, ResourceType } from '@prisma/client';

const prisma = new PrismaClient();

const initialResources = [
  {
    slug: 'ai-strategy-canvas',
    title: 'AI Strategy Canvas',
    description: 'A comprehensive framework for developing and documenting your AI strategy. Map use cases, assess readiness, and create an actionable roadmap for AI implementation.',
    type: ResourceType.FRAMEWORK,
    category: 'AI Strategy',
    topics: ['AI Strategy', 'Digital Transformation', 'Roadmap Planning', 'Use Case Identification'],
    fileUrl: 'https://cdn.pinkbeam.ai/resources/ai-strategy-canvas.pdf',
    fileFormat: 'PDF',
    fileSize: '2.4 MB',
    isGated: true,
    featured: true,
    published: true,
  },
  {
    slug: 'digital-transformation-readiness-checklist',
    title: 'Digital Transformation Readiness Checklist',
    description: 'Assess your organization\'s readiness for digital transformation across technology, culture, processes, and leadership dimensions.',
    type: ResourceType.CHECKLIST,
    category: 'Digital Transformation',
    topics: ['Digital Transformation', 'Assessment', 'Organizational Readiness', 'Change Management'],
    fileUrl: 'https://cdn.pinkbeam.ai/resources/dt-readiness-checklist.pdf',
    fileFormat: 'PDF',
    fileSize: '1.8 MB',
    isGated: true,
    featured: true,
    published: true,
  },
  {
    slug: 'process-automation-roi-calculator',
    title: 'Process Automation ROI Calculator',
    description: 'Calculate the potential return on investment for your process automation initiatives. Includes cost savings, efficiency gains, and payback period analysis.',
    type: ResourceType.CALCULATOR,
    category: 'Process Automation',
    topics: ['ROI', 'Process Automation', 'Business Case', 'Cost Analysis'],
    fileUrl: 'https://cdn.pinkbeam.ai/resources/automation-roi-calculator.xlsx',
    fileFormat: 'XLSX',
    fileSize: '856 KB',
    isGated: true,
    featured: true,
    published: true,
  },
  {
    slug: 'technology-stack-evaluation-framework',
    title: 'Technology Stack Evaluation Framework',
    description: 'A structured approach to evaluating and selecting technology solutions. Includes scoring criteria, vendor comparison matrices, and decision-making guidelines.',
    type: ResourceType.FRAMEWORK,
    category: 'Technology Architecture',
    topics: ['Technology Selection', 'Vendor Evaluation', 'Architecture', 'Decision Making'],
    fileUrl: 'https://cdn.pinkbeam.ai/resources/tech-stack-evaluation-framework.pdf',
    fileFormat: 'PDF',
    fileSize: '3.1 MB',
    isGated: true,
    featured: false,
    published: true,
  },
  {
    slug: 'workshop-facilitation-guide',
    title: 'Workshop Facilitation Guide',
    description: 'Everything you need to run effective transformation workshops. Includes agendas, exercises, templates, and best practices for engaging stakeholders.',
    type: ResourceType.TEMPLATE,
    category: 'Change Management',
    topics: ['Workshops', 'Facilitation', 'Stakeholder Engagement', 'Collaboration'],
    fileUrl: 'https://cdn.pinkbeam.ai/resources/workshop-facilitation-guide.pdf',
    fileFormat: 'PDF',
    fileSize: '4.2 MB',
    isGated: true,
    featured: false,
    published: true,
  },
  {
    slug: 'change-management-playbook',
    title: 'Change Management Playbook',
    description: 'A comprehensive guide to managing organizational change. Includes communication templates, training plans, resistance management strategies, and success metrics.',
    type: ResourceType.TEMPLATE,
    category: 'Change Management',
    topics: ['Change Management', 'Communication', 'Training', 'Organizational Development'],
    fileUrl: 'https://cdn.pinkbeam.ai/resources/change-management-playbook.pdf',
    fileFormat: 'PDF',
    fileSize: '5.8 MB',
    isGated: true,
    featured: true,
    published: true,
  },
  {
    slug: 'vendor-evaluation-scorecard',
    title: 'Vendor Evaluation Scorecard',
    description: 'A standardized scorecard for evaluating technology vendors. Covers technical capabilities, financial stability, support quality, and cultural fit.',
    type: ResourceType.TEMPLATE,
    category: 'Technology Architecture',
    topics: ['Vendor Management', 'Procurement', 'Due Diligence', 'Scoring'],
    fileUrl: 'https://cdn.pinkbeam.ai/resources/vendor-evaluation-scorecard.xlsx',
    fileFormat: 'XLSX',
    fileSize: '1.2 MB',
    isGated: false,
    featured: false,
    published: true,
  },
  {
    slug: 'project-charter-template',
    title: 'Project Charter Template',
    description: 'A professional template for initiating transformation projects. Includes scope definition, stakeholder mapping, success criteria, and governance structure.',
    type: ResourceType.TEMPLATE,
    category: 'Project Management',
    topics: ['Project Management', 'Charter', 'Governance', 'Planning'],
    fileUrl: 'https://cdn.pinkbeam.ai/resources/project-charter-template.docx',
    fileFormat: 'DOCX',
    fileSize: '945 KB',
    isGated: false,
    featured: false,
    published: true,
  },
  {
    slug: 'kpi-dashboard-template',
    title: 'KPI Dashboard Template',
    description: 'Track and visualize your transformation metrics with this customizable dashboard template. Includes common KPIs, data visualization, and automated reporting.',
    type: ResourceType.TEMPLATE,
    category: 'Performance Management',
    topics: ['KPIs', 'Dashboards', 'Analytics', 'Performance Tracking'],
    fileUrl: 'https://cdn.pinkbeam.ai/resources/kpi-dashboard-template.xlsx',
    fileFormat: 'XLSX',
    fileSize: '2.1 MB',
    isGated: true,
    featured: false,
    published: true,
  },
  {
    slug: 'executive-presentation-template',
    title: 'Executive Presentation Template',
    description: 'A polished presentation template for pitching transformation initiatives to executives. Includes slide layouts, talking points, and financial justification sections.',
    type: ResourceType.TEMPLATE,
    category: 'Communication',
    topics: ['Presentations', 'Executive Communication', 'Business Case', 'Stakeholder Management'],
    fileUrl: 'https://cdn.pinkbeam.ai/resources/executive-presentation-template.pptx',
    fileFormat: 'PPTX',
    fileSize: '3.5 MB',
    isGated: true,
    featured: false,
    published: true,
  },
];

async function main() {
  console.log('Seeding resources...');

  for (const resource of initialResources) {
    const existing = await prisma.resource.findUnique({
      where: { slug: resource.slug },
    });

    if (!existing) {
      await prisma.resource.create({
        data: resource,
      });
      console.log(`Created resource: ${resource.title}`);
    } else {
      console.log(`Resource already exists: ${resource.title}`);
    }
  }

  console.log('Resources seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

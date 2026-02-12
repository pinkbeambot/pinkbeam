import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

// Validation schema
const generateRequestSchema = z.object({
  employeeType: z.enum(["researcher", "analyst", "strategist"]).default("researcher"),
  competitors: z.array(z.string().min(1)).min(1).max(3),
  focusAreas: z.array(z.enum(["market-trends", "competitor-intel", "opportunities"])).min(1),
  email: z.string().email(),
});

// Mock brief templates
const briefTemplates = {
  researcher: {
    tone: "analytical",
    title: "Weekly Strategic Intelligence Brief",
    executiveSummary: [
      `Based on monitoring of [COMPETITORS], our intelligence gathering has identified significant shifts in the competitive landscape this week. The data reveals emerging patterns that warrant strategic consideration.`,
      `Primary research indicates an acceleration of AI adoption across customer-facing functions, with [COMPETITOR_1] and [COMPETITOR_2] announcing major platform updates. These developments suggest a broader industry pivot toward automated intelligence solutions.`,
      `Our analysis of market signals points to three critical inflection points that will likely define competitive positioning over the next quarter. Organizations that adapt their strategies to account for these shifts will be better positioned for sustained growth.`,
    ],
  },
  analyst: {
    tone: "data-driven",
    title: "Weekly Performance & Market Analysis",
    executiveSummary: [
      `Quantitative analysis of [COMPETITORS] reveals notable performance divergences this period. Data collected from public filings, product releases, and market indicators paint a complex picture of shifting competitive dynamics.`,
      `Key metrics show [COMPETITOR_1] achieving 23% year-over-year growth in enterprise segments, while [COMPETITOR_2] has focused resources on mid-market expansion with mixed results. Comparative analysis suggests our positioning remains favorable in 4 of 7 evaluated dimensions.`,
      `Statistical modeling indicates a 78% probability of continued market consolidation, with smaller players facing increasing pressure from scaled competitors including [COMPETITOR_3]. Strategic response recommendations are provided in the Opportunities section.`,
    ],
  },
  strategist: {
    tone: "strategic",
    title: "Weekly Strategic Positioning Brief",
    executiveSummary: [
      `The competitive chessboard has shifted significantly this week, with [COMPETITORS] making calculated moves that reshape market dynamics. Strategic analysis reveals both threats and openings that demand executive attention.`,
      `[COMPETITOR_1]'s recent pivot signals a broader strategic realignment in the industry. Their focus on enterprise consolidation creates opportunities for agile players to capture mid-market share before larger competitors can adapt their go-to-market approaches.`,
      `Three strategic imperatives emerge from this week's intelligence: accelerate differentiation in core segments, evaluate partnership opportunities created by competitor repositioning, and prepare contingency plans for potential market consolidation scenarios involving [COMPETITOR_2] or [COMPETITOR_3].`,
    ],
  },
};

const competitorMovesPool = [
  {
    title: "[COMPETITOR] Announces AI-Powered Platform Overhaul",
    impact: "High Impact" as const,
    content: `[COMPETITOR] unveiled a comprehensive platform redesign with embedded AI capabilities throughout their core product. The rollout targets Q2 2026 with aggressive pricing starting at $49/user/month, positioning them to capture significant mid-market share. Early beta feedback suggests strong technical execution but concerns about migration complexity for existing customers.`,
  },
  {
    title: "[COMPETITOR] Expands Enterprise Sales Organization",
    impact: "Medium Impact" as const,
    content: `[COMPETITOR] has hired 50 new enterprise account executives focused specifically on displacing incumbent solutions in the Fortune 500. They're offering migration incentives up to $100K for deals over $500K ARR, with particular focus on financial services and healthcare verticals where compliance requirements create switching friction.`,
  },
  {
    title: "[COMPETITOR] Acquires Complementary Technology",
    impact: "Medium Impact" as const,
    content: `[COMPETITOR] announced the acquisition of a specialized analytics startup for $180M, aimed at closing a key feature gap in their reporting capabilities. Integration timeline suggests new features will be available to customers by Q3 2026, potentially eroding a historic competitive disadvantage.`,
  },
  {
    title: "[COMPETITOR] Launches New Pricing Strategy",
    impact: "High Impact" as const,
    content: `[COMPETITOR] introduced a usage-based pricing model that undercuts industry averages by 30% for high-volume customers. This aggressive move pressures margins across the sector and may trigger a pricing war as competitors respond to maintain market share.`,
  },
  {
    title: "[COMPETITOR] Partners with Major Cloud Provider",
    impact: "Medium Impact" as const,
    content: `[COMPETITOR] announced a strategic partnership with a leading cloud provider for co-selling and technical integration. This alliance provides access to enterprise sales channels and could accelerate their penetration of regulated industries with enhanced security certifications.`,
  },
  {
    title: "[COMPETITOR] Faces Customer Churn Challenges",
    impact: "Low Impact" as const,
    content: `Industry sources indicate [COMPETITOR] is experiencing higher-than-expected churn in their SMB segment, attributed to recent price increases and product complexity. This creates potential displacement opportunities for competitors offering simpler, more cost-effective alternatives.`,
  },
];

const industryTrendsPool = [
  {
    title: "Vertical-Specific Solutions Gaining Market Share",
    content: `Generic horizontal solutions are losing ground to purpose-built vertical offerings. Healthcare and financial services are leading this shift, with buyers willing to pay 30-40% premiums for solutions that address industry-specific compliance and workflow requirements out of the box. This trend favors specialized players and creates challenges for generalist vendors.`,
  },
  {
    title: "API-First Architecture Becoming Baseline Requirement",
    content: `Enterprise buyers now expect comprehensive API coverage as a baseline requirement. RFPs increasingly include technical assessments of API completeness, documentation quality, and webhook support. Vendors without robust API strategies are being excluded from consideration early in evaluation cycles, favoring modern platforms over legacy systems.`,
  },
  {
    title: "Consolidation of Point Solutions Accelerating",
    content: `CIOs are actively seeking to reduce vendor sprawl, driving demand for unified platforms that can replace 3-5 existing point solutions. This trend favors established players with broad feature sets and creates headwinds for best-of-breed startups lacking platform breadth. Buyers prioritize integration simplicity over specialized depth.`,
  },
  {
    title: "AI-Powered Features Redefining Customer Expectations",
    content: `The accelerated adoption of AI-powered features across customer-facing functions is creating new expectations for response times and personalization. Companies that fail to adapt risk losing market share to more agile competitors who are leveraging these technologies to deliver superior customer experiences at lower cost structures.`,
  },
  {
    title: "Economic Uncertainty Driving ROI Scrutiny",
    content: `Pricing pressures continue to mount as economic uncertainty drives enterprises to scrutinize software spend more carefully. We've observed an 18% increase in competitive displacement activity, with buyers prioritizing solutions that demonstrate clear ROI within the first 90 days of implementation. Vendors must sharpen value propositions.`,
  },
];

const opportunitiesPool = [
  {
    title: "Launch Targeted Campaign Against [COMPETITOR] Legacy Customers",
    content: `[COMPETITOR]'s recent platform overhaul creates uncertainty for existing customers. We should launch a retention-risk campaign targeting their enterprise accounts with migration incentives and dedicated success resources. This window of opportunity will close as they complete their rollout and stabilize their customer base.`,
  },
  {
    title: "Accelerate Healthcare Vertical Go-to-Market",
    content: `The trend toward vertical-specific solutions creates an immediate opening. We should fast-track our HIPAA compliance roadmap and develop healthcare-specific case studies to capture this expanding segment. First-mover advantage in vertical specialization could yield 40% pricing premiums and stronger customer retention.`,
  },
  {
    title: "Bundle Strategy for Consolidation Trend",
    content: `Position our platform as a consolidation solution with bundled pricing that undercuts the total cost of 3-4 point solutions. Develop an ROI calculator to quantify savings in sales conversations. This addresses the CIO mandate to reduce vendor sprawl while improving our average contract values.`,
  },
  {
    title: "API Ecosystem Partnership Program",
    content: `Launch a formal API ecosystem program to attract developers and integration partners. This addresses the growing buyer preference for API-rich platforms while creating network effects that increase switching costs for our customers. Target 50 integration partners by year-end.`,
  },
  {
    title: "Mid-Market Expansion Play",
    content: `[COMPETITOR]'s focus on enterprise creates a gap in the mid-market. We should develop a specific mid-market offering with simplified packaging, transparent pricing, and self-service onboarding. This segment offers faster sales cycles and lower acquisition costs compared to enterprise pursuits.`,
  },
];

const keyReadingsPool = [
  {
    title: "The State of SaaS: 2026 Market Analysis Report",
    description: "Comprehensive analysis of SaaS market trends, pricing pressures, and emerging competitive dynamics. Essential reading for strategic planning.",
    source: "TechCrunch",
    readTime: "8 min read",
  },
  {
    title: "AI in Customer Support: Adoption Benchmarks and ROI Data",
    description: "New research reveals how leading companies are measuring AI ROI in support operations, with benchmark data on cost savings and CSAT impacts.",
    source: "Gartner Research",
    readTime: "12 min read",
  },
  {
    title: "Enterprise Software Buying Behavior Shifts in 2026",
    description: "Survey of 500 enterprise buyers reveals changing evaluation criteria, budget allocation trends, and vendor selection priorities for the year ahead.",
    source: "McKinsey Digital",
    readTime: "10 min read",
  },
  {
    title: "The Vertical SaaS Revolution: Why Generic Solutions Are Losing",
    description: "Analysis of the shift from horizontal to vertical SaaS solutions, with case studies from healthcare, finance, and logistics sectors.",
    source: "Bessemer Venture Partners",
    readTime: "15 min read",
  },
  {
    title: "API-First Product Development: Lessons from Industry Leaders",
    description: "How leading SaaS companies are designing API-first architectures to meet enterprise integration demands and drive platform adoption.",
    source: "A16Z",
    readTime: "11 min read",
  },
];

// Helper to shuffle array
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Helper to replace competitor placeholders
function replaceCompetitors(text: string, competitors: string[]): string {
  let result = text;
  
  // Replace [COMPETITORS] with comma-separated list
  result = result.replace("[COMPETITORS]", competitors.join(", "));
  
  // Replace individual placeholders
  competitors.forEach((comp, index) => {
    result = result.replace(`[COMPETITOR_${index + 1}]`, comp);
    result = result.replace(`[COMPETITOR]`, comp);
  });
  
  return result;
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = generateRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { employeeType, competitors, focusAreas, email } = validationResult.data;

    // Check rate limit (1 per email per day)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const existingRequest = await prisma.demoRequest.findFirst({
      where: {
        email: email.toLowerCase(),
        createdAt: {
          gte: oneDayAgo,
        },
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded. You can generate one demo brief per day. Please try again tomorrow.",
          nextAvailable: new Date(existingRequest.createdAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        },
        { status: 429 }
      );
    }

    // Generate mock brief
    const template = briefTemplates[employeeType];
    const selectedCompetitorMoves = shuffle(competitorMovesPool)
      .slice(0, 3)
      .map((move) => ({
        ...move,
        title: replaceCompetitors(move.title, competitors),
        content: replaceCompetitors(move.content, competitors),
      }));

    const selectedTrends = shuffle(industryTrendsPool).slice(0, 3);
    const selectedOpportunities = shuffle(opportunitiesPool)
      .slice(0, 3)
      .map((opp) => ({
        ...opp,
        title: replaceCompetitors(opp.title, competitors),
        content: replaceCompetitors(opp.content, competitors),
      }));
    const selectedReadings = shuffle(keyReadingsPool).slice(0, 3);

    const brief = {
      title: template.title,
      employeeType,
      period: "Weekly",
      date: new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      executiveSummary: template.executiveSummary.map((para: string) =>
        replaceCompetitors(para, competitors)
      ),
      competitorMoves: focusAreas.includes("competitor-intel") ? selectedCompetitorMoves : [],
      industryTrends: focusAreas.includes("market-trends") ? selectedTrends : [],
      opportunities: focusAreas.includes("opportunities") ? selectedOpportunities : [],
      keyReadings: selectedReadings,
      competitors,
      focusAreas,
    };

    // Store demo request in database
    const demoRequest = await prisma.demoRequest.create({
      data: {
        email: email.toLowerCase(),
        employeeType,
        competitors,
        focusAreas,
        briefData: brief,
      },
    });

    // Send welcome email with brief link
    try {
      const viewBriefUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://pinkbeam.io'}/agents/demo/result`;
      await sendWelcomeEmail({
        fullName: email.split('@')[0], // Use email prefix as name
        email: email.toLowerCase(),
        loginUrl: viewBriefUrl,
      });

      // Update record to mark email as sent
      await prisma.demoRequest.update({
        where: { id: demoRequest.id },
        data: { emailSent: true },
      });
    } catch (emailError) {
      // Don't fail the request if email fails
      console.error('[email-error] Demo welcome email failed:', {
        demoRequestId: demoRequest.id,
        recipient: email.toLowerCase(),
        employeeType,
        error: emailError instanceof Error ? emailError.message : String(emailError),
        timestamp: new Date().toISOString(),
      });
    }

    // Return success response with brief data
    return NextResponse.json({
      success: true,
      brief,
      message: "Demo brief generated successfully",
    });

  } catch (error) {
    console.error("Demo generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate demo brief. Please try again later." },
      { status: 500 }
    );
  }
}

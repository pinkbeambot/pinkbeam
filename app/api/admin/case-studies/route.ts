import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all case studies (admin)
export async function GET() {
  try {
    const caseStudies = await prisma.caseStudy.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(caseStudies);
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return NextResponse.json(
      { error: "Failed to fetch case studies" },
      { status: 500 }
    );
  }
}

// POST create new case study
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = [
      "title",
      "slug",
      "clientName",
      "industry",
      "challenge",
      "solution",
      "results",
      "engagementType",
    ];
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }
    
    // Check for duplicate slug
    const existing = await prisma.caseStudy.findUnique({
      where: { slug: body.slug },
    });
    
    if (existing) {
      return NextResponse.json(
        { error: "A case study with this slug already exists" },
        { status: 400 }
      );
    }
    
    const caseStudy = await prisma.caseStudy.create({
      data: {
        title: body.title,
        slug: body.slug,
        clientName: body.clientName,
        industry: body.industry,
        isAnonymous: body.isAnonymous || false,
        challenge: body.challenge,
        solution: body.solution,
        results: body.results,
        metrics: body.metrics || [],
        services: body.services || [],
        engagementType: body.engagementType,
        testimonial: body.testimonial || null,
        testimonialAuthor: body.testimonialAuthor || null,
        testimonialTitle: body.testimonialTitle || null,
        published: body.published || false,
        featured: body.featured || false,
      },
    });
    
    return NextResponse.json(caseStudy, { status: 201 });
  } catch (error) {
    console.error("Error creating case study:", error);
    return NextResponse.json(
      { error: "Failed to create case study" },
      { status: 500 }
    );
  }
}

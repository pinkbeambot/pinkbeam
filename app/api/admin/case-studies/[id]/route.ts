import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH update case study
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Check if case study exists
    const existing = await prisma.caseStudy.findUnique({
      where: { id },
    });
    
    if (!existing) {
      return NextResponse.json(
        { error: "Case study not found" },
        { status: 404 }
      );
    }
    
    // Check for slug conflict if slug is being updated
    if (body.slug && body.slug !== existing.slug) {
      const duplicate = await prisma.caseStudy.findUnique({
        where: { slug: body.slug },
      });
      
      if (duplicate) {
        return NextResponse.json(
          { error: "A case study with this slug already exists" },
          { status: 400 }
        );
      }
    }
    
    const caseStudy = await prisma.caseStudy.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.slug && { slug: body.slug }),
        ...(body.clientName && { clientName: body.clientName }),
        ...(body.industry && { industry: body.industry }),
        ...(body.isAnonymous !== undefined && { isAnonymous: body.isAnonymous }),
        ...(body.challenge && { challenge: body.challenge }),
        ...(body.solution && { solution: body.solution }),
        ...(body.results && { results: body.results }),
        ...(body.metrics && { metrics: body.metrics }),
        ...(body.services && { services: body.services }),
        ...(body.engagementType && { engagementType: body.engagementType }),
        ...(body.testimonial !== undefined && { testimonial: body.testimonial }),
        ...(body.testimonialAuthor !== undefined && { testimonialAuthor: body.testimonialAuthor }),
        ...(body.testimonialTitle !== undefined && { testimonialTitle: body.testimonialTitle }),
        ...(body.published !== undefined && { published: body.published }),
        ...(body.featured !== undefined && { featured: body.featured }),
      },
    });
    
    return NextResponse.json(caseStudy);
  } catch (error) {
    console.error("Error updating case study:", error);
    return NextResponse.json(
      { error: "Failed to update case study" },
      { status: 500 }
    );
  }
}

// DELETE case study
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    // Check if case study exists
    const existing = await prisma.caseStudy.findUnique({
      where: { id },
    });
    
    if (!existing) {
      return NextResponse.json(
        { error: "Case study not found" },
        { status: 404 }
      );
    }
    
    await prisma.caseStudy.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting case study:", error);
    return NextResponse.json(
      { error: "Failed to delete case study" },
      { status: 500 }
    );
  }
}

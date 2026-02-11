import { prisma } from "@/lib/prisma";
import { CaseStudiesAdminClient } from "./CaseStudiesAdminClient";
import type { CaseStudy } from "@/lib/case-studies";

export const metadata = {
  title: "Case Studies — Admin",
};

export default async function CaseStudiesAdminPage() {
  const caseStudies = await prisma.caseStudy.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <CaseStudiesAdminClient caseStudies={caseStudies as CaseStudy[]} />;
}

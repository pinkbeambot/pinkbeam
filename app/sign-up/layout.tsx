import type { Metadata } from "next";
import { createMetadata, serviceMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(serviceMetadata.signUp);

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

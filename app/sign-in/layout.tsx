import type { Metadata } from "next";
import { createMetadata, serviceMetadata } from "@/lib/metadata";

export const metadata: Metadata = createMetadata(serviceMetadata.signIn);

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import type { Metadata } from "next";
import { AutomationROICalculatorClient } from "./AutomationROICalculatorClient";

export const metadata: Metadata = {
  title: "Process Automation ROI Calculator — Pink Beam Solutions",
  description: "Calculate the potential return on investment for your process automation initiatives. Estimate cost savings, efficiency gains, and payback period.",
};

export default function AutomationROICalculatorPage() {
  return <AutomationROICalculatorClient />;
}

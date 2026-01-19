export type MoatResult = {
  rating: "Wide" | "Narrow" | "None";
  summary: string;
  advantages: string[];
  risks: string[];
};

// Client-safe placeholder (for static export exercise)
export async function analyzeMoat(_ticker: string): Promise<MoatResult> {
  return {
    rating: "Narrow",
    summary:
      "Placeholder result (static export mode). Next step will move analysis to a Cloud Function or App Hosting.",
    advantages: ["Brand recognition", "Switching costs", "Network effects (if applicable)"],
    risks: ["Competition pressure", "Tech disruption", "Regulatory changes"],
  };
}

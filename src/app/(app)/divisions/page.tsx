import type { Metadata } from "next";
import { SectionHeader } from "@/components/sections/section-header";
import { DivisionsClient } from "./DivisionsClient";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import type { Division } from "@/payload-types";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
  title: "Our Divisions | SEDS Sri Lanka",
  description:
    "Explore the cutting edge of space exploration and technology through our specialized divisions at SEDS Sri Lanka.",
  openGraph: {
    title: "Our Divisions | SEDS Sri Lanka",
    description:
      "Explore the cutting edge of space exploration and technology through our specialized divisions at SEDS Sri Lanka.",
    images: [{ url: "/section-header/division.png" }],
  },
};

export default async function DivisionsPage() {
  let initialDivisions: Division[] = [];
  try {
    const payload = await getPayload({ config: configPromise });
    const res = await payload.find({
      collection: "divisions",
      limit: 100,
      depth: 1,
    });
    initialDivisions = res.docs as Division[];
  } catch (err) {
    console.error("Error fetching divisions:", err);
  }

  return (
    <div className="flex flex-col w-full pt-8 md:pt-12 lg:pt-16">
      <div className="grid-container section-content">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          <SectionHeader
            title="Our Divisions"
            description="Explore the cutting edge of space exploration and technology through our specialized divisions at SEDS Sri Lanka."
            image="/section-header/division.png"
          />
          <DivisionsClient initialDivisions={initialDivisions} />
        </div>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ObserveMoonNightClient } from "@/components/sections/observe-moon-night/ObserveMoonNightClient";
import { getObserveMoonNightProject } from "@/utilities/getObserveMoonNightProject";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const eventData = await getObserveMoonNightProject(slug);

  if (!eventData) {
    return {
      title: "Event Not Found | SEDS Sri Lanka",
    };
  }

  return {
    title: `International Observe the Moon Night ${eventData.year} | SEDS Sri Lanka`,
    description: `Join SEDS Sri Lanka for International Observe the Moon Night ${eventData.year}. Annual global celebration of lunar science, telescopic observation, and space exploration.`,
  };
}

export default async function ObserveMoonNightAnnualPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const eventData = await getObserveMoonNightProject(slug);

  // If no active published event matching the slug exists in the database, return 404
  if (!eventData) {
    notFound();
  }

  return (
    <ObserveMoonNightClient
      slug={eventData.slug}
      year={eventData.year}
      eventData={eventData}
    />
  );
}

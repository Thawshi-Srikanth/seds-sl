import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ObserveMoonNightClient } from "@/components/sections/observe-moon-night/ObserveMoonNightClient";
import { getObserveMoonNightProject } from "@/utilities/getObserveMoonNightProject";

export const metadata: Metadata = {
  title: "International Observe the Moon Night | SEDS Sri Lanka",
  description:
    "Join SEDS Sri Lanka for an annual global celebration of lunar science, telescopic observation, and space exploration.",
};

export default async function ObserveMoonNightDefaultPage() {
  const eventData = await getObserveMoonNightProject();

  // If no active published event exists in the database, return 404
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

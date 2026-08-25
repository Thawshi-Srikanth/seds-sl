import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { TallyEmbed } from "@/components/ui/TallyEmbed";
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
      title: "Event Feedback | SEDS Sri Lanka",
    };
  }

  return {
    title: `Event Feedback | International Observe the Moon Night ${eventData.year} | SEDS Sri Lanka`,
    description: `Share your feedback and thoughts for International Observe the Moon Night ${eventData.year} with SEDS Sri Lanka.`,
  };
}

export default async function ObserveMoonNightAnnualFeedbackPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const eventData = await getObserveMoonNightProject(slug);

  if (!eventData) {
    notFound();
  }

  // Redirect back to the event page if feedback is disabled or no feedback URL is provided
  if (!eventData.feedbackUrl || !eventData.isFeedbackActive) {
    redirect(`/projects/${eventData.slug}`);
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden pt-24 pb-20">
      {/* CONTINUOUS VISIBLE VERTICAL MARGIN GUIDE LINES & GRID GUIDES */}
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-full max-w-7xl border-x border-border/80 pointer-events-none z-30" />
      <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-full max-w-7xl pointer-events-none grid grid-cols-4 md:grid-cols-12 divide-x divide-border/40 z-30 opacity-80" />

      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-8 relative z-40">
        {/* Navigation / Back link */}
        <div>
          <Link
            href={`/projects/${eventData.slug}`}
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary uppercase tracking-widest transition-colors"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Observe the Moon Night {eventData.year}</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="space-y-3 text-left max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-foreground font-mono">
            {eventData.year} Event Feedback
          </h1>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Thank you for participating in International Observe the Moon Night{" "}
            {eventData.year}! Please take a moment to share your observations
            and thoughts below.
          </p>
        </div>

        {/* Crisp White High-Contrast Form Container Matching Form System */}
        <div className="relative">
          <div className="absolute -left-4 -right-4 top-0 border-t border-slate-300 pointer-events-none" />
          <div className="absolute -left-4 -right-4 bottom-0 border-b border-slate-300 pointer-events-none" />
          <div className="absolute -top-4 -bottom-4 left-0 border-l border-slate-300 pointer-events-none" />
          <div className="absolute -top-4 -bottom-4 right-0 border-r border-slate-300 pointer-events-none" />

          <div className="border border-slate-300 bg-white text-slate-900 shadow-2xl p-4 md:p-8 relative z-10">
            <TallyEmbed
              tallyUrl={eventData.feedbackUrl}
              title={`${eventData.title} Feedback Form`}
              height={
                eventData.feedbackFormHeight
                  ? `${eventData.feedbackFormHeight}px`
                  : "1850px"
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}

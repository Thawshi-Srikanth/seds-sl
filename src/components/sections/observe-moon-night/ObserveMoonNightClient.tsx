"use client";

import { SectionHeader } from "@/components/sections/section-header";
import { MoonNightRegistrationForm } from "@/components/forms/MoonNightRegistrationForm";
import {
  Moon,
  Telescope,
  Camera,
  BookOpen,
  Trophy,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import type { ObserveMoonEventResult } from "@/utilities/getObserveMoonNightProject";

interface ObserveMoonNightClientProps {
  slug: string;
  year?: string;
  eventData?: ObserveMoonEventResult;
}

export function ObserveMoonNightClient({
  slug,
  year = "2026",
  eventData,
}: ObserveMoonNightClientProps) {
  const highlights = [
    {
      icon: <Telescope className="size-6 text-primary" />,
      title: "Lunar Telescopic Observation",
      description:
        "Observe lunar craters, mountain ranges, and mare basins in high resolution using high-power optical telescopes.",
    },
    {
      icon: <Camera className="size-6 text-primary" />,
      title: "Astrophotography Workshop",
      description:
        "Learn specialized lunar imaging techniques using DSLR cameras, smartphones, and telescope mounts.",
    },
    {
      icon: <BookOpen className="size-6 text-primary" />,
      title: "Lunar Science Keynotes",
      description:
        "Hear from aerospace researchers on lunar geology, Moon exploration history, and upcoming Artemis lunar missions.",
    },
    {
      icon: <Trophy className="size-6 text-primary" />,
      title: "Moon Quiz & Competitions",
      description:
        "Participate in live astronomy quizzes, win exclusive space merchandise, and receive digital participation badges.",
    },
  ];

  const schedule = [
    {
      time: "06:30 PM",
      title: "Registration & Telescope Setup",
      desc: "Welcome briefing & telescope alignment.",
    },
    {
      time: "07:15 PM",
      title: "Lunar Keynote Lecture",
      desc: "Interactive presentation on lunar surface geology.",
    },
    {
      time: "08:00 PM",
      title: "Guided Telescopic Observation",
      desc: "Live observation of crater walls and terminator line.",
    },
    {
      time: "09:15 PM",
      title: "Astrophotography Masterclass",
      desc: "Capture high-resolution lunar photos with guidance.",
    },
    {
      time: "10:00 PM",
      title: "Lunar Quiz & Closing Ceremony",
      desc: "Trivia challenge, awards, and certificate distribution.",
    },
  ];

  const title =
    eventData?.title || `International Observe the Moon Night ${year}`;
  const eventDate = eventData?.eventDate || "October 24, 2026";
  const eventTime = eventData?.eventTime || "06:30 PM - 10:30 PM IST";
  const location = eventData?.location || "Colombo & Chapter Observatories";
  const description =
    eventData?.description ||
    "Join SEDS Sri Lanka for an annual global celebration of lunar science, telescopic observation, and space exploration. Connect with observers worldwide as we look up at the Moon.";

  return (
    <main className="flex flex-col w-full min-h-screen pt-8 md:pt-12 lg:pt-16 pb-16">
      <div className="grid-container section-content">
        <div className="col-span-4 md:col-span-8 lg:col-span-12">
          {/* Parallax Hero Header */}
          <SectionHeader
            title={title}
            description={<>{description}</>}
            image="/section-header/space-projects-bg.jpeg"
          />

          {/* Key Event Details Bar */}
          <div className="mt-12 relative">
            <div className="absolute -left-6 -right-6 top-0 border-t border-border/60 pointer-events-none" />
            <div className="absolute -left-6 -right-6 bottom-0 border-b border-border/60 pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/60 border border-border/60 bg-background relative z-0">
              <div className="p-5 flex items-center gap-4 bg-background">
                <div className="p-3 bg-primary/10 border border-primary/20 shrink-0">
                  <Calendar className="size-6 text-primary" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Event Date
                  </div>
                  <div className="text-base font-bold text-foreground font-mono">
                    {eventDate}
                  </div>
                </div>
              </div>

              <div className="p-5 flex items-center gap-4 bg-background">
                <div className="p-3 bg-primary/10 border border-primary/20 shrink-0">
                  <Clock className="size-6 text-primary" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Event Schedule
                  </div>
                  <div className="text-base font-bold text-foreground font-mono">
                    {eventTime}
                  </div>
                </div>
              </div>

              <div className="p-5 flex items-center gap-4 bg-background">
                <div className="p-3 bg-primary/10 border border-primary/20 shrink-0">
                  <MapPin className="size-6 text-primary" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    Observatory Location
                  </div>
                  <div className="text-base font-bold text-foreground font-mono">
                    {location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main 2-Column Section */}
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Event Overview, Highlights & Agenda */}
            <div className="lg:col-span-6 space-y-8">
              {/* Event Overview & Highlights */}
              <div className="relative">
                <div className="absolute -left-4 -right-4 top-0 border-t border-border/60 pointer-events-none" />
                <div className="absolute -left-4 -right-4 bottom-0 border-b border-border/60 pointer-events-none" />
                <div className="absolute -top-4 -bottom-4 left-0 border-l border-border/60 pointer-events-none" />
                <div className="absolute -top-4 -bottom-4 right-0 border-r border-border/60 pointer-events-none" />

                <div className="border border-border/60 divide-y divide-border/60 bg-background relative z-0">
                  <div className="p-6 bg-background space-y-2">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-primary tracking-wider">
                      <Sparkles className="size-4" />
                      <span>About International Observe the Moon Night</span>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Look Up at the Moon Together
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      International Observe the Moon Night is a global public
                      engagement program sponsored by NASA's Lunar
                      Reconnaissance Orbiter (LRO) mission. SEDS Sri Lanka
                      brings together students, researchers, and the general
                      public for an unforgettable evening under the night sky.
                    </p>
                  </div>

                  {highlights.map((h, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, margin: "-30px" }}
                      transition={{ duration: 0.4, delay: idx * 0.08 }}
                      className="p-5 bg-background flex items-start gap-4"
                    >
                      <div className="p-2.5 bg-primary/10 border border-primary/20 shrink-0">
                        {h.icon}
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-bold text-base text-foreground">
                          {h.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {h.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Event Schedule Agenda */}
              <div className="relative">
                <div className="absolute -left-4 -right-4 top-0 border-t border-border/60 pointer-events-none" />
                <div className="absolute -left-4 -right-4 bottom-0 border-b border-border/60 pointer-events-none" />

                <div className="border border-border/60 divide-y divide-border/60 bg-background relative z-0">
                  <div className="p-5 bg-background">
                    <h3 className="text-lg font-bold text-foreground font-mono uppercase tracking-wider">
                      Event Schedule & Agenda
                    </h3>
                  </div>

                  {schedule.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-background flex items-start gap-4"
                    >
                      <div className="text-xs font-mono font-bold text-primary shrink-0 w-20 pt-0.5">
                        {item.time}
                      </div>
                      <div className="space-y-0.5 flex-1">
                        <div className="font-bold text-sm text-foreground">
                          {item.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Code-Based Registration Form */}
            <div className="lg:col-span-6">
              <MoonNightRegistrationForm year={year} eventSlug={slug} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

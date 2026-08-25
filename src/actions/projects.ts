"use server";

import config from "@payload-config";
import { getPayload } from "payload";

export interface UnifiedProjectItem {
  id: string | number;
  name: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  image?: any;
  chapterName?: string;
  createdAt: string;
  slug: string;
  customLink?: string;
  isFeatured?: boolean;
  isFlagship?: boolean;
  badgeLabel?: string;
}

export const fetchProjects = async (
  searchQuery = "",
): Promise<UnifiedProjectItem[]> => {
  const payload = await getPayload({ config });

  try {
    // 1. Fetch standard projects
    const projectsResult = await payload.find({
      collection: "projects",
      sort: "-createdAt",
      where: searchQuery
        ? {
            name: {
              like: searchQuery,
            },
          }
        : {},
      depth: 1,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const standardProjects: UnifiedProjectItem[] = projectsResult.docs.map(
      (doc: any) => ({
        id: doc.id,
        name: doc.name,
        description: doc.description,
        image: doc.image,
        chapterName:
          typeof doc.chapter === "object" && doc.chapter !== null
            ? doc.chapter.name
            : "",
        createdAt: doc.createdAt,
        slug: doc.slug,
        customLink: doc.customLink,
        isFeatured: Boolean(doc.isFeatured),
        isFlagship: false,
        badgeLabel: doc.isFeatured ? "FEATURED PROJECT" : undefined,
      }),
    );

    // 2. Fetch observe-moon-events collection entries
    const eventsResult = await payload.find({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collection: "observe-moon-events" as any,
      sort: "-year",
      where: {
        and: [
          {
            status: {
              equals: "published",
            },
          },
          ...(searchQuery
            ? [
                {
                  title: {
                    like: searchQuery,
                  },
                },
              ]
            : []),
        ],
      },
      depth: 1,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const flagshipEvents: UnifiedProjectItem[] = eventsResult.docs.map(
      (doc: any) => ({
        id: `moon-${doc.id}`,
        name: doc.title || `International Observe the Moon Night ${doc.year}`,
        description:
          doc.shortDescription ||
          doc.description ||
          "Join SEDS Sri Lanka for an annual global celebration of lunar science and observation.",
        image: doc.listingImage || doc.heroImage,
        chapterName: "SEDS Sri Lanka Flagship Event",
        createdAt: doc.eventDate || doc.createdAt || new Date().toISOString(),
        slug: `observe-the-moon-night/${doc.year}`,
        customLink: `/projects/observe-the-moon-night/${doc.year}`,
        isFeatured: doc.isFeatured ?? true,

        isFlagship: true,
        badgeLabel: "FEATURED EVENT",
      }),
    );

    // 3. Combine both collections (Featured flagship events & featured projects sorted to front)
    const combined = [...flagshipEvents, ...standardProjects];

    return combined;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

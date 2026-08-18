import { getPayload } from "payload";
import configPromise from "@payload-config";

export interface ObserveMoonEventResult {
  id: string | number;
  title: string;
  year: string;
  eventDate?: string;
  startTime?: string;
  endTime?: string;
  description?: string;
  heroImage?: any;
  isPaid?: boolean;
  ticketPrice?: string;
  paymentDetails?: string;
  agenda?: any[];
  locations?: any[];
  partners?: any[];
  status: string;
  slug: string;
}

export async function getObserveMoonNightProject(
  slugParam?: string,
): Promise<ObserveMoonEventResult | null> {
  try {
    const payload = await getPayload({ config: configPromise });

    if (slugParam) {
      const yearMatch = slugParam.match(/\d{4}/);
      const searchYear = yearMatch ? yearMatch[0] : slugParam;

      // 1. Query observe-moon-events collection by year or exact match
      const yearResult = await payload.find({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        collection: "observe-moon-events" as any,
        where: {
          and: [
            {
              year: {
                equals: searchYear,
              },
            },
            {
              status: {
                equals: "published",
              },
            },
          ],
        },
        limit: 1,
      });

      if (yearResult.docs[0]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const doc = yearResult.docs[0] as any;
        return {
          id: doc.id,
          title:
            doc.title || `International Observe the Moon Night ${doc.year}`,
          year: doc.year,
          eventDate: doc.eventDate,
          startTime: doc.startTime,
          endTime: doc.endTime,
          description: doc.description,
          heroImage: doc.heroImage,
          isPaid: doc.isPaid || false,
          ticketPrice: doc.ticketPrice || "",
          paymentDetails: doc.paymentDetails || "",
          agenda: doc.agenda || [],
          locations: doc.locations || [],
          partners: doc.partners || [],
          status: doc.status,
          slug: `observe-the-moon-night-${doc.year}`,
        };
      }

      return null;
    }

    // Default route (no slug param): fetch the latest active/published observe-moon-event sorted by year / createdAt
    const latestResult = await payload.find({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      collection: "observe-moon-events" as any,
      where: {
        status: {
          equals: "published",
        },
      },
      sort: "-year",
      limit: 1,
    });

    if (latestResult.docs[0]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = latestResult.docs[0] as any;
      return {
        id: doc.id,
        title: doc.title || `International Observe the Moon Night ${doc.year}`,
        year: doc.year,
        eventDate: doc.eventDate,
        startTime: doc.startTime,
        endTime: doc.endTime,
        description: doc.description,
        heroImage: doc.heroImage,
        isPaid: doc.isPaid || false,
        ticketPrice: doc.ticketPrice || "",
        paymentDetails: doc.paymentDetails || "",
        agenda: doc.agenda || [],
        locations: doc.locations || [],
        partners: doc.partners || [],
        status: doc.status,
        slug: `observe-the-moon-night-${doc.year}`,
      };
    }

    return null;
  } catch (error) {
    console.error("Error querying Observe Moon Event collection:", error);
    return null;
  }
}

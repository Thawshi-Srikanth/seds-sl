import { revalidatePath, revalidateTag } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

export const revalidateCollection =
  (collectionSlug: string): CollectionAfterChangeHook =>
  async ({ doc, previousDoc, req }) => {
    if (req.payload) {
      try {
        // Revalidate specific collection cache tag
        revalidateTag(collectionSlug);
        if (doc?.slug) {
          revalidateTag(`${collectionSlug}_${doc.slug}`);
          revalidatePath(`/${collectionSlug}/${doc.slug}`);
        }
        // Revalidate collection list page and homepage
        revalidatePath(`/${collectionSlug}`);
        revalidatePath("/");
      } catch (err) {
        console.error(`Error revalidating ${collectionSlug}:`, err);
      }
    }
    return doc;
  };

export const revalidateCollectionDelete =
  (collectionSlug: string): CollectionAfterDeleteHook =>
  async ({ doc, req }) => {
    if (req.payload) {
      try {
        revalidateTag(collectionSlug);
        if (doc?.slug) {
          revalidateTag(`${collectionSlug}_${doc.slug}`);
          revalidatePath(`/${collectionSlug}/${doc.slug}`);
        }
        revalidatePath(`/${collectionSlug}`);
        revalidatePath("/");
      } catch (err) {
        console.error(`Error revalidating deleted ${collectionSlug}:`, err);
      }
    }
    return doc;
  };

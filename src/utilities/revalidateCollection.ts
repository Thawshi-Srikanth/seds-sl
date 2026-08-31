import { revalidatePath } from "next/cache";
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from "payload";

export const revalidateCollection =
  (collectionSlug: string): CollectionAfterChangeHook =>
  async ({ doc, req }) => {
    if (req.payload) {
      try {
        if (doc?.slug) {
          revalidatePath(`/${collectionSlug}/${doc.slug}`);
        }
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
        if (doc?.slug) {
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

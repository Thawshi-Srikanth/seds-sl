import fs from "node:fs";
import path from "node:path";
import type { Payload, PayloadRequest } from "payload";

interface IDMap {
  [collection: string]: {
    [oldId: string | number]: string | number;
  };
}

const readData = (collection: string): any[] => {
  const filePath = path.resolve(
    process.cwd(),
    `src/endpoints/seed/data/${collection}.json`,
  );
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const getFileBuffer = (filename: string): File | null => {
  const filePath = path.resolve(
    process.cwd(),
    `src/endpoints/seed/images/${filename}`,
  );
  if (!fs.existsSync(filePath)) return null;
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filename).toLowerCase();
  let type = "image/jpeg";
  if (ext === ".png") type = "image/png";
  if (ext === ".svg") type = "image/svg+xml";
  if (ext === ".webp") type = "image/webp";

  return new File([buffer], filename, { type });
};

const readIdMap = (): IDMap => {
  const filePath = path.resolve(
    process.cwd(),
    "src/endpoints/seed/data/id-map.json",
  );
  if (!fs.existsSync(filePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return {};
  }
};

const writeIdMap = (map: IDMap): void => {
  const filePath = path.resolve(
    process.cwd(),
    "src/endpoints/seed/data/id-map.json",
  );
  fs.writeFileSync(filePath, JSON.stringify(map, null, 2), "utf8");
};

const resolveIDs = (obj: any, idMap: IDMap): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => resolveIDs(item, idMap));
  }
  if (obj !== null && typeof obj === "object") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      let val = obj[key];
      if (
        typeof val === "object" &&
        val !== null &&
        val._relationTo &&
        val._value
      ) {
        const mappedId = idMap[val._relationTo]?.[val._value];
        val = mappedId || val._value;
      } else if (
        (key === "logo" || key === "heroImage" || key === "avatar") &&
        (typeof val === "number" || typeof val === "string")
      ) {
        const mappedId = idMap.media?.[val];
        if (mappedId) val = mappedId;
      }
      newObj[key] = resolveIDs(val, idMap);
    }
    return newObj;
  }
  return obj;
};

export const seed = async ({
  payload,
  req,
  collection,
}: {
  payload: Payload;
  req: PayloadRequest;
  collection?: string;
}): Promise<void> => {
  payload.logger.info(
    `Seeding database... Requested collection: ${collection || "all"}`,
  );

  const availableCollections = [
    "media",
    "forms",
    "pages",
    "divisions",
    "chapters",
    "projects",
    "observe-moon-events",
  ];

  const collectionsToSeed = collection ? [collection] : availableCollections;

  // Read or initialize ID map
  const idMap = readIdMap();

  for (const coll of collectionsToSeed) {
    if (!availableCollections.includes(coll)) {
      payload.logger.warn(`Collection ${coll} is not supported for seeding.`);
      continue;
    }

    payload.logger.info(`— Seeding ${coll}...`);

    const docs = readData(coll);
    if (!docs.length) {
      payload.logger.info(`No data found for ${coll}. Skipping.`);
      continue;
    }

    if (!idMap[coll]) idMap[coll] = {};

    for (const doc of docs) {
      const {
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        id: oldId,
        ...rawDocData
      } = doc;

      // Resolve relational IDs
      const docData = resolveIDs(rawDocData, idMap);

      // Check if media document already exists by filename
      if (coll === "media" && docData.filename) {
        try {
          const existingMedia = await payload.find({
            collection: "media",
            where: { filename: { equals: docData.filename } },
            limit: 1,
          });
          if (existingMedia.docs[0]) {
            idMap[coll][oldId] = existingMedia.docs[0].id;
            payload.logger.info(
              `Found existing media "${docData.filename}" -> ID ${existingMedia.docs[0].id}`,
            );
            continue;
          }
        } catch {
          // Ignore and create if lookup fails
        }
      }

      // Check if observe-moon-event document already exists by year
      if (coll === "observe-moon-events" && docData.year) {
        try {
          const existingEvent = await payload.find({
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            collection: "observe-moon-events" as any,
            where: { year: { equals: docData.year } },
            limit: 1,
          });
          if (existingEvent.docs[0]) {
            const updated = await payload.update({
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              collection: "observe-moon-events" as any,
              id: existingEvent.docs[0].id,
              data: docData,
            });
            idMap[coll][oldId] = updated.id;
            payload.logger.info(
              `Updated existing observe-moon-event year ${docData.year} -> ID ${updated.id}`,
            );
            continue;
          }
        } catch {
          // Ignore and create if lookup fails
        }
      }

      let fileData: File | null = null;
      if (coll === "media" && docData.filename) {
        fileData = getFileBuffer(docData.filename);
      }

      try {
        const created = await payload.create({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          collection: coll as any,
          req,
          data: docData,
          ...(fileData ? { file: fileData } : {}),
        } as any);

        // Map old ID to new ID
        idMap[coll][oldId] = created.id;
        payload.logger.info(`Created ${coll} doc ID ${created.id}`);
      } catch (e) {
        payload.logger.error(`Failed to create doc ${oldId} in ${coll}: ${e}`);
      }
    }

    // Save map after each collection
    writeIdMap(idMap);
  }

  payload.logger.info("Seeding action complete!");
};

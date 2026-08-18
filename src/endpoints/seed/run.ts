import { getPayload } from "payload";
import configPromise from "../../payload.config";
import { seed } from "./index";

async function main() {
  try {
    const collection = process.argv[2];
    const payload = await getPayload({ config: configPromise });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await seed({ payload, req: {} as any, collection });
    console.log("✅ Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error running seed:", err);
    process.exit(1);
  }
}

main();

import dotenv from "dotenv";
import fs from "node:fs";
import { chain } from "stream-chain";
import { parser } from "stream-json/jsonl/Parser";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import type { WithoutSystemFields } from "convex/server";
import type { Doc } from "../convex/_generated/dataModel";
import logError from "@/lib/utils/logError";

dotenv.config({ path: ".env.local" });

function cleanDoc(doc: Doc<"foods">): WithoutSystemFields<Doc<"foods">> {
  const { _id, _creationTime, ...rest } = doc;
  return rest as WithoutSystemFields<Doc<"foods">>;
}

async function syncFoodsData(jsonPath: string) {
  const convexUrl = process.env.CONVEX_PROD_URL;
  const ingestToken = process.env.CONVEX_INGEST_TOKEN;
  if (!convexUrl) throw new Error("Set CONVEX_PROD_URL");
  if (!ingestToken) throw new Error("Set CONVEX_INGEST_TOKEN");

  const client = new ConvexHttpClient(convexUrl);
  const label = `sync:${jsonPath}`;

  const batchSize = 200;
  let batch: WithoutSystemFields<Doc<"foods">>[] = [];
  let totalInserted = 0;
  let totalUpdated = 0;

  console.time(label);

  const toError = (error: unknown): Error =>
    error instanceof Error ? error : new Error(String(error));

  const flushBatch = async () => {
    if (!batch.length) return;

    const docs = batch;
    batch = [];

    const { inserted, updated } = await client.action(
      api.foods.ingestFoods.default,
      { token: ingestToken, docs }
    );

    totalInserted += inserted;
    totalUpdated += updated;
    console.log(`Synced: Inserted ${totalInserted}, updated ${totalUpdated}.`);
  };

  await new Promise<void>((resolve, reject) => {
    const pipeline = chain([fs.createReadStream(jsonPath), parser()]);

    pipeline.on("data", (data: { value: unknown }) => {
      const rawDoc = data.value as Doc<"foods">;
      const doc = cleanDoc(rawDoc);

      batch.push(doc);

      if (batch.length >= batchSize) {
        pipeline.pause();
        void flushBatch()
          .then(() => {
            pipeline.resume();
          })
          .catch((error: unknown) => {
            logError("Upsert error", error);
            pipeline.destroy(toError(error));
          });
      }
    });

    pipeline.on("end", () => {
      void flushBatch()
        .then(() => {
          console.timeEnd(label);
          console.log(
            `Done. Total Inserted ${totalInserted}, Total Updated ${totalUpdated}.`
          );
          resolve();
        })
        .catch((error: unknown) => {
          reject(toError(error));
        });
    });

    pipeline.on("error", (err: unknown) => {
      reject(toError(err));
    });
  });
}

async function main() {
  const jsonPath = process.argv.at(2);
  if (!jsonPath) {
    console.error(
      "Pass path to the extracted convex snapshot (documents.jsonl)."
    );
    process.exit(1);
  }

  await syncFoodsData(jsonPath);
}

main().catch((e: unknown) => {
  logError("syncFoodsData error", e);
  process.exit(1);
});

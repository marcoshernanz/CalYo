import { v } from "convex/values";
import { z } from "zod";
import { action } from "../_generated/server";
import appConfig from "../../app.config";

const NutrientValue = z.coerce.number().catch(0).default(0);

const ProductSchema = z
  .object({
    code: z.string(),
    product_name: z.string().nullable().optional(),
    brands: z.string().nullable().optional(),
    nutriments: z
      .object({
        proteins_100g: NutrientValue,
        carbohydrates_100g: NutrientValue,
        fat_100g: NutrientValue,
      })
      .optional()
      .default({
        proteins_100g: 0,
        carbohydrates_100g: 0,
        fat_100g: 0,
      }),
  })
  .loose();

const OpenFoodFactsResponse = z.object({
  status: z.union([z.number(), z.string()]).optional(),
  product: ProductSchema.nullable().optional(),
});

const scanBarcode = action({
  args: {
    barcode: v.string(),
    locale: v.string(),
  },
  handler: async (ctx, args) => {
    const localeString = args.locale;
    const parts = localeString.split("-");
    // const languageCode = parts[0].toLowerCase();
    const languageCode = "es";
    const countryCode = parts[1] ? parts[1].toLowerCase() : "es";

    const config = appConfig();
    const appName = config.name;
    const appVersion = config.version;
    const supportEmail = process.env.EXPO_PUBLIC_SUPPORT_EMAIL;
    const userAgent = `${appName}/${appVersion} (${supportEmail})`;

    const url = new URL(
      `https://world.openfoodfacts.net/api/v2/product/${args.barcode}`
    );
    url.search = new URLSearchParams({
      cc: countryCode,
      lc: languageCode,
      fields: `code,product_name,product_name_${languageCode},brands,nutriments`,
    }).toString();

    let rawJson: unknown;
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": userAgent,
        },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      rawJson = await response.json();
    } catch (error) {
      console.error("Network error fetching food:", error);
      throw new Error("Failed to reach food database");
    }

    const result = OpenFoodFactsResponse.safeParse(rawJson);

    if (!result.success) {
      console.error("OpenFoodFacts schema validation failed:", result.error);
      return null;
    }

    const data = result.data;

    if (!data.product || String(data.status) === "0") {
      return null;
    }

    const p = data.product;

    const dynamicProduct = p as Record<string, unknown>;

    const localizedNameVal = dynamicProduct[`product_name_${languageCode}`];
    const localizedName =
      typeof localizedNameVal === "string" && localizedNameVal.length > 0
        ? localizedNameVal
        : null;
    const genericName =
      p.product_name && p.product_name.length > 0 ? p.product_name : null;
    const finalName = localizedName ?? genericName ?? "Unknown Product";

    const fullName = p.brands ? `${p.brands} - ${finalName}` : finalName;

    return {
      barcode: args.barcode,
      name: fullName,
      protein: Number(p.nutriments.proteins_100g.toFixed(1)),
      carbs: Number(p.nutriments.carbohydrates_100g.toFixed(1)),
      fat: Number(p.nutriments.fat_100g.toFixed(1)),
    };
  },
});

export default scanBarcode;

import { z } from "zod";
import appConfig from "../../app.config";

const ProductSchema = z.looseObject({
  code: z.string(),
  product_name: z.string().nullable().optional(),
  brands: z.string().nullable().optional(),
  nutriments: z.record(z.string(), z.any()).optional().default({}),
});

const OpenFoodFactsResponse = z.object({
  status: z.union([z.number(), z.string()]).optional(),
  product: ProductSchema.nullable().optional(),
});

export async function fetchProduct(barcode: string, locale: string) {
  const localeString = locale;
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
    `https://world.openfoodfacts.net/api/v2/product/${barcode}`
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
    barcode: barcode,
    name: fullName,
    nutriments: p.nutriments,
  };
}

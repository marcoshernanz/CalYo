import Meal from "@/components/meal/Meal";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import macrosToKcal from "@/lib/utils/macrosToKcal";
import { useAction, useMutation, useQuery, useConvex } from "convex/react";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { Toast } from "@/components/ui/Toast";
import { z } from "zod";
import logError from "@/lib/utils/logError";
import processLibraryImage from "@/lib/image/processLibraryImage";
import cropImageToAspect from "@/lib/image/cropImageToAspect";
import { getLocales } from "expo-localization";
import { fetchProduct } from "@/lib/off/fetchProduct";

export default function MealScreen() {
  const dimensions = useWindowDimensions();
  const router = useRouter();
  const convex = useConvex();
  const {
    photoUri,
    description,
    mealId: initialMealId,
    source,
    barcode,
  } = useLocalSearchParams<{
    photoUri?: string;
    description?: string;
    mealId?: Id<"meals">;
    source?: "camera" | "library";
    barcode?: string;
  }>();

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl.default);
  const analyzeMealPhoto = useAction(
    api.meals.analyze.analyzeMealPhoto.default
  );
  const analyzeMealDescription = useAction(
    api.meals.analyze.analyzeMealDescription.default
  );
  const analyzeMealBarcode = useAction(
    api.meals.analyze.analyzeMealBarcode.default
  );

  const [mealId, setMealId] = useState<Id<"meals"> | undefined>(initialMealId);
  const startedRef = useRef(false);

  const data = useQuery(
    api.meals.getMeal.default,
    mealId ? { mealId } : "skip"
  );

  const fromCamera = source === "camera";

  const createMealFromPhoto = useCallback(
    async (uri: string) => {
      const croppedUri = fromCamera
        ? await cropImageToAspect({ uri, dimensions })
        : await processLibraryImage(uri);

      const uploadUrl = await generateUploadUrl();

      const fileRes = await fetch(croppedUri);
      const blob = await fileRes.blob();

      const uploadRes = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": blob.type || "image/jpeg" },
        body: blob,
      });
      if (!uploadRes.ok) {
        throw new Error(`Upload failed: ${uploadRes.status}`);
      }
      const json: unknown = await uploadRes.json();
      const schema = z.object({
        storageId: z.string(),
      });

      const { data, success } = schema.safeParse(json);

      if (!success) {
        throw new Error("Upload response missing storageId");
      }
      const storageId = data.storageId as Id<"_storage">;

      return await analyzeMealPhoto({ storageId });
    },
    [analyzeMealPhoto, dimensions, fromCamera, generateUploadUrl]
  );

  const createMealFromDescription = useCallback(
    async (description: string) => {
      return await analyzeMealDescription({ description });
    },
    [analyzeMealDescription]
  );

  const createMealFromBarcode = useCallback(
    async (barcode: string) => {
      const locale = getLocales().at(0)?.languageTag ?? "es-ES";

      const existingFood = await convex.query(
        api.foods.getFoodByIdentity.default,
        {
          identity: { source: "off", id: barcode },
        }
      );

      if (existingFood) {
        return await analyzeMealBarcode({ barcode, locale });
      }

      const product = await fetchProduct(barcode, locale);
      if (!product) {
        throw new Error("Product not found in Open Food Facts");
      }

      return await analyzeMealBarcode({ barcode, locale, product });
    },
    [analyzeMealBarcode, convex]
  );

  const startMealAnalysis = useCallback(async () => {
    if (
      (!photoUri && !description && !barcode) ||
      initialMealId ||
      startedRef.current ||
      mealId
    )
      return;
    startedRef.current = true;

    try {
      if (photoUri) {
        const mealId = await createMealFromPhoto(photoUri);
        setMealId(mealId);
      } else if (description) {
        const mealId = await createMealFromDescription(description);
        setMealId(mealId);
      } else if (barcode) {
        const mealId = await createMealFromBarcode(barcode);
        setMealId(mealId);
      }
    } catch (e) {
      logError("Start meal error", e);
      Toast.show({ text: "Error al analizar la comida", variant: "error" });
      router.replace("/app");
    }
  }, [
    createMealFromDescription,
    createMealFromPhoto,
    createMealFromBarcode,
    description,
    initialMealId,
    mealId,
    photoUri,
    barcode,
    router,
  ]);

  useEffect(() => {
    void startMealAnalysis();
  }, [startMealAnalysis]);

  if (mealId && data === null) {
    return <Redirect href="/app" />;
  }

  const meal = data?.meal;
  const mealItems = data?.mealItems ?? [];

  const isDone =
    !!meal &&
    meal.status === "done" &&
    !!meal.name &&
    !!meal.totalMacros &&
    !!meal.totalNutrients;

  const items = isDone
    ? mealItems.map((item) => ({
        id: item._id,
        name: item.food.name.es ?? item.food.name.en,
        calories: macrosToKcal(item.macrosPer100g) * (item.grams / 100),
        grams: item.grams,
      }))
    : undefined;

  const isLoading = !mealId || !data || !isDone;

  return (
    <Meal
      loading={isLoading}
      name={meal?.name}
      mealId={meal?._id}
      totalMacros={meal?.totalMacros}
      totalMicros={meal?.totalMicros}
      mealItems={items}
    />
  );
}

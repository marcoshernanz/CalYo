import Meal from "@/components/meal/Meal";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import macrosToKcal from "@/lib/utils/macrosToKcal";
import { useAction, useMutation, useQuery } from "convex/react";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useWindowDimensions } from "react-native";
import { Toast } from "@/components/ui/Toast";
import { z } from "zod";
import logError from "@/lib/utils/logError";
import processLibraryImage from "@/lib/image/processLibraryImage";
import cropImageToDeviceAspect from "@/lib/image/cropImageToDeviceAspect";

export default function MealScreen() {
  const dimensions = useWindowDimensions();
  const router = useRouter();
  const {
    photoUri,
    mealId: initialMealId,
    source,
  } = useLocalSearchParams<{
    photoUri?: string;
    mealId?: Id<"meals">;
    source?: "camera" | "library";
  }>();

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl.default);
  const analyzeMealPhoto = useAction(
    api.meals.analyze.analyzeMealPhoto.default
  );

  const [mealId, setMealId] = useState<Id<"meals"> | undefined>(initialMealId);
  const startedRef = useRef(false);

  const data = useQuery(
    api.meals.getMeal.default,
    mealId ? { mealId } : "skip"
  );

  const fromCamera = source === "camera";

  const handleMealCreation = useCallback(async () => {
    if (!photoUri || initialMealId || startedRef.current || mealId) return;
    startedRef.current = true;

    try {
      const croppedUri = fromCamera
        ? await cropImageToDeviceAspect({ uri: photoUri, dimensions })
        : await processLibraryImage(photoUri);

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

      const mealId = await analyzeMealPhoto({ storageId });
      setMealId(mealId);
    } catch (e) {
      logError("Start meal error", e);
      Toast.show({ text: "Error al analizar la comida", variant: "error" });
      router.replace("/app");
    }
  }, [
    analyzeMealPhoto,
    dimensions,
    fromCamera,
    generateUploadUrl,
    initialMealId,
    mealId,
    photoUri,
    router,
  ]);

  useEffect(() => {
    void handleMealCreation();
  }, [handleMealCreation]);

  if (mealId && data === null) {
    return <Redirect href="/app" />;
  }

  const meal = data?.meal;
  const mealItems = data?.mealItems ?? [];

  const isDone =
    !!meal && meal.status === "done" && !!meal.name && !!meal.totals;

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
      totals={meal?.totals}
      items={items}
    />
  );
}

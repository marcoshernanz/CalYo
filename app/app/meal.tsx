import Meal from "@/components/meal/Meal";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import macrosToKcal from "@/lib/utils/macrosToKcal";
import { useAction, useMutation, useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";

export default function MealScreen() {
  const { photoUri, initialMealId } = useLocalSearchParams<{
    photoUri?: string;
    initialMealId?: Id<"meals">;
  }>();

  const createMeal = useMutation(api.meals.createMeal.default);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl.default);
  const analyzeMealPhoto = useAction(api.meals.analyzeMealPhoto.default);

  const [mealId, setMealId] = useState<Id<"meals"> | undefined>(initialMealId);
  const startedRef = useRef(false);

  const data = useQuery(
    api.meals.getMeal.default,
    mealId ? { mealId } : "skip"
  );

  useEffect(() => {
    if (!photoUri || initialMealId || startedRef.current) return;
    startedRef.current = true;

    (async () => {
      try {
        const newMealId = await createMeal();
        if (!newMealId) throw new Error("Failed to create meal");
        setMealId(newMealId);

        const uploadUrl = await generateUploadUrl();

        const fileRes = await fetch(photoUri);
        const blob = await fileRes.blob();

        const uploadRes = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": blob.type || "image/jpeg" },
          body: blob,
        });
        if (!uploadRes.ok) {
          throw new Error(`Upload failed: ${uploadRes.status}`);
        }
        const json = await uploadRes.json();
        if (!json?.storageId) {
          throw new Error("Upload response missing storageId");
        }
        const { storageId } = json;

        await analyzeMealPhoto({ mealId: newMealId, storageId });
      } catch (e) {
        console.error("Start meal error", e);
      }
    })();
  }, [
    analyzeMealPhoto,
    createMeal,
    generateUploadUrl,
    photoUri,
    initialMealId,
  ]);

  if (!mealId || !data) return null;

  const { meal, mealItems } = data;

  if (!meal || meal.status !== "done" || !meal.name || !meal.totals) {
    return null;
  }

  const items = mealItems.map((item) => ({
    name: item.food.description.en,
    calories: macrosToKcal(item.nutrients),
    grams: item.grams,
  }));

  return (
    <Meal
      name={meal.name}
      mealId={meal._id}
      totals={meal.totals}
      items={items}
    />
  );
}

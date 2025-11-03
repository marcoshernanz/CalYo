import Meal from "@/components/meal/Meal";
import { Toast } from "@/components/ui/Toast";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useDeleteMeal from "@/lib/hooks/useDeleteMeal";
import macrosToKcal from "@/lib/utils/macrosToKcal";
import { useAction, useMutation, useQuery } from "convex/react";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

export default function MealScreen() {
  const router = useRouter();
  const { photoUri, mealId: initialMealId } = useLocalSearchParams<{
    photoUri?: string;
    mealId?: Id<"meals">;
  }>();

  const generateUploadUrl = useMutation(api.storage.generateUploadUrl.default);
  const analyzeMealPhoto = useAction(api.meals.analyzeMealPhoto.default);
  const createMeal = useMutation(api.meals.createMeal.default);
  const deleteMeal = useDeleteMeal();

  const [mealId, setMealId] = useState<Id<"meals"> | undefined>(initialMealId);
  const startedRef = useRef(false);

  const data = useQuery(
    api.meals.getMeal.default,
    mealId ? { mealId } : "skip"
  );

  useEffect(() => {
    if (!photoUri || initialMealId || startedRef.current || mealId) return;
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

        const { status } = await analyzeMealPhoto({
          mealId: newMealId,
          storageId,
        });
        if (status === "error") {
          Toast.show({ text: "Error al analizar la comida", variant: "error" });
          router.replace("/app");
          void deleteMeal({ id: newMealId });
        }
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
    mealId,
    deleteMeal,
    router,
  ]);

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
        name: item.food.description.en,
        calories: macrosToKcal(item.nutrients),
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

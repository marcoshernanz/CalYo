import Meal from "@/components/meal/Meal";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAction, useMutation, useQuery } from "convex/react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

export default function MealScreen() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const createMeal = useMutation(api.meals.createMeal.default);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl.default);
  const analyzeMealPhoto = useAction(api.meals.analyzeMealPhoto.default);

  const [mealId, setMealId] = useState<Id<"meals"> | null>(
    "kn7bpc59sd228ncdzg33642vmx7szjbj" as Id<"meals">
  );
  const startedRef = useRef(true);
  // const [mealId, setMealId] = useState<Id<"meals"> | null>(null);
  // const startedRef = useRef(false);

  const data = useQuery(
    api.meals.getMeal.default,
    mealId ? { mealId } : "skip"
  );

  useEffect(() => {
    if (!photoUri || startedRef.current) return;
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
        const { storageId } = await uploadRes.json();

        await analyzeMealPhoto({ mealId: newMealId, storageId });
      } catch (e) {
        console.error("Start meal error", e);
      }
    })();
  }, [analyzeMealPhoto, createMeal, generateUploadUrl, photoUri]);

  const meal = data?.meal;
  const items = data?.mealItems ?? [];
  const isLoading =
    !meal || meal.status === "pending" || meal.status === "processing";
  const totals = meal?.totals ?? { calories: 0, protein: 0, fat: 0, carbs: 0 };

  return <Meal />;
}

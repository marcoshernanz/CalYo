import Text from "@/components/ui/Text";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAction, useMutation, useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

export default function MealScreen() {
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const createMeal = useMutation(api.meals.createMeal.default);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl.default);
  const analyzeMealPhoto = useAction(api.meals.analyzeMealPhoto.default);

  const [mealId, setMealId] = useState<Id<"meals"> | null>(null);
  const startedRef = useRef(false);

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

  return (
    <View>
      <Text>{isLoading ? "Loading meal..." : JSON.stringify(meal)}</Text>
      <Text>{JSON.stringify(items)}</Text>
      <Text>{JSON.stringify(totals)}</Text>
    </View>
  );
}

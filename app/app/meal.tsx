import Text from "@/components/ui/Text";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";

export default function MealScreen() {
  const { pictureUri } = useLocalSearchParams<{ pictureUri: string }>();
  const createMeal = useMutation(api.meals.createMeal.default);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl.default);
  const analyzeMealPicture = useAction(api.meals.analyzeMealPicture.default);

  const [mealId, setMealId] = useState<string | null>(null);
  const startedRef = useRef(false);

  const data = useQuery(
    mealId ? api.meals.getMeal.default : undefined,
    mealId ? { mealId } : undefined
  );

  useEffect(() => {
    if (!pictureUri || startedRef.current) return;
    startedRef.current = true;

    (async () => {
      try {
        const newMealId = await createMeal();
        if (!newMealId) throw new Error("Failed to create meal");
        setMealId(newMealId);

        const uploadUrl = await generateUploadUrl();

        const fileRes = await fetch(pictureUri);
        const blob = await fileRes.blob();

        const uploadRes = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": blob.type || "image/jpeg" },
          body: blob,
        });
        const { storageId } = await uploadRes.json();

        await analyzeMealPicture({ mealId: newMealId, storageId });
      } catch (e) {
        console.error("Start meal error", e);
      }
    })();
  }, [analyzeMealPicture, createMeal, generateUploadUrl, pictureUri]);

  const meal = data?.meal;
  const items = data?.items ?? [];
  const isLoading =
    !meal || meal.status === "pending" || meal.status === "processing";
  const totals = meal?.totals ?? { calories: 0, protein: 0, fat: 0, carbs: 0 };

  return (
    <View>
      <Text>{JSON.stringify(meal)}</Text>
      <Text>{JSON.stringify(items)}</Text>
      <Text>{JSON.stringify(totals)}</Text>
    </View>
  );
}

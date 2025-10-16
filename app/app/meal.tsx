import { api } from "@/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";

export default function MealScreen() {
  const { pictureUri } = useLocalSearchParams<{ pictureUri: string }>();
  const createMeal = useMutation(api.meals.createMeal.default);
  const generateUploadUrl = useMutation(api.storage.generateUploadUrl.default);
  const analyzeMealPicture = useAction(api.meals.analyzeMealPicture.default);

  const [mealId, setMealId] = useState<string | null>(null);
  const startedRef = useRef(false);

  const data = useQuery(
    mealId ? api.meals.getMeal.default : undefined,
    mealId ? { id: mealId } : undefined
  );

  useEffect(() => {
    if (!pictureUri || startedRef.current) return;
    startedRef.current = true;

    (async () => {
      try {
        const newMealId = await createMeal({});
        setMealId(newMealId);

        const uploadUrl = await generateUploadUrl();

        const form = new FormData();
        form.append("file", {
          uri: pictureUri,
          name: "meal.jpg",
          type: "image/jpeg",
        });
        const res = await fetch(uploadUrl, { method: "POST", body: form });
        const { storageId } = await res.json();

        // 4) Start analysis
        await analyzeMeal({ mealId: newMealId, storageId, topK: 8 });
      } catch (e) {
        console.error("Start meal error", e);
      }
    })();
  }, [pictureUri]);
}

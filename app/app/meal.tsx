import { api } from "@/convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";

export default function MealScreen() {
  const { pictureUri, mealId: initialMealId } = useLocalSearchParams();

  const [mealId, setMealId] = useState<string | null>(initialMealId as string);
  const analyzingRef = useRef(false); // TODO: Needed?

  const analyzeMeal = useAction(api.meals.analyzeMeal.default);
  const meal = useQuery(api.meals.getMeal.default, { id: mealId });

  useEffect(() => {
    if (!pictureUri || mealId || analyzingRef.current) return;
    analyzingRef.current = true;

    (async () => {
      const { mealId } = await analyzeMeal(pictureUri);
      setMealId(mealId);
      analyzingRef.current = false;
    })();
  }, [analyzeMeal, mealId, pictureUri]);

  return null;
}

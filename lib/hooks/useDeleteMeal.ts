import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

export default function useDeleteMeal() {
  const deleteMeal = useMutation(
    api.meals.deleteMeal.default
  ).withOptimisticUpdate((localStore, args) => {
    const { id } = args;

    const existingMeal = localStore.getQuery(api.meals.getMeal.default, {
      mealId: id,
    });
    if (existingMeal !== undefined) {
      localStore.setQuery(api.meals.getMeal.default, { mealId: id }, null);
    }

    const weekQueries = localStore.getAllQueries(
      api.meals.getWeekMeals.default
    );
    for (const { args: weekArgs, value } of weekQueries) {
      if (!value) continue;

      const updatedWeek = value.map((dayMeals) =>
        dayMeals.filter((meal) => meal._id !== id)
      );

      localStore.setQuery(
        api.meals.getWeekMeals.default,
        weekArgs,
        updatedWeek
      );
    }
  });

  return deleteMeal;
}

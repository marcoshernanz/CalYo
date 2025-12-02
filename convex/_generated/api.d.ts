/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ResendOTP from "../ResendOTP.js";
import type * as auth from "../auth.js";
import type * as foods_getFoodById from "../foods/getFoodById.js";
import type * as foods_ingestFoods from "../foods/ingestFoods.js";
import type * as foods_upsertFoods from "../foods/upsertFoods.js";
import type * as home_getStreak from "../home/getStreak.js";
import type * as http from "../http.js";
import type * as mealItems_getMealItem from "../mealItems/getMealItem.js";
import type * as meals_analyze_analyzeMealConfig from "../meals/analyze/analyzeMealConfig.js";
import type * as meals_analyze_analyzeMealPhoto from "../meals/analyze/analyzeMealPhoto.js";
import type * as meals_analyze_detectMealItems from "../meals/analyze/detectMealItems.js";
import type * as meals_analyze_nameMeal from "../meals/analyze/nameMeal.js";
import type * as meals_analyze_searchFdcCandidates from "../meals/analyze/searchFdcCandidates.js";
import type * as meals_analyze_selectCandidates from "../meals/analyze/selectCandidates.js";
import type * as meals_createMeal from "../meals/createMeal.js";
import type * as meals_getMeal from "../meals/getMeal.js";
import type * as meals_getWeekMeals from "../meals/getWeekMeals.js";
import type * as meals_insertMealItem from "../meals/insertMealItem.js";
import type * as meals_updateMeal from "../meals/updateMeal.js";
import type * as nutrition_computeNutritionTargets from "../nutrition/computeNutritionTargets.js";
import type * as profiles_completeOnboarding from "../profiles/completeOnboarding.js";
import type * as profiles_getProfile from "../profiles/getProfile.js";
import type * as profiles_updateProfile from "../profiles/updateProfile.js";
import type * as rateLimits_checkAndIncrement from "../rateLimits/checkAndIncrement.js";
import type * as storage_generateUploadUrl from "../storage/generateUploadUrl.js";
import type * as tables_foods from "../tables/foods.js";
import type * as tables_mealItems from "../tables/mealItems.js";
import type * as tables_meals from "../tables/meals.js";
import type * as tables_profiles from "../tables/profiles.js";
import type * as tables_rateLimits from "../tables/rateLimits.js";
import type * as testing_getOrCreateTestUser from "../testing/getOrCreateTestUser.js";
import type * as utils_backfillFoodEmbeddings from "../utils/backfillFoodEmbeddings.js";
import type * as utils_countFoodEmbeddings from "../utils/countFoodEmbeddings.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ResendOTP: typeof ResendOTP;
  auth: typeof auth;
  "foods/getFoodById": typeof foods_getFoodById;
  "foods/ingestFoods": typeof foods_ingestFoods;
  "foods/upsertFoods": typeof foods_upsertFoods;
  "home/getStreak": typeof home_getStreak;
  http: typeof http;
  "mealItems/getMealItem": typeof mealItems_getMealItem;
  "meals/analyze/analyzeMealConfig": typeof meals_analyze_analyzeMealConfig;
  "meals/analyze/analyzeMealPhoto": typeof meals_analyze_analyzeMealPhoto;
  "meals/analyze/detectMealItems": typeof meals_analyze_detectMealItems;
  "meals/analyze/nameMeal": typeof meals_analyze_nameMeal;
  "meals/analyze/searchFdcCandidates": typeof meals_analyze_searchFdcCandidates;
  "meals/analyze/selectCandidates": typeof meals_analyze_selectCandidates;
  "meals/createMeal": typeof meals_createMeal;
  "meals/getMeal": typeof meals_getMeal;
  "meals/getWeekMeals": typeof meals_getWeekMeals;
  "meals/insertMealItem": typeof meals_insertMealItem;
  "meals/updateMeal": typeof meals_updateMeal;
  "nutrition/computeNutritionTargets": typeof nutrition_computeNutritionTargets;
  "profiles/completeOnboarding": typeof profiles_completeOnboarding;
  "profiles/getProfile": typeof profiles_getProfile;
  "profiles/updateProfile": typeof profiles_updateProfile;
  "rateLimits/checkAndIncrement": typeof rateLimits_checkAndIncrement;
  "storage/generateUploadUrl": typeof storage_generateUploadUrl;
  "tables/foods": typeof tables_foods;
  "tables/mealItems": typeof tables_mealItems;
  "tables/meals": typeof tables_meals;
  "tables/profiles": typeof tables_profiles;
  "tables/rateLimits": typeof tables_rateLimits;
  "testing/getOrCreateTestUser": typeof testing_getOrCreateTestUser;
  "utils/backfillFoodEmbeddings": typeof utils_backfillFoodEmbeddings;
  "utils/countFoodEmbeddings": typeof utils_countFoodEmbeddings;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  migrations: {
    lib: {
      cancel: FunctionReference<
        "mutation",
        "internal",
        { name: string },
        {
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }
      >;
      cancelAll: FunctionReference<
        "mutation",
        "internal",
        { sinceTs?: number },
        Array<{
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }>
      >;
      clearAll: FunctionReference<
        "mutation",
        "internal",
        { before?: number },
        null
      >;
      getStatus: FunctionReference<
        "query",
        "internal",
        { limit?: number; names?: Array<string> },
        Array<{
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }>
      >;
      migrate: FunctionReference<
        "mutation",
        "internal",
        {
          batchSize?: number;
          cursor?: string | null;
          dryRun: boolean;
          fnHandle: string;
          name: string;
          next?: Array<{ fnHandle: string; name: string }>;
        },
        {
          batchSize?: number;
          cursor?: string | null;
          error?: string;
          isDone: boolean;
          latestEnd?: number;
          latestStart: number;
          name: string;
          next?: Array<string>;
          processed: number;
          state: "inProgress" | "success" | "failed" | "canceled" | "unknown";
        }
      >;
    };
  };
};

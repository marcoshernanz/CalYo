/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ResendOTP from "../ResendOTP.js";
import type * as auth from "../auth.js";
import type * as fdc_getFdcFood from "../fdc/getFdcFood.js";
import type * as fdc_upsertFdcFoods from "../fdc/upsertFdcFoods.js";
import type * as http from "../http.js";
import type * as meals_analyze_analyzeMealConfig from "../meals/analyze/analyzeMealConfig.js";
import type * as meals_analyze_detectMealItems from "../meals/analyze/detectMealItems.js";
import type * as meals_analyze_searchFdcCandidates from "../meals/analyze/searchFdcCandidates.js";
import type * as meals_analyze_selectCandidates from "../meals/analyze/selectCandidates.js";
import type * as meals_analyzeMealPhoto from "../meals/analyzeMealPhoto.js";
import type * as meals_createMeal from "../meals/createMeal.js";
import type * as meals_getMeal from "../meals/getMeal.js";
import type * as meals_insertMealItem from "../meals/insertMealItem.js";
import type * as meals_updateMeal from "../meals/updateMeal.js";
import type * as storage_generateUploadUrl from "../storage/generateUploadUrl.js";
import type * as tables_fdcFoods from "../tables/fdcFoods.js";
import type * as tables_mealItems from "../tables/mealItems.js";
import type * as tables_meals from "../tables/meals.js";
import type * as utils_backfillFdcEmbeddings from "../utils/backfillFdcEmbeddings.js";

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
  "fdc/getFdcFood": typeof fdc_getFdcFood;
  "fdc/upsertFdcFoods": typeof fdc_upsertFdcFoods;
  http: typeof http;
  "meals/analyze/analyzeMealConfig": typeof meals_analyze_analyzeMealConfig;
  "meals/analyze/detectMealItems": typeof meals_analyze_detectMealItems;
  "meals/analyze/searchFdcCandidates": typeof meals_analyze_searchFdcCandidates;
  "meals/analyze/selectCandidates": typeof meals_analyze_selectCandidates;
  "meals/analyzeMealPhoto": typeof meals_analyzeMealPhoto;
  "meals/createMeal": typeof meals_createMeal;
  "meals/getMeal": typeof meals_getMeal;
  "meals/insertMealItem": typeof meals_insertMealItem;
  "meals/updateMeal": typeof meals_updateMeal;
  "storage/generateUploadUrl": typeof storage_generateUploadUrl;
  "tables/fdcFoods": typeof tables_fdcFoods;
  "tables/mealItems": typeof tables_mealItems;
  "tables/meals": typeof tables_meals;
  "utils/backfillFdcEmbeddings": typeof utils_backfillFdcEmbeddings;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

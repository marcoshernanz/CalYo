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
import type * as fdc_upsertFdcFoods from "../fdc/upsertFdcFoods.js";
import type * as http from "../http.js";
import type * as meals_analyzeMealPicture from "../meals/analyzeMealPicture.js";
import type * as storage_generateUploadUrl from "../storage/generateUploadUrl.js";
import type * as tables_fdcFoods from "../tables/fdcFoods.js";
import type * as tables_mealItems from "../tables/mealItems.js";
import type * as tables_meals from "../tables/meals.js";

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
  "fdc/upsertFdcFoods": typeof fdc_upsertFdcFoods;
  http: typeof http;
  "meals/analyzeMealPicture": typeof meals_analyzeMealPicture;
  "storage/generateUploadUrl": typeof storage_generateUploadUrl;
  "tables/fdcFoods": typeof tables_fdcFoods;
  "tables/mealItems": typeof tables_mealItems;
  "tables/meals": typeof tables_meals;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

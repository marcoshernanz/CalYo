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
import type * as actions_ingestFdcFoods from "../actions/ingestFdcFoods.js";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as tables_fdcFoods from "../tables/fdcFoods.js";

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
  "actions/ingestFdcFoods": typeof actions_ingestFdcFoods;
  auth: typeof auth;
  http: typeof http;
  "tables/fdcFoods": typeof tables_fdcFoods;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

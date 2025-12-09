import { Migrations } from "@convex-dev/migrations";
import { components } from "./_generated/api.js";
import { DataModel } from "./_generated/dataModel.js";

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner();

// npx convex run migrations:run '{"fn": "migrations:{MIGRATION_NAME}"}'
// npx convex run --component migrations lib:getStatus --watch

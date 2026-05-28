import { join } from "path";
import { DataSourceOptions } from "typeorm";

/**
 * Returns a TypeORM DataSourceOptions object using a config getter and an optional prefix.
 * Example: prefix = 'USER_MANAGEMENT_' will look for USER_MANAGEMENT_DB_HOST, etc.
 * Pass a function get(key: string): string | undefined, e.g. from ConfigService or process.env.
 */
export function buildDbConfig(
  get: (key: string) => string | undefined,
  prefix = "",
  basePath = __dirname,
): DataSourceOptions {
  console.log(`Building DB config with basePath: ${basePath}`);

  // Determine if we're in development or production based on basePath
  const isProduction = basePath.includes("/dist");
  const migrationsPath = isProduction
    ? join(basePath, "/database/migrations/**/*{.ts,.js}")
    : join(basePath, "/src/database/migrations/**/*{.ts,.js}");

  console.log(
    `Environment: ${isProduction ? "production" : "development"}, migrations path: ${migrationsPath}`,
  );

  const dbConfig: DataSourceOptions = {
    type: "postgres",
    host: get(`${prefix}_DB_HOST`),
    port: +(get(`${prefix}_DB_PORT`) || 3306),
    username: get(`${prefix}_DB_USER`),
    password: get(`${prefix}_DB_PASS`),
    database: get(`${prefix}_DB_NAME`),
    entities: [basePath + "/**/*.entity{.ts,.js}"],
    synchronize: false,
    migrationsRun: true, // Re-enabled auto-migration
    migrations: [migrationsPath],
    logging: true, // Enable for debugging
  };
  console.log(`DB config with prefix ${prefix}:`, dbConfig);
  return dbConfig;
}

import { Inject, Injectable, OnApplicationBootstrap } from "@nestjs/common";
import * as path from "path";
import { DataSource } from "typeorm";

/**
 * Database initialization service that runs seeds after migrations
 * but before the application fully starts accepting requests.
 *
 * Automatically discovers and runs seed functions from the microservice's
 * database/seed/index.ts file if it exists.
 */
@Injectable()
export class DatabaseInitService implements OnApplicationBootstrap {
  constructor(@Inject(DataSource) private readonly dataSource: DataSource) {}

  /**
   * This method is called after all modules have been initialized
   * but before the application starts listening for connections.
   * Perfect timing to run seeds.
   */
  async onApplicationBootstrap(): Promise<void> {
    try {
      console.log("🌱 Starting database seeding process...");

      // Try to auto-discover and run seed function
      await this.runSeedsIfAvailable();

      console.log("✅ Database seeding completed successfully!");
    } catch (error) {
      console.error("❌ Error during database seeding:", error);
      // Don't exit the process, just log the error
      // The application should still start even if seeding fails
    }
  }

  /**
   * Attempts to discover and run seed function from database/seed/index.ts
   */
  private async runSeedsIfAvailable(): Promise<void> {
    try {
      // Try different possible paths for the seed file
      const possiblePaths = [
        path.resolve(process.cwd(), "dist/database/seed/index.js"), // Primary: Compiled in dist
        path.resolve(process.cwd(), "dist/src/database/seed/index.js"), // Alternative dist structure
        path.resolve(process.cwd(), "src/database/seed/index.js"), // Compiled JS in src
        path.resolve(process.cwd(), "src/database/seed/index.ts"), // TypeScript source
      ];

      let seedModule: any = null;
      let successfulPath: string | null = null;

      for (const seedPath of possiblePaths) {
        try {
          console.log(`🔍 Looking for seed file at: ${seedPath}`);
          // Use file:// protocol for ES module imports
          seedModule = await import(`file://${seedPath}`);
          successfulPath = seedPath;
          break;
        } catch (error) {
          // Continue to next path - don't log individual failures to reduce noise
          if (
            error.code !== "MODULE_NOT_FOUND" &&
            error.code !== "ERR_MODULE_NOT_FOUND"
          ) {
            throw error; // Re-throw if it's not a module not found error
          }
        }
      }

      if (!seedModule) {
        console.log("ℹ️ No seed file found, skipping seeding.");
        return;
      }

      console.log(`✅ Found seed file at: ${successfulPath}`);

      if (
        seedModule.seedAllData &&
        typeof seedModule.seedAllData === "function"
      ) {
        console.log("📦 Found seedAllData function, executing...");
        await seedModule.seedAllData(this.dataSource);
      } else {
        console.log("ℹ️ No seedAllData function found in seed file");
      }
    } catch (error) {
      console.error("⚠️ Error loading seed file:", error.message);
      throw error;
    }
  }
}

import { ApiClientModule } from "@pothys/api-client";
import { ConfigModule, ConfigService } from "@pothys/config";
import {
  buildDbConfig,
  DatabaseInitService,
  TypeOrmModule,
} from "@pothys/db-base";
import logger from "@pothys/logger";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CustomersModule } from "./customers/customers.module";
import { AuthPackageModule } from "@pothys/auth";
import { KycModule } from "./kyc/kyc.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ["apps/identity-service/.env", ".env"],
    }),
    ApiClientModule.register(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = buildDbConfig(
          (key) => configService.get(key),
          "IDENTITY_SERVICE",
          __dirname,
        );
        logger.info("Database Configuration IdentityService:", dbConfig);
        return dbConfig;
      },
    }),
    AuthPackageModule.forRoot(),
    AuthModule,
    CustomersModule,
    KycModule,
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseInitService],
})
export class AppModule {}

import { ApiClientModule } from "@pothys/api-client";
import { AuthPackageModule } from "@pothys/auth";
import { ConfigModule, ConfigService } from "@pothys/config";
import {
  buildDbConfig,
  DatabaseInitService,
  TypeOrmModule,
} from "@pothys/db-base";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthPackageModule.forRoot(),
    ApiClientModule.register(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = buildDbConfig(
          (key) => configService.get(key),
          "COMPLIANCE_SERVICE",
          __dirname,
        );
        console.log("Database Configuration:", dbConfig);
        return dbConfig;
      },
    }),
  ],
  controllers: [],
  providers: [DatabaseInitService], // Ensure DatabaseInitService is included
})
export class AppModule {}

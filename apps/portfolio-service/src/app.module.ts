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
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = buildDbConfig(
          (key) => configService.get(key),
          "DIFFUSION_SERVICE",
          __dirname,
        );
        console.log("Database Configuration:", dbConfig);
        return dbConfig;
      },
    }),
    ApiClientModule.register(),
    AuthPackageModule.forRoot(),
  ],
  controllers: [],
  providers: [DatabaseInitService],
})
export class AppModule {}

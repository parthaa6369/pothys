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
          "DOCUMENT_SERVICE",
          __dirname,
        );
        console.log("Database Configuration:", dbConfig);
        return dbConfig;
      },
    }),
    AuthPackageModule.forRoot(),
  ],
  controllers: [],
  providers: [DatabaseInitService],
})
export class AppModule {}

import { DynamicModule, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtStrategy } from "./strategies/jwt.strategy";

export interface AuthPackageOptions {
  jwtExpiresIn?: string;
}

@Module({})
export class AuthPackageModule {
  static forRoot(options?: AuthPackageOptions): DynamicModule {
    return {
      module: AuthPackageModule,
      imports: [
        PassportModule,
        JwtModule.registerAsync({
          useFactory: async (configService: ConfigService) => {
            const jwtSecret = configService.get<string>("JWT_SECRET");
            if (!jwtSecret) {
              throw new Error("JWT_SECRET is not configured");
            }
            const decodedSecret = Buffer.from(jwtSecret, "base64").toString(
              "utf-8",
            );
            return {
              secret: decodedSecret,
              signOptions: { expiresIn: options?.jwtExpiresIn || "24h" },
            };
          },
          inject: [ConfigService],
        }),
      ],
      providers: [JwtStrategy],
      exports: [JwtModule, PassportModule],
      global: true,
    };
  }
}

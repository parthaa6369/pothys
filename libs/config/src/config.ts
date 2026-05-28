import { ConfigService } from "@nestjs/config";

const configService = new ConfigService();

export const config = (key: string): string | undefined => {
  return configService.get<string>(key);
};

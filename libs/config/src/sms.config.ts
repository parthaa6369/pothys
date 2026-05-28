import { ConfigService } from "@nestjs/config";

export interface SmsConfig {
  username: string;
  password: string;
  baseUrl: string;
  restApiUrl: string;
  defaultSenderId: string;
  agreeTerm: string;
  enabled: boolean;
}

export const createSmsConfig = (configService: ConfigService): SmsConfig => ({
  username: configService.get<string>("ISMS_USERNAME", ""),
  password: configService.get<string>("ISMS_PASSWORD", ""),
  baseUrl: configService.get<string>(
    "ISMS_BASE_URL",
    "https://www.isms.com.my/isms_send_all_id.php",
  ),
  restApiUrl: configService.get<string>(
    "ISMS_REST_API_URL",
    "https://www.isms.com.my/RESTAPI.php",
  ),
  defaultSenderId: configService.get<string>("ISMS_SENDER_ID", "ASB"),
  agreeTerm: configService.get<string>("ISMS_AGREE_TERM", "YES"),
  enabled: configService.get<boolean>("SMS_ENABLED", false),
});

export const SMS_ENV_VARIABLES = {
  ISMS_USERNAME: "Your ISMS account username",
  ISMS_PASSWORD: "Your ISMS account password",
  ISMS_BASE_URL: "ISMS HTTP GET API endpoint (optional)",
  ISMS_REST_API_URL: "ISMS REST API endpoint (optional)",
  ISMS_SENDER_ID: "Default sender ID (3-14 characters)",
  ISMS_AGREE_TERM: "Agreement to ISMS terms (YES/NO)",
  SMS_ENABLED: "Enable/disable SMS functionality (true/false)",
};

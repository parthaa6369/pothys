import { ApiOperation } from "@pothys/swagger-base";
import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiOperation({ summary: "Health Check" })
  @Get("healthCheck")
  healthCheck(): string {
    return "All Good now";
  }
}

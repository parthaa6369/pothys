import { ApiPropertyOptional } from "@pothys/swagger-base";
import { DashboardAnalyticsFilter } from "@pothys/type-kit";
import { IsEnum, IsOptional } from "class-validator";

export class DashboardDto {
  @ApiPropertyOptional({ nullable: true, enum: DashboardAnalyticsFilter })
  @IsEnum(DashboardAnalyticsFilter)
  @IsOptional()
  dashboardAnalyticsFilter?: DashboardAnalyticsFilter;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  customStartDate?: string;

  @ApiPropertyOptional({ nullable: true })
  @IsOptional()
  customEndDate?: string;
}

import { ApiProperty, ApiPropertyOptional } from "@pothys/swagger-base";
import { Order } from "@pothys/type-kit";
import { Logger } from "@nestjs/common";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";

/**
 * @description Metadata for paginated responses, including page info and navigation flags.
 */
export class PageMetaDto {
  @ApiProperty()
  readonly page: number | undefined;

  @ApiProperty()
  readonly take: number | undefined;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  /**
   * @description Constructs PageMetaDto from pagination options and item count.
   * @param pageOptionsDto Pagination options
   * @param itemCount Total number of items
   */
  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    Logger.log("PageMetaDto constructor called with:", {
      pageOptionsDto,
      itemCount,
    });
    this.page = pageOptionsDto.page;
    this.take = pageOptionsDto.take;
    if (this.take) {
      this.page = pageOptionsDto.page ?? 1;
      this.take = pageOptionsDto.take ?? 10;
      this.itemCount = itemCount;
      this.pageCount = Math.ceil(this.itemCount / this.take);
      this.hasPreviousPage = this.page > 1;
      this.hasNextPage = this.page < this.pageCount;
    } else {
      this.page = 1;
      this.take = itemCount;
      this.itemCount = itemCount;
      this.pageCount = 1;
      this.hasPreviousPage = false;
      this.hasNextPage = false;
    }
  }
}

/**
 * @description Generic paginated response wrapper with data and meta.
 * @template T The type of data in the page.
 */
export class PageDto<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  /**
   * @description Constructs a PageDto with data and meta.
   * @param data The array of items for the current page
   * @param meta The pagination metadata
   */
  constructor(data: T[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}

/**
 * @description Parameters for constructing PageMetaDto.
 */
export interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}

/**
 * @description Pagination options for API requests, including order, page, and take.
 */
export class PageOptionsDto {
  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 1000,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(1000)
  @IsOptional()
  readonly take?: number;

  /**
   * @description Calculates the number of items to skip for pagination.
   * @returns The offset for the current page
   */
  get skip(): number {
    const page = this.page ?? 1;
    const take = this.take ?? 10;
    return (page - 1) * take;
  }
}

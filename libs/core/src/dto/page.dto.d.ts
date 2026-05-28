import { Order } from "@pothys/type-kit";
export declare class PageMetaDto {
  readonly page: number;
  readonly take: number;
  readonly itemCount: number;
  readonly pageCount: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;
  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters);
}
export declare class PageDto<T> {
  readonly data: T[];
  readonly meta: PageMetaDto;
  constructor(data: T[], meta: PageMetaDto);
}
export interface PageMetaDtoParameters {
  pageOptionsDto: PageOptionsDto;
  itemCount: number;
}
export declare class PageOptionsDto {
  readonly order?: Order;
  readonly page?: number;
  readonly take?: number;
  get skip(): number;
}

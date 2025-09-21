import { IsArray } from "class-validator";
import { PageOptionsDto } from "./page-options.dto";

export class PageDto<T> {
    @IsArray()
    readonly data: T[];

    readonly meta: PageMetaDto;

    constructor(data: T[], meta: PageMetaDto) {
        this.data = data.map((d, i) => ({ ...d, sequence: (((meta.page - 1) * meta.take)) + i + 1 }));
        this.meta = meta;
    }
}

export class PageMetaDto {
    readonly page: number;

    readonly take: number;

    readonly itemCount: number;

    readonly pageCount: number;

    readonly hasPreviousPage: boolean;

    readonly hasNextPage: boolean;

    constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
        this.page = pageOptionsDto.page;
        this.take = pageOptionsDto.take;
        this.itemCount = itemCount;
        this.pageCount = Math.ceil(this.itemCount / this.take);
        this.hasPreviousPage = this.page > 1;
        this.hasNextPage = this.page < this.pageCount;
    }
}

export interface PageMetaDtoParameters {
    pageOptionsDto: PageOptionsDto;
    itemCount: number;
}
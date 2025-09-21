import { Transform } from "class-transformer";
import { IsArray, IsOptional } from "class-validator";
import { ProjectStatus } from "../entities/project.entity";

export class FilterProjectDto {

    @IsArray()
    @IsOptional()
    @Transform(({ value }) => value.map(Number))
    parrishId?: number[];

    @IsOptional()
    @Transform(({ value }) => value.map(Number))
    municipalityId?: number[];

    @IsOptional()
    isArchived?: boolean;

    @IsOptional()
    isParalyzed?: boolean;

    @IsArray()
    @IsOptional()
    name?: string;

    @IsArray()
    @IsOptional()
    status?: ProjectStatus[];

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => value.map(Number))
    year?: number[];

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => value.map(Number))
    categoryId?: number[];

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => value.map(Number))
    areaId?: number[];

    @IsOptional()
    gobernador?: boolean;

    @IsOptional()
    order_pc?: 'asc' | 'desc';

}

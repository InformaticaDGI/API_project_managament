import { Transform } from "class-transformer";
import { IsArray, IsOptional } from "class-validator";

export class FilterCompromisesDto {

    @IsArray()
    @IsOptional()
    @Transform(({ value }) => value.map(Number))
    parrishId?: number[];

    @IsOptional()
    @Transform(({ value }) => value.map(Number))
    municipalityId?: number[];

    @IsArray()
    @IsOptional()
    name?: string;

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => value.map(Number))
    areaId?: number[];

    @IsArray()
    @IsOptional()
    status?: string[];

    @IsArray()
    @IsOptional()
    year?: number[];


}

import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUpdateDto {
    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    date: Date;

    @IsNumber()
    progress: number;

    @IsBoolean()
    gobernador: boolean;

    @IsBoolean()
    supply: boolean;

}

import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumberString, IsOptional, IsString } from "class-validator";
export class CreateCompromiseDto {
    @IsString()
    @ApiProperty({
        description: 'The name of the compromise',
        example: 'Compromise 1'
    })
    name: string;

    @IsString()
    @IsOptional()
    sector: string;

    @IsNumberString()
    areaId: number;

    @IsNumberString()
    parrishId: number;

    @IsNumberString()
    @IsOptional()
    amount: string;

    @IsOptional()
    @IsBoolean()
    bricomiles_salud: boolean;

    @IsOptional()
    @IsBoolean()
    bricomiles_educacion: boolean;

    @IsOptional()
    @IsBoolean()
    nacional: boolean;
}

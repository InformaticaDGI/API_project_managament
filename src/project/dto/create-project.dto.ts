import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNumber, IsNumberString, IsOptional, isString, IsString } from "class-validator";

export class CreateProjectDto {
    @IsString()
    @ApiProperty({
        description: 'The name of the project',
        example: 'Project 1'
    })
    name: string;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'The description of the project',
        example: 'This is a project description'
    })
    sector: string;

    @IsNumber()
    @ApiProperty({
        description: 'The id of the area',
        example: 1
    })
    areaId: number;

    @IsString()
    @IsOptional()
    @ApiProperty({
        description: 'The entity responsible for the project',
        example: 'Construvialgua'
    })
    ente: string

    @IsString()
    @ApiProperty({
        description: 'The status of the project',
        example: 'started'
    })
    status: 'started' | 'completed' | 'not_started';

    @IsOptional()
    @IsNumberString()
    @ApiProperty({
        description: 'The amount of the project',
        example: '100000'
    })
    amount?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Descripcion del proyecto',
    })
    description?: string;

    @IsOptional()
    @IsNumberString()
    @ApiProperty({
        description: 'The amount of the project in USD',
        example: '100000'
    })
    amountUsd?: string;

    @IsOptional()
    @IsDateString()
    @ApiProperty({
        description: 'The start date of the project',
        example: '2021-01-01'
    })
    startDate?: Date;

    @IsOptional()
    @IsDateString()
    @ApiProperty({
        description: 'The end date of the project',
        example: '2022-01-01'
    })
    endDate?: Date;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'The source of funding for the project',
        example: 'F.C.I'
    })
    fundingSource?: string;

    @IsNumber()
    @ApiProperty({
        description: 'The id of the parrish',
        example: 1
    })
    parrishId: number;

    @IsOptional()
    @IsNumber()
    @ApiProperty({
        description: 'The year the project ended',
        example: 2022
    })
    year?: number;

    @IsNumber()
    @ApiProperty({
        description: 'The id of the compromise',
        example: 1
    })
    @IsOptional()
    compromiseId?: number;
}

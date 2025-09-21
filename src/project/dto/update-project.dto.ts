import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    sector: string;

    @IsNumber()
    @ApiProperty({
        description: 'The id of the area',
        example: 1
    })
    areaId: number;

    @IsString()
    @IsOptional()
    ente: string

    @IsString()
    status: 'started' | 'completed' | 'not_started';

    @IsOptional()
    @IsString()
    fundingSource?: string;

    @IsNumber()
    parrishId: number;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Descripcion del proyecto',
    })
    description?: string;

    @IsOptional()
    @IsNumber()
    year?: number;

    @IsNumber()
    @ApiProperty({
        description: 'The id of the compromise',
        example: 1
    })
    @IsOptional()
    compromiseId?: number;
}

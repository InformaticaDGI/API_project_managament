import { PartialType } from '@nestjs/mapped-types';
import { CreateCompromiseDto } from './create-compromise.dto';
import { IsBoolean, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';

export class UpdateCompromiseDto extends PartialType(CreateCompromiseDto) {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    sector: string;

    @IsNumber()
    areaId: number;

    @IsNumber()
    parrishId: number;

    @IsOptional()
    @IsNumberString()
    amount?: string;
    
    @IsNumber()
    @IsOptional()
    progress?: number;

    @IsOptional()
    @IsBoolean()
    supply?: boolean;


}

import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAgendaForActivityDto {

    @IsDateString()
    date: Date;

    @IsBoolean()
    @IsOptional()
    done?: boolean;

    @IsNumber()
    activityId: number;

    @IsOptional()
    @IsString()
    title?: string;
}

import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAgendaForProjectDto {

    @IsDate()
    @Type(() => Date)
    date: Date;
    
    @IsNumber()
    projectId: number;
    
    @IsOptional()
    @IsString()
    title?: string;
   
    @IsBoolean()
    @IsOptional()
    done?: boolean;
}

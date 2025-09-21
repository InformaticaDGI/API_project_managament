import { Areas } from "src/activity/dto/create-activity.dto";

export class CreateForeignActivityDto {
    area: Areas[];
    ente: string[]
    stateId: number;
    date: Date;
    type: 'estadal' | 'municipal';
    name?: string;
}

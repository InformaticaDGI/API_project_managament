import { PartialType } from '@nestjs/swagger';
import { CreateAgendaForProjectDto } from './create-agenda-for-project.dto';

export class UpdateAgendaDto extends PartialType(CreateAgendaForProjectDto) {}

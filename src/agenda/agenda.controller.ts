import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { CreateAgendaForActivityDto } from './dto/create-agenda-for-activity.dto';
import { CreateAgendaForProjectDto } from './dto/create-agenda-for-project.dto';

@Controller('agenda')
export class AgendaController {
  constructor(
    private readonly agendaService: AgendaService,
  ) { }

  @Post('project')
  createForProject(@Body() createAgendaDto: CreateAgendaForProjectDto) {
    return this.agendaService.createForProject(createAgendaDto);
  }

  @Post('activity')
  createForActivity(@Body() createAgendaDto: CreateAgendaForActivityDto) {
    return this.agendaService.createForAgenda(createAgendaDto);
  }

  @Get('week/:start/:end')
  getWeekAgendas(
    @Param('start', {
      transform: (value) => {
        return new Date(value);
      },
    })
    start: Date,
    @Param('end', {
      transform(value) {
        return new Date(value);
      },
    })
    end: Date
  ) {
    return this.agendaService.getWeekAgendas(
      new Date(start),
      new Date(end)
    );
  }

  @Get()
  findAll() {
    return this.agendaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agendaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgendaDto: UpdateAgendaDto) {
    return this.agendaService.update(+id, updateAgendaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agendaService.remove(+id);
  }
}

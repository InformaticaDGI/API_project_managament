import { Injectable } from '@nestjs/common';
import { UpdateAgendaDto } from './dto/update-agenda.dto';
import { CreateAgendaForActivityDto } from './dto/create-agenda-for-activity.dto';
import { CreateAgendaForProjectDto } from './dto/create-agenda-for-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Agenda } from './entities/agenda.entity';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class AgendaService {

  constructor(
    @InjectRepository(Agenda)
    private agendaRepository: Repository<Agenda>,
    private readonly projectService: ProjectService
  ) { }

  createForAgenda(createAgendaDto: CreateAgendaForActivityDto) {
    return this.agendaRepository.save(createAgendaDto);
  }

  async createForProject(createAgendaDto: CreateAgendaForProjectDto) {

    const project = await this.projectService.findOne(createAgendaDto.projectId);

    if (!project) throw new Error('Project not found');

    delete createAgendaDto.projectId;

    return this.agendaRepository.save({
      ...createAgendaDto,
      project: {
        id: project.id
      }
    });
  }

  findAll() {
    return this.agendaRepository.find();
  }

  findOne(id: number) {
    return this.agendaRepository.findOne({
      where: { id }
    });
  }

  update(id: number, updateAgendaDto: UpdateAgendaDto) {
    return this.agendaRepository.update(id, updateAgendaDto);
  }

  getWeekAgendas(start: Date, end: Date) {
    return this.agendaRepository.find({
      where: {
        date: Between(start, end)
      },
      relations: {
        project: {
          parrish: {
            municipality: true
          }
        }
      }
    });

  }

  remove(id: number) {
    return this.agendaRepository.delete(id);
  }
}

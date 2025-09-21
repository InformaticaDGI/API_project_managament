import { Module } from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { AgendaController } from './agenda.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Agenda } from './entities/agenda.entity';
import { Project } from 'src/project/entities/project.entity';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Agenda
    ]),
    ProjectModule,
  ],
  controllers: [AgendaController],
  providers: [
    AgendaService,
    {
      provide: 'MomentWrapper',
      useValue: require('moment')
    }
  ],
})
export class AgendaModule { }

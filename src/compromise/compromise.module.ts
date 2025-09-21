import { Module } from '@nestjs/common';
import { CompromiseService } from './compromise.service';
import { CompromiseController } from './compromise.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Compromise } from './entities/compromise.entity';
import { Area } from 'src/area/entities/area.entity';
import { Parrish } from 'src/parrish/entities/parrish.entity';
import { Project } from 'src/project/entities/project.entity';
import { Municipality } from 'src/municipality/entities/municipality.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Compromise, Area, Parrish, Project, Municipality])],
  controllers: [CompromiseController],
  providers: [CompromiseService],
})
export class CompromiseModule { }

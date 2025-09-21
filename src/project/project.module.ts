import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Parrish } from 'src/parrish/entities/parrish.entity';
import { Category } from 'src/category/entities/category.entity';
import { join } from 'path';
import { Area } from 'src/area/entities/area.entity';
import { Compromise } from 'src/compromise/entities/compromise.entity';
import { Update } from 'src/updates/entities/update.entity';
import { Municipality } from 'src/municipality/entities/municipality.entity';
import { ComponentService } from './component/component.service';
const PdfPrinter = require('pdfmake');

@Module({
  imports: [TypeOrmModule.forFeature([Project, Parrish, Category, Area, Compromise, Update, Municipality])],
  controllers: [ProjectController],
  providers: [
    ProjectService,
    {
      provide: 'PdfPrinter',
      useFactory: () => new PdfPrinter({
        Roboto: {
          normal: join(__dirname, '..', '..', 'src', 'fonts', 'Roboto', 'Roboto-Regular.ttf'),
          bold: join(__dirname, '..', '..', 'src', 'fonts', 'Roboto', 'Roboto-Bold.ttf'),
          italics: join(__dirname, '..', '..', 'src', 'fonts', 'Roboto', 'Roboto-Italic.ttf'),
          bolditalics: join(__dirname, '..', '..', 'src', 'fonts', 'Roboto', 'Roboto-BoldItalic.ttf'),
        }
      }),
    },
    ComponentService],
  exports: [ProjectService]
})
export class ProjectModule { }

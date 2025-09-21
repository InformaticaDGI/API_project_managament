import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ProjectModule } from 'src/project/project.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ProjectModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule { }

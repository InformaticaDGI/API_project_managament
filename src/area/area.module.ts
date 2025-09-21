import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Area } from './entities/area.entity';
import { Compromise } from 'src/compromise/entities/compromise.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Area, Compromise]),
  ],
  controllers: [AreaController],
  providers: [AreaService],
  exports: [AreaService]
})
export class AreaModule { }

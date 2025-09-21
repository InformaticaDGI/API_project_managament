import { Module } from '@nestjs/common';
import { MunicipalityService } from './municipality.service';
import { MunicipalityController } from './municipality.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Municipality } from './entities/municipality.entity';
import { Parrish } from 'src/parrish/entities/parrish.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Municipality, Parrish]),
  ],
  controllers: [MunicipalityController],
  providers: [MunicipalityService],
  exports: [MunicipalityService]
})
export class MunicipalityModule { }

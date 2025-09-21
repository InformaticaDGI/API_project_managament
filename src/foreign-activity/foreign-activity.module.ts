import { Module } from '@nestjs/common';
import { ForeignActivityService } from './foreign-activity.service';
import { ForeignActivityController } from './foreign-activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForeignActivity } from './entities/foreign-activity.entity';
import State from 'src/state/entities/state.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ForeignActivity, State])],
  controllers: [ForeignActivityController],
  providers: [ForeignActivityService],
})
export class ForeignActivityModule { }

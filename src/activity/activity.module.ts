import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parrish } from 'src/parrish/entities/parrish.entity';
import { Activity } from './entities/activity.entity';
import { Municipality } from 'src/municipality/entities/municipality.entity';
import State from 'src/state/entities/state.entity';
import { ForeignActivity } from 'src/foreign-activity/entities/foreign-activity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parrish, Activity, Municipality, State, ForeignActivity])],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule { }

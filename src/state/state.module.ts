import { Module } from '@nestjs/common';
import { StateService } from './state.service';
import { StateController } from './state.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import State from './entities/state.entity';
import { ForeignActivity } from 'src/foreign-activity/entities/foreign-activity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([State, ForeignActivity])
  ],
  controllers: [StateController],
  providers: [StateService],
})
export class StateModule { }

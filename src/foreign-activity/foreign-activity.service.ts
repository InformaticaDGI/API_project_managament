import { Injectable } from '@nestjs/common';
import { CreateForeignActivityDto } from './dto/create-foreign-activity.dto';
import { UpdateForeignActivityDto } from './dto/update-foreign-activity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ForeignActivity } from './entities/foreign-activity.entity';
import { Repository } from 'typeorm';
import State from 'src/state/entities/state.entity';
import { PageOptionsDto } from 'src/common/page-options.dto';
import { PageDto, PageMetaDto } from 'src/common/page.dto';
import { FilterProjectDto } from 'src/project/dto/filter-projects.dto';
import { activityFilter } from 'src/helpers/filterHelper';

@Injectable()
export class ForeignActivityService {

  constructor(
    @InjectRepository(ForeignActivity)
    private readonly activityRepository: Repository<ForeignActivity>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>
  ) { }

  async create(createForeignActivityDto: CreateForeignActivityDto) {
    const state = await this.stateRepository.findOne({ where: { id: createForeignActivityDto.stateId } })
    await this.activityRepository.save({
      ...createForeignActivityDto,
      state,
      area: createForeignActivityDto.area ? `{${createForeignActivityDto.area.join(',')}}` as unknown as any : '{}',
      ente: createForeignActivityDto.ente ? `{${createForeignActivityDto.ente.join(',')}}` as unknown as any : '{}',
    })
  }

  async findAll(params: PageOptionsDto & FilterProjectDto) {
    const where = activityFilter(params);
    const activities = await this.activityRepository.find({
      where,
      relations: {
        state: true
      },
      order: {
        date: 'DESC'
      },
      take: params.take,
      skip: params.skip
    })
    const itemCount = await this.activityRepository.count({ where })
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: params });
    return new PageDto(activities, pageMetaDto);
  }

  findOne(id: number) {
    return this.activityRepository.findOne({
      where: {
        id
      },
      relations: {
        state: true
      }
    })
  }

  async update(id: number, updateForeignActivityDto: UpdateForeignActivityDto) {
    const state = await this.stateRepository.findOne({ where: { id: +updateForeignActivityDto.stateId } })
    delete updateForeignActivityDto.stateId
    await this.activityRepository.update({ id }, {
      ...updateForeignActivityDto,
      state,
      area: updateForeignActivityDto.area ? `{${updateForeignActivityDto.area.join(',')}}` as unknown as any : '{}',
      ente: updateForeignActivityDto.ente ? `{${updateForeignActivityDto.ente.join(',')}}` as unknown as any : '{}',
    })
  }

  remove(id: number) {
    return this.activityRepository.delete(id)
  }
}

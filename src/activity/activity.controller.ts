import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { Areas, CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PageOptionsDto } from 'src/common/page-options.dto';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) { }

  @Post()
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activityService.create(createActivityDto);
  }

  @Get('statistics')
  getStatistics(@Query() params?: { year?: number }) {
    return this.activityService.getStatistics(params.year);
  }

  @Get()
  findAll(@Query() params?: PageOptionsDto) {
    return this.activityService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activityService.findOne(+id);
  }

  @Get('area/:areaId')
  findByArea(@Param('areaId') areaId: Areas) {
    return this.activityService.findAllByArea(areaId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActivityDto: UpdateActivityDto) {
    return this.activityService.update(+id, updateActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activityService.remove(+id);
  }

}

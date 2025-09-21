import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ForeignActivityService } from './foreign-activity.service';
import { CreateForeignActivityDto } from './dto/create-foreign-activity.dto';
import { UpdateForeignActivityDto } from './dto/update-foreign-activity.dto';
import { PageOptionsDto } from 'src/common/page-options.dto';

@Controller('foreign-activity')
export class ForeignActivityController {
  constructor(private readonly foreignActivityService: ForeignActivityService) { }

  @Post()
  create(@Body() createForeignActivityDto: CreateForeignActivityDto) {
    return this.foreignActivityService.create(createForeignActivityDto);
  }

  @Get()
  findAll(
    @Query() params: PageOptionsDto
  ) {
    return this.foreignActivityService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foreignActivityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateForeignActivityDto: UpdateForeignActivityDto) {
    return this.foreignActivityService.update(+id, updateForeignActivityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foreignActivityService.remove(+id);
  }
}

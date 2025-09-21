import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompromiseService } from './compromise.service';
import { CreateCompromiseDto } from './dto/create-compromise.dto';
import { UpdateCompromiseDto } from './dto/update-compromise.dto';
import { PageOptionsDto } from 'src/common/page-options.dto';

@Controller('compromise')
export class CompromiseController {
  constructor(private readonly compromiseService: CompromiseService) { }

  @Post()
  create(@Body() createCompromiseDto: CreateCompromiseDto) {
    return this.compromiseService.create(createCompromiseDto);
  }

  @Get()
  findAll(
    @Query() params?: PageOptionsDto,
  ) {
    return this.compromiseService.findAll(params);
  }

  @Get('nacional')
  findNacionales(
    @Query() params?: PageOptionsDto,
  ) {
    return this.compromiseService.findNacionales(params);
  }


  @Get('bricomiles-salud')
  findAllBricomilesSalud(
    @Query() params?: PageOptionsDto,
  ) {
    return this.compromiseService.findBricomilesSalud(params);
  }

  @Get('bricomiles-educacion')
  findAllBricomilesEducacion(
    @Query() params?: PageOptionsDto,
  ) {
    return this.compromiseService.findBricomilesEducacion(params);
  }

  @Get('consultas')
  findAllConsultas(
    @Query() params?: PageOptionsDto,
  ) {
    return this.compromiseService.findAllConsultas(params);
  }

  @Get('statistics')
  getStatistics(
    @Query() params?: { compromiseType: 'consulta' | 'gobernador' | 'bricomiles_salud' | 'bricomiles_educacion' | 'nacional', year?: number }
  ) {
    return this.compromiseService.getStatistics(params.compromiseType, params.year);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.compromiseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompromiseDto: UpdateCompromiseDto) {
    return this.compromiseService.update(+id, updateCompromiseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.compromiseService.remove(+id);
  }
}

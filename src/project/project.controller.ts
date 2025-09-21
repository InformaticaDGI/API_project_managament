import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res, HttpException } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PageOptionsDto } from 'src/common/page-options.dto';
import { FilterProjectDto } from './dto/filter-projects.dto';
import { Response } from 'express';
import { CreateUpdateDto } from 'src/updates/dto/create-update.dto';
import { ComponentService } from './component/component.service';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly componentService: ComponentService
  ) { }

  @Get('components')
  getComponents(
    @Query() params?: {
      startDate: string,
      endDate: string,
      dateRangeType: 'bimester' | 'semester' | 'year',
    },
  ) {
    return this.componentService.getIpc(params.startDate, params.endDate, params.dateRangeType);
  }

  @Post()
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(createProjectDto);
  }

  @Post('seed-pc-total')
  seedPcTotal() {
    return this.projectService.seedPcTotal();
  }

  @Post('seed-prt-total')
  seedPrt() {
    return this.projectService.seedPrtTotal();
  }

  @Post(':id/update')
  addUpdate(
    @Param('id') id: string,
    @Body() update: CreateUpdateDto,
  ) {
    return this.projectService.addUpdate(+id, update);
  }

  @Post(':id/archive')
  archive(@Param('id') id: string) {
    return this.projectService.archive(+id);
  }

  @Post(':id/unarchive')
  unarchive(@Param('id') id: string) {
    return this.projectService.unarchive(+id);
  }

  @Get('statistics')
  getStatistics(@Query() params: { year?: number, isArchived?: boolean }) {
    return this.projectService.getStatistics(params.year, params.isArchived);
  }

  @Get('archived')
  getArchived(
    @Query() params?: PageOptionsDto,
  ) {
    return this.projectService.getArchived(params);
  }

  @Get('export-agenda')
  async exportAgenda(
    @Res() res: Response,
  ) {
    const pdf = await this.projectService.exportPdfAgendaProjects();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=agenda.pdf');
    pdf.pipe(res);
    pdf.end();
  }

  @Get('export')
  async export(
    @Res() res: Response,
    @Query() params?: FilterProjectDto,
  ) {
    const pdf = await this.projectService.exportPdf(params);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=projects.pdf');
    pdf.pipe(res);
    pdf.end();
  }

  @Get()
  findAll(
    @Query() params?: PageOptionsDto,
  ) {
    return this.projectService.findAllProjects(params);
  }

  @Patch(':projectId/update-ps')
  updatePs(
    @Param('projectId') projectId: string,
    @Body() body: { ps: number }
  ) {
    return this.projectService.updatePs(projectId, body.ps)
  }

  @Get('compromises')
  getCompromises(
    @Query() params?: PageOptionsDto,
  ) {
    return this.projectService.findAllCompromises(params);
  }

  @Get('compromises/:id')
  getCompromise(@Param('id') id: string) {
    return this.projectService.findCompromise(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(':id/image/:image')
  removeImage(@Param('id') id: string, @Param('image') image: string) {
    return this.projectService.removeImage(+id, image);
  }

  @Delete('update/:id')
  removeUpdate(@Param('id') id: string) {
    return this.projectService.removeUpdate(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }

}
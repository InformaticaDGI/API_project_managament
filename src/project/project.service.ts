import { HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
import { DataSource, Not, Raw, Repository } from 'typeorm';
import { Parrish } from 'src/parrish/entities/parrish.entity';
import { FilterProjectDto } from './dto/filter-projects.dto';
import { projectFilter } from 'src/helpers/filterHelper';
import { PageOptionsDto } from 'src/common/page-options.dto';
import { PageDto, PageMetaDto } from 'src/common/page.dto';
import PdfPrinter from 'pdfmake';
import { Area } from 'src/area/entities/area.entity';
import { CreateUpdateDto } from 'src/updates/dto/create-update.dto';
import { Update } from 'src/updates/entities/update.entity';
import { Compromise } from 'src/compromise/entities/compromise.entity';
import { ConfigService } from '@nestjs/config';
import { Municipality } from 'src/municipality/entities/municipality.entity';
import { sortObjectByValue } from 'src/helpers/sortObject';
import * as moment from 'moment';

@Injectable()
export class ProjectService {

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Parrish)
    private readonly parrishRepository: Repository<Parrish>,
    @InjectRepository(Municipality)
    private readonly municipalityRepository: Repository<Municipality>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
    @InjectRepository(Update)
    private readonly updateRepository: Repository<Update>,
    @InjectRepository(Compromise)
    private readonly compromiseRepository: Repository<Compromise>,
    @Inject('PdfPrinter')
    private readonly pdfPrinter: PdfPrinter,
    private readonly configService: ConfigService,
    private dataSource: DataSource,
  ) { }

  async create(createProjectDto: CreateProjectDto) {

    const area = await this.areaRepository.findOne({ where: { id: createProjectDto.areaId } });
    const parrish = await this.parrishRepository.findOne({ where: { id: createProjectDto.parrishId } });
    const compromise = await this.compromiseRepository.findOne({ where: { id: createProjectDto.compromiseId } });

    const createdProject = await this.projectRepository.save({
      ...createProjectDto,
      area,
      parrish,
      compromise,
    });
    return createdProject;
  }

  removeImage(id: number, image: string) {
    const hostUrl = this.configService.get('HOST_URL')
    const path = `${hostUrl}/api/files/project/${image}`;
    return this.projectRepository.update(id, { images: () => `array_remove(images, '${path}')` });
  }

  findCompromise(id: number) {
    return this.projectRepository.findOne({
      where: {
        id,
        status: 'compromise'
      },
      relations: {
        parrish: {
          municipality: true
        },
        area: true
      }
    });
  }

  async findAllCompromises(
    params: PageOptionsDto & FilterProjectDto,
  ): Promise<PageDto<Project>> {
    const { where, order } = projectFilter(params);
    const projects = await this.projectRepository.find({
      where: {
        ...where,
        status: 'compromise'
      },
      relations: {
        parrish: {
          municipality: true
        },
        area: true,
      },
      order,
      take: params.take,
      skip: params.skip
    });

    const itemCount = await this.projectRepository.count({
      where: {
        ...where,
        status: 'compromise'
      }
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: params });

    return new PageDto(projects, pageMetaDto);
  }

  async findAllProjects(params?: PageOptionsDto & FilterProjectDto) {
    const { where, order } = projectFilter(params);
    const projects = await this.projectRepository.find({
      where: {
        status: Not('compromise'),
        ...where,
        isArchived: false
      },
      relations: {
        parrish: {
          municipality: true
        },
        area: true,
        updates: true,
        agendas: true,
      },
      order,
      take: params.take,
      skip: params.skip,
    });

    const itemCount = await this.projectRepository.count({
      where: {
        status: Not('compromise'),
        ...where,
        isArchived: false
      }
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: params });

    const dto = projects.map(p => p.toResponseDTO());
    dto.sort((a, b) => a.progress - b.progress);

    return new PageDto(dto, pageMetaDto);

  }

  async findAll(params?: FilterProjectDto) {
    const { where, order } = projectFilter(params);
    const projects = await this.projectRepository.find({
      where,
      relations: {
        parrish: {
          municipality: true,
        },
        area: true,
        agendas: true,
      },
      order,
    });

    return projects
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: {
        id,
        status: Not('compromise')
      },
      relations: {
        parrish: {
          municipality: true,
        },
        area: true,
        updates: true,
        agendas: true
      }
    });
    if (!project) throw new HttpException('Proyecto no encontrado', 404);
    return project.toResponseDTO();
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {

    const area = updateProjectDto.areaId && await this.areaRepository.findOne({ where: { id: updateProjectDto.areaId } });
    const compromise = updateProjectDto.compromiseId && await this.compromiseRepository.findOne({ where: { id: updateProjectDto.compromiseId } });
    const parr = updateProjectDto.parrishId && await this.parrishRepository.findOne({ where: { id: updateProjectDto.parrishId } });

    delete updateProjectDto.areaId;
    delete updateProjectDto.compromiseId;
    delete updateProjectDto.parrishId;

    return this.projectRepository.update(id, {
      ...updateProjectDto,
      area,
      compromise,
      parrish: parr,
    });
  }

  async updatePs(projectId: string, ps: number) {
    if (ps > 3 || ps < 0) throw new HttpException('PS debe tener un valor entre 0 y 3', 400);
    const project = await this.projectRepository.update(projectId, {
      ps,
    })
    project
  }

  async getArchived(params: PageOptionsDto & FilterProjectDto,) {

    const { where, order } = projectFilter(params);

    const projects = await this.projectRepository.find({
      relations: {
        area: true,
        parrish: {
          municipality: true
        },
        updates: true,
      },
      where: {
        ...where,
        isArchived: true,
      },
      order,
      take: params.take,
      skip: params.skip
    })

    const itemCount = await this.projectRepository.count({
      where: {
        isArchived: true,
        ...where,
      }
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: params });

    return new PageDto(projects.map(p => p.toResponseDTO()), pageMetaDto);
  }

  async remove(id: number) {
    const project = await this.projectRepository
      .findOne({
        where: { id },
        relations: {
          updates: true
        }
      })

    if (project.updates.length > 0) {
      throw new HttpException('El proyecto tiene actualizaciones, no puede ser borrado.', 400);
    }

    return this.projectRepository.delete(id);
  }

  addImages(id: number, images: string[]) {
    return this.projectRepository.update(id, { images: () => `array_cat(images, '{${images.join(',')}}')` });
  }

  async addUpdate(id: number, update: CreateUpdateDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.startTransaction();
      const project = await this.projectRepository.findOne({
        where: { id },
        relations: {
          updates: true
        }
      });

      if (!project) throw new HttpException('Proyecto no encontrado', 404);

      const lastUpdate = project.updates.length > 0 && project.updates[project.updates.length - 1];
      if (lastUpdate) {
        if (lastUpdate.progress >= update.progress) {
          throw new HttpException('El progreso de la actualización debe ser mayor al de la última actualización', 400);
        }
      }

      const createdUpdate = await this.updateRepository.save({
        ...update,
        project,
      });

      await this.updateProjectProgress(project, createdUpdate);
      await queryRunner.commitTransaction();
      return createdUpdate;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  async removeUpdate(updateId: number) {

    const update = await this.updateRepository.findOne({
      where: { id: updateId },
      relations: {
        project: true
      }
    });

    const { project } = update;
    await this.updateRepository.delete(updateId);
    const lastUpdate = await this.updateRepository.findOne({
      where: { project: { id: project.id } },
      order: { id: 'DESC' }
    });

    if (!lastUpdate) {
      await this.projectRepository.update(project.id, {
        status: ProjectStatus.STARTED,
        pc: () => `'{-1,-1,-1}'`,
        prt: 0,
        supply: false
      });
      return
    }
    project.updatePcTotal();
    await this.updateProjectProgress(project, lastUpdate);

  }

  async archive(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: { updates: true }
    });
    if (!project) throw new HttpException('Proyecto no encontrado', 404);

    if (project.updates.length === 0) throw new HttpException('El proyecto no tiene actualizaciones', 400);

    if (project.updates.sort((a, b) => a.progress - b.progress).at(-1).progress < 100) {
      throw new HttpException('El proyecto no esta al 100% de progreso. No se puede archivar.', 400);
    }

    return this.projectRepository.update(id, { isArchived: true });
  }

  async unarchive(id: number) {
    return this.projectRepository.update(id, { isArchived: false });
  }

  async exportPdfAgendaProjects() {

    const started = await this.projectRepository.find({
      where: {
        status: ProjectStatus.STARTED
      },
      order: {
        pcTotal: 'DESC'
      },
      relations: {
        parrish: {
          municipality: true
        },
        agendas: true,
        updates: true,
        area: true,
      }
    });

    const inProcess = await this.projectRepository.find({
      where: {
        status: ProjectStatus.IN_PROCESS
      },
      order: {
        pcTotal: 'DESC'
      },
      relations: {
        parrish: {
          municipality: true
        },
        agendas: true,
        updates: true,
        area: true,
      }
    });

    const completed = await this.projectRepository.find({
      where: {
        status: ProjectStatus.COMPLETED
      },
      order: {
        pcTotal: 'DESC'
      },
      relations: {
        parrish: {
          municipality: true
        },
        agendas: true,
        updates: true,
        area: true,
      }
    });

    const pdf = this.pdfPrinter.createPdfKitDocument({
      pageOrientation: 'landscape',
      content: [
        {
          text: 'Iniciados',
          style: 'subheader',
          background: '#fff7ed',
          color: 'yellow'
        },
        {
          fontSize: 10,
          table: {
            headerRows: 1,
            widths: ['45%', '15%', '15%', '15%', '10%'],
            body: [
              ['Nombre', 'Área', 'Municipio', 'Parroquia', 'Progreso'],
              ...started.map(project => [
                project.name,
                project.area?.name,
                project.parrish?.municipality?.name,
                project.parrish?.name,
                `${project.toResponseDTO().progress}%`
              ])
            ]
          }
        },
        {
          columnGap: 5,
          text: 'En Proceso',
          style: 'subheader',
          background: '#3b82f680',
          color: 'blue'
        },
        {
          fontSize: 10,
          table: {
            headerRows: 1,
            widths: ['45%', '15%', '15%', '15%', '10%'],
            body: [
              ['Nombre', 'Área', 'Municipio', 'Parroquia', 'Progreso'],
              ...inProcess.map(project => [
                project.name,
                project.area?.name,
                project.parrish?.municipality?.name,
                project.parrish?.name,
                `${project.toResponseDTO().progress}%`
              ])
            ]
          }
        },
        {
          text: 'Culminados',
          style: 'subheader',
          background: '#f0fdf4',
          color: 'green'
        },
        {
          fontSize: 10,
          table: {
            headerRows: 1,
            widths: ['45%', '15%', '15%', '15%', '10%'],
            body: [
              ['Nombre', 'Área', 'Municipio', 'Parroquia', 'Progreso'],
              ...completed.map(project => [
                project.name,
                project.area?.name,
                project.parrish?.municipality?.name,
                project.parrish?.name,
                `${project.toResponseDTO().progress}%`
              ])
            ]
          }
        }
      ],
    });
    return pdf;
  }

  async exportPdf(params?: FilterProjectDto) {
    try {
      const projects = await this.findAll(params);
      const pdf = this.pdfPrinter.createPdfKitDocument({
        pageOrientation: 'landscape',
        content: [
          {
            text: 'Proyectos',
            style: 'header'
          },
          {
            fontSize: 10,
            table: {
              headerRows: 1,
              widths: ['60%', '15%', '15%', '10%'],
              body: [
                ['Nombre', 'Área', 'Municipio', 'Parroquia'],
                ...projects.map(project => [
                  project.name,
                  project.area?.name,
                  project.parrish?.municipality?.name,
                  project.parrish?.name
                ])
              ]
            }
          }
        ],
      });
      return pdf;
    } catch (error) {
      throw new HttpException('Error al generar el PDF', 500);
    }
  }

  async getStatistics(year: number = new Date().getFullYear(), isArchived: boolean = false) {

    const municipalities = await this.municipalityRepository.find();
    let max = 0;
    const countByMuncipality = [];
    const countByArea = [];
    const statuses = Object.values(ProjectStatus);

    const not_started = await this.projectRepository.count({
      where: {
        status: ProjectStatus.NOT_STARTED,
        isArchived,
        startDate: isArchived ? undefined : Raw(date => `EXTRACT(YEAR FROM ${date}) = :year`, { year: year })
      }
    });

    const in_process = await this.projectRepository.count({
      where: {
        status: ProjectStatus.IN_PROCESS,
        isArchived,
        startDate: isArchived ? undefined : Raw(date => `EXTRACT(YEAR FROM ${date}) = :year`, { year: year })
      }
    });

    const started = await this.projectRepository.count({
      where: {
        status: ProjectStatus.STARTED,
        isArchived,
        startDate: isArchived ? undefined : Raw(date => `EXTRACT(YEAR FROM ${date}) = :year`, { year: year })
      }
    });

    const completed = await this.projectRepository.count({
      where: {
        status: ProjectStatus.COMPLETED,
        isArchived,
        startDate: isArchived ? undefined : Raw(date => `EXTRACT(YEAR FROM ${date}) = :year`, { year: year })
      }
    });

    for (const mun of municipalities) {
      const statusCounter = {};
      let munMax = 0;
      for (const status of statuses) {
        const count = await this.projectRepository.count({
          where: {
            status,
            isArchived,
            parrish: {
              municipality: {
                id: mun.id
              }
            },
            startDate: isArchived ? undefined : Raw(date => `EXTRACT(YEAR FROM ${date}) = :year`, { year: year })
          }
        });
        statusCounter[status] = count;
        munMax += count;
      }
      if (munMax > max) max = munMax;
      countByMuncipality.push({ municipality: `${mun.id}.${mun.name}`, ...sortObjectByValue(statusCounter) });
    }

    for (const area of await this.areaRepository.find()) {
      const statusCounter = {};
      for (const status of statuses) {
        const count = await this.projectRepository.count({
          where: {
            status,
            isArchived,
            area: {
              id: area.id
            },
            startDate: isArchived ? undefined : Raw(date => `EXTRACT(YEAR FROM ${date}) = :year`, { year: year })
          },
        });
        statusCounter[status] = count;
      }
      countByArea.push({ area: area.name, ...sortObjectByValue(statusCounter) });
    }

    const total = await this.projectRepository.count({
      where: { isArchived, startDate: isArchived ? undefined : Raw(date => `EXTRACT(YEAR FROM ${date}) = :year`, { year: year }) }
    });

    return {
      countByMuncipality,
      countByArea,
      total,
      not_started,
      started,
      in_process,
      completed,
      max
    }

  }

  public async seedPrtTotal() {
    const projects = await this.projectRepository.find();
    for (const project of projects) {
      const prt = this.calculatePRT(project);
      await this.projectRepository.update(project.id, { prt });
    }
  }

  public async seedPcTotal() {
    const projects = await this.projectRepository.find();
    for (const project of projects) {
      const pcTotal = this.calculatePcTotal(project);
      await this.projectRepository.update(project.id, { pcTotal });
    }
  }

  calculatePcTotal(project: Project) {
    return project.pc.map(Number).reduce((acc, curr) => acc + (Number(curr) === -1 ? 0 : curr), 0) / 3;
  }

  private async updateProjectProgress(project: Project, update: Update) {
    const { progress } = update;
    const status = this.getStatusByProgress(progress);
    const pc = await this.updatePcComponent(project, update);
    const prt = this.calculatePRT(project);
    const supply = this.handleSupply(update);
    const pcTotal = this.calculatePcTotal(project);
    await this.projectRepository.update(
      project.id,
      {
        status,
        pc: () => `'{${pc.join(',')}}'`,
        prt,
        supply,
        pcTotal
      });
  }

  handleSupply(update: Update) {
    if (update.progress = 100) {
      return update.supply;
    }
    return false;
  }

  calculatePRT(project: Project): number {
    if (moment().isBefore(new Date()) && project.status !== ProjectStatus.COMPLETED) {
      return 0;
    }
    return 1;
  }

  private async updatePcComponent(project: Project, update: Update) {
    let pc = project.pc;
    const { progress } = update;
    const value = update.gobernador ? 1 : 0;
    if (progress > 0 && progress <= 40) {
      pc[0] = value;
      pc[1] = -1;
      pc[2] = -1;
    } else if (progress > 40 && progress <= 99) {
      if (pc[0] === -1) {
        pc[0] = 0;
      }
      pc[1] = value;
      pc[2] = -1;
    } else {
      if (pc[1] === -1) {
        pc[1] = 0;
      }
      if (pc[0] === -1) {
        pc[0] = 0;
      }
      pc[2] = value;
    }
    return pc;
  }

  private getStatusByProgress(progress: number) {
    // 0 - 40 Iniciado
    // 41 - 99 En proceso
    // 99 - 100 culminado

    if (progress <= 40) {
      return ProjectStatus.STARTED;
    } else if (progress <= 99) {
      return ProjectStatus.IN_PROCESS;
    } else {
      return ProjectStatus.COMPLETED;
    }
  }

}

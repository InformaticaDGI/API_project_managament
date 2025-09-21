import { Injectable } from '@nestjs/common';
import { CreateCompromiseDto } from './dto/create-compromise.dto';
import { UpdateCompromiseDto } from './dto/update-compromise.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { And, FindOptionsWhere, Or, Raw, Repository } from 'typeorm';
import { Compromise } from './entities/compromise.entity';
import { PageOptionsDto } from 'src/common/page-options.dto';
import { FilterCompromisesDto } from './dto/filter-compromises.dto';
import { compromiseFilter } from 'src/helpers/filterHelper';
import { PageDto, PageMetaDto } from 'src/common/page.dto';
import { Parrish } from 'src/parrish/entities/parrish.entity';
import { Area } from 'src/area/entities/area.entity';
import { Municipality } from 'src/municipality/entities/municipality.entity';

@Injectable()
export class CompromiseService {

  constructor(
    @InjectRepository(Compromise)
    private readonly compromiseRepository: Repository<Compromise>,
    @InjectRepository(Parrish)
    private readonly parrishRepository: Repository<Parrish>,
    @InjectRepository(Municipality)
    private readonly municipalityRepository: Repository<Municipality>,
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>
  ) { }

  async create(createCompromiseDto: CreateCompromiseDto) {
    const parrish = await this.parrishRepository.findOne({ where: { id: createCompromiseDto.parrishId } });
    const area = await this.areaRepository.findOne({ where: { id: createCompromiseDto.areaId } });
    return this.compromiseRepository.save({
      ...createCompromiseDto,
      area,
      parrish
    });
  }

  async findAllConsultas(params: PageOptionsDto & FilterCompromisesDto): Promise<PageDto<Compromise>> {
    const where = compromiseFilter(params);
    const compromises = await this.compromiseRepository.find({
      where: {
        ...where,
        is_consulta: true
      },
      take: params.take,
      skip: params.skip,
      relations: {
        area: true,
        parrish: {
          municipality: true
        },
        project: true
      }
    });
    const itemCount = await this.compromiseRepository.count({
      where: {
        ...where,
        is_consulta: true,
      },
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: params });

    return new PageDto(compromises, pageMetaDto);
  }

  async findAll(
    params: PageOptionsDto & FilterCompromisesDto,
  ): Promise<PageDto<Compromise>> {
    const where = compromiseFilter(params);
    const compromises = await this.compromiseRepository.find({
      where: {
        ...where,
        is_consulta: false,
        bricomiles_educacion: false,
        bricomiles_salud: false
      },
      take: params.take,
      skip: params.skip,
      relations: {
        area: true,
        parrish: {
          municipality: true
        },
        project: true
      }
    });

    const itemCount = await this.compromiseRepository.count({
      where: {
        ...where,
        is_consulta: false,
      },
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: params });
    return new PageDto(compromises, pageMetaDto);
  }

  async findNacionales(params: PageOptionsDto & FilterCompromisesDto,) {
    const where = compromiseFilter(params);
    const data = await this.compromiseRepository.find({
      where: {
        ...where,
        nacional: true
      },
      relations: {
        area: true,
        parrish: {
          municipality: true
        },
        project: true
      },
      skip: params.skip,
      take: params.take
    });

    const itemCount = await this.compromiseRepository.count({
      where: {
        ...where,
        nacional: true,
      },
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: params });
    return new PageDto(data, pageMetaDto);

  }


  async findBricomilesSalud(params: PageOptionsDto & FilterCompromisesDto,) {
    const where = compromiseFilter(params);
    const data = await this.compromiseRepository.find({
      where: {
        ...where,
        bricomiles_salud: true
      },
      relations: {
        area: true,
        parrish: {
          municipality: true
        },
        project: true
      },
      skip: params.skip,
      take: params.take
    });

    const itemCount = await this.compromiseRepository.count({
      where: {
        ...where,
        bricomiles_salud: true,
      },
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: params });
    return new PageDto(data, pageMetaDto);

  }

  async findBricomilesEducacion(params: PageOptionsDto & FilterCompromisesDto,) {
    const where = compromiseFilter(params);
    const data = await this.compromiseRepository.find({
      where: {
        ...where,
        bricomiles_educacion: true
      },
      relations: {
        area: true,
        parrish: {
          municipality: true
        },
        project: true
      },
      skip: params.skip,
      take: params.take
    });

    const itemCount = await this.compromiseRepository.count({
      where: {
        ...where,
        bricomiles_educacion: true,
      },
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: params });
    return new PageDto(data, pageMetaDto);

  }

  findOne(id: number) {
    return this.compromiseRepository.findOne({
      where: {
        id,
      },
      relations: {
        area: true,
        parrish: {
          municipality: true
        },
        project: true
      }
    });
  }

  update(id: number, updateCompromiseDto: UpdateCompromiseDto) {

    const area = updateCompromiseDto.areaId ? { area: { id: updateCompromiseDto.areaId } } : {};
    const parrish = updateCompromiseDto.parrishId ? { parrish: { id: updateCompromiseDto.parrishId } } : {};

    updateCompromiseDto = { ...updateCompromiseDto, ...area, ...parrish };

    delete updateCompromiseDto.areaId;
    delete updateCompromiseDto.parrishId;

    return this.compromiseRepository.update(id, {
      ...updateCompromiseDto,
      status: updateCompromiseDto.progress !== 100 ? 'not_completed' : 'completed'
    });
  }

  remove(id: number) {
    return this.compromiseRepository.delete(id);
  }

  async getStatistics(compromiseType: 'consulta' | 'gobernador' | 'bricomiles_salud' | 'bricomiles_educacion' | 'nacional', year: number | 'no_definido' = new Date().getFullYear()) {

    let where = {}

    if (compromiseType === 'nacional') {
      where['nacional'] = true;
    }

    if (compromiseType === 'consulta') {
      where['is_consulta'] = true;
      where['bricomiles_educacion'] = false;
      where['bricomiles_salud'] = false;
    }

    if (compromiseType === 'gobernador') {
      where['is_consulta'] = false;
      where['bricomiles_educacion'] = false;
      where['bricomiles_salud'] = false;
      where['nacional'] = false;
    }

    if (compromiseType === 'bricomiles_salud') {
      where['is_consulta'] = false;
      where['bricomiles_salud'] = true;
    }

    if (compromiseType === 'bricomiles_educacion') {
      where['is_consulta'] = false;
      where['bricomiles_educacion'] = true;
    }

    if (!compromiseType) {
      where['bricomiles_salud'] = false;
      where['bricomiles_educacion'] = false;
    }

    const completed = await this.compromiseRepository.count({
      where: {
        ...where,
        status: 'completed',
        year: year === 'no_definido' ? Raw((y) => `${y} is null`) : year
      }
    });

    const not_completed = await this.compromiseRepository.count({
      where: {
        ...where,
        status: 'not_completed',
        year: year === 'no_definido' ? Raw((y) => `${y} is null`) : year
      }
    });

    const municipalities = await this.municipalityRepository.find();
    const areas = await this.areaRepository.find();

    const statusByMunicipality = [];
    const statusByArea = [];

    for (const area of areas) {
      const completed = await this.compromiseRepository.count({
        where: {
          ...where,
          status: 'completed',
          area: {
            id: area.id
          },
          year: year === 'no_definido' ? Raw((y) => `${y} is null`) : year
        }
      });

      const not_completed = await this.compromiseRepository.count({
        where: {
          ...where,
          status: 'not_completed',
          area: {
            id: area.id
          },
          year: year === 'no_definido' ? Raw((y) => `${y} is null`) : year
        }
      });

      statusByArea.push({ area: area.name, completed, not_completed, total: completed + not_completed });
    }
    let max = 0;
    for (const municipality of municipalities) {
      const completed = await this.compromiseRepository.count({
        where: {
          ...where,
          status: 'completed',
          parrish: {
            municipality: {
              id: municipality.id
            }
          },
          year: year === 'no_definido' ? Raw((y) => `${y} is null`) : year
        }
      });

      const not_completed = await this.compromiseRepository.count({
        where: {
          ...where,
          status: 'not_completed',
          parrish: {
            municipality: {
              id: municipality.id
            }
          },
          year: year === 'no_definido' ? Raw((y) => `${y} is null`) : year
        }
      });
      const total = completed + not_completed
      max = total > max ? total : max;
      statusByMunicipality.push({ municipality: `${municipality.id}.${municipality.name}`, completed, not_completed, total });
    }
    return { completed, not_completed, total: completed + not_completed, statusByMunicipality, statusByArea, max };

  }

}

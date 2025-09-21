import { HttpException, Injectable } from '@nestjs/common';
import { Areas, AREAS, CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { Any, Between, FindOperator, In, Not, Raw, Repository } from 'typeorm';
import { Parrish } from 'src/parrish/entities/parrish.entity';
import { PageOptionsDto } from 'src/common/page-options.dto';
import { FilterProjectDto } from 'src/project/dto/filter-projects.dto';
import { PageDto, PageMetaDto } from 'src/common/page.dto';
import { activityFilter } from 'src/helpers/filterHelper';
import { Municipality } from 'src/municipality/entities/municipality.entity';
import State from 'src/state/entities/state.entity';
import { ForeignActivity } from 'src/foreign-activity/entities/foreign-activity.entity';

@Injectable()
export class ActivityService {

  constructor(
    @InjectRepository(Activity)
    private activityRepository: Repository<Activity>,
    @InjectRepository(Parrish)
    private parrishRepository: Repository<Parrish>,
    @InjectRepository(Municipality)
    private municipalityRepository: Repository<Municipality>,
    @InjectRepository(State)
    private stateRepository: Repository<State>,
    @InjectRepository(ForeignActivity)
    private foreignActivityRepo: Repository<ForeignActivity>
  ) { }

  async create(createActivityDto: CreateActivityDto) {
    const parrish = await this.parrishRepository.findOne({
      where: { id: +createActivityDto.parrishId }
    });
    const activity = this.activityRepository.create({
      ...createActivityDto,
      parrish,
      area: createActivityDto.area ? `{${createActivityDto.area.join(',')}}` as unknown as any : '{}',
      ente: createActivityDto.ente ? `{${createActivityDto.ente.join(',')}}` as unknown as any : '{}',
    });
    return this.activityRepository.save(activity);
  }

  async findAll(params: PageOptionsDto & FilterProjectDto) {
    const where = activityFilter(params);
    const activities = await this.activityRepository.find({
      where: {
        ...where
      },
      relations: {
        parrish: {
          municipality: true
        }
      },
      order: {
        date: "DESC"
      },
      skip: params.skip,
      take: params.take
    });

    const itemCount = await this.activityRepository.count({
      where: {
        ...where
      }
    })

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto: params });

    return new PageDto(activities, pageMetaDto);

  }

  async findAllByArea(area: Areas) {

    const validAreas = ['finanzas', 'economico', 'obras_servicios', 'social', 'salud_educacion', 'seguridad', 'politico', 'nacional'];

    const dependencias: {
      [key: string]: { cod_dep: string | number, denominacion: string }[]
    } = {
      "finanzas": [
        {
          "cod_dep": "02-00",
          "denominacion": "SECRETARÍA DE FINANZAS"
        },
        {
          "cod_dep": "03-00",
          "denominacion": "SECRETARÍA DE PLANIFICACIÓN Y PRESUPUESTO"
        },
        {
          "cod_dep": "01-3",
          "denominacion": "DIRECCIÓN GENERAL DE TALENTO HUMANO"
        },
        {
          "cod_dep": "1011",
          "denominacion": "SUPERINTENDENCIA DE ADMINISTRACIÓN TRIBUTARIA DEL ESTADO GUARICO (SUATEG)"
        },
        {
          "cod_dep": "1040",
          "denominacion": "FONDO DE EFICIENCIA PARA EL DESARROLLO DEL ESTADO BOLIVARIANO DE GUARICO"
        },
        {
          "cod_dep": "1046",
          "denominacion": "SOCIEDAD DE GARANTIAS RECIPROCAS"
        }],
      "economico": [
        {
          "cod_dep": "06-00",
          "denominacion": "SECRETARÍA DE PRODUCCIÓN Y COMERCIO"
        },
        {
          "cod_dep": "1042",
          "denominacion": "CORPOGUARICO POTENCIA, C.A"
        },
        {
          "cod_dep": "21-00",
          "denominacion": "SECRETARIA DE PRODUCCION AGROPECUARIA"
        },
        // {
        //   "cod_dep": "19-00",
        //   "denominacion": "SECRETARIA DE INDUSTRIA Y COMERCIO"
        // },
        {
          "cod_dep": "12-00",
          "denominacion": "SECRETARÍA DE ALIMENTACIÓN"
        },
        {
          "cod_dep": "1016",
          "denominacion": "FONDO DE DESARROLLO REGIONAL DEL ESTADO GUÁRICO (FONDER)"
        },
        {
          "cod_dep": "1004",
          "denominacion": "FODESOPROEGUA"
        },
        {
          "cod_dep": "1043",
          "denominacion": "CORPOTUREBG"
        },
        {
          "cod_dep": "1027",
          "denominacion": "AGUAS TERMALES HOTEL Y SPA S.A"
        },
        {
          "cod_dep": "1028",
          "denominacion": "AGROGUÁRICO POTENCIA C.A"
        },
        /* {
          "cod_dep": "1013",
          "denominacion": "CORPOGUÁRICO"
        }, */
        {
          "cod_dep": "1035",
          "denominacion": "ALIMENTOS DEL GUARICO S.A (ALGUARISA)"
        },
        {
          "cod_dep": "1023",
          "denominacion": "INSTITUTO PÚBLICO MINERO DEL ESTADO BOLIVARIANO DE GUÁRICO (IPMEBG)"
        },
        {
          "cod_dep": "1037",
          "denominacion": "SISTEMA SOCIALISTA DE PROVEDURIA GUARICO (SISOPROGUA)"
        }],
      "obras_servicios": [
        {
          "cod_dep": "18-00",
          "denominacion": "SECRETARÍA DE TRANSPORTE"
        },
        {
          "cod_dep": "20-00",
          "denominacion": "SECRETARÍA DE OBRAS PÚBLICAS"
        },
        {
          "cod_dep": "16-00",
          "denominacion": "SECRETARIA DE SERVICIOS PÚBLICOS"
        },
        {
          "cod_dep": "1036",
          "denominacion": "CONSTRUGUÁRICO, S.A"
        },
        {
          "cod_dep": "1038",
          "denominacion": "BUS GUARICO"
        },
        {
          "cod_dep": "1039",
          "denominacion": "CONSTRUVIALGUA, C.A"
        },
        {
          "cod_dep": "1041",
          "denominacion": "DISTRIBUIDORA DE GAS GUÁRICO (DIGASGUA)"
        },
        {
          "cod_dep": "1006",
          "denominacion": "FUNDACIÓN PATRIA SOCIALISTA (FPS)"
        },
        {
          "cod_dep": "1045",
          "denominacion": "CONSTRUSALUD"
        },
        {
          "cod_dep": "1018",
          "denominacion": "INSTITUTO AUTÓNOMO DE LA VIVIENDA Y HÁBITAT DEL EDO. BOLIVARIANO DE GUÁRICO (IAVHEBG)"
        }],
      "social": [
        {
          "cod_dep": "05-00",
          "denominacion": "SECRETARÍA DE PROTECCIÓN SOCIAL"
        },
        {
          "cod_dep": "11-00",
          "denominacion": "SECRETARÍA DE GESTIÓN TERRITORIAL"
        },
        {
          "cod_dep": "1003",
          "denominacion": "INSTITUTO REGIONAL DEL DEPORTE DEL EDO. BOLIVARIANO DE GUÁRICO (IRDEBG)"
        },
        {
          "cod_dep": "1019",
          "denominacion": "INSTITUTO DE LA MUJER DEL ESTADO BOLIVARIANO DE GUÁRICO (IMUBGUA)"
        },
        {
          "cod_dep": "1010",
          "denominacion": "EJE PARA LA ARTICULACIÓN DEL EMPODERAMIENTO DE LOS CONSEJOS COMUNALES (EMCOMUNA)"
        },
        {
          "cod_dep": "1012",
          "denominacion": "INSTITUTO DE LA JUVENTUD DEL ESTADO GUÁRICO (INJUVEG)"
        },
        {
          "cod_dep": "1000",
          "denominacion": "FUNDACIÓN PARA LA CULTURA DEL ESTADO GUÁRICO (FUNDACULGUA)"
        },
        {
          "cod_dep": "1008",
          "denominacion": "FUNDACIÓN NACIONAL EL NIÑO SIMÓN GUÁRICO"
        },
        {
          "cod_dep": "1032",
          "denominacion": "FUNDACIÓN ORQUESTA SINF. INFANTIL Y JUVENIL DEL EDO. GUÁRICO (FOSIJEG)"
        },
        {
          "cod_dep": "1033",
          "denominacion": "FUNDACIÓN ORQUESTA SINFONICA DEL ESTADO GUÁRICO (FOSEG)"
        },
        {
          "cod_dep": "1017",
          "denominacion": "RED DE BIBLIOTECAS PÚBLICAS DEL ESTADO GUARICO"
        },
      ],
      "salud_educacion": [
        {
          "cod_dep": "07-00",
          "denominacion": "SECRETARÍA DE EDUCACIÓN, CULTURA Y DEPORTE"
        },
        {
          "cod_dep": "08-00",
          "denominacion": "SECRETARÍA DE SALUD PÚBLICA"
        },
        {
          "cod_dep": "09-00",
          "denominacion": "SECRETARÍA DE EDUCACION UNIVERSITARIA"
        },
        {
          "cod_dep": "1001",
          "denominacion": "FUNDACIÓN SOCIALISTA DE ATENCIÓN MÉDICA INTEGRAL DEL ESTADO BOLIVARIANO DE GUÁRICO (FUSAMIEBG)"
        },
        {
          "cod_dep": "1009",
          "denominacion": "ASOCIACIÓN DE MEDICINA Y CIENCIAS APLICADAS AL DEPORTE (ASOMECID)"
        },
        {
          "cod_dep": "1005",
          "denominacion": "INSTITUTO DE CIENCIAS Y TECNOLOGÍAS DEL ESTADO GUÁRICO  (INCITEG)"
        },
      ],
      "seguridad": [
        {
          "cod_dep": "10-9",
          "denominacion": "DIRECCIÓN PROTECCIÓN CIVIL Y ADMINISTRACIÓN DE DESASTRES",
        },
        {
          "cod_dep": "10-8",
          "denominacion": "DIRECCIÓN DE CUERPO DE BOMBEROS DEL ESTADO BOLIVARIANO DE GUÁRICO",
        },
        {
          "cod_dep": "10-00",
          "denominacion": "SECRETARÍA SEGURIDAD Y DEFENSA CIUDADANA"
        },
        {
          "cod_dep": "1021",
          "denominacion": "INSTITUTO AUTONOMO DE LA POLICIA DEL EDO. BOL. GUARICO (IAPEBG)"
        },
      ],
      "politico": [
        {
          "cod_dep": "00-00",
          "denominacion": "POLITICA"
        }
      ],
      "nacional": [
        {
          "cod_dep": "01-00",
          "denominacion": "Ente Nacional"
        }
      ]
    }


    if (!validAreas.includes(area)) throw new HttpException('Area not found', 404);

    // const deps = dependencias[area].map(dep => dep.cod_dep.toString())

    return this.activityRepository.find({
      relations: {
        parrish: {
          municipality: true
        }
      },
      where: {
        area: `{${area}}` as unknown as any,
      }
    });
  }

  findOne(id: number) {
    return this.activityRepository.findOne({
      where: { id }, relations: {
        parrish: {
          municipality: true
        }
      }
    });
  }

  async update(id: number, updateActivityDto: UpdateActivityDto) {

    const activity = await this.findOne(id);

    if (!activity) throw new HttpException('Activity not found', 404);

    const parrish = updateActivityDto.parrishId && await this.parrishRepository.findOne({ where: { id: +updateActivityDto.parrishId } });

    delete updateActivityDto.parrishId;

    return this.activityRepository.update(id, {
      ...updateActivityDto,
      parrish,
      area: updateActivityDto.area ? `{${updateActivityDto.area.join(',')}}` as unknown as any : '{}',
      ente: updateActivityDto.ente ? `{${updateActivityDto.ente.join(',')}}` as unknown as any : '{}',
    });
  }

  async remove(id: number) {
    const activity = await this.activityRepository.findOne({
      where: { id }
    });
    return this.activityRepository.remove(activity);
  }


  async getStatistics(year: number = new Date().getFullYear()) {

    const activitiesByArea = []
    const activitiesByMunicipality = [[], [], [], [], [], [], [], [], [], [], [], []]
    const activitiesByState = [[], [], [], [], [], [], [], [], [], [], [], []]
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const municipalities = await this.municipalityRepository.find({
      relations: {
        parrishes: true
      }
    })

    const states = await this.stateRepository.find()

    for (const month of months) {
      for (const state of states) {
        const result = await this.foreignActivityRepo.query(`
            SELECT COUNT(*) FROM foreign_activity
            JOIN state s on s.id = foreign_activity."stateId"
            WHERE EXTRACT(MONTH FROM date) = $1
            AND EXTRACT(YEAR FROM date) = $2
            AND s.id = $3
        `, [month, year, state.id])
        activitiesByState[month - 1].push({
          state: state.name,
          count: result[0].count
        })
      }
    }

    for (const month of months) {
      for (const municipality of municipalities) {
        const result = await this.activityRepository.query(`
            SELECT COUNT(*) FROM activity
            JOIN parrish p on p.id = activity."parrishId"
            JOIN municipality m on m.id = p."municipalityId"
            WHERE EXTRACT(MONTH FROM date) = $1
            AND EXTRACT(YEAR FROM date) = $2
            AND m.id in ($3)
        `, [month, year, municipality.id])
        activitiesByMunicipality[month - 1].push({
          /* ...activitiesByMunicipality[month], */
          municipality: municipality.name,
          count: result[0].count
        })
      }
    }

    const activitiesStatusTerritory = []
    const foreignStatusTerritory = []

    for (const municipality of municipalities) {

      const nacional = await this.activityRepository.query(`
        SELECT COUNT(*) FROM activity
        JOIN parrish p on p.id = activity."parrishId"
        JOIN municipality m on m.id = p."municipalityId"
        WHERE p."municipalityId" = $1 AND activity."area" in ('{nacional}') 
        AND EXTRACT(YEAR FROM date) = $2
        `, [municipality.id, year])

      const gobernacion = await this.activityRepository.query(`
        SELECT COUNT(*) FROM activity
        JOIN parrish p on p.id = activity."parrishId"
        JOIN municipality m on m.id = p."municipalityId"
        WHERE p."municipalityId" in ($1) AND activity."area" not in ('{nacional}')
        AND EXTRACT(YEAR FROM date) = $2
        `, [municipality.id, year])

      activitiesStatusTerritory.push({
        nacional: nacional[0].count,
        gobernacion: gobernacion[0].count
      })

    }

    for (const state of states) {

      const nacional = await this.foreignActivityRepo.query(`
        SELECT COUNT(*) FROM foreign_activity
        JOIN state s on s.id = foreign_activity."stateId"
        WHERE s."id" = $1 AND foreign_activity."area" in ('{nacional}')
        AND EXTRACT(YEAR FROM date) = $2
      `, [state.id, year])

      const gobernacion = await this.foreignActivityRepo.query(`
        SELECT COUNT(*) FROM foreign_activity
        JOIN state s on s.id = foreign_activity."stateId"
        WHERE s."id" = $1 AND foreign_activity."area" not in ('{nacional}')
        AND EXTRACT(YEAR FROM date) = $2
      `, [state.id, year])


      foreignStatusTerritory.push({
        nacional: nacional[0].count,
        gobernacion: gobernacion[0].count
      })

    }

    const activity_estadales = await this.activityRepository.count({
      where: {
        type: 'estadal',
        date: Raw(date => `EXTRACT(YEAR FROM ${date}) = :year`, { year: year })
      }
    })

    const foreign_activity_estadales = await this.foreignActivityRepo.count({
      where: {
        type: 'estadal',
        date: Raw(date => `EXTRACT(YEAR FROM ${date}) = :year`, { year: year })
      }
    })

    const activity_municipales = await this.activityRepository.count({
      where: {
        type: 'municipal',
        date: Raw(date => `EXTRACT(YEAR FROM ${date}) = :year`, { year: year })
      }
    })

    const foreign_activity_municipales = await this.foreignActivityRepo.count({
      where: {
        type: 'municipal',
        date: Raw(date => `EXTRACT(YEAR FROM ${date}) = :year`, { year: year })
      }
    })

    const estadales = activity_estadales + foreign_activity_estadales;
    const municipales = activity_municipales + foreign_activity_municipales;


    for (const area of AREAS) {
      const count = await this.activityRepository.count({
        where: {
          area: `{${area}}`,
          date: Raw(date => `EXTRACT(YEAR FROM ${date}) = :year`, { year: year })
        }
      })
      const countForeign = await this.foreignActivityRepo.count({
        where: {
          area: `{${area}}`,
          date: Raw(date => `EXTRACT(YEAR FROM ${date}) = :year`, { year: year })
        }
      })
      activitiesByArea.push({ count: count + countForeign, area })
    }

    const activitiesCountByPolitical = await this.activityRepository.count({
      where: {
        area: '{politico}',
        date: Raw(date => `EXTRACT(YEAR FROM ${date}) = :year`, { year: year })
      },
    })

    const foreignActivitiesCountByPolitical = await this.foreignActivityRepo.count({
      where: {
        area: '{politico}',
        date: Raw(date => `EXTRACT(YEAR FROM ${date}) = :year`, { year: year })
      }
    })

    const activitiesCountByNotPolitical = await this.activityRepository.count({
      where: {
        area: Not('{politico}'),
        date: Raw(date => `EXTRACT(YEAR FROM ${date}) = :year`, { year: year })
      }
    })

    const foreignActivitiesCountByNotPolitical = await this.foreignActivityRepo.count({
      where: {
        area: Not('{politico}'),
        date: Raw(date => `EXTRACT(YEAR FROM ${date}) = :year`, { year: year })
      }
    })

    const politicas = activitiesCountByPolitical + foreignActivitiesCountByPolitical;
    const no_politicas = activitiesCountByNotPolitical + foreignActivitiesCountByNotPolitical;

    return { activitiesByArea, estadales, municipales, politicas, no_politicas, total: politicas + no_politicas, activitiesStatusTerritory, foreignStatusTerritory, activitiesByMunicipality, activitiesByState }
  }

}

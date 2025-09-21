import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { Area } from 'src/area/entities/area.entity';

@Injectable()
export class CategoryService {

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Area)
    private areaRepository: Repository<Area>
  ) { }

  create(createCategoryDto: CreateCategoryDto) {
    return 'This action adds a new category';
  }

  findAll() {
    return this.categoryRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }

  async seed() {
    for (const item of data) {
      const category = new Category();
      category.area = await this.areaRepository.findOneBy({ id: item.areaId });
      category.name = item.name;
      this.categoryRepository.save(category);
    }
  }
}

const data = [
  {
    areaId: 1,
    name: 'CONSTRUCCIÓN DE BASE DE MISIONES'
  },
  {
    areaId: 2,
    name: 'REHABILITACIÓN DE LA VIALIDAD AGRÍCOLA'
  },
  {
    areaId: 3,
    name: 'REHABILITACIÓN DE GALERÍA FILTRANTE'
  },
  {
    areaId: 3,
    name: 'REHABILITACIÓN DE POZO PROFUNDO'
  },
  {
    areaId: 4,
    name: 'MEJORAS A GUARDERÍA GERIÁTRICA '
  },
  {
    areaId: 1,
    name: 'REHABILITACIÓN DE PLAZA'
  },
  {
    areaId: 5,
    name: 'MEJORAS A ESCUELAS'
  },
  {
    areaId: 4,
    name: 'REHABILITACIÓN DE BASES DE MISIONES'
  },
  {
    areaId: 6,
    name: 'REHABILITACIÓN DE CONSULTORIO TIPO II'
  },
  {
    areaId: 7,
    name: 'REACTIVACIÓN DE SISTEMAS DE RIEGO'
  },
  {
    areaId: 8,
    name: 'REHABILITACIÓN DE CANCHA'
  },
  {
    areaId: 3,
    name: 'REACTIVACIÓN DE POZO PROFUNDO'
  },
  {
    areaId: 2,
    name: 'REHABILITACIÓN DE TRONCALES'
  },
  {
    areaId: 2,
    name: 'ACTIVACIÓN DE PEAJE'
  },
  {
    areaId: 9,
    name: 'REHABILITACIÓN DE CENTROS DE COORDINACIÓN POLICIAL'
  },
  {
    areaId: 2,
    name: 'DEMARCACION DE CALLES Y AVENIDAS '
  },
  {
    areaId: 2,
    name: 'MANTENIMIENTO VIAL '
  },
  {
    areaId: 3,
    name: 'REHABILITACIÓN DE PLANTA DE TRATAMIENTO DE AGUA '
  },
  {
    areaId: 3,
    name: 'REACTIVACIÓN DE ACUEDUCTO'
  },
  {
    areaId: 3,
    name: 'SUSTITUCIÓN DE COLECTOR'
  },
  {
    areaId: 11,
    name: 'REHABILITACIÓN DE CAPILLA'
  },
  {
    areaId: 5,
    name: 'REHABILITACIÓN DE ESCUELAS'
  },
  {
    areaId: 2,
    name: 'REACTIVACIÓN DE PLANTA PROCESADORA DE ASFALTO'
  },
  {
    areaId: 9,
    name: 'MEJORMIENTO DE MODULOS POLICIALES'
  },
  {
    areaId: 12,
    name: 'REHABILITACIÓN DE TEATROS'
  },
  {
    areaId: 6,
    name: 'CONSTRUCCIÓN DE FARMACIAS POPULARES'
  },
  {
    areaId: 10,
    name: 'CONSTRUCCIÓN DE MONUMENTOS'
  },
  {
    areaId: 11,
    name: 'MEJORAS A IGLESIAS'
  },
  {
    areaId: 8,
    name: 'REHABILITACIÓN DE GIMNASIOS'
  },
  {
    areaId: 13,
    name: 'RECUPERACIÓN DE PLANTA DE LÁCTEOS'
  },
  {
    areaId: 13,
    name: 'CONSTRUCCIÓN DE PLANTA DE LÁCTEOS Y DERIVADOS'
  },
  {
    areaId: 6,
    name: 'REHABILITACIÓN DE CONSULTORIO MÉDICO POPULAR'
  },
  {
    areaId: 3,
    name: 'INTALACIÓN DE EQUIPO DE BOMBEO '
  },
  {
    areaId: 1,
    name: 'CONSTRUCCIÓN DE TIENDA DE ALIMENTOS DEL GUÁRICO'
  },
  {
    areaId: 13,
    name: 'CONSTRUCCIÓN DE PLANTA EMPAQUETADORA'
  },
  {
    areaId: 14,
    name: 'CONSTRUCCIÓN DE PLANTA DE LLENADO GLP'
  },
  {
    areaId: 6,
    name: 'REHABILITACIÓN DE SALA DE REHABILITACIÓN INTEGRAL'
  },
  {
    areaId: 15,
    name: 'CULMINACIÓN DE VIVIENDAS'
  },
  {
    areaId: 9,
    name: 'CONSTRUCCIÓN DE CICPC'
  },
  {
    areaId: 14,
    name: 'ENTREGA DE CILINDROS DE GAS'
  },
  {
    areaId: 9,
    name: 'ACTIVACIÓN DE CENTRO DE COORDINACIÓN POLICIAL'
  },
  {
    areaId: 3,
    name: 'ACTIVACIÓN DE ESTACIONES DE BOMBEO'
  },
  {
    areaId: 5,
    name: 'REHABILITACIÓN DE GRUPOS ESCOLARES'
  },
  {
    areaId: 6,
    name: 'REHABILITACIÓN DE FARMAPATRIA'
  },
  {
    areaId: 2,
    name: 'REHABILITACIÓN DE VIALIDAD AGRICOLA'
  },
  {
    areaId: 5,
    name: 'ACONDICIONAMIENTO A UNIDADES EDUCATIVAS'
  },
  {
    areaId: 10,
    name: 'CONSTRUCCIÓN DE PLAZA'
  },
  {
    areaId: 8,
    name: 'REHABILITACIÓN DE ESTADIOS'
  },
  {
    areaId: 13,
    name: 'REACTIVACIÓN DE PLANTA PROCESADORA'
  },
  {
    areaId: 12,
    name: 'CONSTRUCCIÓN DE ESPACIOS RECREATIVOS Y CULTURALES '
  },
  {
    areaId: 3,
    name: 'CORRECCIÓN DE FUGAS EN TUBERIAS DE ACERO '
  },
  {
    areaId: 1,
    name: 'REHABILITACIÓN DE BIBLIOTECA'
  },
  {
    areaId: 6,
    name: 'REHABILITACIÓN DE HOSPITALES'
  },
  {
    areaId: 1,
    name: 'REHABILITACIÓN Y MANTENIMIENTO  DE IGLESIAS'
  },
  {
    areaId: 3,
    name: 'CONSTRUCCIÓN DE GABARRA'
  },
  {
    areaId: 1,
    name: 'REHABILITACIÓN DE CASA DE ALIMENTACIÓN'
  },
  {
    areaId: 5,
    name: 'REHABILITACIÓN DE SIMONCITO'
  },
  {
    areaId: 15,
    name: 'REHABILITACIÓN DE FACHADAS'
  },
  {
    areaId: 3,
    name: 'SUSTITUCIÓN DE ALCANTARILLA'
  },
  {
    areaId: 2,
    name: 'PLAN BACHEO'
  },
  {
    areaId: 6,
    name: 'REHABILITACIÓN A CENTROS DE SALUD'
  },
  {
    areaId: 6,
    name: 'REHABILITACIÓN DE C.D.I'
  },
  {
    areaId: 13,
    name: 'INAUGURACIÓN DE SILOS'
  },
  {
    areaId: 3,
    name: 'CONSTRUCCIÓN DE RED DE AGUA POTABLE'
  },
  {
    areaId: 13,
    name: 'REACTIVACIÓN DE GRANJAS'
  },
  {
    areaId: 3,
    name: 'ACTIVACIÓN DE ACUEDUCTOS RURALES'
  },
  {
    areaId: 5,
    name: 'CULMINACIÓN DE GIMNASIO CUBIERTO'
  },
  {
    areaId: 4,
    name: 'REHABILITACIÓN DE ALDEA DE ATENCIÓN A ADULTOS MAYORES'
  },
  {
    areaId: 5,
    name: 'REHABILITACIÓN DE CENTRO DE EDUCACIÓN'
  },
  {
    areaId: 6,
    name: 'REHABILITACIÓN DE SRI'
  },
  {
    areaId: 2,
    name: 'REHABILITACIÓN DE REDOMA'
  },
  {
    areaId: 12,
    name: 'REHABILITACIÓN DE CASA DE LA CULTURA'
  },
  {
    areaId: 2,
    name: 'REHABILITACIÓN DE LA VIALIDAD URBANA'
  },
  {
    areaId: 16,
    name: 'ADQUISICIÓN DE LUMINARIAS'
  },
  {
    areaId: 5,
    name: 'REHABILITACIÓN DE CENTROS EDUCATIVOS'
  },
  {
    areaId: 10,
    name: 'ORNAMENTACIÓN Y EMBELLECIMIENTO'
  },
  {
    areaId: 6,
    name: 'REHABILITACIÓN DE CLÍNICA BOLIVARIANA'
  },
  {
    areaId: 3,
    name: 'ADQUISICIÓN DE EQUIPOS DE BOMBEO'
  },
  {
    areaId: 5,
    name: 'MEJORAS A ESCUELAS DE TALENTO'
  },
  {
    areaId: 5,
    name: 'CULMINACIÓN DE CENTROS EDUCATIVOS'
  },
  {
    areaId: 5,
    name: 'CONSTRUCCIÓN DE ESCUELA DE TALENTO DEPORTIVO '
  },
  {
    areaId: 8,
    name: 'REHABILITACIÓN DE POLIDEPORTIVOS'
  },
  {
    areaId: 1,
    name: 'CONSOLIDACIÓN DE TERMINAL DE PASAJEROS'
  },
  {
    areaId: 2,
    name: 'ADQUISICIÓN DE MEZCLA ASFALTICA'
  },
  {
    areaId: 16,
    name: 'ADQUISICIÓN DE EQUIPOS ELÉCTRICOS'
  },
  {
    areaId: 9,
    name: 'REPOTENCIACIÓN DE RADIO PATRULLA'
  },
  {
    areaId: 6,
    name: 'REHABILITACIÓN DE AMBULATORIO'
  },
  {
    areaId: 3,
    name: 'PERFORACIÓN DE POZO PROFUNDO'
  },
  {
    areaId: 17,
    name: 'ACTIVIDADES CULTURALES Y RECREATIVAS'
  },
  {
    areaId: 6,
    name: 'REPARACIÓN Y ACTIVACIÓN DE EQUIPOS MÉDICOS'
  },
  {
    areaId: 8,
    name: 'REHABILITACIÓN DE PARQUES'
  },
  {
    areaId: 3,
    name: 'CONSTRUCCIÓN DE POZOS PROFUNDOS'
  },
  {
    areaId: 18,
    name: 'ADQUISICIÓN DE HERRAMIENTAS E INSUMOS PARA EL MANTENIMIENTO'
  },
  {
    areaId: 3,
    name: 'REHABILITACIÓN Y LIMPIEZA DE POZOS PROFUNDOS'
  },
  {
    areaId: 6,
    name: 'REHABILITACIÓN Y MEJORAS A CENTROS DE SALUD'
  },
  {
    areaId: 5,
    name: 'REHABILITACIÓN DE LICEO'
  },
  {
    areaId: 19,
    name: 'REACTIVACIÓN DE LA DIVISIÓN DE CONTROL DE CALIDAD'
  },
  {
    areaId: 16,
    name: 'INSTALACIÓN DE LUMINARIAS'
  },
  {
    areaId: 8,
    name: 'REHABILITACIÓN DE COMPLEJO DEPORTIVO'
  },
  {
    areaId: 6,
    name: 'REACONDICIONAMIENTO DE AEROAMBULANCIA'
  },
  {
    areaId: 10,
    name: 'REHABILITACIÓN Y MEJORAS EN LAS INSTALACIONES DEL HOTEL Y SPA AGUAS TERMALES'
  },
  {
    areaId: 7,
    name: 'PRODUCCIÓN PORCINA'
  },
  {
    areaId: 20,
    name: 'ADQUISICIÓN DE EQUIPOS TECNOLÓGICO'
  },
  {
    areaId: 8,
    name: 'ADQUISICIÓN DE MATERIAL DEPORTIVO'
  },
  {
    areaId: 15,
    name: 'CULMINACIÓN DE APARTAMENTOS'
  },
  {
    areaId: 7,
    name: 'SIEMBRA'
  },
  {
    areaId: 5,
    name: 'REHABILITACIÓN DE ALDEA UNIVERSITARIA'
  },
  {
    areaId: 13,
    name: 'RECUPERACIÓN DE GALPONES, ALMACENES, SILOS Y OTROS'
  },
  {
    areaId: 3,
    name: 'REHABILITACIÓN Y MEJORAS DE LA RED DE AGUAS SERVIDAS'
  }
];

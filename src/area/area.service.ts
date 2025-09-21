import { Injectable } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { Area } from './entities/area.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AreaService {

  constructor(
    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,
  ) { }

  create(createAreaDto: CreateAreaDto) {
    return 'This action adds a new area';
  }

  findAll() {
    return this.areaRepository.find({
      relations: ['categories'],
      order: {
        name: 'ASC'
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} area`;
  }

  update(id: number, updateAreaDto: UpdateAreaDto) {
    return `This action updates a #${id} area`;
  }

  remove(id: number) {
    return `This action removes a #${id} area`;
  }

  seed() {
    return this.areaRepository.insert([
      { name: "INFRAESTRUCTURA", id: 1 },
      { name: "VIALIDAD", id: 2 },
      { name: "HIDRAULICA", id: 3 },
      { name: "BIENESTAR SOCIAL", id: 4 },
      { name: "EDUCACION", id: 5 },
      { name: "SALUD", id: 6 },
      { name: "AGROPRODUCTIVO", id: 7 },
      { name: "DEPORTE", id: 8 },
      { name: "SEGURIDAD Y DEFENSA", id: 9 },
      { name: "TURISMO", id: 10 },
      { name: "RELIGIOSO", id: 11 },
      { name: "CULTURA", id: 12 },
      { name: "AGROINDUSTRIAL", id: 13 },
      { name: "GAS", id: 14 },
      { name: "VIVIENDA", id: 15 },
      { name: "ELECTRICIDAD", id: 16 },
      { name: "EXPO GUARICO", id: 17 },
      { name: "AMBIENTE", id: 18 },
      { name: "INVERSIÓN INSTITUCIONAL", id: 19 },
      { name: "TECNOLOGÍA", id: 20 },
    ]);
  }

}

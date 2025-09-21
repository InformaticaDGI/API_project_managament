import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import State from './entities/state.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StateService {

  constructor(
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>
  ) { }

  findAll() {
    return this.stateRepository.find();
  }

  async seed() {
    const count = await this.stateRepository.count()
    if (count > 0) return;
    for (const state of estados) {
      await this.stateRepository.insert({
        name: state
      })
    }
  }

}


const estados = [
  "Amazonas",
  "Anzoátegui",
  "Apure",
  "Aragua",
  "Barinas",
  "Bolívar",
  "Carabobo",
  "Cojedes",
  "Delta Amacuro",
  "Falcón",
  "Lara",
  "Mérida",
  "Miranda",
  "Monagas",
  "Nueva Esparta",
  "Portuguesa",
  "Sucre",
  "Táchira",
  "Trujillo",
  "Vargas",
  "Yaracuy",
  "Zulia",
  "Distrito Capital"
]
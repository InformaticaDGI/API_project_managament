import { Injectable } from '@nestjs/common';
import { CreateMunicipalityDto } from './dto/create-municipality.dto';
import { UpdateMunicipalityDto } from './dto/update-municipality.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Municipality } from './entities/municipality.entity';
import { Repository } from 'typeorm';
import { Parrish } from 'src/parrish/entities/parrish.entity';

@Injectable()
export class MunicipalityService {

  constructor(
    @InjectRepository(Municipality)
    private readonly municipalityRepository: Repository<Municipality>,
    @InjectRepository(Parrish)
    private readonly parrishRepository: Repository<Parrish>,
  ) { }

  create(createMunicipalityDto: CreateMunicipalityDto) {
    return 'This action adds a new municipality';
  }

  findAll() {
    return this.municipalityRepository.find({
      relations: {
        parrishes: true
      },
      order: {
        name: 'ASC'
      }

    });
  }

  findOne(id: number) {
    return `This action returns a #${id} municipality`;
  }

  update(id: number, updateMunicipalityDto: UpdateMunicipalityDto) {
    return `This action updates a #${id} municipality`;
  }

  remove(id: number) {
    return `This action removes a #${id} municipality`;
  }

  async seed() {

    const roscio = await this.municipalityRepository.insert({
      id: 1,
      name: 'Juan German Roscio',
    })

    await this.parrishRepository.insert([
      { id: 1, name: 'San Juan de los Morros', municipality: roscio.identifiers[0] },
      { id: 2, name: 'Cantagallo', municipality: roscio.identifiers[0] },
      { id: 3, name: 'Parapara', municipality: roscio.identifiers[0] },
    ])

    const camaguan = await this.municipalityRepository.insert({
      id: 2,
      name: 'Camaguan',
    })

    await this.parrishRepository.insert([
      { id: 4, name: 'Camaguan', municipality: camaguan.identifiers[0] },
      { id: 5, name: 'Puerto Miranda', municipality: camaguan.identifiers[0] },
      { id: 6, name: 'Uverito', municipality: camaguan.identifiers[0] },
    ])

    const chaguaramas = await this.municipalityRepository.insert({
      id: 3,
      name: 'Chaguaramas',
    })

    await this.parrishRepository.insert([
      { id: 7, name: 'Chaguaramas', municipality: chaguaramas.identifiers[0] },
    ])

    const socorro = await this.municipalityRepository.insert({
      id: 4,
      name: 'El Socorro',
    })

    await this.parrishRepository.insert([
      { id: 8, name: 'El Socorro', municipality: socorro.identifiers[0] },
    ])

    const infante = await this.municipalityRepository.insert({
      id: 5,
      name: 'Infante',
    })

    await this.parrishRepository.insert([
      { id: 9, name: 'Valle de la Pascua', municipality: infante.identifiers[0] },
      { id: 10, name: 'Espino', municipality: infante.identifiers[0] },
    ])

    const mercedes = await this.municipalityRepository.insert({
      id: 6,
      name: 'Las Mercedes',
    })

    await this.parrishRepository.insert([
      { id: 11, name: 'Las Mercedes', municipality: mercedes.identifiers[0] },
      { id: 12, name: 'Cabruta', municipality: mercedes.identifiers[0] },
      { id: 13, name: 'Santa Rita de Manapire', municipality: mercedes.identifiers[0] },
    ])

    const mellado = await this.municipalityRepository.insert({
      id: 7,
      name: 'Mellado',
    })

    await this.parrishRepository.insert([
      { id: 14, name: 'El Sombrero', municipality: mellado.identifiers[0] },
      { id: 15, name: 'Sosa', municipality: mellado.identifiers[0] },
    ])

    const miranda = await this.municipalityRepository.insert({
      id: 8,
      name: 'Miranda',
    })

    await this.parrishRepository.insert([
      { id: 16, name: 'Calabozo', municipality: miranda.identifiers[0] },
      { id: 17, name: 'El Calvario', municipality: miranda.identifiers[0] },
      { id: 18, name: 'El Rastro', municipality: miranda.identifiers[0] },
      { id: 19, name: 'Guardatinajas', municipality: miranda.identifiers[0] },
    ])

    const monagas = await this.municipalityRepository.insert({
      id: 9,
      name: 'Monagas',
    })

    await this.parrishRepository.insert([
      { id: 20, name: 'Altagracia de Orituco', municipality: monagas.identifiers[0] },
      { id: 21, name: 'Lezama', municipality: monagas.identifiers[0] },
      { id: 22, name: 'Libertad de Orituco', municipality: monagas.identifiers[0] },
      { id: 23, name: 'Paso Real de Macaira', municipality: monagas.identifiers[0] },
      { id: 24, name: 'San Francisco de Macaira', municipality: monagas.identifiers[0] },
      { id: 25, name: 'San Rafael de Orituco', municipality: monagas.identifiers[0] },
      { id: 26, name: 'Carlos Soublette', municipality: monagas.identifiers[0] },
    ])

    const ortiz = await this.municipalityRepository.insert({
      id: 10,
      name: 'Ortiz',
    })

    this.parrishRepository.insert([
      { id: 27, name: 'San Francisco de Tiznados', municipality: ortiz.identifiers[0] },
      { id: 28, name: 'San Jose de Tiznados', municipality: ortiz.identifiers[0] },
      { id: 29, name: 'San Lorenzo de Tiznados', municipality: ortiz.identifiers[0] },
      { id: 30, name: 'Ortiz', municipality: ortiz.identifiers[0] },
    ])

    const ribas = await this.municipalityRepository.insert({
      id: 11,
      name: 'Ribas',
      parrishes: [
        { id: 31, name: 'Tucupido' },
        { id: 32, name: 'San Rafael de Laya' },
      ]
    })

    await this.parrishRepository.insert([
      { id: 31, name: 'Tucupido', municipality: ribas.identifiers[0] },
      { id: 32, name: 'San Rafael de Laya', municipality: ribas.identifiers[0] },
    ])

    const guayabal = await this.municipalityRepository.insert(
      {
        id: 12,
        name: 'San Gerónimo de Guayabal',
      }
    )

    await this.parrishRepository.insert([
      { id: 33, name: 'Guayabal', municipality: guayabal.identifiers[0] },
      { id: 34, name: 'Cazorla', municipality: guayabal.identifiers[0] },
    ])

    const guaribe = await this.municipalityRepository.insert({
      id: 13,
      name: 'San José de Guaribe',
    })

    await this.parrishRepository.insert([
      { id: 35, name: 'San José de Guaribe', municipality: guaribe.identifiers[0] },
    ])

    const stmaria = await this.municipalityRepository.insert({
      id: 14,
      name: 'Santa María de Ipire',
    })

    await this.parrishRepository.insert([
      { id: 36, name: 'Santa María de Ipire', municipality: stmaria.identifiers[0] },
      { id: 37, name: 'Altamira', municipality: stmaria.identifiers[0] },
    ])

    const zaraza = await this.municipalityRepository.insert({
      id: 15,
      name: 'Zaraza',
    })

    await this.parrishRepository.insert([
      { id: 38, name: 'Zaraza', municipality: zaraza.identifiers[0] },
      { id: 39, name: 'San José de Unare', municipality: zaraza.identifiers[0] }
    ])

  }

}

import { Injectable } from '@nestjs/common';
import { AreaService } from 'src/area/area.service';
import { CategoryService } from 'src/category/category.service';
import { MunicipalityService } from 'src/municipality/municipality.service';

@Injectable()
export class SeedService {
    constructor(
        private readonly municipalityService: MunicipalityService,
        private readonly areaService: AreaService,
        private readonly categoryService: CategoryService,
    ) {

    }

    async seed() {
        await this.municipalityService.seed();
        await this.areaService.seed();
        await this.categoryService.seed();
    }

}

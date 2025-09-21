import { FilterActivityDto } from "src/activity/dto/filter-activity.dto";
import { FilterCompromisesDto } from "src/compromise/dto/filter-compromises.dto";
import { FilterProjectDto } from "src/project/dto/filter-projects.dto";
import { Project } from "src/project/entities/project.entity";
import { And, Any, FindOptionsOrder, In, Like } from "typeorm";

export const projectFilter = (filters: FilterProjectDto) => {
    const where = {};
    const order: FindOptionsOrder<Project> = { pcTotal: 'ASC', year: 'DESC', parrish: { municipality: { name: 'ASC' } } };

    if (filters) {
        if (filters.parrishId) {
            where['parrish'] = { id: In(filters.parrishId) };
        }
        if (filters.municipalityId) {
            where['parrish'] = { municipality: In(filters.municipalityId) };
        }
        if (filters.name) {
            where['name'] = Like(`%${filters.name}%`);
        }
        if (filters.status) {
            where['status'] = And(In(filters.status));
        }
        if (filters.year) {
            where['year'] = In(filters.year);
        } if (filters.areaId) {
            where['area'] = {
                id: In(filters.areaId)
            };
        } if (filters.categoryId) {
            where['category'] = {
                id: In(filters.categoryId)
            };
        } if (filters.gobernador) {
            where['updates'] = {
                gobernador: filters.gobernador
            }
        } if (filters.isArchived) {
            where['isArchived'] = filters.isArchived;
        } if (filters.isParalyzed) {
            where['isParalyzed'] = filters.isParalyzed;
        }
    }

    if (filters.order_pc) {
        order['pcTotal'] = filters.order_pc;
    }

    return { where, order };
}

export function compromiseFilter(filters: FilterCompromisesDto) {
    const where = {};

    if (filters) {
        if (filters.parrishId) {
            where['parrish'] = { id: In(filters.parrishId) };
        }
        if (filters.municipalityId) {
            where['parrish'] = { municipality: In(filters.municipalityId) };
        }
        if (filters.name) {
            where['name'] = Like(`%${filters.name}%`);
        }
        if (filters.status) {
            where['status'] = In(filters.status);
        }
        if (filters.year) {
            where['year'] = In(filters.year);
        }
        if (filters.areaId) {
            where['area'] = {
                id: In(filters.areaId)
            };
        }
    }
    return where;
}

export function activityFilter(filters: FilterActivityDto) {
    const where = {};

    if (filters) {
        if (filters.parrishId) {
            where['parrish'] = { id: In(filters.parrishId) };
        }
        if (filters.municipalityId) {
            where['parrish'] = { municipality: In(filters.municipalityId) };
        }
        if (filters.name) {
            where['name'] = Like(`%${filters.name}%`);
        }
        if (filters.areaId) {
            where['area'] = `{${filters.areaId as unknown as any}}`

        }
        if (filters.ente) {
            where['ente'] = `{${filters.ente as unknown as any}}`
        }
        if (filters.stateId) {
            where['state'] = { id: In(filters.stateId) }
        }
    }
    return where;
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Municipality } from 'src/municipality/entities/municipality.entity';
import { tercil } from 'src/helpers/tercil';

const totalPPActivities = 52;
const totalPCGActivities = 240;

@Injectable()
export class ComponentService {

    constructor(
        @InjectRepository(Municipality)
        private readonly municipalityRepo: Repository<Municipality>,
        private readonly dataSource: DataSource,
    ) { }

    private async getPs(municipalities: Municipality[], startDate?: string, endDate?: string) {
        const psByMunicipality = [];
        let psTotal = 0;
        let municipalitiesWithAtLeastOneProject = 0;
        for (const municipality of municipalities) {
            let [ps] = await this.dataSource.query(`
                SELECT (ps::float / 3) as ps FROM project
                where "parrishId" in (${municipality.parrishes.map(p => p.id).join(',')})
                ${startDate ? `and "startDate" >= '${startDate}'` : ''}
                ${endDate ? `and "endDate" <= '${endDate}'` : ''}
            `);
            ps = ps?.ps || 0
            const [projects] = await this.dataSource.query(`
                SELECT COUNT(*) FROM project
                where "parrishId" in (${municipality.parrishes.map(p => p.id).join(',')})
                ${startDate ? `and "startDate" >= '${startDate}'` : ''}
                ${endDate ? `and "endDate" <= '${endDate}'` : ''}
            `);
            if (+projects.count > 0) municipalitiesWithAtLeastOneProject++;
            psByMunicipality.push({
                municipality: municipality.name,
                ps: tercil(+ps),
            });
            psTotal += +ps;
        }
        return {
            psTotal: tercil(psTotal / municipalitiesWithAtLeastOneProject),
            psByMunicipality: psByMunicipality.sort((a, b) => b.ps.value - a.ps.value)
        }
    }

    private async getPc(municipalities: Municipality[], startDate?: string, endDate?: string) {
        const pcByMunicipality2 = [];
        let pcTotal2 = 0;
        let muncipalitiesWithAtLeastOneProject = 0;
        for (const municipality of municipalities) {
            const [pc] = await this.dataSource.query(`
                SELECT coalesce(AVG("pcTotal"), 0) as avg FROM project
                where "parrishId" in (${municipality.parrishes.map(p => p.id).join(',')})
                ${startDate ? `and "startDate" >= '${startDate}'` : ''}
                ${endDate ? `and "endDate" <= '${endDate}'` : ''}
            `);
            const [projects] = await this.dataSource.query(`
                SELECT COUNT(*) FROM project
                where "parrishId" in (${municipality.parrishes.map(p => p.id).join(',')})
                ${startDate ? `and "startDate" >= '${startDate}'` : ''}
                ${endDate ? `and "endDate" <= '${endDate}'` : ''}
            `);
            if (+projects.count > 0) {
                muncipalitiesWithAtLeastOneProject++;
            }
            pcByMunicipality2.push({
                municipality: municipality.name,
                pc: tercil(+pc.avg),
            });
            pcTotal2 += +pc.avg;
        }
        return {
            pcTotal2: tercil(pcTotal2 / muncipalitiesWithAtLeastOneProject),
            pcByMunicipality2: pcByMunicipality2.sort((a, b) => b.pc.value - a.pc.value)
        }
    }

    private async getPrt(municipalities: Municipality[], startDate?: string, endDate?: string) {
        const prtByMunicipality = [];
        let prtTotal = 0;
        let finishedProjectsCount = 0;
        for (const municipality of municipalities) {
            const [prt] = await this.dataSource.query(`
                 SELECT sum(prt) FROM project
                 where "parrishId" in (${municipality.parrishes.map(p => p.id).join(',')}) 
                    ${startDate ? `and "startDate" >= '${startDate}'` : ''}
                    ${endDate ? `and "endDate" <= '${endDate}'` : ''}
                `);
            const [projects] = await this.dataSource.query(`
                 SELECT COUNT(*) FROM project
                 where "parrishId" in (${municipality.parrishes.map(p => p.id).join(',')}) 
                    ${startDate ? `and "startDate" >= '${startDate}'` : ''}
                    ${endDate ? `and "endDate" <= '${endDate}'` : ''}
                `);
            finishedProjectsCount += prt.sum;
            prtByMunicipality.push({
                municipality: municipality.name,
                prt: tercil(+prt.sum / projects.count),
            });
            prtTotal += +prt.sum / (+projects.count || 1);
        }
        return {
            prt: tercil(prtTotal / 15),
            prtByMunicipality: prtByMunicipality.sort((a, b) => b.prt.value - a.prt.value)
        }
    }

    private getTotalActivitiesByDateRangeType(dateRangeType: DateRangeType, total: number) {
        switch (dateRangeType) {
            case 'bimester':
                return total / 6;
            case 'semester':
                return total / 2;
            default:
                return total;
        }
    }

    private async getPP(municipalities: Municipality[], startDate?: string, endDate?: string, dateRangeType?: DateRangeType) {
        const goal = this.getTotalActivitiesByDateRangeType(dateRangeType, totalPPActivities);
        const ppByMunicipality = [];
        let ppTotal = 0;
        for (const municipality of municipalities) {
            const [activities] = await this.dataSource.query(`
                SELECT COUNT(*) FROM activity
                where "parrishId" in (${municipality.parrishes.map(p => p.id).join(',')}) 
                and area in ('{politico}')
                ${startDate ? `and "date" >= '${startDate}'` : ''}
                ${endDate ? `and "date" <= '${endDate}'` : ''}
            `);
            const activityQuota = Math.round(+goal * (+municipality.populationDensity)) || 1;
            let pp = Math.round(+activities.count) / activityQuota;
            if (pp > 1) pp = 1;
            ppByMunicipality.push({
                municipality: municipality.name,
                pp: tercil(pp),
                count: Math.round(+activities.count),
            });
            ppTotal += pp;
        }
        return {
            ppTotal: ppTotal / 15,
            ppByMunicipality: ppByMunicipality.sort((a, b) => b.pp.value - a.pp.value),
            goal
        }
    }

    private async getPCG(municipalities: Municipality[], startDate?: string, endDate?: string, dateRangeType?: DateRangeType) {
        const goal = this.getTotalActivitiesByDateRangeType(dateRangeType, totalPCGActivities);
        const pcgByMunicipality = [];
        let pcgTotal = 0;

        for (const municipality of municipalities) {
            const [activities] = await this.dataSource.query(`
                SELECT COUNT(*) FROM activity where "parrishId" in (${municipality.parrishes.map(p => p.id).join(',')}) 
                and "isPolitical" = false
                ${startDate ? `and "date" >= '${startDate}'` : ''}
                ${endDate ? `and "date" <= '${endDate}'` : ''}
            `);
            const activityQuota = Math.round(+goal * (+municipality.populationDensity)) || 1;
            let pcg = Math.round(+activities.count) / activityQuota;
            if (pcg > 1) pcg = 1;
            pcgByMunicipality.push({
                municipality: municipality.name,
                pcg: tercil(pcg),
                count: Math.round(+activities.count),
            });
            pcgTotal += pcg;
        }
        return {
            pcgTotal: pcgTotal / 15,
            pcgByMunicipality: pcgByMunicipality.sort((a, b) => b.pcg.value - a.pcg.value),
            goal
        }
    }

    private async getCredibilityComponent(municipalities: Municipality[], startDate?: string, endDate?: string) {
        const credibilityByMunicipality = [];
        let credibilityTotal = 0;
        for (const municipality of municipalities) {
            const [completedCompromises] = await this.dataSource.query(`
                SELECT COUNT(*) FROM compromise
                where "parrishId" in (${municipality.parrishes.map(p => p.id).join(',')})
                and "status" = 'completed'
            `);
            const [totalCompromises] = await this.dataSource.query(`
                SELECT COUNT(*) FROM compromise
                where "parrishId" in (${municipality.parrishes.map(p => p.id).join(',')})
            `);
            credibilityByMunicipality.push({
                municipality: municipality.name,
                credibility: tercil(+completedCompromises.count / +totalCompromises.count),
            });
            credibilityTotal += +completedCompromises.count / +totalCompromises.count;
        }
        return {
            credibilityTotal: tercil(credibilityTotal / 15),
            credibilityByMunicipality: credibilityByMunicipality.sort((a, b) => b.credibility.value - a.credibility.value),
        }
    }


    private async getPt(municipalities: Municipality[], startDate?: string, endDate?: string) {
        const [PT_TOTAL_PROJECTS] = await this.dataSource.query(`
            SELECT COUNT(*) FROM project 
            ${startDate ? `where "startDate" >= '${startDate}'` : ''}
            ${endDate ? `and "endDate" <= '${endDate}'` : ''}
            `);
        const ptByMunicipality = [];
        let ptTotal = 0;
        for (const municipality of municipalities) {
            const { populationDensity } = municipality
            const [projects] = await this.dataSource.query(`
                SELECT COUNT(*) FROM 
                project where "parrishId" in (${municipality.parrishes.map(p => p.id).join(',')})
                ${startDate ? `and "startDate" >= '${startDate}'` : ''}
                ${endDate ? `and "endDate" <= '${endDate}'` : ''}
                `);

            const projectQuota = Math.round(+PT_TOTAL_PROJECTS.count * (+populationDensity)) || 1;
            let pt = Math.round(+projects.count) / (projectQuota >= 1 ? projectQuota : 1);

            const actualQuota = (+projects.count / Math.round(+PT_TOTAL_PROJECTS.count));
            const expectedQuota = (+projectQuota / Math.round(+PT_TOTAL_PROJECTS.count));
            // const quotaDiff = actualQuota - expectedQuota;

            /* if (pt > 1) {
                pt = 1;
            } */
            /* if (quotaDiff > 0.10) {
                pt = pt - (quotaDiff);
            } */
            ptByMunicipality.push({
                municipality: municipality.name,
                pt: tercil(pt),
                count: Math.round(+projects.count),
                expected: projectQuota,
                overflow: actualQuota - expectedQuota
            });
            ptTotal += this.handlePtOverflow(pt);
        }
        return {
            ptTotal: ptTotal / 15,
            ptByMunicipality: ptByMunicipality.sort((a, b) => b.pt.value - a.pt.value),
            goal: +PT_TOTAL_PROJECTS.count
        }
    }

    private handlePtOverflow(pt: number) {
        if (pt > 1 && pt <= 1.33) {
            return 1;
        } else if (pt > 1.33 && pt <= 1.66) {
            return 0.5;
        } else if (pt > 1.67) {
            return 0.3;
        } else {
            return pt;
        }
    }

    async getIpc(startDate?: string, endDate?: string, dateRangeType: DateRangeType = 'bimester') {
        const municipalities = await this.municipalityRepo.find({ relations: ['parrishes'] });
        const { prt, prtByMunicipality } = await this.getPrt(municipalities, startDate, endDate);
        const { ptByMunicipality, ptTotal, goal: ptGoal } = await this.getPt(municipalities, startDate, endDate);
        const { pcTotal2, pcByMunicipality2 } = await this.getPc(municipalities, startDate, endDate);
        const { pcgByMunicipality, pcgTotal, goal: pcgGoal } = await this.getPCG(municipalities, startDate, endDate, dateRangeType);
        const { ppByMunicipality, ppTotal, goal: ppGoal } = await this.getPP(municipalities, startDate, endDate, dateRangeType);
        const { psByMunicipality, psTotal } = await this.getPs(municipalities, startDate, endDate)
        const { credibilityTotal, credibilityByMunicipality } = await this.getCredibilityComponent(municipalities, startDate, endDate);
        const ipc = (pcTotal2.value + prt.value + ptTotal + pcgTotal + ppTotal + psTotal.value + credibilityTotal.value) / 7;
        return {
            ptTotal: tercil(ptTotal),
            ptGoal,
            ptByMunicipality,
            ipc: tercil(ipc),
            pcg: tercil(pcgTotal),
            pp: tercil(ppTotal),
            pc: pcTotal2,
            prt: prt,
            prtByMunicipality,
            pcTotal2,
            pcByMunicipality2,
            pcgByMunicipality,
            ppByMunicipality,
            pcgGoal: Math.round(pcgGoal),
            ppGoal,
            psByMunicipality,
            psTotal,
            credibilityTotal,
            credibilityByMunicipality
        };
    }

}


export type DateRangeType = 'bimester' | 'semester' | 'year';
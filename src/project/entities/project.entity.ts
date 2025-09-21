import { Agenda } from "src/agenda/entities/agenda.entity";
import { Area } from "src/area/entities/area.entity";
import { Category } from "src/category/entities/category.entity";
import { Compromise } from "src/compromise/entities/compromise.entity";
import { Parrish } from "src/parrish/entities/parrish.entity";
import { Update } from "src/updates/entities/update.entity";
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import * as moment from 'moment'
import { tercil } from "src/helpers/tercil";

@Entity()
export class Project {
    @PrimaryColumn({ generated: 'increment' })
    public id: number;

    @Column("varchar", { length: 500 })
    @Index({ fulltext: true })
    public name: string;

    @Column({ nullable: true })
    public sector: string;

    @Column({ nullable: true })
    @Index()
    public year: number;

    @Column({ default: false })
    public supply: boolean;

    @Column({ default: false })
    public isParalyzed: boolean;

    @ManyToOne(() => Category, category => category.projects)
    @Index()
    category?: Category;

    @ManyToOne(() => Area, area => area.projects)
    @Index()
    area?: Area;

    @Column({ nullable: true })
    fundingSource: string;

    @Column({ nullable: true })
    ente: string;

    // Componente Politico Social
    @Column("integer", { default: 0 })
    ps: number;

    // Componente Politico - Recursos - Tiempo
    @Column("decimal", { default: 0.0 })
    prt: number;

    // Componente Politico - Comunicacional
    @Column("integer", { default: [-1, -1, -1], array: true })
    pc: number[];

    @Column("text", { nullable: true })
    description?: string;

    @Column("decimal", { default: 0.0 })
    pcTotal: number;

    @Column("date", { nullable: true })
    startDate: Date;

    @Column("date", { nullable: true })
    endDate: Date;

    @Column("varchar", { default: '0.0', nullable: true })
    amount: string;

    @Column("varchar", { default: '0.0', nullable: true })
    amountUsd: string;

    @Column({
        enum: ['started', 'not_started', 'completed', 'in_process'],
    })
    @Index()
    status: string

    @ManyToOne(() => Parrish, parrish => parrish.projects)
    parrish: Parrish

    @Column("simple-array", { array: true, default: [] })
    images: string[];

    @Column({ default: false })
    isArchived: boolean;

    @ManyToOne(() => Compromise, compromise => compromise.project, { cascade: true })
    compromise?: Compromise

    @OneToMany(() => Update, update => update.project)
    updates?: Update[]

    @OneToMany(() => Agenda, agenda => agenda.project)
    agendas?: Agenda[]

    toResponseDTO(): ProjectResponseDto {
        return {
            id: this.id,
            name: this.name,
            sector: this.sector,
            year: this.year,
            supply: this.supply,
            category: this.category,
            area: this.area,
            fundingSource: this.fundingSource,
            ente: this.ente,
            ps: this.ps,
            prt: this.prt,
            pc: this.pc,
            startDate: this.startDate,
            endDate: this.endDate,
            amount: this.amount,
            amountUsd: this.amountUsd,
            status: this.status as ProjectStatus,
            parrish: this.parrish,
            images: this.images,
            isArchived: this.isArchived,
            compromise: this.compromise,
            updates: this.updates,
            agendas: this.agendas,
            isParalyzed: this.isParalyzed,
            description: this.description,
            progress: this.updates.length > 0 ? this.updates.sort((a, b) => a.progress - b.progress).at(-1).progress : 0,
            isOverdue: moment(this.endDate).isBefore(new Date()) && this.status !== ProjectStatus.COMPLETED,
            components: {
                pc: tercil(this.pcTotal),
                prt: tercil(this.prt),
            }
        }
    }

    updatePcTotal() {
        this.pcTotal = this.pc.reduce((acc, curr) => acc + curr, 0) / 3;
        return this;
    }

}

export type ProjectResponseDto = {
    id: number;
    name: string;
    sector: string;
    year: number;
    supply: boolean;
    category?: Category;
    area?: Area;
    fundingSource: string;
    ente: string;
    ps: number;
    isParalyzed: boolean;
    prt: number;
    pc: number[];
    startDate: Date;
    endDate: Date;
    amount: string;
    amountUsd: string;
    status: ProjectStatus;
    parrish: Parrish;
    images: string[];
    isArchived: boolean;
    progress: number;
    compromise?: Compromise;
    updates?: Update[];
    agendas?: Agenda[];
    isOverdue?: boolean;
    description?: string;
    components: {
        [key: string]: Component;
    }
}

export type Component = {
    value: number;
    label: string;
    color: string;
}

export enum ProjectStatus {
    STARTED = 'started',
    COMPLETED = 'completed',
    NOT_STARTED = 'not_started',
    IN_PROCESS = 'in_process'
}
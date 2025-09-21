import { Area } from "src/area/entities/area.entity";
import { Parrish } from "src/parrish/entities/parrish.entity";
import { Project } from "src/project/entities/project.entity";
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Compromise {
    @PrimaryColumn({ generated: 'increment' })
    public id: number;

    @Column({ length: 500 })
    public name: string;

    @Column({ nullable: true })
    public sector: string;


    @Column('varchar', { nullable: true })
    public year?: number;
    
    @Column('integer', { default: 0 })
    public progress: number;

    @ManyToOne(() => Area, (area) => area.compromises)
    area?: Area;

    @Column('boolean', { default: false })
    @Index()
    is_consulta: boolean

    @Column('boolean', { default: false })
    @Index()
    bricomiles_salud: boolean

    @Column('boolean', { default: false })
    @Index()
    bricomiles_educacion: boolean

    @Column('boolean', { default: false })
    @Index()
    nacional: boolean
    
    
    @Column('boolean', { default: false })
    @Index()
    supply: boolean

    @Column({
        enum: ['completed', 'not_completed'],
        default: 'not_completed'
    })
    @Index()
    status: string

    @Column("varchar", { nullable: true })
    public amount: string;

    @Column("varchar", { default: '0.0', nullable: true })
    amountUsd: number;

    @ManyToOne(() => Parrish, parrish => parrish.compromises)
    parrish: Parrish

    @OneToMany(() => Project, project => project.compromise)
    project?: Project[]

}

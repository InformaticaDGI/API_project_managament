import { Project } from "src/project/entities/project.entity";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity()
export class Update {
    @PrimaryColumn({ generated: 'increment' })
    public id: number;

    @Column({ length: 500, nullable: true })
    description?: string;

    @ManyToOne(() => Project, project => project.updates, { cascade: true })
    project: Project

    @Column('date', { nullable: true })
    date: Date;

    @Column()
    progress: number;

    @Column("boolean", { default: false })
    gobernador: boolean;

    @Column("boolean", { default: false })
    supply: boolean;

}

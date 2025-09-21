import { Activity } from "src/activity/entities/activity.entity";
import { Project } from "src/project/entities/project.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Agenda {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar", { length: 255, nullable: true })
    title?: string;

    @Column("timestamp")
    date: Date;

    @Column("boolean", { nullable: true })
    done: boolean;

    @ManyToOne(() => Project, project => project.agendas, { nullable: true, cascade: true })
    project?: Project;

    @ManyToOne(() => Activity, activity => activity.agendas, { nullable: true, cascade: true })
    activity?: Activity;

}
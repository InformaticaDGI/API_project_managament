import { Activity } from "src/activity/entities/activity.entity";
import { Compromise } from "src/compromise/entities/compromise.entity";
import { Municipality } from "src/municipality/entities/municipality.entity";
import { Project } from "src/project/entities/project.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Parrish {
    @PrimaryColumn({ generated: 'increment' })
    public id: number;

    @Column({ length: 500 })
    public name: string;

    @ManyToOne(() => Municipality, municipality => municipality.parrishes)
    municipality: Municipality;

    @OneToMany(() => Project, project => project.parrish)
    projects: Project[];

    // one parrish has many compromises
    @OneToMany(() => Compromise, compromise => compromise.parrish)
    compromises: Compromise[];

    @OneToMany(() => Activity, activity => activity.parrish)
    activities: Activity[];

}

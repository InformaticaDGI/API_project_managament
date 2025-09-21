import { Activity } from "src/activity/entities/activity.entity";
import { Category } from "src/category/entities/category.entity";
import { Compromise } from "src/compromise/entities/compromise.entity";
import { Project } from "src/project/entities/project.entity";
import { Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Area {
    @PrimaryColumn({ generated: 'increment' })
    public id: number;

    @PrimaryColumn({ length: 500 })
    public name: string;

    // One area has many categories
    @OneToMany(() => Category, category => category.area)
    categories: Category[];

    // One area has many projects
    @OneToMany(() => Project, project => project.area)
    projects: Project[];

    // One area has many compromises
    @OneToMany(() => Compromise, compromise => compromise.area)
    compromises: Compromise[];

    @OneToMany(() => Activity, activity => activity.area)
    activities: Activity[];

}

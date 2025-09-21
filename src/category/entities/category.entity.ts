import { Area } from "src/area/entities/area.entity";
import { Project } from "src/project/entities/project.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Category {
    @PrimaryColumn({ generated: 'increment' })
    public id: number;

    @Column({ length: 500 })
    public name: string;

    @ManyToOne(() => Area, area => area.categories)
    area: Area;

    @OneToMany(() => Project, project => project.category)
    projects: Project[];

}

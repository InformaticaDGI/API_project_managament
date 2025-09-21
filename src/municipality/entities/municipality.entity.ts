import { Parrish } from "src/parrish/entities/parrish.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
export class Municipality {
    @PrimaryColumn({ generated: 'increment' })
    public id: number;

    @Column({ length: 500 })
    public name: string;

    @OneToMany(() => Parrish, parrish => parrish.municipality)
    parrishes: Parrish[];

    @Column({ type: 'float', default: 0.0 })
    populationDensity: number;
}

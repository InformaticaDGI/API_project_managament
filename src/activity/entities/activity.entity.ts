import { Agenda } from "src/agenda/entities/agenda.entity";
import { Parrish } from "src/parrish/entities/parrish.entity";
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Areas } from "../dto/create-activity.dto";

@Entity()
export class Activity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("boolean", { default: false })
    @Index()
    isPolitical: boolean;

    @Column("boolean", { default: false })
    @Index()
    gobernador: boolean;

    @Column("simple-array", { array: true, default: [] })
    @Index()
    area: string[];

    @ManyToOne(() => Parrish, parrish => parrish.activities)
    parrish: Parrish;

    @Column("date")
    date: Date;

    @Column("varchar", { default: "municipal" })
    type: "municipal" | "estadal";

    @Column("varchar", { length: 250, nullable: true })
    name?: string;

    @Column("simple-array", { array: true, default: [] })
    ente: string[];

    @OneToMany(() => Agenda, agenda => agenda.activity)
    agendas: Agenda[];

}

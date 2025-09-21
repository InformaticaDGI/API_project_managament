import { Areas } from "src/activity/dto/create-activity.dto";
import State from "src/state/entities/state.entity";
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ForeignActivity {
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

    @ManyToOne(() => State, state => state.activities)
    state: State;

    @Column("date")
    date: Date;

    @Column("varchar", { default: "estadal" })
    type: "municipal" | "estadal";

    @Column("varchar", { length: 250, nullable: true })
    name?: string;

    @Column("simple-array", { array: true, default: [] })
    ente: string[];

}

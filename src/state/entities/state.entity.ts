import { Activity } from "src/activity/entities/activity.entity";
import { ForeignActivity } from "src/foreign-activity/entities/foreign-activity.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";

@Entity()
class State {
    @PrimaryColumn({ generated: 'increment' })
    id: number

    @Column("varchar")
    name: string

    @OneToMany(() => ForeignActivity, activity => activity.state)
    activities: Activity[];
}

export default State;

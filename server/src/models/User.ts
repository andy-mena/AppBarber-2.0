import { Model, Table, Column, DataType, Default, HasMany} from 'sequelize-typescript';
import Appointment from './Appointment';
import Testimonials from './Testimonials';
import Token from './Token';
import AppointmentCancellation from './AppointmentCancellation';

@Table({

    tableName: 'user',
    timestamps: true

})


class User extends Model {
    
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true
    })

    declare userId: number;

    @Column({
        type: DataType.STRING(30),
        allowNull: false
    })
    declare name: string;

    @Column({
        type: DataType.STRING(30),
        allowNull: true
    })
    declare lastname: string;

    @Column({
        type: DataType.STRING(60),
        allowNull: false
    })
    declare email: string;

    @Column({
        type: DataType.STRING(100),
        allowNull: false
    })
    declare password: string;

    @Column({
        type: DataType.STRING(12),
        allowNull: false
    })
    declare phone: string;

    @Column({
        type: DataType.STRING(200),
        allowNull: true
    })
    declare address: string;

    @Default(0)
    @Column({
        type: DataType.TINYINT,
        allowNull: false
    })
    declare confirmed: number;

    @Default(0)
    @Column({
        type: DataType.TINYINT(),
        allowNull: false
    })

    declare admin: number;

    @Default('default.png')
    @Column({
        type: DataType.STRING(100),
        allowNull: true
    })

    declare image: string

    @HasMany(() => Token)
    declare token: Token[]

    @HasMany(() => Appointment)
    appointment: Appointment[]

    @HasMany(() => Testimonials)
    testimonials: Testimonials[]

    // Relación uno a muchos con AppointmentCancellation
    @HasMany(() => AppointmentCancellation)
    appointmentCancellations: AppointmentCancellation[];

}

export default User;

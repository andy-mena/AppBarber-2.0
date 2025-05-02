import { col, fn, literal } from "sequelize";
import { IBarberRepository } from "../interfaces/repositories/IBarberRepository";
import Barber from "../models/Barber";
import { BarberData, BarberIncome, BarberType } from "../types";
import Appointment from "../models/Appointment";
import AppointmentService from "../models/AppointmentService";

class BarberRepository implements IBarberRepository {
    async findAll(): Promise<Barber[]> {
        return await Barber.findAll()
    }

    async findById(id: Barber["barberId"]): Promise<Barber> {
        return await Barber.findByPk(id);
    }

    async save(barber: BarberType, image: string): Promise<Barber> {
        const newBarber = await Barber.create({
            name: barber.name,
            lastname: barber.lastname,
            email: barber.email,
            phone: barber.phone,
            specialty: barber.specialty,
            image: image
        })

        return await newBarber.save();
    }

    async update(barber: BarberType, image: string, id: Barber["barberId"]): Promise<Barber> {
        await Barber.update(
            {
                name: barber.name,
                lastname: barber.lastname,
                email: barber.email,
                phone: barber.phone,
                specialty: barber.specialty,
                image: image
            },
            {
                where: {
                    barberId: id,
                },
            },
        )

        return await this.findById(id)
    }

    async findByEmail(email: Barber["email"]): Promise<Barber> {
        return await Barber.findOne({
            where: {
                email
            }
        })
    }


    async destroy(barber: Barber): Promise<void> {
        await barber.destroy();
    }

    async barberData(): Promise<BarberData[]> {
        // Obtener los barberos y la cantidad de citas completadas
        // Se utiliza el modelo Appointment para contar las citas completadas por cada barbero
        const barbers = await Barber.findAll({
            attributes: [
                'barberId',
                'name',
                [
                    fn('COUNT', col('Appointment.appointmentId')), 'appointments'
                ]
            ],
            include: [
                {
                    model: Appointment,
                    attributes: [],
                    where: {
                        status: 'completed'
                    },
                    required: false
                }
            ],
            group: ['Barber.barberId'],
            order: [[literal('appointments'), 'DESC']]
        });

        // Mapear los resultados para obtener un array de objetos con la información deseada
        // Se utiliza el método getDataValue para obtener el valor de los atributos de la instancia del modelo
        const data: BarberData[] = barbers.map((barbero) => {
            return {
                barberId: barbero.barberId,
                name: barbero.name,
                appointments: barbero.getDataValue('appointments')
            }
        })

        return data;
    }

    async barberIncome(): Promise<BarberIncome[]> {
        const barbers = await AppointmentService.findAll({
            attributes: [
                [col('Appointment.barberId'), 'barberId'],
                [col('Appointment.barbero.name'), 'name'],
                [fn('SUM', col('current_price')), 'value'],
            ],
            include: [
                {
                    model: Appointment,
                    attributes: [],
                    where: {
                        status: 'completed'
                    },
                    include: [
                        {
                            model: Barber,
                            attributes: [],
                        },
                    ],
                },
            ],
            group: ['Appointment.barberId'],
            order: [[literal('value'), 'DESC']],
        });

        const data: BarberIncome[] = barbers.map((barbero) => {
            return {
                barberId: barbero.getDataValue('barberId'),
                name: barbero.getDataValue('name'),
                value: barbero.getDataValue('value')
            }
        })

        return data;
    }

}

export default BarberRepository;
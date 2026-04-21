import type { Request, Response } from "express";
import Barber from "../models/Barber";
import { barberAvailable } from "../helpers/barberAvailable";
import validateTime from "../helpers/validateTime";
import Appointment from "../models/Appointment";
import Service from "../models/Service";
import AppointmentService from "../models/AppointmentService";
import moment from "moment";
import AppointmentCancellation from "../models/AppointmentCancellation";
import { col, fn, literal, Op } from "sequelize";

class AppointmentController {

    public static makeAppointment = async (request: Request, response: Response) => {

        try {

            const { barberId, time, date, services }: Appointment = request.body;
            const barber = await Barber.findByPk(barberId);
            if (!barber) {
                const error = new Error('Barbero no encontrado');
                return response.status(404).json({ error: error.message });
            }

            // Llama a la función de disponibilidad del barbero con los parámetros adecuados
            const isAvailable = await barberAvailable(barberId, new Date(date), time);

            if (!isAvailable) {
                const error = new Error('El barbero no está disponible en esa hora');
                return response.status(400).json({ error: error.message });
            }

            if (!validateTime(time)) {
                const error = new Error('Selecciona una hora dentro del rango de atención');
                return response.status(400).json({ error: error.message });
            }

            const appointment = new Appointment({
                barberId,
                time,
                date,
                userId: request.user.userId
            });

            await appointment.save();


            await Promise.all(services.map(async serviceId => {

                const service = await Service.findByPk(+serviceId)
                const price = service.price;

                const appointmentService = new AppointmentService({
                    appointmentId: appointment.appointmentId,
                    serviceId,
                    current_price: price
                });

                await appointmentService.save();
            }))

            response.status(200).send('Reserva de cita, realizada con éxito');

        } catch (error) {
            const err = new Error('Oops! Something wrong happened');
            console.log(error)
            return response.status(500).json({ error: err.message })
        }

    }

    public static getAppointmentUserAuth = async (request: Request, response: Response) => {

        try {
            const appointments = await Appointment.findAll({
                where: { userId: request.user.userId },
                include: [
                    {
                        model: Barber,
                        attributes: ['name', 'lastname', 'image', 'barberId']
                    },
                    {
                        model: Service,
                        attributes: ['name', 'serviceId'],
                        through: {
                            attributes: ['current_price']
                        }
                    }
                ],
                attributes: ['date', 'time', 'status', 'appointmentId'],
                order: [['date', 'ASC'], ['time', 'ASC']]

            }
            );

            response.json(appointments);

        } catch (error) {
            const err = new Error('Oops! Something wrong happened');
            return response.status(500).json({ error: err.message })
        }

    }

    public static getAppointmentById = async (request: Request, response: Response) => {
        try {
            const appointmentId = +request.params.appointmentId;
            const appointment = await Appointment.findOne({
                where: {
                    appointmentId: appointmentId,
                    userId: request.user.userId,
                },
                include: [
                    {
                        model: Barber,
                        attributes: ['name', 'lastname', 'image', 'barberId']
                    },
                    {
                        model: Service,
                        attributes: ['name', 'serviceId'],
                        through: {
                            attributes: ['current_price']
                        }
                    }
                ],
                attributes: ['date', 'time', 'status', 'appointmentId']

            })

            if (!appointment) {
                const error = new Error('Cita no encontrada');
                return response.status(404).json({ error: error.message });
            }



            response.status(200).json(appointment);

        } catch (error) {
            const err = new Error('Oops! Something wrong happened');
            return response.status(500).json({ error: err.message })
        }

    }

    public static updateAppointment = async (request: Request, response: Response) => {
        try {
            const appointmentId = +request.params.appointmentId;
            const { barberId, time, date, services }: Appointment = request.body;
            const dateCurrently = moment();


            const appointment = await Appointment.findByPk(appointmentId, {
                include: [
                    {
                        model: Barber,
                        attributes: ['name', 'lastname', 'image', 'barberId']
                    },

                    {
                        model: Service,
                        attributes: ['name', 'serviceId'],
                        through: {
                            attributes: ['current_price']
                        }
                    }
                ]
            });

            if (!appointment) {
                const error = new Error('Cita no encontrada');
                return response.status(404).json({ error: error.message });
            }

            const dateUpdated = moment(appointment.date, 'YYYY-MM-DD');


            if (!dateUpdated.isValid() || dateUpdated.isSameOrBefore(dateCurrently)) {
                return response.status(400).json({ error: 'La fecha propuesta debe ser válida y mayor a la fecha actual' });
            }

            const diff24Hours = Math.abs(moment.duration(dateCurrently.diff(appointment.date)).asHours());

            if (diff24Hours < 24) {
                response.status(404).json({ error: 'No se puede Actualizar la cita dentro de las 24 horas previas a la cita original' })
                return;
            }

            // Llama a la función de disponibilidad del barbero con los parámetros adecuados
            const isAvailable = await barberAvailable(barberId, new Date(date), time);

            if (!isAvailable) {
                const error = new Error('El barbero no está disponible en esa hora');
                return response.status(400).json({ error: error.message });
            }

            appointment.barberId = barberId;
            appointment.time = time;
            appointment.date = date;

            await AppointmentService.destroy({ where: { appointmentId } })

            await Promise.all(services.map(async serviceId => {

                const service = await Service.findByPk(+serviceId)
                const price = service.price;

                const appointmentService = new AppointmentService({
                    appointmentId: appointment.appointmentId,
                    serviceId,
                    current_price: price
                });

                await appointmentService.save();
            }))

            await appointment.save();

            response.status(200).send('La cita se ha actualizado con éxito')


        } catch (error) {
            const err = new Error('Oops! Something wrong happened');
            return response.status(500).json({ error: err.message })
        }
    }

    public static cancelAppointment = async (request: Request, response: Response) => {
        try {
            const appointmentId = +request.params.appointmentId;
            const dateCurrently = moment();

            const appointment = await Appointment.findByPk(appointmentId);

            if (!appointment) {
                const error = new Error('Cita no encontrada');
                return response.status(404).json({ error: error.message });
            }

            const diff24Hours = Math.abs(moment.duration(dateCurrently.diff(appointment.date)).asHours());

            if (diff24Hours < 24) {
                response.status(404).json({ error: 'No se puede Cancelar la cita dentro de las 24 horas previas a la cita original, te invitamos a leer nuestra política de citas' })
                return;
            }

            appointment.status = 'cancelled';
            appointment.save();
            response.status(200).send('Has cancelado tu cita');

        } catch (error) {
            const err = new Error('Oops! Something wrong happened');
            return response.status(500).json({ error: err.message });
        }
    }

    public static cancellationReason = async (request: Request, response: Response) => {
        try {

            const cancellationReasons = new AppointmentCancellation(request.body);
            cancellationReasons.save();
            response.status(201).send('Gracias por hacernos saber el motivo de cancelación');

        } catch (error) {
            const err = new Error('Oops! Something wrong happened');
            return response.status(500).json({ error: err.message });
        }

    }

    public static deleteAppointment = async (request: Request, response: Response) => {
        try {
            const appointmentId = +request.params.appointmentId;

            const appointment = await Appointment.findByPk(appointmentId);

            if (!appointment) {
                const error = new Error('Cita no encontrada');
                return response.status(400).json({
                    msg: error.message
                })
            }

            await AppointmentService.destroy({
                where: {
                    appointmentId
                }
            })

            await appointment.destroy();

            response.status(200).send('La cita ha sido eliminada');

        } catch (error) {
            const err = new Error('Oops! Something wrong happened');
            return response.status(500).json({ error: err.message });
        }
    }

    //Ingresos mensuales por todas la citas atendidas
    public static monthlyRevenueAppointment = async (request: Request, response: Response) => {

        try {

            const { month, year } = request.query;

            if (!month || !year) {
                return response.status(400).json({ message: "Mes y año son requeridos." });
            }

            // Crear el rango de fechas para el mes
            const startDate = new Date(Number(year), Number(month) - 1, 1); // Primer día del mes
            const endDate = new Date(Number(year), Number(month), 0); // Último día del mes

            const dailyRevenue = await AppointmentService.findAll({
                attributes: [
                    [fn('DAY', col('appointment.date')), 'day'],
                    [fn('SUM', col('current_price')), 'revenue']
                ],

                include: [
                    {
                        model: Appointment,
                        attributes: [],
                        where: {
                            date: { [Op.between]: [startDate, endDate] },
                            status: 'completed'
                        }
                    }
                ],

                group: [fn('DAY', col('appointment.date'))],
                order: [fn('DAY', col('appointment.date'))]
            })

            response.status(200).json(dailyRevenue);
        } catch (error) {
            console.log(error)
            const err = new Error('Oops! Something wrong happened');
            return response.status(500).json({ error: err.message });

        }

    }
}

export default AppointmentController;
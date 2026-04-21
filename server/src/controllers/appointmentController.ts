import type { NextFunction, Request, Response } from "express";
import Appointment from "../models/Appointment";
import AppointmentService from "../models/AppointmentService";
import { col, fn, Op } from "sequelize";
import { IAppointmentService } from "../interfaces/services/IAppointmentService";

class AppointmentController {

    constructor(private appointmentService: IAppointmentService) { }

    public makeAppointment = async (request: Request, response: Response, next: NewableFunction) => {
        try {
            await this.appointmentService.makeAppointment(request.body, request.user.userId);
            response.status(201).send('Cita creada con éxito');
        } catch (error) {
<<<<<<< HEAD
            next(error)
=======
            const err = new Error('Oops! Something wrong happened');
            console.log(error)
            return response.status(500).json({ error: err.message })
>>>>>>> 1e803b7c6dbd3b5fa08f85fd38571e21583c68eb
        }
    }

    public getAppointmentUserAuth = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const appointments = await this.appointmentService.getAppointmentsByUser(request.user.userId);
            response.status(200).json(appointments);
        } catch (error) {
            next(error);
        }
    }

    public getAppointmentById = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const appointmentId = +request.params.appointmentId;
            const userId = request.user.userId;

            const appointment = await this.appointmentService.getAppointmentById(appointmentId, userId);
            response.status(200).json(appointment);

        } catch (error) {
            next(error)
        }
    }

    public updateAppointment = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const appointmentId = +request.params.appointmentId;
            await this.appointmentService.updateAppointment(appointmentId, request.user.userId, request.body);
            response.status(200).send('La cita se ha actualizado con éxito')
        } catch (error) {
            next(error)
        }
    }

    public cancelAppointment = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const appointmentId = +request.params.appointmentId;
            await this.appointmentService.cancelAppointment(appointmentId, request.user.userId);
            response.status(200).send('Su cita ha sido cancelada con éxito');
        } catch (error) {
            next(error)
        }
    }

    public cancellationReason = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.appointmentService.cancellationReason(request.body);
            response.status(201).send('Gracias por hacernos saber el motivo de cancelación');
        } catch (error) {
            next(error);
        }

    }

    public deleteAppointment = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const appointmentId = +request.params.appointmentId;
            await this.appointmentService.deleteAppointment(appointmentId);
            response.status(200).send('La cita ha sido eliminada');
        } catch (error) {
            console.log(error)
            next(error);
        }
    }
    //Ingresos mensuales por todas la citas atendidas
    public  monthlyRevenueAppointment = async (request: Request, response: Response) => {

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
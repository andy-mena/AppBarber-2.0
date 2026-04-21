import type { Request, Response } from "express"
import User from "../models/User";
import Appointment from "../models/Appointment";
import { col, fn, literal, Op } from "sequelize";
import AppointmentService from "../models/AppointmentService";

export class CustomerController {

    public static getCustomers = async (request: Request, response: Response) => {
        try {
            const customers = await User.findAll({
                attributes: [
                    'userId',
                    'name',
                    'email',
                    'lastname',
                    'image',
                    'phone',
                    [fn('COUNT', col('appointment.appointmentId')), 'totalAppointments'], // Cuenta citas asociadas
                    [fn('MAX', col('appointment.date')), 'lastAppointment'] // Última cita asociada
                ],
                include: [
                    {
                        model: Appointment,
                        as: 'appointment',
                        attributes: [], // No necesitamos columnas de Appointment directamente
                        required: false // LEFT JOIN para incluir usuarios sin citas
                    }
                ],
                group: ['userId'], // Agrupa por la clave primaria del modelo User
                order: [[literal('totalAppointments'), 'DESC']] // Ordena por total de citas
            });

            response.status(200).json(customers);

        } catch (error) {
            console.log(error);
            const err = new Error("Oops! Error del servidor");
            response.status(500).json({ error: err.message })
        }

    }

    public static getMonthlyVisit = async (request: Request, response: Response) => {
        try {

            const data = await Appointment.findAll({
                where: {
                    status: 'completed'
                },
                attributes: [
                    [fn('MONTHNAME', col('date')), 'month'],
                    [fn('COUNT', literal('*')), 'totalAppointments']
                ],
                group: [fn('MONTH', col('date')), fn('MONTHNAME', col('date'))],     // Agrupa por mes
                order: [[literal('month'), 'ASC']],
            })

            response.status(200).json(data)

        } catch (error) {
            const err = new Error("Oops! Error del servidor");
            response.status(500).json({ error: err.message })
        }

    }

    public static getLastMonthCustomer = async (request: Request, response: Response) => {
        try {

            const customerCount = await User.count({
                where: {
                    createdAt: {
                        [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1))
                    }
                },
            })

            response.status(200).json(customerCount)

        } catch (error) {
            console.log(error);
            const err = new Error("Oops! Error del servidor");
            response.status(500).json({ error: err.message })
        }
    }

    public static totalAppointmentsMonth = async (request: Request, response: Response) => {
        try {
            const totalAppointmentsThisMonth = await Appointment.count({
                where: {
                    date: {
                        [Op.and]: [
                            { [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }, // Primer día del mes
                            { [Op.lt]: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1) } // Primer día del siguiente mes
                        ]
                    },
                    status: 'completed'
                }
            });

            response.status(200).json(totalAppointmentsThisMonth)

        } catch (error) {
            const err = new Error("Oops! Error del servidor");
            response.status(500).json({ error: err.message })
        }
    }

    public static totalServiceMonth = async (request: Request, response: Response) => {
        try {
            const totalServices = await AppointmentService.count({
                include: [
                    {
                        model: Appointment,
                        where: {
                            date: {
                                [Op.gte]: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // Primer día del mes
                                [Op.lt]: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
                            },
                            status: 'completed'
                        }
                    }
                ]
            })

            response.status(200).json(totalServices)

        } catch (error) {
            const err = new Error("Oops! Error del servidor");
            response.status(500).json({ error: err.message })
        }

    }

    public static deleteCustomer = async (request: Request, response: Response) => {
        try {
            const userId = +request.params.userId;

            const customer = await User.findByPk(userId);

            if (!customer) {
                const error = new Error("Este usuario no existe");
                return response.status(401).json({ error: error.message })
            }

            await customer.destroy();

            response.status(200).send("Usuario eliminado correctamente");

        } catch (error) {
            const err = new Error("Oops! Error del servidor");
            response.status(500).json({ error: err.message })
        }

    }
}
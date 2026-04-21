import { IAppointmentRepository } from "../interfaces/repositories/IAppointmentRepository";
import Appointment from "../models/Appointment";
import AppointmentCancellation from "../models/AppointmentCancellation";
import AppointmentService from "../models/AppointmentService";
import Barber from "../models/Barber";
import Service from "../models/Service";

class AppointmentRepository implements IAppointmentRepository {

    async save(appointment: Appointment, services: Service[]): Promise<void> {
        //Almacena la cita en la base de datos
        await appointment.save();

        //Almacena los servicios de la cita en la base de datos
        await Promise.all(services.map(async (serviceId) => {
            const service = await Service.findByPk(+serviceId);
            const price = service.price;

            const appointmentService = new AppointmentService({
                appointmentId: appointment.appointmentId,
                serviceId: service.serviceId,
                current_price: price
            })
            await appointmentService.save();
        }))
    }

    async findByUser(userId: Appointment["userId"]): Promise<Appointment[]> {
        return await Appointment.findAll({
            where: { userId },
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
    }

    async findByAppointmentId(appointmentId: Appointment["appointmentId"]): Promise<Appointment | null> {
        return await Appointment.findOne({
            where: { appointmentId },
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
        });
    }

    async findById(appointmentId: Appointment["appointmentId"], userId: Appointment["userId"]): Promise<Appointment | null> {
        return await Appointment.findOne({
            where: {
                appointmentId,
                userId
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
    }

    async update(appointmentId: Appointment["appointmentId"], appointment: Appointment, services: Appointment['services']): Promise<void> {

        await AppointmentService.destroy({ where: { appointmentId } });

        await Promise.all(services.map(async serviceId => {

            const service = await Service.findByPk(+serviceId)
            const price = service.price;

            const appointmentService = new AppointmentService({
                appointmentId,
                serviceId,
                current_price: price
            });

            await appointmentService.save();
        }))

        await appointment.save();
    }

    async saveCancelAppointment(appointment: Appointment): Promise<void> {
        // Actualiza el estado de la cita a "cancelled"
        appointment.status = "cancelled";
        // Guarda los cambios en la base de datos
        await appointment.save();
    }

    async saveCancellationReason(cancellationReasonData: AppointmentCancellation): Promise<void> {
        await cancellationReasonData.save();
    }

    async destroy(appointmentId: Appointment["appointmentId"], appointment: Appointment): Promise<void> {

        await AppointmentService.destroy({
            where: {
                appointmentId
            }
        });

        await appointment.destroy();
    }
}

export default AppointmentRepository;
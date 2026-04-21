import AppError from "../errors/AppError";
import { barberAvailable } from "../helpers/barberAvailable";
import { IAppointmentRepository } from "../interfaces/repositories/IAppointmentRepository";
import { IAppointmentService } from "../interfaces/services/IAppointmentService";
import { IBarberService } from "../interfaces/services/IBarberService";
//models
import Appointment from "../models/Appointment";
import User from "../models/User";
import AppointmentCancellation from "../models/AppointmentCancellation";
import DateValidator from "../helpers/DateValidator";


class AppointmentService implements IAppointmentService {

    constructor(
        private appointmentRepository: IAppointmentRepository,
        private barberService: IBarberService,
        private dateValidator: DateValidator
    ) { }

    async makeAppointment(appointment: Appointment, userId: User['userId']): Promise<void> {
        const { barberId, time, date, services } = appointment;
        await this.barberService.getBarberById(barberId);

        //Validar disponibilidad del barbero
        const isAvailable = await barberAvailable(barberId, new Date(date), time);
        if (!isAvailable) {
            throw new AppError('Barbero no disponible en la fecha y hora seleccionada', 400);
        }

        //Validar fecha y hora
        this.dateValidator.validateFutureDate(date, time);
        this.dateValidator.validateTime(time);

        //Crear la cita
        const newAppointment = new Appointment({
            barberId,
            time,
            date,
            userId: userId
        });

        //Llamar al repositorio para guardar la cita
        await this.appointmentRepository.save(newAppointment, services);
    }

    async getAppointmentsByUser(userId: User["userId"]): Promise<Appointment[]> {
        const appointments = await this.appointmentRepository.findByUser(userId);
        return appointments;
    }

    async getAppointment(appointmentId: Appointment["appointmentId"]): Promise<Appointment | null> {
        const appointment = await this.appointmentRepository.findByAppointmentId(appointmentId);
        if (!appointment) {
            throw new AppError('Cita no encontrada', 404);
        }
        return appointment;
    }

    async getAppointmentById(appointmentId: Appointment["appointmentId"], userId: User["userId"]): Promise<Appointment | null> {

        const appointment = await this.appointmentRepository.findById(appointmentId, userId)
        if (!appointment) {
            throw new AppError('Cita no encontrada', 404);
        }

        return appointment
    }

    async updateAppointment(appointmentId: Appointment["appointmentId"], userId: Appointment['userId'], appointmentData: Appointment): Promise<void> {

        //Obtener la cita a actualizar
        const appointment = await this.getAppointmentById(appointmentId, userId);

        //Validar el cumplimiento de la fecha y hora
        this.dateValidator.validateFutureDate(appointmentData.date, appointmentData.time);
        this.dateValidator.validateDiffHour(appointment.date);
        this.dateValidator.validateTime(appointmentData.time);

        //Validar que el barbero esté disponible
        const isAvailable = await barberAvailable(appointmentData.barberId, new Date(appointmentData.date), appointmentData.time);
        if (!isAvailable) {
            throw new AppError('El barbero no está disponible en esa hora', 400);
        }


        //Actualizar la cita
        appointment.barberId = appointmentData.barberId;
        appointment.time = appointmentData.time;
        appointment.date = appointmentData.date;

        //Llamar al repositorio para actualizar la cita
        await this.appointmentRepository.update(appointmentId, appointment, appointmentData.services);
    }

    async cancelAppointment(appointmentId: Appointment["appointmentId"], userId: User['userId']): Promise<void> {
        const appointment = await this.getAppointmentById(appointmentId, userId);
        this.dateValidator.validateDiffHour(appointment.date);
        await this.appointmentRepository.saveCancelAppointment(appointment);
    }

    async cancellationReason(cancellationReasonData: Pick<AppointmentCancellation, 'cancellation_reason' | 'additional_comments'>): Promise<void> {
        const cancellationReason = new AppointmentCancellation(cancellationReasonData);
        await this.appointmentRepository.saveCancellationReason(cancellationReason)
    }

    async deleteAppointment(appointmentId: Appointment["appointmentId"]): Promise<void> {

        const appointment = await this.getAppointment(appointmentId);
        console.log(appointment);
        await this.appointmentRepository.destroy(appointmentId, appointment);
    }
}

export default AppointmentService;
import Appointment from "../../models/Appointment";
import AppointmentCancellation from "../../models/AppointmentCancellation";
import User from "../../models/User";

export interface IAppointmentService {
    makeAppointment(appointment: Appointment, userId : User['userId']) : Promise<void>;
    getAppointmentsByUser(userId: User['userId']): Promise<Appointment[]>;
    getAppointment(appointmentId: Appointment['appointmentId']): Promise<Appointment | null>;
    getAppointmentById(appointmentId: Appointment['appointmentId'], userId: User['userId']): Promise<Appointment | null>;
    updateAppointment(appointmentId: Appointment['appointmentId'], userId : Appointment['userId'], appointment: Appointment) : Promise<void>;
    cancelAppointment(appointmentId: Appointment['appointmentId'], userId: User['userId']) : Promise<void>;
    cancellationReason(cancellationReasonData : Pick<AppointmentCancellation, 'cancellation_reason' | 'additional_comments'>): Promise<void>;
    deleteAppointment(appointmentId: Appointment['appointmentId']) : Promise<void>;
}
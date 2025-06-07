import Appointment from "../../models/Appointment";
import AppointmentCancellation from "../../models/AppointmentCancellation";
import Service from "../../models/Service";

export interface IAppointmentRepository {
    save(appointment: Appointment, service: Service[]): Promise<void>;
    findByUser(userId : Appointment['userId']) : Promise<Appointment[]>;
    findByAppointmentId(appointmentId: Appointment['appointmentId']): Promise<Appointment | null>;
    findById(appointmentId: Appointment['appointmentId'], userId : Appointment['userId']): Promise<Appointment | null>;
    update(appointmentId: Appointment['appointmentId'], appointment: Appointment, services: Appointment['services']): Promise<void>;
    saveCancelAppointment(appointment: Appointment) : Promise<void>;
    saveCancellationReason(cancellationReasonData: AppointmentCancellation) : Promise<void>;
    destroy(appointmentId: Appointment['appointmentId'], appointment: Appointment) : Promise<void>;

}

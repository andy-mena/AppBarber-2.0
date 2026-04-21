import AppointmentController from "../../controllers/appointmentController";
import AppointmentRepository from "../../repositories/appointmentRepository";
import AppointmentService from "../../services/appointmentService";

import BarberRepository from "../../repositories/barberRepository";
import BarberService from "../../services/barberService";
import DateValidator from "../../helpers/DateValidator";

const barberRepository = new BarberRepository();
const barberService = new BarberService(barberRepository);

const dateValidator = new DateValidator();

const appointmentRepository = new AppointmentRepository();
const appointmentService = new AppointmentService(appointmentRepository, barberService,dateValidator);
const appointmentController = new AppointmentController(appointmentService);

export {
    appointmentController
}
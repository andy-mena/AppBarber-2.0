import { Router } from 'express'
import { body, param } from 'express-validator'
import { authenticate } from '../middleware/auth';
import AppointmentController from '../controllers/appointmentController';
import { handleInputErrors } from '../middleware/Validation';
import { isAdmin } from '../middleware/admin';

const route = Router();
route.use(authenticate);


route.post(
    '/make-appointment',
    body('barberId')
        .isNumeric().withMessage('ID del barbero no válido'),
    body('time')
        .notEmpty().withMessage('La hora no puede ir vacía'),
    body('date')
        .isISO8601().withMessage('Fecha no válida').toDate(),
    body('services')
        .isArray().withMessage('Servicios debe ser un array')
        .custom(services => services.every((serviceId: string) => !isNaN(parseInt(serviceId)))).withMessage('Todos los IDs de servicios deben ser numéricos'),
    handleInputErrors,
    AppointmentController.makeAppointment
);

route.put(
    '/update-appointment/:appointmentId',
    param('appointmentId')
        .isNumeric().withMessage('ID de cita no válido'),
    body('barberId')
        .isNumeric().withMessage('ID del barbero no válido'),
    body('time')
        .notEmpty().withMessage('La hora no puede ir vacía'),
    body('date')
        .isISO8601().withMessage('Fecha no válida').toDate(),
    body('services')
        .isArray().withMessage('Servicios debe ser un array')
        .custom(services => services.every((serviceId: string) => !isNaN(parseInt(serviceId)))).withMessage('Todos los IDs de servicios deben ser numéricos'),
    handleInputErrors,
    AppointmentController.updateAppointment
)

route.patch(
    '/cancel-appointment/:appointmentId',
    param('appointmentId')
        .isNumeric().withMessage('ID de cita no válido'),
    handleInputErrors,
    AppointmentController.cancelAppointment
)

route.get(
    '/user/appointments',
    AppointmentController.getAppointmentUserAuth
)

route.get(
    '/monthly-revenue',
    isAdmin,
    AppointmentController.monthlyRevenueAppointment
)

route.get(
    '/:appointmentId',
    param('appointmentId')
        .isNumeric().withMessage('ID de cita no válido'),
    handleInputErrors,
    AppointmentController.getAppointmentById
)

route.post(
    '/cancellation-reason',
    body('cancellation_reason')
        .notEmpty().withMessage('El motivo no puede ir vacío'),
    body('additional_comments')
        .notEmpty().withMessage('El comentario no puede ir vacío'),
    handleInputErrors,
    AppointmentController.cancellationReason
)

route.delete(
    '/delete-appointment/:appointmentId',
    param('appointmentId')
        .isNumeric().withMessage('ID de cita no válido'),
    handleInputErrors,
    isAdmin,
    AppointmentController.deleteAppointment
)



export default route;


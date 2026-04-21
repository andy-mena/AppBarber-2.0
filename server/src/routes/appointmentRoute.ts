import { Router } from 'express'
import { body, param } from 'express-validator'
import { authenticate } from '../middleware/auth';
import { appointmentController } from '../config/container';
import { handleInputErrors } from '../middleware/Validation';
import { isAdmin } from '../middleware/admin';

const route = Router();
route.use(authenticate);


route.post(
    '/create',
    body('barberId')
        .isNumeric().withMessage('ID del barbero no válido'),
    body('time')
        .notEmpty().withMessage('La hora no puede ir vacía'),
    //Validar que la fecha sea mayor a la actual y que sea una fecha válida
    body('date')
        .isISO8601().withMessage('Fecha no válida').toDate(),
    body('services')
        .isArray({min: 1}).withMessage('Servicios debe ser un array')
        .custom(services => services.every((serviceId: string) => !isNaN(parseInt(serviceId)))).withMessage('Todos los IDs de servicios deben ser numéricos'),
    handleInputErrors,
    appointmentController.makeAppointment
);

route.put(
    '/:appointmentId/update',
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
    appointmentController.updateAppointment
)

route.patch(
    '/:appointmentId/cancel',
    param('appointmentId')
        .isNumeric().withMessage('ID de cita no válido'),
    handleInputErrors,
    appointmentController.cancelAppointment
)

route.get(
    '/user/appointments',
<<<<<<< HEAD
    appointmentController.getAppointmentUserAuth
)

route.get(
=======
    AppointmentController.getAppointmentUserAuth
)

route.get(
    '/monthly-revenue',
    isAdmin,
    AppointmentController.monthlyRevenueAppointment
)

route.get(
>>>>>>> 1e803b7c6dbd3b5fa08f85fd38571e21583c68eb
    '/:appointmentId',
    param('appointmentId')
        .isNumeric().withMessage('ID de cita no válido'),
    handleInputErrors,
    appointmentController.getAppointmentById
)

route.post(
    '/cancellation/reason',
    body('cancellation_reason')
        .notEmpty().withMessage('El motivo no puede ir vacío'),
    body('additional_comments')
        .notEmpty().withMessage('El comentario no puede ir vacío'),
    handleInputErrors,
    appointmentController.cancellationReason
)

route.delete(
    '/:appointmentId/delete',
    param('appointmentId')
        .isNumeric().withMessage('ID de cita no válido'),
    handleInputErrors,
    isAdmin,
    appointmentController.deleteAppointment
)

<<<<<<< HEAD
route.get(
    '/monthly-revenue',
    isAdmin,
    appointmentController.monthlyRevenueAppointment
)
=======

>>>>>>> 1e803b7c6dbd3b5fa08f85fd38571e21583c68eb

export default route;


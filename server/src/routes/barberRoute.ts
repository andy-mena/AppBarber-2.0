import { Router } from 'express'
import { body, param } from 'express-validator';
import { authenticate } from '../middleware/auth';
import { barberController } from '../config/container';
import { handleInputErrors } from '../middleware/Validation';
import { isAdmin } from '../middleware/admin';
import upload from '../middleware/uploadFiles';

const route = Router();
route.use(authenticate);

route.get(
    '/barbers',
    barberController.getBarbers
)

route.get(
    '/:barberId',
    param('barberId')
        .isNumeric().withMessage('ID no valido'),
    handleInputErrors,
    barberController.getBarberById
)

route.post(
    '/create',
    isAdmin, // Verificación de autenticación primero
    upload.single('image'), // Manejo de la carga de la imagen antes de las validaciones
    body('name').notEmpty().withMessage('El nombre del barbero es requerido'),
    body('lastname').notEmpty().withMessage('El apellido del barbero es requerido'),
    body('phone').notEmpty().withMessage('El numero telefónico es requerido'),
    body('email').isEmail().withMessage('El email es requerido'),
    body('specialty').notEmpty().withMessage('La especialidad es requerida'),
    handleInputErrors, // Manejo de los errores de validación
    barberController.createBarber
);

route.put(
    '/:barberId/update',
    isAdmin,
    upload.single('image'),
    param('barberId').isNumeric().withMessage('ID no valido'),
    body('name').notEmpty().withMessage('El nombre del barbero es requerido'),
    body('lastname').notEmpty().withMessage('El apellido del barbero es requerido'),
    body('phone').notEmpty().withMessage('El numero telefónico es requerido'),
    body('email').isEmail().withMessage('El email es requerido'),
    body('specialty').notEmpty().withMessage('La especialidad es requerida'),
    handleInputErrors,
    barberController.updateBarber
);

route.delete(
    '/:barberId/delete',
    isAdmin,
    param('barberId').isNumeric().withMessage('ID no valido'),
    handleInputErrors,
    barberController.deleteBarber
);

route.get(
    '/appointment/data',
    isAdmin,
    barberController.barberData
);

route.get(
    '/income/data',
    isAdmin,
    barberController.barbersIncome
);

export default route;
import { body , param} from 'express-validator'
import { handleInputErrors } from "../middleware/Validation";
import { authenticate } from '../middleware/auth'
import { isAdmin } from '../middleware/admin'
import { Router } from 'express';
import { serviceController } from '../config/container';

const route = Router();

//todas las consultas hacia servicio, el usuario debe estar autenticado
route.use(authenticate);

route.get(
    '/services',
    serviceController.getAllServices
);

route.get(
    '/get-top-services',
    isAdmin,
    serviceController.getTopServices
)

route.get(
    '/:serviceId',
    isAdmin,
    param('serviceId')
        .isNumeric().withMessage('ID no valido'),
    handleInputErrors,
    serviceController.getServiceById
);

route.post(
    '/create',
    isAdmin,
    body('name')
        .notEmpty().withMessage('El nombre del servicio es requerido'),
    body('price')
        .notEmpty().withMessage('El precio del servicio es requerido'),
    handleInputErrors,
    serviceController.newService
)

route.put(
    '/:serviceId/update',
    isAdmin,
    param('serviceId')
        .isNumeric().withMessage('ID no valido'),
    body('name')
        .notEmpty().withMessage('El nombre del servicio es requerido'),
    body('price')
        .notEmpty().withMessage('El precio del servicio es requerido'),
    handleInputErrors,
    serviceController.updateService
)

route.delete(
    '/:serviceId/delete',
    isAdmin,
    param('serviceId')
        .isNumeric().withMessage('ID no valido'),
    handleInputErrors,
    serviceController.deleteService
)


export default route;

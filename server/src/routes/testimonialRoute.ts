import { Router } from 'express'
import { body, param } from 'express-validator'
import { authenticate } from '../middleware/auth'
import { handleInputErrors } from '../middleware/Validation';
import { testimonialController } from '../config/container';
import { isAdmin } from '../middleware/admin';

const route = Router();
route.use(authenticate);

route.post(
    '/create',
    body('title')
        .notEmpty().withMessage('EL titulo es requerido'),
    body('message')
        .notEmpty().withMessage('EL testimonial es requerido'),
    handleInputErrors,
    testimonialController.createTestimonial
)
route.get(
    '/testimonials/approved',
    isAdmin,
    testimonialController.getTestimonialsApproved
)
route.get(
    '/testimonials',
    isAdmin,
    testimonialController.getAllTestimonials
)
route.get(
    '/:testimonialId',
    param('testimonialId')
        .isNumeric().withMessage('ID del testimonial no valido'),
    handleInputErrors,
    isAdmin,
    testimonialController.getTestimonialById
)
route.patch(
    '/:testimonialId/status',
    param('testimonialId')
        .isNumeric().withMessage('ID del testimonial no valido'),
    handleInputErrors,
    isAdmin,
    testimonialController.updateStatusTestimonial
)
route.delete(
    '/:testimonialId/delete',
    param('testimonialId')
        .isNumeric().withMessage('ID del testimonial no valido'),
    isAdmin,
    testimonialController.deleteTestimonial
)

export default route;





import TestimonialsController from "../../controllers/testimonialController";
import TestimonialRepository from "../../repositories/testimonialRepository";
import TestimonialService from "../../services/testimonialService";

const testimonialRepository = new TestimonialRepository();
const testimonialService = new TestimonialService(testimonialRepository);
const testimonialController = new TestimonialsController(testimonialService);

export { testimonialController }
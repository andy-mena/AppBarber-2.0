import Testimonials from "../../models/Testimonials";
import User from "../../models/User";

export interface ITestimonialService {
    createTestimonial: (testimonial: Testimonials, userId: User['userId']) => Promise<void>;
    getTestimonialsApproved: () => Promise<Testimonials[]>;
    getAllTestimonials: () => Promise<Testimonials[]>;
    getTestimonialById: (testimonialId: Testimonials['testimonialId']) => Promise<Testimonials | null>;
    updateStatusTestimonial: (testimonialId: Testimonials['testimonialId'], status: Testimonials['status']) => Promise<void>;
    deleteTestimonial: (testimonialId: Testimonials['testimonialId']) => Promise<void>
}
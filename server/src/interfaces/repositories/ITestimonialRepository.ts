import Testimonials from "../../models/Testimonials";

export interface ITestimonialRepository {
    save: (testimonial: Testimonials) => Promise<void>;
    findAllApproved: () => Promise<Testimonials[]>;
    findAll: () => Promise<Testimonials[]>;
    findById: (testimonialId: Testimonials['testimonialId']) => Promise<Testimonials | null>;
    updateStatus: (testimonial: Testimonials, status: Testimonials['status']) => Promise<void>;
    delete: (testimonial: Testimonials) => Promise<void>;
}
import AppError from "../errors/AppError";
import { ITestimonialRepository } from "../interfaces/repositories/ITestimonialRepository";
import { ITestimonialService } from "../interfaces/services/ITestimonialService";
import Testimonials from "../models/Testimonials";
import User from "../models/User";

class TestimonialService implements ITestimonialService {

    constructor(private testimonialRepository: ITestimonialRepository) { }

    async createTestimonial(testimonialData: Testimonials, userId: User['userId']): Promise<void> {
        const testimonial = new Testimonials({
            ...testimonialData,
            userId: userId
        });
        await this.testimonialRepository.save(testimonial);
    }

    async getTestimonialsApproved(): Promise<Testimonials[]> {
        return await this.testimonialRepository.findAllApproved();
    }

    async getAllTestimonials(): Promise<Testimonials[]> {
        return await this.testimonialRepository.findAll();
    }

    async getTestimonialById(testimonialId: Testimonials['testimonialId']): Promise<Testimonials | null> {
        const testimonial = await this.testimonialRepository.findById(testimonialId);
        // Si no se encuentra el testimonio, lanzar un error
        if (!testimonial) {
            throw new AppError('Testimonial no encontrado', 404);
        }
        return testimonial;
    }

    async updateStatusTestimonial(testimonialId: Testimonials['testimonialId'], status: Testimonials['status']): Promise<void> {
        const testimonial = await this.getTestimonialById(testimonialId);
        await this.testimonialRepository.updateStatus(testimonial, status);
    }

    async deleteTestimonial(testimonialId: Testimonials['testimonialId']): Promise<void> {
        const testimonial = await this.getTestimonialById(testimonialId);
        await this.testimonialRepository.delete(testimonial); ''
    }
}


export default TestimonialService;
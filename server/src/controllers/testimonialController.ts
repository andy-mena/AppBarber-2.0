import type { Response, Request, NextFunction } from "express";
import { ITestimonialService } from "../interfaces/services/ITestimonialService";

class TestimonialsController {

    constructor(private testimonialService: ITestimonialService) { }

    public createTestimonial = async (request: Request, response: Response, next: NextFunction) => {
        try {
            await this.testimonialService.createTestimonial(request.body, request.user.userId);
            response.status(201).send('Testimonial creado correctamente');
        } catch (error) {
            next(error);
        }
    }

    public getTestimonialsApproved = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const testimonials = await this.testimonialService.getTestimonialsApproved();
            response.status(200).json(testimonials);
        } catch (error) {
            next(error);
        }
    }

    public getAllTestimonials = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const testimonials = await this.testimonialService.getAllTestimonials();
            response.status(200).json(testimonials);
        } catch (error) {
            next(error)
        }
    }

    public getTestimonialById = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const testimonialId = +request.params.testimonialId;
            const testimonial = await this.testimonialService.getTestimonialById(testimonialId);
            response.status(200).json(testimonial);
        } catch (error) {
            next(error);
        }
    }

    public updateStatusTestimonial = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const testimonialId = +request.params.testimonialId;
            await this.testimonialService.updateStatusTestimonial(testimonialId, request.body.status);
            response.status(200).send('Se ha cambiado el estado del testimonial');
        } catch (error) {
            next(error)
        }
    }

    public deleteTestimonial = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const testimonialId = +request.params.testimonialId;
            await this.testimonialService.deleteTestimonial(testimonialId);
            response.status(200).send('Testimonial eliminado correctamente');
        } catch (error) {
            next(error)
        }
    }
}

export default TestimonialsController;
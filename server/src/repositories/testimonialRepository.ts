import { ITestimonialRepository } from "../interfaces/repositories/ITestimonialRepository";
import Testimonials from "../models/Testimonials";
import User from "../models/User";

class TestimonialRepository implements ITestimonialRepository {

    async save(testimonial: Testimonials): Promise<void> {
        await testimonial.save();
    }

    async findAllApproved(): Promise<Testimonials[]> {
        return await Testimonials.findAll({
            where: {
                status: "approved"
            },
            order: [
                ['date', 'DESC'],
            ],
            include: [
                {
                    model: User,
                    attributes: ['name', 'lastname', 'image'],
                },
            ],
        });
    }

    async findAll(): Promise<Testimonials[]> {
        return await Testimonials.findAll({
            order: [
                ['date', 'DESC'],
            ],
            include: [
                {
                    model: User,
                    attributes: ['name', 'lastname', 'image'],
                },
            ],
        });
    }

    async findById(testimonialId: Testimonials['testimonialId']): Promise<Testimonials | null> {
        return await Testimonials.findByPk(testimonialId, {
            include: [
                {
                    model: User,
                    attributes: ['name', 'lastname', 'image'],
                },
            ],
        });
    }

    async updateStatus(testimonial: Testimonials, status: Testimonials['status']): Promise<void> {
        await testimonial.update({ status: status })
        await testimonial.save();
    }

    async delete(testimonial: Testimonials): Promise<void> {
        await testimonial.destroy();
    }
}

export default TestimonialRepository;
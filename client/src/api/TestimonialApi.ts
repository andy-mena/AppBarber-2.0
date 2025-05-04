import api from "@/config/axios";
import { isAxiosError } from "axios";
import { Testimonial, TestimonialForm, testimonialSchemaUser, testimonialSchemaUserArray } from "../types";

export const addTestimonial = async (formData: TestimonialForm) => {
    try {
        
        const url = '/testimonial/create';
        const { data } = await api.post<string>(url, formData);
        return data;

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }

}

export const getTestimonials = async () => {
    try {
        const url = '/testimonial/testimonials/approved';
        const { data } = await api.get(url);

        const response = testimonialSchemaUserArray.safeParse(data);
        

        if (response.success) {
            return response.data;
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }

    }
}

export const getAllTestimonials = async () => {
    try {
        const url = '/testimonial/testimonials';
        const { data } = await api.get(url);

        const response = testimonialSchemaUserArray.safeParse(data);
        if (response.success) {
            return response.data;
        }
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error);
        }
    }

}

export const getTestimonialById = async (testimonialId : Testimonial['testimonialId']) => {
    try {
        const url = `/testimonial/${testimonialId}`;
        const { data } = await api.get(url);

        const response = testimonialSchemaUser.safeParse(data);

        if(response.success){
            return response.data;
        }
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }

}

export const updateTestimonialStatus = async ({testimonialId,status} : {testimonialId : Testimonial['testimonialId'], status: Testimonial['status']}) => {
    try {
        const url = `/testimonial/${testimonialId}/status`;
        const { data } = await api.patch<string>(url, {
            status: status
        } )

        return data;
        
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }
}

export const deleteTestimonial = async (testimonialId : Testimonial['testimonialId']) => {
    try {
        const url = `/testimonial/${testimonialId}/delete`;
        const { data } = await api.delete<string>(url);
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response){
            throw new Error(error.response.data.error);
        }
    }

}
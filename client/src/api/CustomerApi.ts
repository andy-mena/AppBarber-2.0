import api from "@/config/axios";
import { isAxiosError } from "axios";
import { appointmentDataSchemaArray, customersSchemaArray } from "../types";

export const getCustomers = async () => {
    try {

        const url = `/customer/customers`;
        const { data } = await api.get(url);
        console.log(data)

        const response = customersSchemaArray.safeParse(data);

        if (response.success) {
            return response.data;
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const getCustomersLastMonth = async () => {
    try {

        const url = `/customer/last-month-customer`;
        const { data } = await api.get<number>(url);
        return data;

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const getTotalAppointmentMonth = async () => {

    try {
        const url = '/customer/total-appointment-month';
        const { data } = await api.get<number>(url);
        return data;

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }

}

export const getTotalServicesMonth = async () => {
    try {
        const url = '/customer/total-service-month'
        const { data } = await api.get<number>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}

export const getAppointmentData = async () => {
    try {
        const url = '/customer/monthly-visit';
        const { data } = await api.get(url);

        const response = appointmentDataSchemaArray.safeParse(data);

        if (response.success) {
            return response.data;
        }

    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}


export const deleteCustomer = async (userId: number) => {
    try {
        const url = `/customer/${userId}/delete`;
        const { data } = await api.delete<string>(url);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data.error)
        }
    }
}
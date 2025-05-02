import Barber from "../models/Barber"

export type UserType = {
    name: string,
    lastname: string,
    email: string,
    password: string,
    phone: string,
}

export type BarberType = Omit<Barber, 'barberId' | 'createdAt' | 'updatedAt'>

export type BarberData = {
    barberId: number,
    name: string,
    appointments: number
}

export type BarberIncome = {
    barberId: number,
    name: string,
    value: number
}

export type Services = {
    serviceId: number,
    name: string,
    price: number,
}

export type TopServices = {
    name: string,
    count: number
}

export type Appointment = {
    appointmentId: number,
    barberId: number,
    userId: number,
    date: Date,
    time: string
}
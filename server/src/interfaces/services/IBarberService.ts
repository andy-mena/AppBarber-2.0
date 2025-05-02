import Barber from "../../models/Barber";
import { BarberData, BarberIncome, BarberType } from "../../types";

export interface IBarberService {
    getBarbers(): Promise<Barber[]>;
    getBarberById(id: Barber['barberId']): Promise<Barber>;
    getBarberByEmail(email: Barber['email']): Promise<Barber>;
    createBarber(barber: BarberType, image: string): Promise<Barber>;
    updateBarber(barber: BarberType, image: string, id: Barber['barberId']): Promise<Barber>;
    deleteBarber(id: Barber['barberId']): Promise<void>;
    barberData(): Promise<BarberData[]>;
    barberIncome(): Promise<BarberIncome[]>;
}
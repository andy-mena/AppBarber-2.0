import Barber from "../../models/Barber";
import { BarberData, BarberIncome, BarberType } from "../../types";

export interface IBarberRepository {
    findAll(): Promise<Barber[]>;
    findById(id: Barber['barberId']): Promise<Barber>;
    findByEmail(email: Barber['email']): Promise<Barber>;
    save(barber: BarberType, image: string): Promise<Barber>;
    update(barber: BarberType, image: string, id: Barber['barberId']): Promise<Barber>;
    destroy(barber: Barber): Promise<void>;
    barberData(): Promise<BarberData[]>;
    barberIncome(): Promise<BarberIncome[]>
}
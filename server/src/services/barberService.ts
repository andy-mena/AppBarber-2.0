import path from "path";
import fs from 'fs';
import AppError from "../errors/AppError";
import { IBarberRepository } from "../interfaces/repositories/IBarberRepository";
import { IBarberService } from "../interfaces/services/IBarberService";
import Barber from "../models/Barber";
import { BarberData, BarberIncome, BarberType } from "../types";

class BarberService implements IBarberService {

    constructor(private barberRepository: IBarberRepository) { }

    async getBarbers(): Promise<Barber[]> {
        return await this.barberRepository.findAll();
    }

    async getBarberById(id: Barber["barberId"]): Promise<Barber> {
        const barber = await this.barberRepository.findById(id);
        if (!barber) {
            throw new AppError('El barbero no existe', 400);
        }
        return barber;
    }

    async getBarberByEmail(email: Barber["email"]): Promise<Barber> {
        const barber = await this.barberRepository.findByEmail(email);
        if (barber) {
            throw new AppError('Este barbero ya existe', 400);
        }
        return barber
    }

    async createBarber(barber: BarberType, image: string): Promise<Barber> {
        await this.getBarberByEmail(barber.email);
        return await this.barberRepository.save(barber, image)
    }

    async updateBarber(barber: BarberType, image: string, id: Barber["barberId"]): Promise<Barber> {
        const currentBarber = await this.getBarberById(id);
        if (image !== 'default.png' && currentBarber.image !== 'default.png') {
            this.deleteImage(currentBarber);
        }
        const barberUpdate = await this.barberRepository.update(barber, image, id);
        return barberUpdate;
    }

    async deleteBarber(id: Barber["barberId"]): Promise<void> {
        //Obtener el barbero a eliminar
        const barber = await this.getBarberById(id);
        //Elimina la imagen del sistema de archivos
        this.deleteImage(barber);
        //eliminar de la base de datos
        await this.barberRepository.destroy(barber)
    }

    async barberData(): Promise<BarberData[]> {
        return await this.barberRepository.barberData();
    }

    async barberIncome(): Promise<BarberIncome[]> {
        return await this.barberRepository.barberIncome();
    }

    private deleteImage(barber: BarberType) {
        const image = barber.image;
        const imagePath = path.join(__dirname, '..', 'uploads', image);
        // Verifica si la imagen existe antes de intentar eliminarla
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }

}

export default BarberService;
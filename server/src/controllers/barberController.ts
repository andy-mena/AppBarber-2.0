import type { NextFunction, Request, Response } from "express";
import { IBarberService } from "../interfaces/services/IBarberService";

declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File; // Aquí usamos el tipo `File` proporcionado por `multer`
    }
  }
}

class BarberController {

  constructor(private barberService: IBarberService) { }

  public getBarbers = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const barber = await this.barberService.getBarbers();
      response.status(200).json(barber);
    } catch (error) {
      next(error)
    }
  }

  public getBarberById = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const barberId = request.params.barberId;
      const barber = await this.barberService.getBarberById(+barberId);
      response.status(200).json(barber);
    } catch (error) {
      next(error)
    }
  }

  private getImage(request: Request): string {
    const image = request.file ? request.file.filename : 'default.png';
    return image;
  }

  public createBarber = async (request: Request, response: Response, next: NextFunction) => {

    try {
      const image = this.getImage(request);
      const newBarber = await this.barberService.createBarber(request.body, image);
      response.status(201).json(newBarber)
    } catch (error) {
      next(error)
    }
  }

  public updateBarber = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const barberId = request.params.barberId;
      const image = this.getImage(request);
      const barberUpdated = await this.barberService.updateBarber(request.body, image, +barberId)
      response.status(200).json(barberUpdated);
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  public deleteBarber = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const barberId = +request.params.barberId;
      await this.barberService.deleteBarber(barberId);
      response.status(200).send('Barbero eliminado correctamente');
    } catch (error) {
      next(error)
    }
  }

  public barberData = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const barbers = await this.barberService.barberData()
      response.status(200).json(barbers);
    } catch (error) {
      next(error)
    }
  }

  public barbersIncome = async (request: Request, response: Response, next: NextFunction) => {
    try {
      const data = await this.barberService.barberIncome();
      response.status(200).json(data);
    } catch (error) {
      next(error)
    }
  }
}

export default BarberController;
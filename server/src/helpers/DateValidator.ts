import moment from "moment";
import AppError from "../errors/AppError";

class DateValidator {

    // Validates that the date is in the future
    public validateFutureDate(date: Date): void {
        const currentlyDate = moment();
        const dateUpdated = moment(date, 'YYYY-MM-DD');

        if (!dateUpdated.isValid() || dateUpdated.isSameOrBefore(currentlyDate)) {
            throw new AppError('La fecha propuesta debe ser válida y mayor a la fecha actual', 400);
        }
    }

    // Validates that the date is at least 24 hours in the future
    public validateDiffHour(date: Date) {

        const currentlyDate = moment();
        const diff24Hours = Math.abs(moment.duration(currentlyDate.diff(date)).asHours());

        if (diff24Hours < 24) {
            throw new AppError('No se puede Actualizar la cita dentro de las 24 horas previas a la cita original', 404);
        }
    }

    public validateTime(time: string): void {
        // Convertir la hora en formato HH:MM a un objeto Date
        const selectHour = new Date(`2000-01-01T${time}:00`);

        // Crear objetos Date para las horas de inicio y fin del rango permitido
        const startHour = new Date('2000-01-01T09:00:00'); // 9:00 AM
        const endHour = new Date('2000-01-01T17:00:00');   // 5:00 PM

        // Validar si la hora seleccionada está dentro del rango permitido
        if (!(selectHour >= startHour && selectHour <= endHour)){
            throw new AppError('La hora seleccionada no es válida, debe estar entre las 9:00 AM y las 5:00 PM', 400);
        } 
    }


}

export default DateValidator;
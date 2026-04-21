export function isValidateDate(date: Date): boolean {
    const today = new Date();
    const inputDate = new Date(date);

    // Eliminar horas para comparar solo fechas (opcional)
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);

    return inputDate >= today;
}
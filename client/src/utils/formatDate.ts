export function formatDate(fecha: string): string {
    if (!fecha) return "";

    // Extraemos solo la parte de la fecha (YYYY-MM-DD) antes de procesar
    // Esto funciona tanto para "2026-04-22" como para "2026-04-22T00:00:00.000Z"
    const soloFecha = fecha.split('T')[0];
    const [year, month, day] = soloFecha.split('-').map(Number);

    const date = new Date(year, month - 1, day);

    if (isNaN(date.getTime())) {
        // En lugar de lanzar un error que rompe la app, devolvemos un string vacío o aviso
        console.error('Error procesando fecha:', fecha);
        return 'Fecha no válida';
    }

    const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };

    return date.toLocaleDateString('es-NI', options);
}
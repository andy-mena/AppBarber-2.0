import colors from 'colors'
import server from './server';

//Definir el puerto
const port: number = Number(process.env.PORT || 4000);

//Arrancar el servidor en el puerto establecido
server.listen(port,'0.0.0.0', () => {
    console.log(colors.white.bgGreen(`Servidor funcionando en el puerto ${port}`))
})



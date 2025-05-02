import BarberController from "../../controllers/barberController";
import BarberRepository from "../../repositories/barberRepository";
import BarberService from "../../services/barberService";


const barberRepository = new BarberRepository();
const barberService = new BarberService(barberRepository);
const barberController = new BarberController(barberService);

export { barberController }
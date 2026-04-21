import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Avatar
} from '@chakra-ui/react'
import { getAppointmentById } from "@/api/AppointmentApi";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { formatToCordobas } from '@/utils/formatToCordobas';
import { BsClockFill } from 'react-icons/bs';
import { FaCalendar } from 'react-icons/fa6';
import { formatTime } from '@/utils/formatTime';
import { es } from 'date-fns/locale';
import { formatInTimeZone } from 'date-fns-tz';

export const AppointmentModalDetails = () => {

    const location = useLocation();
    const queryParam = new URLSearchParams(location.search);
    const appointmentId = +queryParam.get('ViewAppointment')!;

    const navigate = useNavigate();

    const { data, isError } = useQuery({
        queryKey: ['viewAppointment', appointmentId],
        queryFn: () => getAppointmentById(appointmentId),
        enabled: appointmentId > 0,
        retry: false
    })

    const timeZone = 'America/Managua';
    const showModal = appointmentId ? true : false;

    const appointmentDate = data?.date ? new Date(data.date) : null;
    const isValidDate = appointmentDate && !isNaN(appointmentDate.getTime());


    if (isError) return <Navigate to={'/404'} />

    if (data) return (
        <div>
            <Modal size={'lg'} onClose={() => navigate(location.pathname, { replace: true })} isOpen={showModal} isCentered>
                <ModalOverlay />
                <ModalContent bg="#1f1f1f" color={'#f7f7f7'} padding={5}>
                    <ModalHeader className='font-heading text-white-500'>Información de tu Cita</ModalHeader>
                    <ModalCloseButton border={'none'} />
                    <ModalBody>

                        <div className='mb-5 text-sm'>
                            <p className='mb-3'>Barbero Seleccionado</p>
                            <div className='flex justify-between items-center'>
                                <p className="text-brown-200">{data.barbero.name} {" "} {data.barbero.lastname}</p>
                                <Avatar size='md' src={`${import.meta.env.VITE_IMAGE_URL}/${data.barbero.image}`} />

                            </div>

                        </div>

                        <div className='mb-5 text-sm'>
                            <p className='mb-3'>Fecha y Hora</p>
                            <div className="time flex justify-between items-center">
                                <div className="flex items-center gap-x-2 text-brown-200">
                                    <BsClockFill className="text-Primary-500" />
                                    {formatTime(data.time)}
                                </div>

                                <div className="flex items-center gap-x-2 text-brown-200">
                                    <FaCalendar className="text-Primary-500" />
                                    {isValidDate
                                        ? formatInTimeZone(appointmentDate, timeZone, "d 'de' MMMM 'de' yyyy", { locale: es })
                                        : "Cargando fecha..."
                                    }
                                </div>
                            </div>

                        </div>
                        <div className='services space-y-3 text-sm'>
                            <p className='text-white-500'>Servicios Seleccionados</p>
                            {data.services.map(service => (
                                <div key={service.name} className="flex justify-between items-center mb-5 relative">
                                    <p className="text-sm text-left text-brown-200">{service.name}</p>
                                    <p className="hidden lg:flex points">...................................................................</p>
                                    <span className="font-heading ms-2 text-Primary-500  text-lg m-0 p-0">{formatToCordobas(service.AppointmentService.current_price)}</span>

                                </div>
                            ))}

                            <p className="mt-5 text-white-500  text-sm">Total a Pagar: <span className="text-Primary-500 text-2xl font-heading">{formatToCordobas(data.services.reduce((total, service) => total + service.AppointmentService.current_price, 0))}</span> </p>
                        </div>

                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => navigate(location.pathname, { replace: true })} bg={'#d6a354'} _hover={{ bg: '#c1872e' }} color={'#f7f7f7'}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    )
}

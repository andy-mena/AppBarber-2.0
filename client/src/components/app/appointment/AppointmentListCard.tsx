import { AppointmentService } from "@/types/index";
import { Avatar, AvatarGroup, Card, CardBody, Text } from '@chakra-ui/react'
import { BsClockFill } from "react-icons/bs";
import { FaCalendar } from "react-icons/fa";
import { format, parseISO, } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { es } from 'date-fns/locale';
import { formatTime } from "@/utils/formatTime";
import { useAuthStore } from "@/store/authStore";
import AppointmentListItemMenu from "./AppointmentListItemMenu";


type AppointmentListItemProps = {
  appointment: AppointmentService,
};

const AppointmentListCard = ({ appointment }: AppointmentListItemProps) => {

  const user = useAuthStore(state => state.user);
  const timeZone = 'America/Managua';

  const date = appointment?.date ? parseISO(appointment.date) : null;

  if (!date) {
    return <span>Sin fecha</span>; 
  }

  const formatDay = formatInTimeZone(date, timeZone, 'EEEE', { locale: es }).slice(0, 3);
  const formatDate = formatInTimeZone(date, timeZone, 'dd EEEE', { locale: es }).slice(0,2);

  if (user) return (

    <li className="p-0 bg-brown-500 rounded-md">
      <Card borderRadius='0' width={'100%'} padding={0} bg={'transparent'}>
        <CardBody marginX={0} width={'100%'}>
          <div className="flex flex-col md:flex-row md:justify-between items-center md:items-center">
            <div className="flex gap-x-5">

              <div className="flex flex-col items-center border-r pe-6 border-r-black-300">
                <Text className="text-white-500 text-2xl">{formatDay}</Text>
                <Text className="text-Primary-500 text-4xl font-bold"> {formatDate}</Text>
              </div>

              <div className="time flex flex-col justify-center space-y-1">
                <div className="flex items-center gap-x-2 text-brown-200">
                  <BsClockFill className="text-Primary-500" />
                  {formatTime(appointment.time)}
                </div>

                <div className="flex items-center gap-x-2 text-brown-200">
                  <FaCalendar className="text-Primary-500" />
                  {format(new Date(appointment.date), 'MMMM yyyy', { locale: es })}
                </div>
              </div>

              <div className="hidden lg:flex flex-col justify-center space-y-2">
                <p className="text-brown-200 text-sm">
                  <span className="font-normal">Barbero {appointment.barbero.name}</span>.
                </p>
                <AvatarGroup size="sm" className="flex gap-x-1">
                  <Avatar
                    size="2xs"
                    border="none"
                    name="Barbero"
                    src={`${import.meta.env.VITE_IMAGE_URL}/${appointment.barbero.image}`}
                  />

                  <Avatar
                    size="2xs"
                    border="none"
                    name="user"
                    src={`${import.meta.env.VITE_IMAGE_URL}/${user.image}`}
                  />
                </AvatarGroup>
              </div>
            </div>

            <AppointmentListItemMenu appointment={appointment} />

          </div>
        </CardBody>
      </Card>
    </li>
  )
}

export default AppointmentListCard;
import { FaPhoneVolume } from "react-icons/fa6";
import { BsClockFill } from "react-icons/bs";
import { BiLogoFacebookCircle } from "react-icons/bi";
import { RiInstagramFill } from "react-icons/ri";
import { AiFillTikTok } from "react-icons/ai";
import { AiFillTwitterCircle } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";
import Logo from "@/components/Logo";
import { Link, useLocation } from "react-router-dom";
import ProfileMenu from "@/components/app/ProfileMenu";
import MenuHam from "./MenuHam";


const HeaderApp = () => {
    
    const location = useLocation();

    return (
        <header className="py-5 lg:py-0">
            <div className="hidden lg:flex bg-Primary-500 py-5">
                <div className="w-full max-w-4xl mx-auto">
                    <div className="flex justify-between">
                        <div className="phone-hours flex justify-between w-[60%]">
                            <div className="text-white-500 flex gap-x-2 items-center">
                                <FaPhoneVolume />
                                <p className="text-xs font-light">Contacto: <span>8788 2866</span></p>

                            </div>

                            <div className="text-white-500 flex gap-x-2 items-center">
                                <BsClockFill />
                                <p className="text-xs font-light">Horarios: <span>Lunes a Sábado: 9:00 AM - 6:00 PM</span></p>

                            </div>

                        </div>

                        <div className="icons flex items-center  text-white-500 text-lg">
                            <BiLogoFacebookCircle />
                            <RiInstagramFill />
                            <AiFillTikTok />
                            <AiFillTwitterCircle />
                        </div>

                    </div>

                </div>
            </div>

            <ul className="flex px-8 justify-between items-center lg:px-0 lg:w-full lg:max-w-4xl my-3 lg:mx-auto">
                <li>
                    <Link to={'/app'}>
                        <Logo />
                    </Link>
                </li>

                <li className="flex lg:hidden">
                    <MenuHam />
                </li>

                <li className="hidden lg:flex">
                    <nav className="hidden lg:flex flex-col lg:flex-row gap-x-7 items-center">
                        <Link to={'/app'} className={`${location.pathname === '/app' ? 'text-Primary-500' : 'text-white-500'} text-sm hover:text-Primary-500 duration-300`}>Inicio</Link>
                        <Link to={'/app/about'} className={`${location.pathname === '/app/about' ? 'text-Primary-500' : 'text-white-500'} text-sm hover:text-Primary-500 duration-300`}>Nosotros</Link>
                        <Link to={'/app/my-appointment'} className={`${location.pathname === '/app/my-appointment' ? 'text-Primary-500' : 'text-white-500'} text-sm hover:text-Primary-500 duration-300`}>Mis Citas</Link>
                        <ProfileMenu />
                        <Link to={'/app/appointment'} className="text-white-500 px-4 py-2 rounded-lg bg-Primary-500 hover:bg-Primary-600 duration-300 flex gap-x-2 items-center text-sm ">
                            Haz Tu cita
                        </Link>
                    </nav>
                </li>

            </ul>


        </header>
    )
}

export default HeaderApp
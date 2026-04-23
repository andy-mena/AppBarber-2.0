import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Calendar,
    ChevronLeft,
    Home,
    Menu,
    Package,
    Settings,
    ShoppingCart,
    Users,
    LayoutDashboard,
    List,
    User
} from 'lucide-react'
import { Link, Navigate, Outlet, useLocation} from 'react-router-dom'
import Logo from '@/components/Logo'
import { useAuthStore } from '@/store/authStore'
import ProfileMenu from '@/components/app/ProfileMenu'
import { Toaster } from 'sonner'

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const user = useAuthStore(state => state.user);
    const location = useLocation();

    if (!user) return <Navigate to={'/'} />


    if(user)return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className={`bg-brown-500 w-52 min-h-screen flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static absolute z-30`}>
                <div className="flex items-center justify-between p-4">
                    <Logo />
                    <Button variant={'ghost'} size="icon" className="md:hidden hover:bg-transparent" onClick={() => setSidebarOpen(false)}>
                        <ChevronLeft className="w-6 h-6 text-white-500" />
                    </Button>
                </div>
                <ScrollArea className="flex-grow">
                    <nav className="p-4 space-y-2">
                        <Link to="/admin" className={`${location.pathname === '/admin' ? 'bg-Primary-500' : 'bg-transparent' } flex items-center space-x-2 text-white-500 hover:bg-Primary-500 duration-200 rounded-md p-2`}>
                            <Home className="w-5 h-5" />
                            <span>Dashboard</span>
                        </Link>
                        <Link to="/admin/appointments"className={`${location.pathname === '/admin/appointments' ? 'bg-Primary-500' : 'bg-transparent' } flex items-center space-x-2 text-white-500 hover:bg-Primary-500 duration-200 rounded-md p-2`}>
                            <Calendar className="w-5 h-5" />
                            <span>Citas</span>
                        </Link>

                        <Link to="/admin/testimonials"className={`${location.pathname === '/admin/testimonials' ? 'bg-Primary-500' : 'bg-transparent' } flex items-center space-x-2 text-white-500 hover:bg-Primary-500 duration-200 rounded-md p-2`}>
                            <List className="w-5 h-5" />
                            <span>Testimoniales</span>
                        </Link>

                        <Link to="/admin/services"className={`${location.pathname === '/admin/services' ? 'bg-Primary-500' : 'bg-transparent' } flex items-center space-x-2 text-white-500 hover:bg-Primary-500 duration-200 rounded-md p-2`}>
                            <LayoutDashboard className="w-5 h-5" />
                            <span>Servicios</span>
                        </Link>
                        <Link to="/admin/barbers"className={`${location.pathname === '/admin/barbers' ? 'bg-Primary-500' : 'bg-transparent' } flex items-center space-x-2 text-white-500 hover:bg-Primary-500 duration-200 rounded-md p-2`}>
                            <User className="w-5 h-5" />
                            <span>Barberos</span>
                        </Link>
                        <Link to="/admin/customers"className={`${location.pathname === '/admin/customers' ? 'bg-Primary-500' : 'bg-transparent' } flex items-center space-x-2 text-white-500 hover:bg-Primary-500 duration-200 rounded-md p-2`}>
                            <Users className="w-5 h-5" />
                            <span>Clientes</span>
                        </Link>
                    </nav>
                </ScrollArea>
                <div className="p-4 ">
                    <Link to="/admin/settings"className={`${location.pathname === '/admin/settings' ? 'bg-Primary-500' : 'bg-transparent' } flex items-center space-x-2 text-white-500 hover:bg-Primary-500 duration-200 rounded-md p-2`}>
                        <Settings className="w-5 h-5" />
                        <span>Configuración</span>
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top Bar */}
                <header className="flex items-center justify-between p-6 bg-brown-500">
                    <div className="flex items-center">
                        <Button variant="ghost" size="icon" className="mr-2 md:hidden hover:bg-brown-500" onClick={() => setSidebarOpen(true)}>
                            <Menu className="w-6 h-6 text-white-500" />
                        </Button>
                        <div className="relative hidden lg:flex">
                        
                            
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <ProfileMenu/>
                    </div>
                </header>


                <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto">
                    <Outlet/>
                </main>
            </div>

            <Toaster
                richColors
                position='top-left'
                closeButton={true}
                duration={8000}
            />
        </div>

        
    )
}
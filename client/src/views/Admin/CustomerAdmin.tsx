import { getAppointmentData, getCustomers } from "@/api/CustomerApi";
import CardCustomer from "@/components/admin/customer/CardCustomer";
import ChartCustomer from "@/components/admin/customer/ChartCustomer";
import CustomerTable from "@/components/admin/customer/CustomerTable";
import PaginationComponent from "@/components/Pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { CalendarCheck } from "lucide-react";
import RecentUsers from "@/components/admin/RecentUsers";
import { usePagination } from "@/hooks/usePagination";
import TopCustomersTable from "@/components/admin/TopCustomersTable";
import { Spinner } from "@chakra-ui/react";
import CustomerConfirm from "@/components/admin/customer/CustomerConfirm";

export default function CustomerAdmin() {
  const { data, isPending } = useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
    retry: false,
  });

  const { data: customerData } = useQuery({
    queryKey: ["customerData"],
    queryFn: getAppointmentData,
    retry: false,
  });

  const totalPages = Math.ceil((data?.length || 0) / 4);

  const { currentPage, goToPage } = usePagination({
    totalPages,
  });

  const currentCustomers =
    data?.slice((currentPage - 1) * 4, currentPage * 4) || [];

  return (
    <>
      {isPending ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <CardCustomer totalCustomer={data?.length || 0} />
          </div>

          <div className="my-10">
            <Card className="w-full bg-[#1F1F1F] text-[#F7F7F7] border-none">
              <CardHeader>
                <CardTitle className="text-[#D6A354]">
                  Clientes de Mojica's Barbershop
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-black-400">
                        <TableHead className="w-[100px] text-brown-200">
                          Cliente
                        </TableHead>
                        <TableHead className="text-brown-200">
                          Nombre Completo
                        </TableHead>
                        <TableHead className="text-brown-200">
                          Contacto
                        </TableHead>
                        <TableHead>
                          <div className="flex items-center text-brown-200">
                            <CalendarCheck className="mr-2 h-4 w-4 text-[#D6A354]" />
                            Total Citas
                          </div>
                        </TableHead>
                        <TableHead className="text-brown-200">
                          Última Cita
                        </TableHead>
                        <TableHead className="text-brown-200">
                          Acciones
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentCustomers!.map((customer) => (
                        <CustomerTable
                          key={customer.userId}
                          customer={customer}
                        />
                      ))}
                    </TableBody>
                  </Table>
                  <CustomerConfirm />
                  <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={goToPage}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-5 my-10 lg:grid-cols-2">
            <div className="recharts">
              {customerData && <ChartCustomer data={customerData!} />}
            </div>

            <div className="table">
              <RecentUsers />
            </div>
          </div>

          <div>
            <TopCustomersTable />
          </div>
        </>
      )}
    </>
  );
}

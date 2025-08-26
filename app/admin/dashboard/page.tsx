import { AppSidebar } from '@/components/app-sidebar';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { SectionCards } from '@/components/section-cards';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const CUSTOMERS = [
  {
    id: 1,
    name: 'Abde',
    surname: 'Kamal',
    lastName: null,
    Nacimiento: '01/01/1990',
    sexo: 'M',
    dni: 'Y8341787T',
    phone: 642626497,
    postalCode: 16660,
    Dirección: 'C/ Montejano 72',
    country: 'Pedroñeras, Las',
    Provincia: 'Cuenca',
    Email: 'abdokamal0198@gmail.com',
    inDay: '08/10/2024',
    orderDay: '15/09/2025',
  },
  {
    id: 2,
    name: 'Abdón',
    surname: 'García ',
    lastName: 'Carrasco',
    Nacimiento: '12/06/2005',
    sexo: 'M',
    dni: '51255694X',
    phone: 605653853,
    postalCode: 16660,
    Dirección: 'Pompello Castillo, 62',
    country: 'Pedroñeras, Las',
    Provincia: 'Cuenca',
    Email: 'abdongarcia05@gmail.com',
    inDay: '23/04/2025',
    orderDay: '16/07/2025',
  },
  {
    id: 3,
    name: 'Acacio',
    surname: 'Cerrillo ',
    lastName: 'Patiño ',
    Nacimiento: '28/05/1986',
    sexo: 'M',
    dni: '70521441Z',
    phone: 665865186,
    'Tel.2': null,
    postalCode: 16620,
    Dirección: 'Carretera De Belmonte 7',
    country: 'Alberca de Záncara, La',
    Provincia: 'Cuenca',
    Email: 'acacio.cerrillo28@gmail.com',
    inDay: '01/08/2024',
    orderDay: '18/12/2024',
  },
];

const today = new Date();

// Convertimos y filtramos por fecha pasada
const expiredOrders = CUSTOMERS.filter((customer) => {
  const [day, month, year] = customer.orderDay.split('/').map(Number);
  const orderDate = new Date(year, month - 1, day);
  return orderDate < today;
});

export default function Page() {
  const transformedData = expiredOrders.map((customer) => ({
    id: customer.id,
    header: `${customer.name} ${customer.surname}`,
    status: 'Done', // puedes hacer lógica condicional si quieres más estados
    target: customer.phone.toString(),
    limit: customer.dni,
    reviewer: customer.Email,
  }));

  console.log('<DataTable data={transformedData} />', expiredOrders);

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

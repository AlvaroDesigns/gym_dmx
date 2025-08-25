import { getFieldsModalZones } from '@/data/modals';
import { useCreateZone } from '@/hooks/zones/use-zones';
import { CLASS_TYPE, ZONE_TYPE } from '@/types';
import { IconAdjustmentsPlus, IconLayoutColumns, IconPlus } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { AppSidebar } from '../app-sidebar';
import EditSheetForm from '../form/EditSheetForm';
import { PageHeader } from '../page-header';
import { SiteHeader } from '../site-header';
import SkeletonUsers from '../skeletons/skeleton-user';
import { Button } from '../ui/button';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { ViewToggle } from '../ui/view-toggle';

type View = 'default' | 'compiled';

interface ProductLayoutProps {
  children: React.ReactNode;
  isButton?: boolean;
  isView?: boolean;
  textButton?: string;
  isLoading?: boolean;
  onChangeView?: (value: View) => void;
  view?: View;
  buttonProps?: {
    text: string;
    routingUri: 'internal' | 'modal' | 'custom';
    type?: 'class' | 'zone';
    url?: string;
  };
  customButton?: React.ReactNode;
}

export const ProductLayout = ({
  children,
  isLoading = false,
  isView = false,
  buttonProps,
  customButton,
  onChangeView,
  view = 'default' as View,
}: ProductLayoutProps) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const form = useForm();
  const createZoneMutation = useCreateZone();

  const { type } = buttonProps || {};

  const normalizedType =
    type === 'class' ? CLASS_TYPE : type === 'zone' ? ZONE_TYPE : undefined;
  const fields = normalizedType ? getFieldsModalZones(normalizedType) : [];

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
            <div className="flex flex-col gap-1 p-6 md:py-6">
              <div className="flex flex-row justify-between items-top gap-4">
                <div className="text-left">
                  <PageHeader />
                </div>
                <div className="flex gap-3">
                  {isView && (
                    <ViewToggle
                      size="sm"
                      variant="ghost"
                      options={[
                        {
                          value: 'default',
                          icon: <IconLayoutColumns />,
                        },
                        {
                          value: 'compiled',
                          icon: <IconAdjustmentsPlus />,
                        },
                      ]}
                      value={view}
                      onValueChange={(value) => onChangeView?.(value as View)}
                    />
                  )}

                  {buttonProps &&
                    (buttonProps?.routingUri === 'internal' ? (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          if (buttonProps?.routingUri === 'internal') {
                            return router.push(buttonProps?.url ?? '');
                          }
                          return setIsOpen(true);
                        }}
                      >
                        <IconPlus />
                        {buttonProps.text}
                      </Button>
                    ) : buttonProps?.routingUri === 'custom' ? (
                      customButton
                    ) : (
                      <EditSheetForm
                        open={isOpen}
                        sizeButton="sm"
                        triggerText={buttonProps?.text}
                        startButtonContent={<IconPlus />}
                        setOpen={setIsOpen}
                        form={form}
                        fields={fields}
                        onSubmit={(data) => {
                          createZoneMutation.mutate(
                            {
                              name: data.name || 'Nueva Zona',
                              description: data.description || '',
                              imageUrl: data.imageUrl || '',
                            },
                            {
                              onSuccess: () => {
                                setIsOpen(false);
                                toast.success('Zona creada exitosamente!');
                                form.reset();
                              },
                              onError: () => {
                                toast.error(
                                  'Error al crear zona. Por favor, intenta nuevamente.',
                                );
                              },
                            },
                          );
                        }}
                      />
                    ))}
                </div>
              </div>
              {isLoading ? <SkeletonUsers /> : children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

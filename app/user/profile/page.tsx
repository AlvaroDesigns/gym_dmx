'use client';

import { BottomTabs } from '@/components/bottom-tabs';
import { AvatarSections } from '@/components/sections/avatar-sections';
import { Button } from '@/components/ui/button';
import { FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetUsers } from '@/hooks/users/use-get-users';
import { IconBrandInstagram, IconBrandTiktok } from '@tabler/icons-react';

export default function Page() {
  const { data } = useGetUsers({
    email: 'hello@alvarodesigns.com',
  });

  const user = Array.isArray(data) ? data[0] : data?.data?.[0];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        {/* User */}
        <div className="flex flex-col gap-4 p-6 md:gap-6 md:py-6">
          <div className="flex justify-center mt-5 items-center">
            <AvatarSections isAvatar name={user?.name ?? ''} size="lg" />
          </div>
        </div>
        {/* Class */}
        <div className="flex flex-col">
          <div className="flex flex-col gap-4 p-6 pt-3 md:gap-6 md:py-6 overflow-auto">
            <FormItem className="w-full">
              <Label htmlFor="name">Apodo</Label>
              <Input
                className="h-12"
                type="text"
                id="name"
                readOnly
                defaultValue={user?.name}
                placeholder="Nombre de usuario"
              />
            </FormItem>
            <FormItem className="w-full">
              <Label htmlFor="instagram">Instagram</Label>
              <div className="relative">
                <IconBrandInstagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  className="h-12 pl-10"
                  type="text"
                  id="instagram"
                  defaultValue={user?.instagram ?? ''}
                  placeholder="www.instagram.com/tu_usuario"
                />
              </div>
            </FormItem>
            <FormItem className="w-full">
              <Label htmlFor="tiktok">TikTok</Label>
              <div className="relative">
                <IconBrandTiktok className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  className="h-12 pl-10"
                  type="text"
                  id="tiktok"
                  defaultValue={user?.tiktok ?? ''}
                  placeholder="www.tiktok.com/@tu_usuario"
                />
              </div>
            </FormItem>
            <Button className="h-12 mt-3" type="submit">
              Guardad Cambios
            </Button>
          </div>
        </div>
        {/* BottomTabs */}
        <BottomTabs />
      </div>
    </div>
  );
}

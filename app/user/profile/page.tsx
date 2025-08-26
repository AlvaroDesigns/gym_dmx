'use client';

import { Input } from '@/components//ui/input';
import { Label } from '@/components//ui/label';
import { BottomTabs } from '@/components/bottom-tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FormItem } from '@/components/ui/form';
import { useGetUsers } from '@/hooks/users/use-get-users';

export default function Page() {
  const { data } = useGetUsers({
    email: 'hello@alvarodesigns.com',
  });

  const user = data?.[0];

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        {/* User */}
        <div className="flex flex-col gap-4 p-6 md:gap-6 md:py-6">
          <div className="flex justify-center gap-4 items-center">
            <Avatar className="h-30 w-30">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
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
              <Label htmlFor="name">Instagram</Label>
              <Input
                className="h-12"
                type="text"
                id="name"
                defaultValue={user?.instagram ?? ''}
                placeholder="www.instagram.com/tu_usuario"
              />
            </FormItem>
            <FormItem className="w-full">
              <Label htmlFor="name">TikTok</Label>
              <Input
                className="h-12"
                type="text"
                id="name"
                defaultValue={user?.tiktok ?? ''}
                placeholder="www.tiktok.com/@tu_usuario"
              />
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

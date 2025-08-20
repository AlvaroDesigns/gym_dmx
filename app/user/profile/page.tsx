'use client';

import { Input } from '@/components//ui/input';
import { Label } from '@/components//ui/label';
import { BottomTabs } from '@/components/bottom-tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FormItem } from '@/components/ui/form';

const USER = {
  name: 'Álvaro Saiz Bonilla',
  staff: 'Supervisor, Comunicación',
  email: 'alvaro.saiz.bonilla@gmail.com',
  dni: '12345678J',
  image: 'https://github.com/shadcn.png',
};

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        {/* User */}
        <div className="flex flex-col gap-4 p-6 md:gap-6 md:py-6">
          <div className="flex justify-center gap-4 items-center">
            <Avatar className="h-30 w-30">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>{USER.name.charAt(0)}</AvatarFallback>
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
                defaultValue=""
                placeholder="Nombre de usuario"
              />
            </FormItem>
            <FormItem className="w-full">
              <Label htmlFor="name">Instagram</Label>
              <Input
                className="h-12"
                type="text"
                id="name"
                defaultValue=""
                placeholder="www.instagram.com/tu_usuario"
              />
            </FormItem>
            <FormItem className="w-full">
              <Label htmlFor="name">TikTok</Label>
              <Input
                className="h-12"
                type="text"
                id="name"
                defaultValue=""
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

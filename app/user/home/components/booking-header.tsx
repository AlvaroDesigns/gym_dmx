import { AvatarSections } from '@/components/sections/avatar-sections';
import { UserData } from '@/types/user';

interface User {
  name?: UserData['name'];
  surname?: UserData['surname'];
}

export function BookingHeader({ user }: { user: User }) {
  return (
    <div className="flex flex-col gap-4 p-6 md:gap-6 md:py-6 border-b border-border">
      <div className="flex gap-4 items-center">
        <AvatarSections isAvatar name={user?.name ?? ''} status={false} size="sm" />
        <div className="flex flex-col gap-2">
          <span className="text-md leading-none text-muted-foreground">Bienvenido</span>
          <h2 className="text-[20px] leading-none font-semibold">¡Hola {user?.name}!</h2>
        </div>
      </div>
    </div>
  );
}

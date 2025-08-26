import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserData } from '@/types/user';

interface User {
  name?: UserData['name'];
  surname?: UserData['surname'];
}

export function BookingHeader({ user }: { user: User }) {
  return (
    <div className="flex flex-col gap-4 p-6 md:gap-6 md:py-6">
      <div className="flex gap-4 items-center">
        <Avatar className="h-19 w-19">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>{user?.name?.charAt(0) ?? ''}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <h2 className="text-[20px] leading-none font-semibold">
            ¡Hola {user?.name} {user?.surname}!
          </h2>
          <div className="flex flex-col gap-1">
            <span className="text-md leading-none text-muted-foreground">
              Hoy puede ser un gran día.
            </span>
            <span className="text-md leading-none text-muted-foreground">
              ¡Vamos a por ello!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

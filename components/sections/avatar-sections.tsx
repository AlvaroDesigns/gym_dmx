import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';

export const AvatarSections = ({
  name,
  status,
  isBanned = true,
}: {
  name: string;
  status?: boolean;
  isBanned?: boolean;
}) => {
  const variantStatus = status ? 'success' : 'destructive';
  const variantLabel = status ? 'Cliente Activo' : 'Cliente Desactivado';

  return (
    <div className="flex flex-col gap-4 pmd:gap-6 md:py-2">
      <div className="flex gap-4 items-center">
        <Avatar className="h-19 w-19">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <span className="text-[20px] leading-none font-semibold">¡Hola {name}!</span>
          {isBanned && (
            <div className="flex flex-col gap-1">
              <Badge variant={variantStatus}>{variantLabel}</Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

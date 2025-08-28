import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AvatarSectionsProps extends AvatarComponentProps {
  name: string;
  status?: boolean;
  isBanned?: boolean;
  isAvatar?: boolean;
}

export const AvatarSections = ({
  name,
  status,
  isBanned = true,
  isAvatar = false,
  size,
  image,
}: AvatarSectionsProps) => {
  const variantStatus = status ? 'success' : 'destructive';
  const variantLabel = status ? 'Cliente Activo' : 'Cliente Desactivado';

  if (isAvatar) {
    return <AvatarComponent size={size} name={name} image={image} />;
  }

  return (
    <div className="flex flex-col gap-4 pmd:gap-6 md:py-2">
      <div className="flex gap-4 items-center">
        <AvatarComponent size={size} name={name} image={image} />
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

interface AvatarComponentProps {
  size?: 'sm' | 'md' | 'lg';
  image?: string;
  name: string;
}

const AvatarComponent = ({
  size = 'md',
  image = 'https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fwww.gravatar.com%2Favatar%2F2c7d99fe281ecd3bcd65ab915bac6dd5%3Fs%3D250',
  name,
}: AvatarComponentProps) => {
  return (
    <Avatar
      className={cn(
        size === 'md' && 'h-19 w-19',
        size === 'sm' && 'h-14 w-14',
        size === 'lg' && 'h-24 w-24',
      )}
    >
      <AvatarImage src={image} />
      <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
    </Avatar>
  );
};

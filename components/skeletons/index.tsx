import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SkeletonHomeProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  numberOfItems?: number;
}

export default function SkeletonHome({
  size = 'md',
  numberOfItems = 5,
}: SkeletonHomeProps) {
  return (
    <div className="py-2 space-y-4">
      <div className="space-y-4">
        {Array.from({ length: numberOfItems }).map((_, i) => (
          <SkeletonCard key={i} size={size} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonCard({ size = 'md' }: { size: SkeletonHomeProps['size'] }) {
  return (
    <Card
      className={cn(
        'w-full p-8 gap-4',
        size === 'xs' && 'min-h-16',
        size === 'sm' && 'min-h-24',
        size === 'md' && 'min-h-36',
        size === 'lg' && 'min-h-48',
      )}
    >
      <div className="flex items-center justify-center space-x-4 animate-pulse">
        <div className="w-19 h-19 bg-gray-300 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-gray-300 rounded" />
          <div className="h-4 w-1/2 bg-gray-300 rounded" />
        </div>
      </div>
    </Card>
  );
}

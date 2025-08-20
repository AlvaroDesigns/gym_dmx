import { Card } from '../ui/card';

// app/users/loading.tsx (Next.js App Router)
export default function SkeletonUsers() {
  return (
    <div className="py-2 space-y-4">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} className="w-full p-8 gap-4 min-h-36">
            <div className="flex items-center justify-center space-x-4 animate-pulse">
              <div className="w-19 h-19 bg-gray-300 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-gray-300 rounded" />
                <div className="h-4 w-1/2 bg-gray-300 rounded" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

'use client';

import { BottomTabs } from '@/components/bottom-tabs';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        {/* User */}
        <div className="flex flex-col">
          <h2 className="text-xl font-bold px-6 pt-6">Promociones</h2>
          <div className="flex flex-row gap-4 p-6 pt-2 md:gap-6 md:py-6 overflow-auto">
            <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
              <Image
                src="https://dmxgym.com/wp-content/uploads/2024/05/trx.png"
                alt="Photo by Drew Beamer"
                fill
                className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </AspectRatio>
          </div>
        </div>

        {/* BottomTabs */}
        <BottomTabs />
      </div>
    </div>
  );
}

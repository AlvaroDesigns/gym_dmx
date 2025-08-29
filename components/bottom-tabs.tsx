import { IconHome, IconUser } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';

const MOBILE = [
  {
    id: 'promotions',
    icon: 'Present',
    text: 'Promociones',
    href: '/user/promotions',
  },
  {
    id: 'home',
    text: 'home',
    href: '/user/home',
  },

  {
    id: 'profile',
    icon: 'UserIcon',
    text: 'Mi Perfil',
    href: '/user/profile',
  },
];

export const BottomTabs = () => {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-5 bg-white dark:bg-black dark:border-t  shadow-md drop-shadow-[0_-4px_3px_rgba(0,0,0,0.1)] z-50">
      {MOBILE.map((item) => (
        <Fragment key={item.id}>
          {item?.id === 'home' ? (
            <div className="relative -mt-10 -ml-6">
              <button
                className="flex items-center justify-center w-16 h-16 text-white  rounded-full shadow-lg bg-primary"
                onClick={() => router.push(item.href)}
              >
                <IconHome className="w-5 h-5 text-white dark:text-black" />
              </button>
            </div>
          ) : (
            <div onClick={() => router.push(item.href)}>
              <div className="flex flex-col items-center text-gray-600">
                <IconUser className="w-5 h-5 text-black dark:text-white" />
                <span className="text-xs dark:text-white">{item.text}</span>
              </div>
            </div>
          )}
        </Fragment>
      ))}
    </div>
  );
};

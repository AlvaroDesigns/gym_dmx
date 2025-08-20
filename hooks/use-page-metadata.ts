import { getPageMetadata, PageMetadata } from '@/config/page-metadata';
import { usePathname } from 'next/navigation';

export function usePageMetadata(): PageMetadata {
  const pathname = usePathname();
  return getPageMetadata(pathname);
}

export function usePageMetadataWithCustom(
  customTitle?: string,
  customDescription?: string,
): PageMetadata {
  const metadata = usePageMetadata();

  return {
    title: customTitle || metadata.title,
    description: customDescription || metadata.description,
  };
}

'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import * as React from 'react';

type ListHorizontalProps<T> = {
  items: T[] | undefined;
  renderItem: (item: T, index: number) => React.ReactNode;
  pageIndex: number;
  pageSize: number;
  setPageIndex: (index: number) => void;
  setPageSize: (size: number) => void;
  pageCount: number;
  pageSizeOptions?: number[];
  totalCount?: number;
};

export function ListHorizontal<T>({
  items,
  renderItem,
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  pageCount,
  pageSizeOptions = [6, 10, 20, 30, 40, 50],
  totalCount,
}: ListHorizontalProps<T>) {
  const shouldShowPagination = (totalCount ?? items?.length ?? 0) > 10;
  return (
    <>
      {items?.map((item, index) => renderItem(item, index))}

      {shouldShowPagination && (
        <div className="flex items-center justify-between px-1 pt-2">
          <div className="items-center gap-2 lg:flex justify-between">
            <div className="hidden items-center gap-2 lg:flex">
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => {
                  const newSize = Number(value);
                  setPageSize(newSize);
                }}
              >
                <SelectTrigger size="sm" className="w-24" id="rows-per-page">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {pageSizeOptions.map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium lg:ml-2">
              Page {pageIndex + 1} of {pageCount}
            </div>
          </div>
          <Pagination className="ml-auto w-fit lg:ml-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pageIndex > 0) setPageIndex(pageIndex - 1);
                  }}
                  aria-disabled={pageIndex === 0}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pageIndex + 1 < pageCount) setPageIndex(pageIndex + 1);
                  }}
                  aria-disabled={pageIndex + 1 >= pageCount}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}

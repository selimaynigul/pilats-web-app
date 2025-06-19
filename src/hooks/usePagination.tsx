import { useState, useEffect } from "react";

interface UsePaginationOptions<T> {
  fetchService: (params: any) => Promise<{ data: T[] }>;
  initialPage?: number;
  params?: any;
}

export function usePagination<T>({
  fetchService,
  initialPage = 0,
  params,
}: UsePaginationOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const fetchItems = (pageToFetch: number, resetItems = false) => {
    setLoading(true);

    fetchService({
      ...params,
      searchByPageDto: {
        pageNo: pageToFetch,
        pageSize: params?.pageSize,
        sort: params?.sort,
      },
    })
      .then((response) => {
        const newItems = response.data;
        if (resetItems) {
          setItems(newItems);
        } else {
          setItems((prev) => [...prev, ...newItems]);
        }

        setHasMore(newItems.length > 7);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchItems(nextPage);
  };

  const refetch = () => {
    setPage(initialPage);
    fetchItems(initialPage, true);
  };

  useEffect(() => {
    refetch();
  }, [params, fetchService]);

  return {
    items,
    loading,
    hasMore,
    loadMore,
    refetch,
  };
}

export default usePagination;

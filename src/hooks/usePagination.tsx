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
  const [hasMore, setHasMore] = useState(true);

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

        setHasMore(newItems.length > 0);
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

  useEffect(() => {
    setPage(initialPage);
    fetchItems(initialPage, true);
  }, [params]);

  return {
    items,
    loading,
    hasMore,
    loadMore,
  };
}

export default usePagination;

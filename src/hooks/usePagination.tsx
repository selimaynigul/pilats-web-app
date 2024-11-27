import { useState, useEffect } from "react";

interface UsePaginationOptions<T> {
  fetchService: (params: any) => Promise<{ data: T[] }>;
  initialPage?: number;
  pageSize?: number;
  sort?: string;
}

export function usePagination<T>({
  fetchService,
  initialPage = 0,
  pageSize = 8,
  sort = "DESC",
}: UsePaginationOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchItems = (pageToFetch: number) => {
    setLoading(true);

    fetchService({
      searchByPageDto: {
        pageNo: pageToFetch,
        pageSize,
        sort,
      },
    })
      .then((response) => {
        const newItems = response.data;

        if (newItems.length === 0) {
          setHasMore(false);
        } else {
          setItems((prev) => [...prev, ...newItems]);
        }
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
    fetchItems(page);
  }, []);

  return {
    items,
    loading,
    hasMore,
    loadMore,
  };
}

export default usePagination;

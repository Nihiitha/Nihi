import { useEffect, useRef } from 'react';

interface UseInfiniteScrollOptions {
  callback: () => void;
  hasMore: boolean;
  loading: boolean;
}

function useInfiniteScroll({ callback, hasMore, loading }: UseInfiniteScrollOptions) {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (loading) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      },
      { threshold: 1.0 }
    );
    const current = observerRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [callback, hasMore, loading]);

  return observerRef;
}

export default useInfiniteScroll; 
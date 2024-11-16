import { useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

export const useInfiniteScroll = (
  loadMore: () => Promise<void>,
  hasMore: boolean
) => {
  const { ref, inView } = useInView({
    threshold: 0.5
  });

  const handleLoadMore = useCallback(async () => {
    if (hasMore) {
      await loadMore();
    }
  }, [hasMore, loadMore]);

  useEffect(() => {
    if (inView) {
      handleLoadMore();
    }
  }, [inView, handleLoadMore]);

  return { ref };
};
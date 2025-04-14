import { defineStore } from 'pinia';
import type { ImageObject } from '~/types';

interface QueryCache {
   images: ImageObject[];
   bookmark: string | null;
}

/**
 * Pinia store for managing image search results and caching
 * Implements caching mechanism for better UX during navigation
 */
export const useImagesStore = defineStore('images', {
   state: () => ({
      cache: {} as Record<string, QueryCache>,
   }),

   actions: {
      setQueryResult(
         query: string,
         images: ImageObject[],
         bookmark: string | null
      ) {
         this.cache[query] = { images, bookmark };
      },

      getQueryResult(query: string): QueryCache | undefined {
         return this.cache[query];
      },
   },
});

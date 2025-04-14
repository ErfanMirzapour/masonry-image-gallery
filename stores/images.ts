import { defineStore } from 'pinia';
import type { ImageObject } from '~/types';

interface QueryCache {
   images: ImageObject[];
   bookmark: string | null;
}

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

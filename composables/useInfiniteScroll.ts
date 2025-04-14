export function useInfiniteScroll(loadMore: () => Promise<void>) {
   const observer = ref<IntersectionObserver>();
   const bottomTrigger = ref<HTMLElement>();

   onMounted(() => {
      observer.value = new IntersectionObserver(
         ([entry]) => {
            if (entry.isIntersecting) {
               loadMore();
            }
         },
         { threshold: 0.5 }
      );

      if (bottomTrigger.value) {
         observer.value.observe(bottomTrigger.value);
      }
   });

   onUnmounted(() => {
      if (observer.value) {
         observer.value.disconnect();
      }
   });

   return {
      bottomTrigger,
   };
}

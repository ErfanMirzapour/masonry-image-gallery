<template>
   <div class='pt-3'>
      <search class='mb-3'>
         <div class="form-wrapper">
            <BForm @submit='onSubmit'>
               <BFormInput v-model='query' type='search' placeholder='Search for images...' required
                  aria-label='Search Query' />
            </BForm>
         </div>
      </search>

      <div v-if="!submitted" class='text-center'>Start searching...</div>
      <div v-else-if="error" class="text-center" role="alert">{{ error }}</div>
      <div v-else-if="images.length === 0 && !loading || !submitted">There are not images related to your query!
      </div>
      <Loading v-else-if='loading' />

      <BContainer v-else fluid class="masonry-container mb-3 text-">
         <div v-for="image in images" :key="image.id" class="masonry-item mb-3">
            <NuxtImg loading='lazy' :src="image.images['736x'].url"
               :srcset="`${image.images['236x'].url} 1x, ${image.images['474x'].url} 2x`"
               :width="image.images['736x'].width" :height="image.images['736x'].height" :alt="image.description" />
         </div>
      </BContainer>
      <div ref="bottomTrigger" class="bottom-trigger"></div>

      <div v-if="loadingMore" class="text-center mb-3">
         <Loading />
      </div>
   </div>
</template>

<script lang="ts" setup>
import type { ImageObject } from '~/types';

const query = ref()
const images = ref<ImageObject[]>([])
const error = ref<null | string>(null)
const loading = ref(false)
const submitted = ref(false)
const loadingMore = ref(false)
const bookmark = ref<string | null>(null)

const { bottomTrigger } = useInfiniteScroll(loadMore)

// New fetchImages() helper
async function fetchImages(bookmarkParam: string | null = null) {
   return await $fetch('/api/images', {
      query: {
         q: query.value,
         limit: 10,
         ...(bookmarkParam ? { bookmark: bookmarkParam } : {})
      },
   })
}

async function onSubmit(e: Event) {
   e.preventDefault()
   try {
      loading.value = true
      submitted.value = true
      images.value = []
      bookmark.value = null
      const { pins, bookmark: newBookmark } = await fetchImages()
      images.value = pins
      bookmark.value = newBookmark
   } catch (err: any) {
      console.error(err);
      error.value = 'Failed to fetch images. Please try again!';
   } finally {
      loading.value = false
   }
}

async function loadMore() {
   if (loadingMore.value || !bookmark.value) return
   try {
      loadingMore.value = true
      const { pins, bookmark: newBookmark } = await fetchImages(bookmark.value)
      images.value = [...images.value, ...pins]
      bookmark.value = newBookmark
   } catch (err) {
      console.error(err)
      error.value = 'Failed to load more images'
   } finally {
      loadingMore.value = false
   }
}
</script>

<style scoped>
.form-wrapper {
   width: 20rem;
   margin: 0 auto;
}

.masonry-container {
   column-count: 1;
   column-gap: 1em;
   width: 100%;
   text-align: center;

   @media (min-width: 576px) {
      column-count: 2;
   }

   @media (min-width: 768px) {
      column-count: 3;
   }
}

.masonry-item {
   break-inside: avoid;
   border-radius: 10px;
   overflow: hidden;

   &>img {
      width: 100%;
      height: auto;
   }
}

.bottom-trigger {
   width: 100%;
   height: 20px;
}
</style>
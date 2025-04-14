<template>
   <div class="pt-3">
      <!-- Search Form Section -->
      <section class="form-wrapper mb-3" role='search'>
         <BForm @submit.prevent="onSubmit">
            <BFormInput v-model="query" type="search" placeholder="Search for images..." required
               aria-label="Search Query" />
         </BForm>
      </section>

      <!-- Status Messages Section -->
      <section aria-live="polite">
         <div v-if="!submitted" class="text-center">Enter a search term to begin...</div>
         <div v-else-if="error" class="text-center alert alert-danger" role="alert">{{ error }}</div>
         <div v-else-if="images.length === 0 && !loading" class="text-center">
            No images found for your search query.
         </div>
         <Loading v-else-if="loading" />
      </section>

      <!-- Image Gallery Section -->
      <section aria-label="Image gallery">
         <BContainer v-if='!loading' fluid class="masonry-container mb-3">
            <div v-for="(image, index) in images" :key="`${query}-${index}-${image.images['736x'].url}`"
               class="masonry-item mb-3">
               <NuxtImg loading="lazy" :src="image.images['736x'].url"
                  :srcset="`${image.images['236x'].url} 1x, ${image.images['474x'].url} 2x`"
                  :width="image.images['736x'].width" :height="image.images['736x'].height"
                  :alt="image.description || 'Pinterest image'" class="w-100 rounded h-auto" />
            </div>
         </BContainer>

         <!-- Infinite Scroll Trigger -->
         <div ref="bottomTrigger" class="bottom-trigger" aria-hidden="true"></div>
         <div v-if='loadingMore' class='text-center mb-3'>
            <Loading />
         </div>
      </section>
   </div>
</template>

<script setup lang="ts">
import { useImagesStore } from '@/stores/images'
import type { ImageObject } from '@/types'

// Store and router setup
const store = useImagesStore()
const route = useRoute()
const router = useRouter()

// Component state
interface State {
   query: string
   images: ImageObject[]
   bookmark: string | null
   loading: boolean
   loadingMore: boolean
   submitted: boolean
   error: string | null
}

const state = reactive<State>({
   query: route.query.q as string || '',
   images: [],
   bookmark: null,
   loading: false,
   loadingMore: false,
   submitted: Boolean(route.query.q),
   error: null
})

const { query, images, bookmark, loading, loadingMore, submitted, error } = toRefs(state)

// Setup infinite scroll
const { bottomTrigger } = useInfiniteScroll(loadMore)

/**
 * Watches for URL query changes and triggers search
 */
watch(() => route.query.q, async (newQuery) => {
   if (newQuery) {
      state.submitted = true
      state.query = newQuery as string

      // Check cache before making API request
      const cached = store.getQueryResult(state.query)
      if (cached) {
         state.images = cached.images
         state.bookmark = cached.bookmark
      } else {
         await search()
      }
   } else {
      // Reset state when query is empty
      resetState()
   }
}, { immediate: true })

function resetState() {
   state.submitted = false
   state.images = []
   state.bookmark = null
   state.error = null
}

/**
 * Fetches images from the API
 * @param bookmarkParam - Optional bookmark for pagination
 */
async function fetchImages(bookmarkParam: string | null = null) {
   return await $fetch<{ pins: ImageObject[], bookmark: string | null }>('/api/images', {
      query: {
         q: state.query,
         limit: 10,
         ...(bookmarkParam ? { bookmark: bookmarkParam } : {})
      },
   })
}

/**
 * Performs initial search and updates store cache
 */
async function search() {
   try {
      state.loading = true
      state.error = null
      const { pins, bookmark: newBookmark } = await fetchImages()
      state.images = pins
      state.bookmark = newBookmark
      store.setQueryResult(state.query, pins, newBookmark)
   } catch (err) {
      console.error('Search error:', err)
      state.error = 'Failed to fetch images. Please try again!'
   } finally {
      state.loading = false
   }
}

/**
 * Loads more images when infinite scroll triggers
 */
async function loadMore() {
   if (state.loading || state.loadingMore || !state.bookmark) return

   try {
      state.loadingMore = true
      state.error = null
      const { pins, bookmark: newBookmark } = await fetchImages(state.bookmark)
      state.images = [...state.images, ...pins]
      state.bookmark = newBookmark
      store.setQueryResult(state.query, state.images, newBookmark)
   } catch (err) {
      console.error('Load more error:', err)
      state.error = 'Failed to load more images'
   } finally {
      state.loadingMore = false
   }
}

/**
 * Handles form submission by updating the URL query
 */
async function onSubmit(e: Event) {
   e.preventDefault()
   try {
      await router.push({ query: { q: state.query } })
   } catch (err) {
      console.error('Navigation error:', err)
      state.error = 'Failed to update search query'
   }
}
</script>

<style scoped>
.form-wrapper {
   width: 20rem;
   margin: 0 auto;
}

.masonry-container {
   column-count: 2;
   column-gap: 1rem;
   width: 100%;
}

/* Responsive column count based on screen size */
@media (min-width: 576px) {
   .masonry-container {
      column-count: 3;
   }
}

@media (min-width: 768px) {
   .masonry-container {
      column-count: 4;
   }
}

.masonry-item {
   display: inline-block;
   width: 100%;
   break-inside: avoid;
}

.bottom-trigger {
   width: 100%;
   height: 20px;
}

.alert {
   max-width: 600px;
   margin: 0 auto;
}
</style>

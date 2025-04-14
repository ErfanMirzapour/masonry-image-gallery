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
      <div v-else-if="images.length === 0 && !loading || !submitted">There are not images related to your query!
      </div>
      <Loading v-else-if='loading' />

      <BContainer v-else fluid class="masonry-container mb-3 text-">

         <div v-for="image in images" :key="image.id" class="masonry-item mb-3">
            <nuxt-img :src="image.images['736x'].url"
               :srcset="`${image.images['236x'].url} 1x, ${image.images['474x'].url} 2x`"
               :width="image.images['736x'].width" :height="image.images['736x'].height" :alt="image.description" />
         </div>
      </BContainer>
   </div>
</template>

<script lang="ts" setup>
import type { ImageObject } from '~/types';

const query = ref()
const images = ref<ImageObject[]>([])
const error = ref(null)
const loading = ref(false)
const submitted = ref(false)

async function onSubmit(e: Event) {
   e.preventDefault()
   try {
      loading.value = true
      submitted.value = true
      const data = await $fetch('/api/images', {
         query: {
            q: query.value,
            limit: 10,
         }
      })
      images.value = data.pins
      console.log(data.pins)
   } catch (err) {
      error.value = err.message
   } finally {
      loading.value = false
   }
}
</script>

<style scoped>
.form-wrapper {
   width: 20rem;
   /* Adjust the width as needed */
   margin: 0 auto;
   /* Centers the form horizontally */
}

.masonry-container {
   column-count: 3;
   column-gap: 1em;
   width: 100%;
   text-align: center;
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
</style>
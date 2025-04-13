<template>
   <div>
      <input type="text">
      <BContainer fluid class="masonry-container">
         <BCard class="masonry-item mb-3">
            <nuxt-img src="https://picsum.photos/300/200" width="300" height="200" alt="" />
         </BCard>
         <BCard class="masonry-item mb-3">
            <nuxt-img src="https://picsum.photos/300/400" width="300" height="400" alt="" />
         </BCard>
         <BCard class="masonry-item mb-3">
            <nuxt-img src="https://picsum.photos/300/250" width="300" height="250" alt="" />
         </BCard>
         <BCard class="masonry-item mb-3">
            <nuxt-img src="https://picsum.photos/300/300" width="300" height="300" alt="" />
         </BCard>
         <BCard class="masonry-item mb-3">
            <nuxt-img src="https://picsum.photos/300/350" width="300" height="350" alt="" />
         </BCard>
         <BCard class="masonry-item mb-3">
            <nuxt-img src="https://picsum.photos/300/200" width="300" height="200" alt="" />
         </BCard>
      </BContainer>
   </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.masonry-container {
   column-count: 3;
   column-gap: 1em;
   width: 100%;
}

.masonry-item {
   break-inside: avoid;
}
</style>
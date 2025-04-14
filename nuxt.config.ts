// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
   compatibilityDate: '2024-11-01',
   devtools: { enabled: true },
   modules: ['@nuxt/eslint', '@nuxt/image', '@bootstrap-vue-next/nuxt', '@pinia/nuxt'],
   css: ['bootstrap/dist/css/bootstrap.min.css'],
});
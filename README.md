# Masonry Images Gallery

This project is a Nuxt application that showcases an image gallery with a Pinterest-like masonry layout, built using Bootstrap for styling and Pinia for state management.

[Demo](https://masonry-image-gallery.netlify.app/)

> It worth noting that because API response lacks necessary CORS headers, I added an API endpoint using Nuxt's server features to proxy it.

## Main Features

-  Pure CSS masonry layout (Multi-column layout)
-  Caching results in store for (Back/Forward navigation)
-  Responsive layout based on device size and pixel density
-  Infinite scroll loading more behavior
-  API endpoint Proxy

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# bun
bun run dev
```

## Flaws

This app has a major UX flaw. Because the brand new CSS feature Masonry it's not implemented by the browsers yet and we're using a pure CSS (JS not involved) work around to have a semi-masonry layout, the order of the items changes as user scrolls bottom to see new images.

The order of item placement in multi-column layout is not left to right, like grid layouts, but it's top to bottom.
We could have create a new container for each set of new results but it won't look good because of the gap between two containers and it's not a great solution, either!

/**
 * API endpoint that acts as a proxy to the image search service
 * Implemented to handle CORS issues with the original API
 * @route GET /api/images
 * @query q - Search query string
 * @query limit - Number of results to return
 * @query bookmark - Pagination token for getting next page
 */
export default defineEventHandler(async event => {
   try {
      const query = getQuery(event);
      const response = await fetch(
         `https://pingrid-api.fazlali.workers.dev/?q=${query.q}&limit=${
            query.limit
         }${query.bookmark ? `&bookmark=${query.bookmark}` : ''}`
      );

      if (!response.ok) {
         throw new Error(`API responded with status ${response.status}`);
      }

      setResponseStatus(event, response.status);
      return response.json();
   } catch (error) {
      console.error('Image API Error:', error);
      throw createError({
         statusCode: 500,
         message: 'Failed to fetch images from the API',
      });
   }
});

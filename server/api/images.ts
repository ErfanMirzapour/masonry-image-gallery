export default defineEventHandler(async event => {
   const query = getQuery(event);
   const response = await fetch(
      `https://pingrid-api.fazlali.workers.dev/?q=${query.q}&limit=${query.limit}`
   );

   setResponseStatus(event, response.status);

   return response.json();
});

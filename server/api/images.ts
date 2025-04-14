export default defineEventHandler(async event => {
   const query = getQuery(event);
   const response = await fetch(
      `https://pingrid-api.fazlali.workers.dev/?q=${query.q}&limit=${query.limit}`
   );
   return response.json();
});

export function onRequest(context) {
    return new Response(context.env.API_URL);
}
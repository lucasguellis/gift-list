export function onRequest(context) {
    return new Response(context.env.AUTH_KEY_SECRET);
}
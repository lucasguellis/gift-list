/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// Check requests for a pre-shared secret
const hasValidHeader = (request, env) => {
	console.log(env.AUTH_KEY_SECRET);
	return request.headers.get('X-Auth-Key') === env.AUTH_KEY_SECRET;
};

export default {
	async fetch(request, env, ctx) {
		switch (request.method) {
			case "OPTIONS":
				const corsHeaders1 = {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
					"Access-Control-Allow-Headers": "*",
				};
				return new Response('ok', { headers: corsHeaders1 });
			case "PUT":
				if (!hasValidHeader(request, env)) {
					return new Response('Unauthorized', { status: 401 });
				}
				const corsHeaders2 = {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "PUT, OPTIONS",
					"Access-Control-Allow-Headers": "*",
					"Content-Type": "application/json",
				};
				const body = await request.json();
				console.log(env.BUCKET);
				await env.BUCKET.put(body.key, JSON.stringify(body.value));
				return new Response('ok', { headers: corsHeaders2 });
			case "GET":
				const url = new URL(request.url);
				const key = url.pathname.slice(1);
				const corsHeaders3 = {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, OPTIONS",
					"Access-Control-Allow-Headers": "*",
				};
				let object;

				const objectName = `gift-list-${key}`
				object = await env.BUCKET.get(`${objectName}.json`);

				if (object == null) {
					return new Response('Not found', { status: 404 });
				}

				const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set('etag', object.httpEtag);

        return new Response(object.body, {
			headers: {...headers, ...corsHeaders3},
        });
			default:
				return new Response('Method not allowed', { status: 405 });
		}
	},
};

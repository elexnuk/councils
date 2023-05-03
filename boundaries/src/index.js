// Publicly accessible components
import { boundaryFiles } from "./boundary_files.json";

// Test for valid secret key
const hasValidAuthorization = (request, env) => {
	return request.headers.get("X-Custom-Auth-Key") === env.AUTH_KEY_SECRET;
};

// Whitelisted origins
const allowedOrigins = [
	"https://council-colouring.pages.dev"
]

// headers for CORS requests
const preflightcorsHeaders = (request) => { return {
	// Return the origin if it's whitelisted above, else return the default allowed origin (first item). 
	"Access-Control-Allow-Origin": (allowedOrigins.includes(request.headers.get("Origin")) ? request.headers.get("Origin") : allowedOrigins[0] ),
	"Access-Control-Allow-Methods": "GET,PUT,DELETE,OPTIONS",
	"Access-Control-Max-Age": "86400",
} };

const corsHeaders = (response, origin) => { 
	response.headers.set("Access-Control-Allow-Origin", (allowedOrigins.includes(origin) ? origin : allowedOrigins[0]));
	response.headers.append("Vary", "Origin"); // for caching
	return response;
 };

function authorizeRequest(request, env, key) {
	switch (request.method) {
		case "PUT":
		case "DELETE":
			return hasValidAuthorization(request, env);
		case "GET":
			return boundaryFiles.includes(key);
		case "OPTIONS":
			return true;
		default:
			return false;
	}
}

function handleOptions(request) {
	if (
		request.headers.get("Origin") !== null &&
		request.headers.get("Access-Control-Request-Method") !== null &&
		request.headers.get("Access-Control-Request-Headers") !== null
	) {
		// CORS preflight
		return new Response(null, {
			headers: {
				...preflightcorsHeaders(request),
				"Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers")
			}
		})
	} else {
		// CORS OPTIONS
		return new Response(null, {
			headers: {
				Allow: "GET,PUT,DELETE,OPTIONS"
			}
		});
	}
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const key = url.pathname.slice(1);

		if (!authorizeRequest(request, env, key)) {
			return new Response("Forbidden", { status: 403 });
		}

		switch (request.method) {
			case "OPTIONS": 
				return handleOptions(request);
			case 'PUT':
				// Allow creation/update through PUT
				await env.boundaryBinding.put(key, request.body);
				return corsHeaders(new Response(`Success. PUT ${key}`), request.headers.get("Origin"));
			case 'GET':
				// Check fetch working with origin response
				if (key == "") {
					return new Response("Success. Worker Responding");
				}

				// Actually get the object and return it
				const object = await env.boundaryBinding.get(key);
				if (object === null) {
					return new Response("Not Found", { status: 404 });
				}
				const headers = new Headers();
				object.writeHttpMetadata(headers);
				headers.set("etag", object.httpEtag);
				return corsHeaders(new Response(object.body, {
					headers,
				}), request.headers.get("Origin"));
			case 'DELETE':
				// Allow deletion through DELETE method
				await env.boundaryBinding.delete(key);
				return corsHeaders(new Response(`Success. DELETE ${key}`), request.headers.get("Origin"));
			default:
				return corsHeaders(new Response("Method Not Allowed", {
					status: 405,
					headers: {
						Allow: "PUT, GET, DELETE",
					},
				}), request.headers.get("Origin"));
		}
	},
};  

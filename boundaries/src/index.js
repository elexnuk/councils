// Publicly accessible components
import { boundaryFiles } from "./boundary_files.json";

// Test for valid secret key
const hasValidAuthorization = (request, env) => {
	return request.headers.get("X-Custom-Auth-Key") === env.AUTH_KEY_SECRET;
};

function authorizeRequest(request, env, key) {
	switch (request.method) {
		case "PUT":
		case "DELETE":
			return hasValidAuthorization(request, env);
		case "GET":
			return boundaryFiles.includes(key);
		default:
			return false;
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
			case 'PUT':
				// Allow creation/update through PUT
				await env.boundaryBinding.put(key, request.body);
				return new Response(`Success. PUT ${key}`);
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
				return new Response(object.body, {
					headers,
				});
			case 'DELETE':
				// Allow deletion through DELETE method
				await env.boundaryBinding.delete(key);
				return new Response(`Success. DELETE ${key}`);
			default:
				return new Response("Method Not Allowed", {
					status: 405,
					headers: {
						Allow: "PUT, GET, DELETE",
					},
				});
		}
	},
};  

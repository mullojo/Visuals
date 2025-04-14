export default {
    async fetch(request, env, ctx) {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
      }
  
      const { filename, type } = await request.json();
  
      if (!filename || !type) {
        return new Response("Missing filename or type", { status: 400 });
      }
  
      const key = `${Date.now()}-${filename}`;
  
      const uploadUrl = await env.MEDIA_BUCKET.createPresignedUrl({
        method: "PUT",
        key,
        expiresIn: 600, // 10 min
        httpMetadata: {
          contentType: type,
        },
      });
  
      const publicUrl = `https://${env.MEDIA_BUCKET.publicHostname}/${key}`;
  
      return new Response(JSON.stringify({ uploadUrl: uploadUrl.toString(), publicUrl }), {
        headers: { "Content-Type": "application/json" },
      });
    },
  };
  
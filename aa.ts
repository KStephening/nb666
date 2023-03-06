// import { serve } from 'https://deno.land/std/http/server.ts';

import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
serve((_req) => new Response("Hello, world"));
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";

const server = serve({ port: 8000 });
console.log('HTTP server listening on port 8000...');

for await (const req of server) {
    const data = await req.json().catch(() => null);

    const response = await fetch('https://gpt-ecru.vercel.app/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });




    const body = response.body;

    // 将响应流作为HTTP响应的主体，使用流式方式发送给客户端
    req.respond({
        body: body,
        headers: new Headers({
            'content-type': 'application/octet-stream',
        }),
    });
}

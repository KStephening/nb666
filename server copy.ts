import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
async function handler(req: Request): Promise<Response> {
  switch (req.method) {

    case "POST": {
      const data = await req.json().catch(() => null);
      console.log("text");
      // 请求参数
      // const data = {
      //   "model": "gpt-3.5-turbo",
      //   "messages": [
      //     { "role": "system", "content": "You are a helpful assistant." },
      //     { "role": "user", "content": text },
      //   ]
      // }
      // 发送POST请求
      const response = await fetch('https://gpt-ecru.vercel.app/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      // 解析返回的JSON数据
      const body = response.body
      console.log(body);
      return new Response(body, {
        headers: {'content-type': 'application/octet-stream', },
      });
    }

    default:
      return new Response("Invalid method", { status: 405 });
  }
}

serve(handler);
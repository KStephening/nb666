import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import  { Configuration, OpenAIApi }  from "https://esm.sh//openai";
const OPENAI_API_KEY = "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";

async function handler(req: Request): Promise<Response> {
  switch (req.method) {

    case "POST": {
      const { text } = await req.json().catch(() => null);

      // const model = "davinci";
      // const prompt = `The following is a conversation with an AI assistant. The assistant helps with various tasks.\n\nUser: ${text}\nAI:`;

      const configuration = new Configuration({
        apiKey: OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Say this is a test",
        temperature: 0,
        max_tokens: 7,
      });
      // const result = await openai.createCompletion(
      //   {
      //     engine: model,
      //     prompt,
      //     maxTokens: 1024,
      //     n: 1,
      //     stop: "\n",
      //     temperature: 0.5,
      //   },
      //   OPENAI_API_KEY
      // );

      // const response = result.choices[0].text.trim();
      const body = { response };
      return new Response(body, {
        headers: { "content-type": "application/json" },
      });
    }

    default:
      return new Response("Invalid method", { status: 405 });
  }
}

serve(handler);
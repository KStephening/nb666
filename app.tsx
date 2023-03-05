import { h, renderToString, useState } from "https://esm.sh/preact";
import { useStatefulFetch } from "https://cdn.skypack.dev/use-stateful-fetch";
import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { openai } from "https://deno.land/x/openai/mod.ts";
const OPENAI_API_KEY = "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";

const App = () => {
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState("");
  const [sendRequest, { loading, data }] = useStatefulFetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input.trim() === "") return;

    setHistory([...history, { user: input, bot: "" }]);
    setInput("");

    const response = await sendRequest({ text: input });

    setHistory((prev) => {
      const lastIndex = prev.length - 1;
      const updatedHistory = [...prev];
      updatedHistory[lastIndex].bot = response.response;
      return updatedHistory;
    });
  };

  return (
    <div>
      <h1>Chat with AI </h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button disabled={loading}> Send </button>
      </form>
      {loading && <p>Loading...</p>}
      <div>
        {history.map(({ user, bot }, index) => (
          <div key={index}>
            <p>User: {user} </p>
            {bot && <p>AI: {bot} </p>}
          </div>
        ))}
      </div>
    </div>
  );
};

const html = renderToString(<App />, document.body);

async function handler(req: Request): Promise<Response> {
  switch (req.method) {
    case "GET": {
      return new Response(html, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }

    case "POST": {
      const { text } = await req.json().catch(() => null);

      const model = "davinci";
      const prompt = `The following is a conversation with an AI assistant. The assistant helps with various tasks.\n\nUser: ${text}\nAI:`;

      const result = await openai.createCompletion(
        {
          engine: model,
          prompt,
          maxTokens: 1024,
          n: 1,
          stop: "\n",
          temperature: 0.5,
        },
        OPENAI_API_KEY
      );

      const response = result.choices[0].text.trim();
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
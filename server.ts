import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { openai } from "https://deno.land/x/openai/mod.ts";

serve((req: Request) => new Response("Hello World"));
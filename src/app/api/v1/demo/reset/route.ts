import { emptyRequestSchema, resetResponseSchema } from "@/application/api/schemas";
import { getDemoApplication } from "@/application/demo/demo-runtime";
import { parseJson, respond } from "@/app/api/v1/_lib/api-response";

export async function POST(request: Request): Promise<Response> {
  return respond(resetResponseSchema, async () => {
    await parseJson(request, emptyRequestSchema);
    return getDemoApplication().resetDemo();
  });
}

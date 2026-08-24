import { openResolutionRequestSchema, resolutionResponseSchema } from "@/application/api/schemas";
import { getDemoApplication } from "@/application/demo/demo-runtime";
import { parseJson, respond } from "@/app/api/v1/_lib/api-response";

export async function POST(request: Request): Promise<Response> {
  return respond(
    resolutionResponseSchema,
    async () => ({
      resolution: getDemoApplication().openResolution(
        await parseJson(request, openResolutionRequestSchema),
      ),
    }),
    201,
  );
}

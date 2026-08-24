import { confirmationResponseSchema, confirmSimulationRequestSchema } from "@/application/api/schemas";
import { getDemoApplication } from "@/application/demo/demo-runtime";
import { parseJson, respond } from "@/app/api/v1/_lib/api-response";

interface ResolutionRouteContext {
  readonly params: Promise<{ resolutionId: string }>;
}

export async function POST(
  request: Request,
  context: ResolutionRouteContext,
): Promise<Response> {
  return respond(confirmationResponseSchema, async () => {
    const { resolutionId } = await context.params;
    const input = await parseJson(request, confirmSimulationRequestSchema);
    return {
      confirmation: getDemoApplication().confirmSimulation({ resolutionId, ...input }),
    };
  });
}

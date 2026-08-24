import { appliedSimulationResponseSchema, applySimulationRequestSchema } from "@/application/api/schemas";
import { getDemoApplication } from "@/application/demo/demo-runtime";
import { parseJson, respond } from "@/app/api/v1/_lib/api-response";

interface ResolutionRouteContext {
  readonly params: Promise<{ resolutionId: string }>;
}

export async function POST(
  request: Request,
  context: ResolutionRouteContext,
): Promise<Response> {
  return respond(appliedSimulationResponseSchema, async () => {
    const { resolutionId } = await context.params;
    const input = await parseJson(request, applySimulationRequestSchema);
    return getDemoApplication().applySimulation({ resolutionId, ...input });
  });
}

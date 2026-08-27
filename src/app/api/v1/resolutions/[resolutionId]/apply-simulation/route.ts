import { appliedSimulationResponseSchema, applySimulationRequestSchema } from "@/application/api/schemas";
import { parseJson, respond } from "@/app/api/v1/_lib/api-response";
import { requireApiUser } from "@/lib/auth/current-user";
import { withLatestGuidedRun } from "@/persistence/guided-run-store";

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
    const user = await requireApiUser();
    return withLatestGuidedRun(user.id, (application) => application.applySimulation({ resolutionId, ...input }));
  });
}

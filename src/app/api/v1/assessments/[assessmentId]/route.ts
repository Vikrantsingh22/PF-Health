import { assessmentResponseSchema } from "@/application/api/schemas";
import { respond } from "@/app/api/v1/_lib/api-response";
import { requireApiUser } from "@/lib/auth/current-user";
import { withLatestGuidedRun } from "@/persistence/guided-run-store";

interface AssessmentRouteContext {
  readonly params: Promise<{ assessmentId: string }>;
}

export async function GET(
  _request: Request,
  context: AssessmentRouteContext,
): Promise<Response> {
  return respond(assessmentResponseSchema, async () => {
    const { assessmentId } = await context.params;
    const user = await requireApiUser();
    return withLatestGuidedRun(user.id, (application) => ({ assessment: application.getAssessment(assessmentId) }));
  });
}

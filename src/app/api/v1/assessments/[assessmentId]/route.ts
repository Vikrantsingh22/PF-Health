import { assessmentResponseSchema } from "@/application/api/schemas";
import { getDemoApplication } from "@/application/demo/demo-runtime";
import { respond } from "@/app/api/v1/_lib/api-response";

interface AssessmentRouteContext {
  readonly params: Promise<{ assessmentId: string }>;
}

export async function GET(
  _request: Request,
  context: AssessmentRouteContext,
): Promise<Response> {
  return respond(assessmentResponseSchema, async () => {
    const { assessmentId } = await context.params;
    return { assessment: getDemoApplication().getAssessment(assessmentId) };
  });
}

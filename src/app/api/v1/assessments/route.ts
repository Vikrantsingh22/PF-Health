import { assessmentRequestSchema, assessmentResponseSchema } from "@/application/api/schemas";
import { parseJson, respond } from "@/app/api/v1/_lib/api-response";
import { requireApiUser } from "@/lib/auth/current-user";
import { withLatestGuidedRun } from "@/persistence/guided-run-store";

export async function POST(request: Request): Promise<Response> {
  return respond(assessmentResponseSchema, async () => {
    const input = await parseJson(request, assessmentRequestSchema);
    const user = await requireApiUser();
    return withLatestGuidedRun(user.id, (application) => ({
      assessment: application.loadAndAssess(
        input.memberId,
        input.expectedSnapshotVersion,
        input.workflow.type,
      ),
    }));
  });
}

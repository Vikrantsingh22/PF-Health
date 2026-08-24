import { assessmentRequestSchema, assessmentResponseSchema } from "@/application/api/schemas";
import { getDemoApplication } from "@/application/demo/demo-runtime";
import { parseJson, respond } from "@/app/api/v1/_lib/api-response";

export async function POST(request: Request): Promise<Response> {
  return respond(assessmentResponseSchema, async () => {
    const input = await parseJson(request, assessmentRequestSchema);
    return {
      assessment: getDemoApplication().loadAndAssess(
        input.memberId,
        input.expectedSnapshotVersion,
        input.workflow.type,
      ),
    };
  });
}

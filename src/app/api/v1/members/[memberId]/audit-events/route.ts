import { auditResponseSchema, demoMemberIdSchema } from "@/application/api/schemas";
import { getDemoApplication } from "@/application/demo/demo-runtime";
import { respond } from "@/app/api/v1/_lib/api-response";

interface MemberRouteContext {
  readonly params: Promise<{ memberId: string }>;
}

export async function GET(_request: Request, context: MemberRouteContext): Promise<Response> {
  return respond(auditResponseSchema, async () => {
    const { memberId } = await context.params;
    const safeMemberId = demoMemberIdSchema.parse(memberId);
    return { events: getDemoApplication().listAudit(safeMemberId) };
  });
}

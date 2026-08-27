import { auditResponseSchema, demoMemberIdSchema } from "@/application/api/schemas";
import { respond } from "@/app/api/v1/_lib/api-response";
import { requireApiUser } from "@/lib/auth/current-user";
import { withLatestGuidedRun } from "@/persistence/guided-run-store";

interface MemberRouteContext {
  readonly params: Promise<{ memberId: string }>;
}

export async function GET(_request: Request, context: MemberRouteContext): Promise<Response> {
  return respond(auditResponseSchema, async () => {
    const { memberId } = await context.params;
    const safeMemberId = demoMemberIdSchema.parse(memberId);
    const user = await requireApiUser();
    return withLatestGuidedRun(user.id, (application) => ({ events: application.listAudit(safeMemberId) }));
  });
}

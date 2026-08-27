import { issueDetailResponseSchema } from "@/application/api/schemas";
import { createIssueDetail } from "@/application/issues/issue-detail";
import { respond } from "@/app/api/v1/_lib/api-response";
import { requireApiUser } from "@/lib/auth/current-user";
import { withLatestGuidedRun } from "@/persistence/guided-run-store";

interface IssueRouteContext {
  readonly params: Promise<{ issueId: string }>;
}

export async function GET(_request: Request, context: IssueRouteContext): Promise<Response> {
  return respond(issueDetailResponseSchema, async () => {
    const { issueId } = await context.params;
    const user = await requireApiUser();
    return withLatestGuidedRun(user.id, (application) => createIssueDetail(application.getIssue(issueId)));
  });
}

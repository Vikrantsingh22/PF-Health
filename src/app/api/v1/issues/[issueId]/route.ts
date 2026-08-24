import { issueDetailResponseSchema } from "@/application/api/schemas";
import { getDemoApplication } from "@/application/demo/demo-runtime";
import { createIssueDetail } from "@/application/issues/issue-detail";
import { respond } from "@/app/api/v1/_lib/api-response";

interface IssueRouteContext {
  readonly params: Promise<{ issueId: string }>;
}

export async function GET(_request: Request, context: IssueRouteContext): Promise<Response> {
  return respond(issueDetailResponseSchema, async () => {
    const { issueId } = await context.params;
    return createIssueDetail(getDemoApplication().getIssue(issueId));
  });
}

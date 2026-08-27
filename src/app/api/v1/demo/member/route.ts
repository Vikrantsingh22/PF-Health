import { memberResponseSchema } from "@/application/api/schemas";
import { respond } from "@/app/api/v1/_lib/api-response";
import { requireApiUser } from "@/lib/auth/current-user";
import { withLatestGuidedRun } from "@/persistence/guided-run-store";

export async function GET(): Promise<Response> {
  return respond(memberResponseSchema, async () => {
    const user = await requireApiUser();
    return withLatestGuidedRun(user.id, (application) => ({ member: application.getMember("demo_ravi") }));
  });
}

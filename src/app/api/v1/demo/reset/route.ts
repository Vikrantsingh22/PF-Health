import { emptyRequestSchema, resetResponseSchema } from "@/application/api/schemas";
import { parseJson, respond } from "@/app/api/v1/_lib/api-response";
import { requireApiUser } from "@/lib/auth/current-user";
import { createGuidedRun } from "@/persistence/guided-run-store";

export async function POST(request: Request): Promise<Response> {
  return respond(resetResponseSchema, async () => {
    await parseJson(request, emptyRequestSchema);
    const user = await requireApiUser();
    return createGuidedRun(user.id, (application) => application.resetDemo());
  });
}

import { openResolutionRequestSchema, resolutionResponseSchema } from "@/application/api/schemas";
import { parseJson, respond } from "@/app/api/v1/_lib/api-response";
import { requireApiUser } from "@/lib/auth/current-user";
import { withLatestGuidedRun } from "@/persistence/guided-run-store";

export async function POST(request: Request): Promise<Response> {
  return respond(
    resolutionResponseSchema,
    async () => {
      const input = await parseJson(request, openResolutionRequestSchema);
      const user = await requireApiUser();
      return withLatestGuidedRun(user.id, (application) => ({ resolution: application.openResolution(input) }));
    },
    201,
  );
}

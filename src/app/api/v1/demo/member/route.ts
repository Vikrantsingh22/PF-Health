import { memberResponseSchema } from "@/application/api/schemas";
import { getDemoApplication } from "@/application/demo/demo-runtime";
import { respond } from "@/app/api/v1/_lib/api-response";

export async function GET(): Promise<Response> {
  return respond(memberResponseSchema, () => ({
    member: getDemoApplication().getMember("demo_ravi"),
  }));
}

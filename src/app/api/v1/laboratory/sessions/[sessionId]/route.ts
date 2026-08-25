import { parseJson, respond } from "@/app/api/v1/_lib/api-response";
import { getLaboratoryService } from "@/laboratory/runtime";
import { laboratorySessionResponseSchema, updateLaboratoryDraftSchema } from "@/laboratory/schemas";
type Context = { params: Promise<{ sessionId: string }> };
export async function GET(_: Request, { params }: Context): Promise<Response> { const { sessionId } = await params; return respond(laboratorySessionResponseSchema, () => ({ session: getLaboratoryService().get(sessionId) })); }
export async function PUT(request: Request, { params }: Context): Promise<Response> { const { sessionId } = await params; return respond(laboratorySessionResponseSchema, async () => { const input = await parseJson(request, updateLaboratoryDraftSchema); return { session: getLaboratoryService().updateDraft(sessionId, input.expectedDraftVersion, input.scenario) }; }); }

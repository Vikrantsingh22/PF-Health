import { parseJson, respond } from "@/app/api/v1/_lib/api-response";
import { laboratorySessionResponseSchema, updateLaboratoryDraftSchema } from "@/laboratory/schemas";
import { requireApiUser } from "@/lib/auth/current-user";
import { getLaboratorySession, mutateLaboratorySession } from "@/persistence/laboratory-session-store";
type Context = { params: Promise<{ sessionId: string }> };
export async function GET(_: Request, { params }: Context): Promise<Response> { const { sessionId } = await params; return respond(laboratorySessionResponseSchema, async () => { const user = await requireApiUser(); return { session: await getLaboratorySession(user.id, sessionId) }; }); }
export async function PUT(request: Request, { params }: Context): Promise<Response> { const { sessionId } = await params; return respond(laboratorySessionResponseSchema, async () => { const input = await parseJson(request, updateLaboratoryDraftSchema); const user = await requireApiUser(); return { session: await mutateLaboratorySession(user.id, sessionId, (service) => service.updateDraft(sessionId, input.expectedDraftVersion, input.scenario)) }; }); }

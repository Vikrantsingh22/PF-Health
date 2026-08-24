import { ZodError, type ZodType } from "zod";

import { apiErrorSchema } from "@/application/api/schemas";
import { ApplicationError } from "@/application/errors/application-error";

const JSON_HEADERS = Object.freeze({
  "Cache-Control": "no-store",
  "Content-Type": "application/json; charset=utf-8",
});

function requestId(): string {
  return `request_${crypto.randomUUID()}`;
}

function statusFor(code: ApplicationError["code"] | "INTERNAL_ERROR"): number {
  switch (code) {
    case "VALIDATION_ERROR":
      return 400;
    case "NOT_FOUND":
      return 404;
    case "CONFLICT":
      return 409;
    case "UNSUPPORTED_ACTION":
    case "REVIEW_REQUIRED":
      return 422;
    case "INTERNAL_ERROR":
      return 500;
  }
}

function fieldErrors(error: ZodError): Record<string, string[]> {
  const fields: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.length === 0 ? "body" : issue.path.map(String).join(".");
    fields[path] = [...(fields[path] ?? []), issue.message];
  }
  return fields;
}

function errorResponse(error: unknown): Response {
  const id = requestId();
  if (error instanceof ZodError) {
    const payload = apiErrorSchema.parse({
      error: {
        code: "VALIDATION_ERROR",
        message: "The request body is invalid.",
        requestId: id,
        fieldErrors: fieldErrors(error),
      },
    });
    return Response.json(payload, { status: 400, headers: JSON_HEADERS });
  }

  if (error instanceof ApplicationError) {
    const payload = apiErrorSchema.parse({
      error: { code: error.code, message: error.message, requestId: id },
    });
    return Response.json(payload, { status: statusFor(error.code), headers: JSON_HEADERS });
  }

  const payload = apiErrorSchema.parse({
    error: {
      code: "INTERNAL_ERROR",
      message: "The request could not be completed.",
      requestId: id,
    },
  });
  return Response.json(payload, { status: 500, headers: JSON_HEADERS });
}

export async function parseJson<T>(request: Request, schema: ZodType<T>): Promise<T> {
  const text = await request.text();
  let value: unknown = {};
  if (text.trim() !== "") {
    try {
      value = JSON.parse(text);
    } catch {
      throw new ApplicationError("VALIDATION_ERROR", "The request body must be valid JSON");
    }
  }
  return schema.parse(value);
}

export async function respond(
  schema: ZodType,
  action: () => unknown | Promise<unknown>,
  status = 200,
): Promise<Response> {
  try {
    const payload = schema.parse(await action());
    return Response.json(payload, { status, headers: JSON_HEADERS });
  } catch (error) {
    return errorResponse(error);
  }
}

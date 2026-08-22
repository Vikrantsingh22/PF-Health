# Semantic Router — Finalist-Only Concept

## Status

`DEFERRED / DO NOT IMPLEMENT FOR AUGUST 27`

This document preserves a future direction without authorizing code, UI, dependencies, issue codes, prompts, or API endpoints. `docs/product/SCOPE.md` remains controlling.

## Future problem

A later version may accept a member goal such as a type of withdrawal or transfer, resolve it to a known workflow definition, identify deterministic record requirements, and run the same health engine in that explicit context.

```text
user expression
      |
      v
bounded intent classification
      |
      v
approved WorkflowDefinition
      |
      v
deterministic HealthRequirement set
      |
      v
existing HealthEngine
```

The router would select among approved workflow IDs. It would not answer from general model knowledge, determine eligibility, or create requirements dynamically.

## Conceptual types

```ts
interface UserIntent {
  rawText: string;
  locale: string;
}

interface WorkflowDefinition {
  workflowId: string;
  version: number;
  label: string;
  requirementIds: string[];
  sourceIds: string[];
}

type RouteResult =
  | { status: "MATCHED"; workflowId: string; confidenceBand: "HIGH" | "MEDIUM" }
  | { status: "NEEDS_CLARIFICATION"; questionKey: string }
  | { status: "UNSUPPORTED" }
  | { status: "REVIEW_REQUIRED" };
```

Even if an LLM classifies language, the output must validate against a closed workflow registry. `UNSUPPORTED` and `REVIEW_REQUIRED` remain first-class outcomes.

## Preconditions before approval

- The current Ravi journey is complete, tested, accessible, and demo-stable.
- A human approves the expanded product narrative and scope.
- Each workflow has official sources, explicit requirements, limitations, and tests.
- Ambiguous language and multilingual behavior have evaluation datasets.
- Privacy and prompt-injection reviews are complete.
- The fallback experience works without a model.
- The change does not imply claim eligibility or government affiliation.

## Explicit non-goals

- Generic public-service chatbot
- Autonomous browsing or portal operation
- Open-ended RAG over unverified websites
- Model-generated legal or eligibility rules
- Routing to real claim submission
- Multiple public services before PF workflows are reliable

## Architectural preparation allowed now

The MVP may pass a simple `WorkflowContext` into `evaluateHealth` and keep rules independent from UI routes. No other router infrastructure should be built until this document is promoted through an explicit scope decision.

import { MockEPFOAdapter } from "@/adapters/epfo/mock-epfo-adapter";
import { InMemoryWorkflowRepository } from "@/adapters/persistence/in-memory-workflow-repository";
import { DemoResolutionService } from "@/application/resolution/demo-resolution-service";
import type { MemberState } from "@/domain/model/types";
import type { WorkflowRepositoryState } from "@/application/ports/workflow-repository";

export interface GuidedRunState {
  readonly member: MemberState;
  readonly workflow: WorkflowRepositoryState;
}

export function createDemoApplication(initialState?: GuidedRunState): DemoResolutionService {
  return new DemoResolutionService(
    new MockEPFOAdapter(initialState?.member),
    new InMemoryWorkflowRepository(initialState?.workflow),
    {
      now: () => new Date().toISOString(),
      createId: (kind) => `${kind}_${crypto.randomUUID()}`,
    },
  );
}

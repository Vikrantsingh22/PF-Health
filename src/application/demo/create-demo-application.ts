import { MockEPFOAdapter } from "@/adapters/epfo/mock-epfo-adapter";
import { InMemoryWorkflowRepository } from "@/adapters/persistence/in-memory-workflow-repository";
import { DemoResolutionService } from "@/application/resolution/demo-resolution-service";

export function createDemoApplication(): DemoResolutionService {
  let sequence = 0;
  return new DemoResolutionService(
    new MockEPFOAdapter(),
    new InMemoryWorkflowRepository(),
    {
      now: () => new Date().toISOString(),
      createId: (kind) => `${kind}_${String(++sequence).padStart(4, "0")}`,
    },
  );
}

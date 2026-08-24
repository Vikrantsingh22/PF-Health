import { createDemoApplication } from "@/application/demo/create-demo-application";
import type { DemoResolutionService } from "@/application/resolution/demo-resolution-service";

const runtime = globalThis as typeof globalThis & {
  pfHealthDemoApplication?: DemoResolutionService;
};

export function getDemoApplication(): DemoResolutionService {
  runtime.pfHealthDemoApplication ??= createDemoApplication();
  return runtime.pfHealthDemoApplication;
}

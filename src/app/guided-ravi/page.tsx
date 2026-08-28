import { PFHealthApp } from "@/components/pf-health-app";
import { SiteHeader } from "@/components/site-header";
import { SyntheticNotice } from "@/components/synthetic-notice";
import { requirePageUser } from "@/lib/auth/current-user";
import { hasCompletedGuidedRun } from "@/persistence/guided-run-store";

export default async function GuidedRaviPage() {
  const user = await requirePageUser("/guided-ravi");
  const previouslyCompleted = await hasCompletedGuidedRun(user.id);
  return <><SiteHeader wide /><SyntheticNotice /><PFHealthApp previouslyCompleted={previouslyCompleted} /></>;
}

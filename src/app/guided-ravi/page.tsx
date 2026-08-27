import { PFHealthApp } from "@/components/pf-health-app";
import { SiteHeader } from "@/components/site-header";
import { requirePageUser } from "@/lib/auth/current-user";

export default async function GuidedRaviPage() {
  await requirePageUser("/guided-ravi");
  return <><SiteHeader /><PFHealthApp /></>;
}

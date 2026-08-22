import { createDemoApplication } from "@/application/demo/create-demo-application";

const { member, assessment } = createDemoApplication().resetDemo();

console.log(
  JSON.stringify({
    operation: "reset:demo",
    memberId: member.memberId,
    snapshotVersion: member.snapshotVersion,
    assessmentStatus: assessment.status,
    passedChecks: assessment.passedChecks,
    totalChecks: assessment.totalChecks,
  }),
);

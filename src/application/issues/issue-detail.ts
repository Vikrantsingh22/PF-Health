import type { Issue } from "@/domain/model/types";

const SOURCES = Object.freeze([
  Object.freeze({
    sourceId: "SRC-001" as const,
    title: "FAQ — Transfer Claims",
    url: "https://www.epfindia.gov.in/site_docs/PDFs/Circulars/Y2020-2021/faq_transfer_claim.pdf",
    retrievedAt: "2026-08-22" as const,
  }),
  Object.freeze({
    sourceId: "SRC-002" as const,
    title: "EPFO Help — transfer claims",
    url: "https://www.epfindia.gov.in/site_en/Help.php",
    retrievedAt: "2026-08-25" as const,
  }),
]);

export function createIssueDetail(issue: Issue) {
  return Object.freeze({
    issue,
    copy: Object.freeze({
      title: "Your previous employment is missing exit information.",
      summary: "One item in Ravi's sample record needs attention.",
      impact: "Exit information is required for the supported online-transfer scenario.",
      owner:
        "Ravi may be able to use the supported member update path. Employer help or EPFO review may be needed.",
      nextStep: "Review the supported path, then apply a correction only to Ravi's sample record.",
      limitation: "This does not guarantee a transfer or claim outcome.",
      source: "DETERMINISTIC_FALLBACK" as const,
    }),
    sources: SOURCES.filter(({ sourceId }) => issue.sourceIds.includes(sourceId)),
  });
}

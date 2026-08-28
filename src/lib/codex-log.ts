export type CodexLogBlock =
  | { readonly type: "paragraph"; readonly text: string }
  | { readonly type: "list"; readonly items: readonly string[] };

export interface CodexLogSection {
  readonly title: string;
  readonly blocks: readonly CodexLogBlock[];
}

export interface ParsedCodexLog {
  readonly introduction: readonly string[];
  readonly sections: readonly CodexLogSection[];
}

function cleanInlineMarkdown(value: string) {
  return value
    .replace(/\[([^\]]+)]\(([^)]+)\)/g, "$1 ($2)")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .trim();
}

export function parseCodexLog(markdown: string): ParsedCodexLog {
  const introduction: string[] = [];
  const sections: Array<{ title: string; blocks: CodexLogBlock[] }> = [];
  let activeSection: { title: string; blocks: CodexLogBlock[] } | undefined;
  let paragraph: string[] = [];
  let list: string[] = [];

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = cleanInlineMarkdown(paragraph.join(" "));
    if (activeSection) activeSection.blocks.push({ type: "paragraph", text });
    else introduction.push(text);
    paragraph = [];
  };
  const flushList = () => {
    if (list.length === 0) return;
    const items = list.map(cleanInlineMarkdown);
    if (activeSection) activeSection.blocks.push({ type: "list", items });
    else introduction.push(...items);
    list = [];
  };

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    const datedHeading = line.match(/^#{1,2}\s+(\d{4}-\d{2}-\d{2}\s+—\s+.+)$/);

    if (datedHeading) {
      flushParagraph();
      flushList();
      activeSection = { title: datedHeading[1], blocks: [] };
      sections.push(activeSection);
      continue;
    }
    if (/^#\s+Codex Contribution Log$/.test(line)) continue;
    if (line.startsWith("- ")) {
      flushParagraph();
      list.push(line.slice(2));
      continue;
    }
    if (line === "") {
      flushParagraph();
      flushList();
      continue;
    }
    paragraph.push(line.replace(/^#{1,6}\s+/, ""));
  }

  flushParagraph();
  flushList();
  return { introduction, sections };
}

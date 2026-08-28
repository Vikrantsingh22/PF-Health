import type { Metadata } from "next";
import type { ReactNode } from "react";

import "@fontsource-variable/noto-sans/wght.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "PF Health",
  description: "Synthetic PF record health prototype",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const directionContract = `<!--
IMPECCABLE DIRECTION CONTRACT 9188a955
THESIS: PF Health behaves like a calm personal case file; it refuses dashboard tiles and detached issue cards.
OWN-WORLD: Warm paper, slate text, deep-blue file structure, green healthy marks, amber attention marks, flat ruled surfaces, and authored outline icons.
STORY: Ravi loads a synthetic record, understands one supported issue, confirms a local correction, and sees the same file revalidate from four to five healthy checks.
FIRST VIEWPORT: Identity and synthetic notice lead into a full-width file cover, five indexed checks, a continuous check-05 dossier bridge, guidance rows, evidence, and one primary action.
FORM: Calm Case File, ranked structure 3, seed 9188a955.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`;

  return (
    <html data-scroll-behavior="smooth" lang="en">
      <body>
        <div aria-hidden="true" className="direction-contract">
          {directionContract}
        </div>
        {children}
      </body>
    </html>
  );
}

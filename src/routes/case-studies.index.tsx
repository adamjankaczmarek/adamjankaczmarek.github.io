import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CASE_STUDIES } from "@/lib/projects.data";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const Route = createFileRoute("/case-studies/")({
  head: () => ({
    meta: [
      { title: "Case Studies — Adam Jan Kaczmarek" },
      {
        name: "description",
        content:
          "Realized client projects by Adam Jan Kaczmarek — Document AI, NLP, and machine learning systems shipped to production.",
      },
      { property: "og:title", content: "Case Studies — Adam Jan Kaczmarek" },
      {
        property: "og:description",
        content:
          "Realized client projects — Document AI, NLP, and machine learning systems shipped to production.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CaseStudiesPage,
});

function CaseStudiesPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="mx-auto max-w-6xl px-6 md:px-10 h-14 flex items-center justify-between">
          <Link to="/" className="mono text-sm text-primary">
            <span className="opacity-60">~/</span>adam.kaczmarek
          </Link>
          <nav className="hidden md:flex gap-6 mono text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              home
            </Link>
            <Link to="/case-studies" className="text-primary transition-colors">
              case studies
            </Link>
            <Link to="/posts" className="hover:text-primary transition-colors">
              writing
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 md:px-10 pt-16 pb-32">
        <div className="mb-12">
          <div className="section-label mb-3">// realized work</div>
          <h1 className="text-4xl md:text-5xl mb-3">Case Studies</h1>
          <p className="text-muted-foreground max-w-xl">
            Client engagements shipped to production — the business problem, the trade-offs, and the
            outcome.
          </p>
        </div>

        <div className="space-y-4">
          {CASE_STUDIES.map((cs) => (
            <CaseStudyCard key={cs.slug} cs={cs} />
          ))}
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-8 mono text-xs text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} Adam Jan Kaczmarek</span>
          <Link to="/" className="hover:text-primary transition-colors">
            ← back to portfolio
          </Link>
        </div>
      </footer>
    </div>
  );
}

function CaseStudyCard({ cs }: { cs: (typeof CASE_STUDIES)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card-surface p-6">
      <div className="mono text-xs text-muted-foreground mb-2">
        {cs.role} · {cs.date}
      </div>
      <h2 className="text-xl md:text-2xl mb-2">{cs.title}</h2>
      <div className="mono text-xs text-primary mb-3">{cs.client}</div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{cs.abstract}</p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {cs.tags.map((t) => (
          <span key={t} className="chip">
            {t}
          </span>
        ))}
      </div>

      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="mono text-xs text-primary hover:underline inline-flex items-center gap-1">
          <span>{open ? "hide" : "show"} highlights</span>
          <span className={`transition-transform ${open ? "rotate-180" : ""}`}>▾</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="mt-4 space-y-2">
            {cs.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-sm text-muted-foreground leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>

      <div className="mt-5 pt-4 border-t border-border">
        <Link
          to="/case-studies/$caseId"
          params={{ caseId: cs.slug }}
          className="mono text-xs text-primary hover:underline inline-flex items-center gap-1"
        >
          <span>full technical details</span>
          <span>→</span>
        </Link>
      </div>
    </div>
  );
}

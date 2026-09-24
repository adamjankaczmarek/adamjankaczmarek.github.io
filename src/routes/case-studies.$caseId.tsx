import { createFileRoute, Link } from "@tanstack/react-router";
import { CASE_STUDIES, getCaseStudyBySlug } from "@/lib/projects.data";

export const Route = createFileRoute("/case-studies/$caseId")({
  head: ({ params }) => {
    const cs = getCaseStudyBySlug(params.caseId);
    return {
      meta: [
        { title: cs ? `${cs.title} — Adam Jan Kaczmarek` : "Case Study — Adam Jan Kaczmarek" },
        { name: "description", content: cs?.abstract ?? "" },
        { property: "og:title", content: cs?.title ?? "" },
        { property: "og:description", content: cs?.abstract ?? "" },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: CaseStudyPage,
  notFoundComponent: CaseStudyNotFound,
});

function CaseStudyNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl mb-2">Case study not found</h1>
        <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
        <Link
          to="/case-studies"
          className="mono text-sm px-5 py-2.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity inline-block"
        >
          ← back to case studies
        </Link>
      </div>
    </div>
  );
}

function CaseStudyPage() {
  const { caseId } = Route.useParams();
  const cs = getCaseStudyBySlug(caseId);

  if (!cs) {
    return <CaseStudyNotFound />;
  }

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
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 md:px-10 pt-12 pb-24">
        <div className="mb-10">
          <Link
            to="/case-studies"
            className="mono text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 mb-6"
          >
            <span>←</span>
            <span>all case studies</span>
          </Link>

          <div className="mono text-xs text-muted-foreground mb-4">
            {cs.role} · {cs.date}
          </div>

          <h1 className="text-3xl md:text-4xl leading-tight mb-3">{cs.title}</h1>
          <div className="mono text-xs text-primary mb-4">{cs.client}</div>
          <p className="text-muted-foreground text-lg leading-relaxed mb-4">{cs.abstract}</p>

          <div className="flex flex-wrap gap-1.5">
            {cs.tags.map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <div className="mono text-xs text-muted-foreground mb-2">stack</div>
            <div className="flex flex-wrap gap-1.5">
              {cs.stack.map((s) => (
                <span key={s} className="chip chip-accent">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <article className="prose prose-invert prose-lg max-w-none">
          {cs.content.map((block, i) => {
            switch (block.type) {
              case "h2":
                return (
                  <h2
                    key={i}
                    className="text-2xl md:text-3xl mt-12 mb-4 font-normal"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {block.text}
                  </h2>
                );
              case "h3":
                return (
                  <h3
                    key={i}
                    className="text-xl md:text-2xl mt-8 mb-3 font-normal"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {block.text}
                  </h3>
                );
              case "blockquote":
                return (
                  <blockquote
                    key={i}
                    className="border-l-2 border-primary pl-5 my-8 italic text-muted-foreground"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {block.text}
                  </blockquote>
                );
              case "ul":
                return (
                  <ul key={i} className="my-6 space-y-2">
                    {block.items?.map((item, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        <span className="text-muted-foreground leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                );
              case "p":
              default:
                return (
                  <p key={i} className="text-muted-foreground leading-relaxed mb-6">
                    {block.text}
                  </p>
                );
            }
          })}
        </article>

        <div className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="mono text-xs text-muted-foreground mb-1">other case studies</div>
              <div className="flex flex-wrap gap-2">
                {CASE_STUDIES.filter((c) => c.slug !== cs.slug).map((c) => (
                  <Link
                    key={c.slug}
                    to="/case-studies/$caseId"
                    params={{ caseId: c.slug }}
                    className="mono text-xs px-3 py-1.5 border border-border rounded-full hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    {c.title}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/case-studies"
              className="mono text-sm px-5 py-2.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
            >
              ← all case studies
            </Link>
          </div>
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

import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import profileAsset from "@/assets/profile.jpg.asset.json";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume — Adam Jan Kaczmarek" },
      { name: "description", content: "Resume of Adam Jan Kaczmarek — education, experience, projects, talks, publications, skills and certificates." },
      { property: "og:title", content: "Resume — Adam Jan Kaczmarek" },
      { property: "og:description", content: "Deep Learning Engineer & NLP researcher — full resume." },
    ],
  }),
  component: ResumePage,
});

type Theme = "dark" | "light";
function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    const stored = (typeof localStorage !== "undefined" && localStorage.getItem("theme")) as Theme | null;
    const prefersLight = typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: light)").matches;
    setTheme(stored ?? (prefersLight ? "light" : "dark"));
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    try { localStorage.setItem("theme", theme); } catch {}
  }, [theme]);
  return [theme, () => setTheme((t) => (t === "dark" ? "light" : "dark"))];
}

const EDUCATION = [
  { school: "Wrocław University of Science and Technology", degree: "PhD candidate, Computer Science", years: "2017 – present", detail: "Research on neural NLP for low-resource Slavic languages; named entity recognition, coreference, and ASR rescoring." },
  { school: "Wrocław University of Science and Technology", degree: "MSc, Computer Science", years: "2015 – 2017", detail: "Thesis on deep learning for sequence labeling. Graduated with distinction." },
  { school: "Wrocław University of Science and Technology", degree: "BSc, Computer Science", years: "2011 – 2015", detail: "Specialization in algorithms and intelligent systems." },
];

const EXPERIENCE = [
  { company: "SoftwareML", role: "Senior Deep Learning Engineer", years: "2022 – present", detail: "Lead NLP and applied DL initiatives for enterprise clients — model training, evaluation pipelines, and production deployment on GPU clusters." },
  { company: "CLARIN-PL (Wrocław Tech)", role: "Research Engineer", years: "2018 – 2022", detail: "Built and maintained open-source NLP tooling: Liner2, Inforex annotation platform, NER and coreference resolution models for Polish." },
  { company: "Wrocław University of Science and Technology", role: "Teaching & Research Assistant", years: "2017 – 2022", detail: "Taught ML, algorithms and software engineering; supervised BSc/MSc theses in NLP." },
  { company: "BioVision Lab", role: "Computer Vision Researcher", years: "2012 – 2017", detail: "Developed CellStar — segmentation and tracking of budding yeast cells in time-lapse microscopy." },
];

const RESUME_PROJECTS = [
  { name: "PolEval 2018 / 2020 / 2021", detail: "Co-organizer and contestant — NER, ASR rescoring, punctuation restoration shared tasks for Polish." },
  { name: "BSNLP Shared Tasks (2019, 2021)", detail: "Multilingual Slavic NER, entity linking, and coreference resolution submissions and tooling." },
  { name: "Liner2 & Inforex", detail: "Long-running contributions to CLARIN-PL open-source NLP stack used by research groups across Europe." },
  { name: "t-REx for ASR", detail: "Transformer-based rescorer + lattice extender; SoTA on PolEval 2020 ASR task." },
  { name: "CellStar & Yeast Image Toolkit", detail: "Cell segmentation algorithm and benchmarking platform for brightfield microscopy." },
];

const TALKS = [
  { event: "PolEval Workshop", year: "2021", detail: "Co-organizer and presenter — punctuation restoration task overview." },
  { event: "BSNLP @ EACL", year: "2021", detail: "Talk: Slavic NER submission and few-shot transfer." },
  { event: "PolEval Workshop", year: "2020", detail: "Presentation: t-REx — transformer rescorer for hybrid ASR." },
  { event: "PolEval Workshop", year: "2018", detail: "Talk: Nested Named Entity Recognition for Polish." },
  { event: "CLARIN-PL Tech Meetups", year: "2019 – 2022", detail: "Recurring talks on annotation tooling and NER pipelines." },
];

const PUBS = [
  { title: "Slavic Named Entity Recognition: BSNLP 2021 Shared Task Submission", venue: "BSNLP @ EACL 2021", url: "https://aclanthology.org/2021.bsnlp-1.14/" },
  { title: "PolEval 2021 Task 1: Punctuation Restoration from Read Text", venue: "PolEval 2021", url: "http://poleval.pl/" },
  { title: "t-REx: Transformer Rescorer & Extender for ASR", venue: "PolEval 2020", url: "https://github.com/adamjankaczmarek/poleval2020" },
  { title: "Nested Named Entity Recognition for Polish", venue: "PolEval 2018", url: "http://poleval.pl/files/poleval2018.pdf" },
  { title: "CellStar: Algorithm for Yeast Cell Segmentation in Brightfield Microscopy", venue: "Bioinformatics", url: "http://cellstar-algorithm.org/" },
];

const SKILL_GROUPS: Record<string, string[]> = {
  "Languages": ["Python", "Scala", "Java", "C++", "Bash", "SQL"],
  "ML / DL": ["PyTorch", "TensorFlow", "HuggingFace", "scikit-learn", "ONNX", "CUDA"],
  "NLP": ["Transformers", "ELECTRA", "BERT", "NER", "Coreference", "ASR", "Tokenization"],
  "Infrastructure": ["Docker", "Kubernetes", "MLflow", "Airflow", "AWS", "Spark"],
};

const CERTS = [
  { name: "NVIDIA Certified Professional — Generative AI LLMs", year: "2026", url: "https://www.credly.com/badges/c3ceb478-53d2-4263-ac5f-ac8b52aa6096/public_url" },
  { name: "NVIDIA Certified Professional — Agentic AI", year: "2026", url: "https://www.credly.com/badges/283a3e6f-93b9-48b6-92c5-fd0d9632a3ef/public_url" },
  { name: "PolEval Co-organizer", year: "2018 – 2021" },
  { name: "BSNLP Shared Task Contributor", year: "2019, 2021" },
];

function ResumePage() {
  const [theme, toggleTheme] = useTheme();
  return (
    <div className="min-h-screen relative">
      <div className="bg-perspective" aria-hidden="true" />
      <div className="bg-aurora" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-noise" aria-hidden="true" />

      <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="mx-auto max-w-5xl px-6 md:px-10 h-14 flex items-center justify-between">
          <Link to="/" className="mono text-sm text-primary">
            <span className="opacity-60">~/</span>adam.kaczmarek
          </Link>
          <nav className="hidden md:flex gap-6 mono text-xs text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">home</Link>
            <Link to="/resume" className="hover:text-primary transition-colors">resume</Link>
            <Link to="/posts" className="hover:text-primary transition-colors">writing</Link>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="toggle theme"
              className="mono text-xs w-8 h-8 inline-flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
            >
              {theme === "dark" ? "☼" : "☾"}
            </button>
            <button
              onClick={() => typeof window !== "undefined" && window.print()}
              className="mono text-xs px-3 py-1.5 border border-primary/40 text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              print / PDF ↗
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 md:px-10 pb-20">
        <section className="pt-16 md:pt-24 pb-12 grid md:grid-cols-[auto_1fr] gap-10 items-center">
          <div className="relative w-44 h-56 md:w-56 md:h-72 mx-auto md:mx-0">
            <div className="absolute inset-0 bg-gradient-to-l from-primary/20 to-accent/10 blur-3xl" />
            <img
              src={profileAsset.url}
              alt="Adam Jan Kaczmarek"
              className="relative w-full h-full object-cover contrast-110"
              style={{
                maskImage:
                  "radial-gradient(ellipse 72% 95% at 50% 50%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.7) 78%, rgba(0,0,0,0) 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse 72% 95% at 50% 50%, rgba(0,0,0,1) 50%, rgba(0,0,0,0.7) 78%, rgba(0,0,0,0) 100%)",
              }}
            />
          </div>
          <div>
            <div className="section-label mb-3">// résumé</div>
            <h1 className="text-4xl md:text-6xl leading-[1.05] mb-4">
              <span className="italic text-gradient">Adam</span> Jan Kaczmarek
            </h1>
            <p className="mono text-sm text-primary mb-5">
              Deep Learning Engineer · NLP Researcher · Open-source Contributor
            </p>
            <p className="text-muted-foreground leading-relaxed max-w-2xl">
              PhD candidate and senior engineer with a decade of applied research in natural
              language processing and computer vision. I co-organize PolEval, contribute to the
              CLARIN-PL open-source stack, and build production NLP systems for low-resource
              languages — from multilingual NER and coreference to ASR rescoring and information
              extraction. Equally at home in a paper draft, a CUDA profile, and a Kubernetes
              manifest.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 mono text-xs text-muted-foreground">
              <a href="mailto:adam.jan.kaczmarek@softwaremill.com" className="text-primary hover:underline">adam.jan.kaczmarek@softwaremill.com</a>
              <span>+48 661 105 014</span>
              <a href="https://github.com/adamjankaczmarek" target="_blank" rel="noreferrer" className="hover:text-primary">github</a>
              <a href="https://aclanthology.org/people/a/adam-kaczmarek/" target="_blank" rel="noreferrer" className="hover:text-primary">acl anthology</a>
            </div>
          </div>
        </section>

        <ResumeSection label="academic background" title="Education">
          <Timeline items={EDUCATION.map((e) => ({ head: e.degree, sub: e.school, meta: e.years, detail: e.detail }))} />
        </ResumeSection>

        <ResumeSection label="career" title="Experience">
          <Timeline items={EXPERIENCE.map((e) => ({ head: e.role, sub: e.company, meta: e.years, detail: e.detail }))} />
        </ResumeSection>

        <ResumeSection label="selected work" title="Projects">
          <div className="grid md:grid-cols-2 gap-4">
            {RESUME_PROJECTS.map((p) => (
              <div key={p.name} className="card-surface p-5">
                <h3 className="text-lg mb-1">{p.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.detail}</p>
              </div>
            ))}
          </div>
        </ResumeSection>

        <ResumeSection label="talks & events" title="Public appearances">
          <ul className="space-y-3">
            {TALKS.map((t) => (
              <li key={t.event + t.year} className="card-surface p-4 grid grid-cols-[1fr_auto] gap-4 items-start">
                <div>
                  <div className="text-base">{t.event}</div>
                  <div className="mono text-xs text-muted-foreground mt-1">{t.detail}</div>
                </div>
                <span className="mono text-xs text-primary whitespace-nowrap">{t.year}</span>
              </li>
            ))}
          </ul>
        </ResumeSection>

        <ResumeSection label="papers" title="Publications">
          <ol className="space-y-3">
            {PUBS.map((p, i) => (
              <li key={p.title}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="card-surface p-4 grid grid-cols-[auto_1fr_auto] gap-4 items-center group"
                >
                  <span className="mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <div className="text-base mb-0.5">{p.title}</div>
                    <div className="mono text-xs text-primary">{p.venue}</div>
                  </div>
                  <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </a>
              </li>
            ))}
          </ol>
        </ResumeSection>

        <ResumeSection label="toolbox & credentials" title="Skills & certificates">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-5">
              {Object.entries(SKILL_GROUPS).map(([group, items]) => (
                <div key={group} className="card-surface p-5">
                  <div className="section-label mb-3">{group}</div>
                  <div className="flex flex-wrap gap-2">
                    {items.map((s) => (
                      <span key={s} className="chip mono text-xs px-3 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div>
              <ul className="space-y-3">
                {CERTS.map((c) => {
                  const Tag: "a" | "div" = c.url ? "a" : "div";
                  const props = c.url ? { href: c.url, target: "_blank", rel: "noreferrer" } : {};
                  return (
                    <li key={c.name}>
                      <Tag {...props} className="card-surface p-4 flex items-center justify-between gap-4 group">
                        <span className="text-sm group-hover:text-primary transition-colors">{c.name}</span>
                        <span className="mono text-xs text-primary whitespace-nowrap">{c.year}</span>
                      </Tag>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </ResumeSection>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 md:px-10 py-8 mono text-xs text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} Adam Jan Kaczmarek</span>
          <Link to="/" className="hover:text-primary">← back to portfolio</Link>
        </div>
      </footer>
    </div>
  );
}

function ResumeSection({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <section className="py-12 md:py-16">
      <div className="mb-8">
        <div className="section-label mb-2">// {label}</div>
        <h2 className="text-3xl md:text-4xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Timeline({ items }: { items: { head: string; sub: string; meta: string; detail: string }[] }) {
  return (
    <ol className="space-y-4">
      {items.map((it) => (
        <li key={it.head + it.meta} className="card-surface p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
            <h3 className="text-lg">{it.head}</h3>
            <span className="mono text-xs text-primary whitespace-nowrap">{it.meta}</span>
          </div>
          <div className="mono text-xs text-muted-foreground mb-2">{it.sub}</div>
          <p className="text-sm text-muted-foreground leading-relaxed">{it.detail}</p>
        </li>
      ))}
    </ol>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { POSTS } from "@/lib/posts.data";
import { useEffect, useState } from "react";
import bgYeast from "@/assets/projects/yeast.jpg";
import bgNer from "@/assets/projects/ner.jpg";
import bgPunct from "@/assets/projects/punctuation.jpg";
import bgAsr from "@/assets/projects/asr.jpg";
import bgGraph from "@/assets/projects/graph.jpg";
import bgAnnot from "@/assets/projects/annotation.jpg";
import bgAudio from "@/assets/projects/audio.jpg";
import bgSrvDl from "@/assets/services/deeplearning.jpg";
import bgSrvNlp from "@/assets/services/nlp.jpg";
import bgSrvRes from "@/assets/services/research.jpg";
import bgSrvOss from "@/assets/services/opensource.jpg";
import bgPostElectra from "@/assets/posts/electra.jpg";
import bgPostFewshot from "@/assets/posts/fewshot.jpg";
import bgPostBench from "@/assets/posts/benchmarks.jpg";
import profileAsset from "@/assets/profile.jpg";

const POST_BG: Record<string, string> = {
  "electra-polish": bgPostElectra,
  "few-shot-ner-slavic": bgPostFewshot,
  "reproducible-nlp-benchmarks": bgPostBench,
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Adam Jan Kaczmarek — Deep Learning & NLP Engineer" },
      {
        name: "description",
        content:
          "Portfolio of Adam Jan Kaczmarek — Deep Learning Engineer, NLP researcher, and open-source contributor. Resume, projects, publications, certificates and writing.",
      },
      { property: "og:title", content: "Adam Jan Kaczmarek — Deep Learning & NLP Engineer" },
      {
        property: "og:description",
        content:
          "Deep Learning Engineer & NLP researcher. Resume, projects, publications, and writing.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [],
  }),
  component: Portfolio,
});

const NAV = [
  { id: "about", label: "about" },
  { id: "offer", label: "offer" },
  { id: "projects", label: "projects" },
  { id: "skills", label: "skills" },
  { id: "publications", label: "publications" },
  { id: "posts", label: "writing" },
];

const PROJECTS = [
  {
    title: "BSNLP 2021 — NER & Linking",
    role: "Researcher",
    date: "Dec 2020 – Apr 2021",
    tags: ["NLP", "NER", "Research"],
    url: "https://aclanthology.org/2021.bsnlp-1.14/",
    desc: "Few-shot and zero-shot Named Entity Recognition and coreference resolution across multilingual Slavic languages (Polish, Czech, Ukrainian).",
    bg: bgNer,
  },
  {
    title: "PolEval 2021 — Task 1",
    role: "Co-Creator",
    date: "Oct 2020 – Oct 2021",
    tags: ["NLP", "PolEval"],
    url: "https://github.com/poleval/2021-punctuation-restoration",
    desc: "Co-authored the punctuation restoration task: data acquisition, annotation guidelines, evaluation metrics, and contestant scoring.",
    bg: bgPunct,
  },
  {
    title: "PolEval 2020 — t-REx for ASR",
    role: "Researcher / Coordinator",
    date: "Apr 2020 – Oct 2020",
    tags: ["ASR", "NLP", "Transformers"],
    url: "https://github.com/adamjankaczmarek/poleval2020",
    desc: "Hybrid ASR improvement system: lattice extender + transformer-based utterance rescorer using ELECTRA.",
    bg: bgAsr,
  },
  {
    title: "BSNLP 2019 — Slavic NER",
    role: "Co-Creator",
    date: "Mar 2019 – Jun 2019",
    tags: ["NLP", "NER"],
    url: "http://bsnlp.cs.helsinki.fi/shared-task.html",
    desc: "Shared task on multilingual NER and entity disambiguation across Slavic languages.",
    bg: bgGraph,
  },
  {
    title: "PolEval 2018 — Nested NER",
    role: "Team Leader",
    date: "May 2018 – Oct 2018",
    tags: ["NLP", "NER", "PolEval"],
    url: "http://poleval.pl/files/poleval2018.pdf",
    desc: "Led a team on Nested Named Entity Recognition for Polish, proposing SoTA methods and final submission.",
    bg: bgNer,
  },
  {
    title: "Liner2 & Crete Coreference",
    role: "Researcher / Developer",
    date: "2020 – 2021",
    tags: ["NER", "Coreference", "Tools"],
    url: "https://github.com/CLARIN-PL/Liner2",
    desc: "Open-source NER and coreference resolution toolkit developed at CLARIN-PL.",
    bg: bgGraph,
  },
  {
    title: "Inforex Annotation Tool",
    role: "Developer",
    date: "2020 – 2021",
    tags: ["NLP", "Annotation"],
    url: "https://github.com/CLARIN-PL/Inforex",
    desc: "Web system for collaborative text corpora construction with multi-level semantic annotation.",
    bg: bgAnnot,
  },
  {
    title: "CellStar Algorithm",
    role: "Researcher / Developer",
    date: "Aug 2012 – Mar 2017",
    tags: ["CV", "ML", "Bio"],
    url: "http://cellstar-algorithm.org/",
    desc: "Automatic segmentation and tracking of budding yeast cells in brightfield time-lapse microscopy.",
    bg: bgYeast,
  },
  {
    title: "Yeast Image Toolkit",
    role: "Co-Creator",
    date: "Aug 2012 – Mar 2017",
    tags: ["CV", "Benchmark"],
    url: "http://yeast-image-toolkit.biosim.eu/",
    desc: "Benchmarking platform for cell segmentation and tracking algorithms in microscopy.",
    bg: bgYeast,
  },
  {
    title: "AudioScope",
    role: "Co-Creator",
    date: "Mar 2016 – May 2017",
    tags: ["Audio", "NLP"],
    url: null,
    desc: "Research system for identifying spoken phrases in audio recordings.",
    bg: bgAudio,
  },
];

const OFFER = [
  {
    title: "Deep Learning Engineering",
    desc: "End-to-end design and training of neural architectures — from data pipelines to production deployment on GPU clusters.",
    icon: "◈",
    bg: bgSrvDl,
  },
  {
    title: "NLP Systems",
    desc: "Custom language models, NER, coreference, ASR rescoring and information extraction across low-resource languages.",
    icon: "✦",
    bg: bgSrvNlp,
  },
  {
    title: "Research & Consulting",
    desc: "Translating academic SoTA into shippable systems. Literature reviews, prototypes, and reproducible benchmarks.",
    icon: "❖",
    bg: bgSrvRes,
  },
  {
    title: "Open-source Tooling",
    desc: "Building and contributing to NLP toolkits and annotation platforms used by research communities.",
    icon: "✺",
    bg: bgSrvOss,
  },
];

type Skill = { name: string; slug?: string };
const SKILLS: Record<string, Skill[]> = {
  Languages: [
    { name: "Python", slug: "python" },
    { name: "Scala", slug: "scala" },
    { name: "Java", slug: "openjdk" },
    { name: "C++", slug: "cplusplus" },
    { name: "Bash", slug: "gnubash" },
    { name: "SQL", slug: "postgresql" },
  ],
  "ML / DL": [
    { name: "PyTorch", slug: "pytorch" },
    { name: "TensorFlow", slug: "tensorflow" },
    { name: "HuggingFace", slug: "huggingface" },
    { name: "scikit-learn", slug: "scikitlearn" },
    { name: "ONNX", slug: "onnx" },
    { name: "CUDA", slug: "nvidia" },
  ],
  NLP: [
    { name: "Transformers" },
    { name: "ELECTRA" },
    { name: "BERT" },
    { name: "NER" },
    { name: "Coreference" },
    { name: "ASR" },
    { name: "Tokenization" },
  ],
  Infra: [
    { name: "Docker", slug: "docker" },
    { name: "Kubernetes", slug: "kubernetes" },
    { name: "MLflow", slug: "mlflow" },
    { name: "Airflow", slug: "apacheairflow" },
    { name: "AWS", slug: "amazonwebservices" },
    { name: "Spark", slug: "apachespark" },
  ],
};

const BADGES = [
  {
    title: "NVIDIA Certified Professional: Gen AI LLMs",
    issuer: "NVIDIA · 2026",
    image:
      "https://images.credly.com/size/340x340/images/4b94e285-07f8-484f-9bb5-aff9d9d5c709/blob",
    url: "https://www.credly.com/badges/c3ceb478-53d2-4263-ac5f-ac8b52aa6096/public_url",
  },
  {
    title: "NVIDIA Certified Professional: Agentic AI",
    issuer: "NVIDIA · 2026",
    image:
      "https://images.credly.com/size/340x340/images/9c5ac530-3a82-4970-ad25-d50fbe755ccb/blob",
    url: "https://www.credly.com/badges/283a3e6f-93b9-48b6-92c5-fd0d9632a3ef/public_url",
  },
];

const CERTIFICATES = [
  { name: "PhD candidate — Wrocław University of Science and Technology", year: "ongoing" },
  { name: "MSc — Computer Science, WUST", year: "2017" },
  { name: "PolEval Co-organizer", year: "2018–2021" },
  { name: "BSNLP Shared Task contributor", year: "2019, 2021" },
];

const PUBLICATIONS = [
  {
    title: "Slavic Named Entity Recognition: BSNLP 2021 Shared Task Submission",
    venue: "BSNLP @ EACL 2021",
    url: "https://aclanthology.org/2021.bsnlp-1.14/",
  },
  {
    title: "PolEval 2021 Task 1: Punctuation Restoration from Read Text",
    venue: "PolEval 2021",
    url: "http://poleval.pl/",
  },
  {
    title: "t-REx: Transformer Rescorer & Extender for ASR",
    venue: "PolEval 2020",
    url: "https://github.com/adamjankaczmarek/poleval2020",
  },
  {
    title: "Nested Named Entity Recognition for Polish",
    venue: "PolEval 2018",
    url: "http://poleval.pl/files/poleval2018.pdf",
  },
  {
    title: "CellStar: Algorithm for Yeast Cell Segmentation in Brightfield Microscopy",
    venue: "Bioinformatics",
    url: "http://cellstar-algorithm.org/",
  },
];

function useTypewriter(words: string[], speed = 80) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const w = words[i % words.length];
    const t = setTimeout(
      () => {
        if (!del) {
          const next = w.slice(0, text.length + 1);
          setText(next);
          if (next === w) setTimeout(() => setDel(true), 1600);
        } else {
          const next = w.slice(0, text.length - 1);
          setText(next);
          if (next === "") {
            setDel(false);
            setI((x) => x + 1);
          }
        }
      },
      del ? 35 : speed,
    );
    return () => clearTimeout(t);
  }, [text, del, i, words, speed]);
  return text;
}

type Theme = "dark" | "light";
function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>("dark");
  useEffect(() => {
    const stored = (typeof localStorage !== "undefined" &&
      localStorage.getItem("theme")) as Theme | null;
    const prefersLight =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: light)").matches;
    const initial: Theme = stored ?? (prefersLight ? "light" : "dark");
    setTheme(initial);
  }, []);
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("light", theme === "light");
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
    try {
      localStorage.setItem("theme", theme);
    } catch (_e) {
      // storage unavailable (e.g. private browsing)
    }
  }, [theme]);
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return [theme, toggle];
}

function Portfolio() {
  const phrase = useTypewriter([
    "a Deep Learning Engineer.",
    "a NLP expert.",
    "an open-source contributor.",
    "a researcher who ships.",
  ]);
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="min-h-screen relative">
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <filter id="knockout-white" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      -1 -1 -1 0 3"
            />
          </filter>
        </defs>
      </svg>
      <div className="bg-perspective" aria-hidden="true" />
      <div className="bg-aurora" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-noise" aria-hidden="true" />
      <Header theme={theme} toggleTheme={toggleTheme} />
      <main className="mx-auto max-w-6xl px-6 md:px-10">
        <Hero phrase={phrase} />
        <Offer />
        <Projects />
        <Skills theme={theme} />
        <Publications />
        <Posts />
      </main>
      <Footer />
    </div>
  );
}

function Header({ theme, toggleTheme }: { theme: Theme; toggleTheme: () => void }) {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
      <div className="mx-auto max-w-6xl px-6 md:px-10 h-14 flex items-center justify-between">
        <a href="#about" className="mono text-sm text-primary">
          <span className="opacity-60">~/</span>adam.kaczmarek
        </a>
        <nav className="hidden md:flex gap-6 mono text-xs text-muted-foreground">
          {NAV.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="hover:text-primary transition-colors">
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="mono text-xs w-8 h-8 inline-flex items-center justify-center rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
          >
            {theme === "dark" ? "☼" : "☾"}
          </button>
          <Link
            to="/resume"
            className="mono text-xs px-3 py-1.5 border border-primary/40 text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            resume ↗
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero({ phrase }: { phrase: string }) {
  return (
    <section
      id="about"
      className="pt-20 pb-32 md:pt-32 md:pb-40 grid md:grid-cols-[1fr_auto] gap-12 items-center"
    >
      <div>
        <div className="mono text-xs text-primary mb-6 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          available for select engagements
        </div>
        <h1 className="text-5xl md:text-7xl leading-[1.05] mb-6">
          Hi, I'm <span className="text-gradient">Adam</span>.
          <br />
          I am{" "}
          <span className="mono text-2xl md:text-4xl text-primary not-italic">
            {phrase}
            <span className="inline-block w-[0.6ch] h-[0.9em] -mb-1 bg-primary animate-pulse ml-0.5" />
          </span>
        </h1>
        <p className="max-w-xl text-muted-foreground text-lg leading-relaxed">
          Eight years building NLP systems across academia and industry — from yeast cell tracking
          to multilingual NER and ASR rescoring. I co-organize{" "}
          <span className="text-foreground">PolEval</span> and contribute to{" "}
          <span className="text-foreground">CLARIN-PL</span> open-source tooling.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#projects"
            className="btn-primary mono text-sm px-5 py-2.5 rounded-full inline-flex items-center gap-1"
          >
            view projects →
          </a>
          <a
            href="mailto:cogitocode@cogitocode.pl"
            className="mono text-sm px-5 py-2.5 border border-border rounded-full hover:border-primary transition-colors bg-card"
          >
            get in touch
          </a>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="relative w-72 h-96">
          <div className="absolute inset-0 bg-gradient-to-l from-primary/20 to-accent/10 blur-3xl" />
          <div
            className="relative w-full h-full rounded-2xl overflow-hidden"
            style={{
              border: "1px solid var(--border)",
            }}
          >
            <img
              src={profileAsset}
              alt="Adam Jan Kaczmarek"
              className="w-full h-full object-cover contrast-110"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHead({
  id,
  label,
  title,
  kicker,
}: {
  id: string;
  label: string;
  title: string;
  kicker?: string;
}) {
  return (
    <div id={id} className="mb-12 scroll-mt-20">
      <div className="section-label mb-3">// {label}</div>
      <h2 className="text-4xl md:text-5xl mb-2">{title}</h2>
      {kicker && <p className="text-muted-foreground max-w-2xl">{kicker}</p>}
    </div>
  );
}

function Offer() {
  return (
    <section className="py-20">
      <SectionHead
        id="offer"
        label="what I offer"
        title="Services"
        kicker="Engagements range from short-form research sprints to long-term embedded engineering."
      />
      <div className="grid md:grid-cols-2 gap-4">
        {OFFER.map((o) => (
          <div key={o.title} className="card-surface p-6 group relative overflow-hidden isolate">
            {o.bg && (
              <div
                aria-hidden="true"
                className="tile-bg"
                style={{ backgroundImage: `url(${o.bg})` }}
              />
            )}
            <div className="text-3xl text-primary mb-3">{o.icon}</div>
            <h3 className="text-2xl mb-2">{o.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{o.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  const [filter, setFilter] = useState<string>("All");
  const tags = ["All", "NLP", "NER", "Research", "CV", "Tools"];
  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.tags.includes(filter));
  return (
    <section className="py-20">
      <SectionHead
        id="projects"
        label="selected work"
        title="Projects"
        kicker="A decade of applied research across NLP, computer vision, and open-source tooling."
      />
      <div className="mb-8 flex flex-wrap gap-2">
        {tags.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`mono text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filter === t
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:border-primary/50"
            }`}
          >
            {t.toLowerCase()}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((p) => {
          const Tag: "a" | "div" = p.url ? "a" : "div";
          const props = p.url ? { href: p.url, target: "_blank", rel: "noreferrer" } : {};
          return (
            <Tag
              key={p.title}
              {...props}
              className="card-surface p-6 group block relative overflow-hidden isolate"
            >
              {p.bg && (
                <div
                  aria-hidden="true"
                  className="tile-bg"
                  style={{ backgroundImage: `url(${p.bg})` }}
                />
              )}
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-xl leading-tight">{p.title}</h3>
                {p.url && (
                  <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    ↗
                  </span>
                )}
              </div>
              <div className="mono text-xs text-muted-foreground mb-3">
                {p.role} · {p.date}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
            </Tag>
          );
        })}
      </div>
    </section>
  );
}

function SkillBadge({ skill, theme }: { skill: Skill; theme: Theme }) {
  if (!skill.slug) {
    return <span className="chip chip-accent">{skill.name}</span>;
  }
  const iconColor = theme === "light" ? "1f2a44" : "white";
  return (
    <span
      className="group inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card hover:border-primary/60 transition-colors"
      title={skill.name}
    >
      <img
        src={`https://cdn.simpleicons.org/${skill.slug}/${iconColor}`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity"
      />
      <span className="mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
        {skill.name}
      </span>
    </span>
  );
}

function Skills({ theme }: { theme: Theme }) {
  return (
    <section className="py-20">
      <SectionHead id="skills" label="toolbox & credentials" title="Skills & Certificates" />
      <div className="space-y-12">
        <div>
          <div className="section-label mb-4">stack</div>
          <div className="space-y-6">
            {Object.entries(SKILLS).map(([group, items]) => (
              <div key={group}>
                <div className="mono text-xs text-muted-foreground mb-3">{group}</div>
                <div className="flex flex-wrap gap-2">
                  {items.map((s) => (
                    <SkillBadge key={s.name} skill={s} theme={theme} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="section-label mb-4">certifications</div>
            <div className="grid grid-cols-2 gap-4">
              {BADGES.map((b) => (
                <a
                  key={b.title}
                  href={b.url}
                  target="_blank"
                  rel="noreferrer"
                  className="card-surface p-5 flex flex-col items-center text-center group"
                  title={b.title}
                >
                  <img
                    src={b.image}
                    alt={b.title}
                    loading="lazy"
                    style={theme === "dark" ? { filter: "url(#knockout-white)" } : undefined}
                    className="w-28 h-28 object-contain mb-3 drop-shadow-[0_0_18px_rgba(120,180,255,0.25)] group-hover:scale-105 transition-transform"
                  />
                  <div className="text-sm leading-snug mb-1 group-hover:text-primary transition-colors">
                    {b.title}
                  </div>
                  <div className="mono text-[10px] text-muted-foreground">{b.issuer}</div>
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="section-label mb-4">credentials</div>
            <ul className="space-y-3">
              {CERTIFICATES.map((c) => (
                <li
                  key={c.name}
                  className="card-surface p-4 flex items-center justify-between gap-4"
                >
                  <span className="text-sm">{c.name}</span>
                  <span className="mono text-xs text-primary whitespace-nowrap">{c.year}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Publications() {
  return (
    <section className="py-20">
      <SectionHead id="publications" label="papers & talks" title="Publications" />
      <ol className="space-y-3">
        {PUBLICATIONS.map((p, i) => (
          <li key={p.title}>
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="card-surface p-5 grid grid-cols-[auto_1fr_auto] gap-5 items-center group"
            >
              <span className="mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="text-base md:text-lg mb-1">{p.title}</div>
                <div className="mono text-xs text-primary">{p.venue}</div>
              </div>
              <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                ↗
              </span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Posts() {
  return (
    <section className="py-20">
      <SectionHead
        id="posts"
        label="writing"
        title="Blog posts"
        kicker="Occasional notes from the lab bench and the production trenches."
      />
      <div className="space-y-3">
        {POSTS.map((p) => {
          const bg = POST_BG[p.slug];
          return (
            <Link
              key={p.slug}
              to="/posts/$postId"
              params={{ postId: p.slug }}
              className="card-surface p-6 group block relative overflow-hidden isolate"
            >
              {bg && (
                <div
                  aria-hidden="true"
                  className="tile-bg-right"
                  style={{ backgroundImage: `url(${bg})` }}
                />
              )}
              <div className="flex items-center gap-3 mono text-xs text-muted-foreground mb-2">
                <span>{p.date}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span>{p.read} read</span>
              </div>
              <h3 className="text-2xl mb-2 group-hover:text-primary transition-colors">
                {p.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.excerpt}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>read post</span>
                <span>→</span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-6">
        <Link
          to="/posts"
          className="mono text-sm px-5 py-2.5 border border-border rounded-full hover:border-primary transition-colors inline-block"
        >
          view all posts →
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-border">
      <div className="mx-auto max-w-6xl px-6 md:px-10 py-12 grid md:grid-cols-2 gap-8 items-end">
        <div>
          <h3 className="text-3xl mb-2">Let's build something.</h3>
          <p className="text-muted-foreground text-sm">
            Reach out for consulting, research collaboration, or just to talk shop.
          </p>
        </div>
        <div className="mono text-sm space-y-1.5">
          <a href="mailto:cogitocode@cogitocode.pl" className="block text-primary hover:underline">
            cogitocode@cogitocode.pl
          </a>
          <div className="text-muted-foreground">+48 661 105 014</div>
          <div className="flex gap-4 pt-2 text-xs">
            <a
              href="https://github.com/adamjankaczmarek"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary"
            >
              github
            </a>
            <a
              href="https://aclanthology.org/people/a/adam-kaczmarek/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary"
            >
              acl
            </a>
            <a
              href="https://cogito.codes"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary"
            >
              cogito.codes
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 md:px-10 pb-8 mono text-xs text-muted-foreground flex items-center justify-between border-t border-border pt-6">
        <span>© {new Date().getFullYear()} Adam Jan Kaczmarek</span>
        <span>built with care · v1.0</span>
      </div>
    </footer>
  );
}

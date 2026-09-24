export type ContentBlock = {
  type: "p" | "h2" | "h3" | "blockquote" | "ul";
  text: string;
  items?: string[];
};

export interface CaseStudy {
  slug: string;
  title: string;
  client: string;
  role: string;
  date: string;
  tags: string[];
  stack: string[];
  abstract: string;
  highlights: string[];
  content: ContentBlock[];
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "document-intelligence",
    title: "Document Intelligence Platform",
    client: "Enterprise client — insurance & financial services",
    role: "Technical Lead, ML Engineering",
    date: "2024 – 2025",
    tags: ["Document AI", "OCR", "NLP", "Computer Vision"],
    stack: ["LayoutLM", "Table Transformer", "PyTorch", "ONNX Runtime", "FastAPI", "Airflow"],
    abstract:
      "Replaced manual document entry with an automated Intelligent Document Processing pipeline, cutting per-document handling time from minutes to seconds and giving the business a scalable path to tens of thousands of invoices, claims, and contracts a month without adding headcount.",
    highlights: [
      "Automated classification, extraction, and validation for 6+ document types",
      "Cut manual data-entry effort by removing the first-pass touch on the majority of incoming volume",
      "Human-in-the-loop review queue for low-confidence fields, so accuracy stayed audit-grade",
      "Delivered as a modular pipeline so the client could swap OCR/LLM vendors without a rewrite",
    ],
    content: [
      {
        type: "p",
        text: "The client processed thousands of invoices, claims forms, and contracts every week by hand — a slow, error-prone bottleneck that capped how fast the business could scale intake without scaling headcount. The mandate was to automate structured-data extraction from visually rich, semi-structured documents while keeping a human in the loop for anything the system wasn't confident about.",
      },
      {
        type: "h2",
        text: "Why not just throw an LLM at it",
      },
      {
        type: "p",
        text: "We evaluated three paths: a SaaS OCR/IDP API, a general-purpose LLM (GPT-4o-class) prompted for extraction, and a custom open-source model stack. LLM prompting was the fastest way to validate the idea, but per-document cost and inconsistent field-level accuracy made it a poor fit once volume climbed past a few thousand documents a month. SaaS document APIs got us to a working demo in days, but operating cost scaled linearly with volume and gave us no lever to fix the client's specific document layouts. We chose a hybrid: SaaS OCR for text extraction where it was strong, paired with our own layout and extraction models trained on the client's actual document population — the strategic trade-off the business needed given projected volume.",
      },
      {
        type: "h2",
        text: "Pipeline architecture",
      },
      {
        type: "p",
        text: "Every document flows through the same staged pipeline, with each stage able to fail safe into the human review queue rather than propagate a bad extraction downstream.",
      },
      {
        type: "ul",
        text: "",
        items: [
          "Classification — route each incoming file to the right downstream pipeline by document type",
          "OCR — recover machine-readable text and bounding boxes from scans and photos with no embedded text layer",
          "Document Layout Analysis — segment the page into tables, headers, text blocks, captions, and footers using a multimodal layout model",
          "Table Structure Recognition — reconstruct rows, columns, and cell spans for bordered and borderless tables",
          "Key Information Extraction — resolve entities and their relations into a key-value structure the business systems can consume",
          "Confidence gating — anything below threshold routes to a reviewer UI instead of straight to the downstream system",
        ],
      },
      {
        type: "h2",
        text: "Human-in-the-loop, not human-instead-of",
      },
      {
        type: "p",
        text: "Full automation was never the goal on day one — trustworthy automation was. Every extracted field carries a confidence score; only fields above threshold flow straight through, everything else lands in a lightweight review UI where an operator corrects or confirms in seconds. Those corrections feed back into retraining data, so the share of documents needing no human touch grows every retraining cycle instead of staying flat.",
      },
      {
        type: "blockquote",
        text: "The board that mattered to the client wasn't model F1 score — it was 'how many documents can a single operator clear per hour now.' We optimized the pipeline against that number, not the benchmark.",
      },
      {
        type: "h2",
        text: "Results",
      },
      {
        type: "p",
        text: "The platform now clears the majority of incoming volume with no manual touch, with the remainder resolved through the review queue in a fraction of the original handling time. Because the pipeline is modular — classification, OCR, layout, extraction as swappable stages — the client can upgrade or replace any single stage (a new OCR vendor, a fine-tuned extraction model) without touching the rest of the system, protecting the investment as document volume and types keep growing.",
      },
    ],
  },
];

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return CASE_STUDIES.find((c) => c.slug === slug);
}

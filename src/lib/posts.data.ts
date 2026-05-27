export interface Post {
  slug: string;
  title: string;
  date: string;
  read: string;
  excerpt: string;
  content: { type: "p" | "h2" | "h3" | "blockquote" | "ul"; text: string; items?: string[] }[];
}

export const POSTS: Post[] = [
  {
    slug: "electra-polish",
    title: "Notes on training ELECTRA from scratch in Polish",
    date: "Sep 2021",
    read: "8 min",
    excerpt:
      "Lessons learned from pre-training a Polish ELECTRA model on a single 8×V100 node — data curation, masking strategies, and gotchas.",
    content: [
      {
        type: "p",
        text: "Pre-training a transformer from scratch is one of those tasks that sounds straightforward on paper and then eats three months of your life. This post is a field report from training a Polish ELECTRA model — what worked, what didn't, and the subtle traps that cost me weeks.",
      },
      {
        type: "h2",
        text: "Why ELECTRA?",
      },
      {
        type: "p",
        text: "ELECTRA's replaced-token detection objective is significantly more sample-efficient than MLM. For a mid-resource language like Polish, where every GPU-hour counts, this matters. Instead of masking 15% of tokens and predicting them, ELECTRA trains a discriminator to detect which tokens were replaced by a small generator network. Every token in the sequence becomes a training signal.",
      },
      {
        type: "h2",
        text: "Data curation is 80% of the work",
      },
      {
        type: "p",
        text: "I started with the Polish subset of Oscar + Wikipedia dumps, then spent far too long on deduplication and quality filtering. The key insight: a smaller, cleaner corpus beats a larger noisy one. My final training set was ~25GB of text, down from an initial ~120GB.",
      },
      {
        type: "ul",
        text: "",
        items: [
          "Remove boilerplate with MinHash LSH deduplication",
          "Filter by perplexity score against a small n-gram model",
          "Strip markup and normalize quotes/dashes",
          "Segment into coherent passages, not random 512-token chunks",
        ],
      },
      {
        type: "h2",
        text: "Generator-discriminator balance",
      },
      {
        type: "p",
        text: "The original ELECTRA paper uses a generator that's 1/3 the size of the discriminator. I found that for Polish, a 1/4 ratio worked better — possibly because the morphological richness of Polish makes the generation task harder, and a weaker generator actually produces more educational errors for the discriminator to learn from.",
      },
      {
        type: "blockquote",
        text: "The biggest mistake was spending two weeks tuning the learning rate while the real problem was a bug in my data loader that silently dropped 30% of sentences.",
      },
      {
        type: "h2",
        text: "Hardware reality check",
      },
      {
        type: "p",
        text: "Training on a single 8×V100 node (DGX-1) for about three weeks got me to a model that outperformed multilingual mBERT on Polish NER and sentiment tasks. Was it worth it? For the learning experience, absolutely. For production, I'd probably fine-tune a larger multilingual model today. But there's something deeply satisfying about training a model that truly understands Polish morphology from first principles.",
      },
      {
        type: "p",
        text: "The full model weights and training code are available on HuggingFace Hub. Feel free to reach out if you're attempting something similar — I'm happy to share the gritty details that didn't fit in this post.",
      },
    ],
  },
  {
    slug: "few-shot-ner-slavic",
    title: "Few-shot NER across Slavic languages",
    date: "May 2021",
    read: "12 min",
    excerpt:
      "How meta-learning and cross-lingual transfer can salvage NER quality when annotated data is essentially absent.",
    content: [
      {
        type: "p",
        text: "Named Entity Recognition is a solved problem — if you have tens of thousands of labeled examples. But what happens when you need to extract entities from a language that has maybe a few hundred annotated sentences, if any? This was the challenge the BSNLP 2021 shared task threw at us: NER across four Slavic languages under low- and zero-resource conditions.",
      },
      {
        type: "h2",
        text: "The problem: parallel annotation doesn't exist",
      },
      {
        type: "p",
        text: "Unlike high-resource language pairs, Slavic languages don't have large parallel annotated corpora. You can't directly project labels from Polish to Ukrainian and expect good results. The morphology differs, entity boundaries shift, and transliteration inconsistencies break naive alignment.",
      },
      {
        type: "h2",
        text: "Meta-learning to the rescue",
      },
      {
        type: "p",
        text: "We approached this with MAML-inspired meta-learning: train the model to adapt quickly to new entity types given just a handful of examples. The core idea is to optimize for parameters that require only a few gradient steps to specialize for a new language or domain.",
      },
      {
        type: "h3",
        text: "The adaptation loop",
      },
      {
        type: "ul",
        text: "",
        items: [
          "Sample a support set of 8-32 sentences from the target language",
          "Perform 3-5 inner-loop gradient updates on the support set",
          "Evaluate on a query set and backprop through the adaptation",
          "Update meta-parameters to minimize query-set loss across many episodes",
        ],
      },
      {
        type: "h2",
        text: "Cross-lingual transfer via adversarial training",
      },
      {
        type: "p",
        text: "To bridge the gap between languages, we added an adversarial language discriminator to the shared encoder. During training, the encoder tries to fool the discriminator while still performing well on NER. This encourages language-invariant representations in the shared space.",
      },
      {
        type: "blockquote",
        text: "The surprising finding: zero-shot transfer from Polish to Belarusian was better than from Russian to Belarusian, despite Russian being linguistically closer. The orthographic similarity of Polish and Belarusian apparently matters more than treebank-based linguistic distance metrics suggest.",
      },
      {
        type: "h2",
        text: "Results and lessons",
      },
      {
        type: "p",
        text: "Our final submission placed second on the zero-shot track and first on the few-shot track. The main lesson: when data is scarce, architectural creativity matters more than compute scale. A 110M parameter model with careful meta-learning can outperform a 500M parameter model fine-tuned naively.",
      },
      {
        type: "p",
        text: "If you're working on low-resource NER, I'd recommend starting with cross-lingual word embeddings and gradually adding complexity only where simple baselines fail. It's easy to over-engineer solutions in this space.",
      },
    ],
  },
  {
    slug: "reproducible-nlp-benchmarks",
    title: "Building reproducible NLP benchmarks",
    date: "Feb 2021",
    read: "6 min",
    excerpt:
      "What three years of co-organizing PolEval taught me about evaluation design, data leakage, and contestant-friendly tooling.",
    content: [
      {
        type: "p",
        text: "I've co-organized PolEval, the Polish NLP evaluation campaign, for three consecutive years. Running a shared task sounds glamorous — you set a problem, people solve it, you rank them. The reality is a constant battle against data leakage, ambiguous guidelines, and submission formats that break at 11:59 PM on deadline day.",
      },
      {
        type: "h2",
        text: "Designing the task",
      },
      {
        type: "p",
        text: "A good shared task needs a Goldilocks difficulty: not so easy that existing baselines solve it perfectly, not so hard that nobody makes progress. For PolEval 2021's punctuation restoration task, we chose a real-world problem (restoring punctuation from ASR output) with enough inherent ambiguity to make it interesting.",
      },
      {
        type: "h2",
        text: "The data leakage problem",
      },
      {
        type: "p",
        text: "Data leakage is the silent killer of shared task integrity. Contestants don't need to be malicious — training on Wikipedia and then evaluating on a Wikipedia-derived test set creates invisible overlap. We now use aggressive deduplication, temporal filtering (train before 2018, test after 2019), and n-gram overlap detection before releasing any split.",
      },
      {
        type: "ul",
        text: "",
        items: [
          "MinHash Jaccard similarity threshold of 0.5 for passage-level deduplication",
          "Temporal train/test splits for chronologically-ordered data",
          "Manual spot-checking of top-scoring submissions for suspicious patterns",
          "Release test inputs without labels, run evaluation on our servers",
        ],
      },
      {
        type: "h2",
        text: "Contestant experience matters",
      },
      {
        type: "p",
        text: "The most technically perfect evaluation is useless if participants can't submit. We learned to provide starter code, Docker images with pinned dependencies, and a local evaluation script that exactly mirrors our server-side scoring. The friction of participating correlates inversely with the quality and quantity of submissions.",
      },
      {
        type: "blockquote",
        text: "One year we required a custom JSON format for submissions. The resulting parsing errors consumed 20% of my organizer time. Never again. We now accept the simplest format that unambiguously captures the required information.",
      },
      {
        type: "h2",
        text: "Final thoughts",
      },
      {
        type: "p",
        text: "If you're thinking about organizing a shared task, my advice is: start small, over-communicate, and automate everything. The human hours you invest in infrastructure pay dividends in fairness, reproducibility, and your own sanity. And publish your evaluation scripts alongside the results — reproducibility starts with the organizers.",
      },
    ],
  },
];

export function getPostBySlug(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return POSTS.map((p) => p.slug);
}

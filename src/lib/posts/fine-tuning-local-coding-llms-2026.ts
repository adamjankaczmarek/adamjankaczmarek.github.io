// Generated from ~/workspace/blogposts/peft_2026/blogpost.md — edit the markdown and regenerate.
import type { Post } from "@/lib/posts.data";

export const fineTuningLocalCodingLlms2026: Post = {
  slug: "fine-tuning-local-coding-llms-2026",
  title:
    "Fine-Tuning Local Coding LLMs in 2026: PEFT, Real Hardware, and Letting an Agent Run the Sweep",
  date: "Oct 2026",
  read: "26 min",
  excerpt:
    "PEFT methods that actually matter, the memory arithmetic that decides what fits, what 2×H200, 4×V100, DGX Spark, 4×RTX 3090 and 8×Titan RTX are each good for — and how to let an autoresearch agent run the sweep without gaming your eval.",
  content: [
    {
      type: "h2",
      text: "The question I keep getting",
    },
    {
      type: "p",
      text: '"We have some GPUs. Can we fine-tune a coding model on our own code?"',
    },
    {
      type: "p",
      text: "The GPUs are never the ones from the papers. One team has two H200s they won in an internal allocation fight. Another has a 4×V100 server left over from a 2019 computer-vision project. One engineer has a DGX Spark on their desk. A research group has a homebuilt 4×RTX 3090 rig, and someone in the basement has a chassis with eight Titan RTX cards that nobody wants to throw away.",
    },
    {
      type: "p",
      text: 'The honest answer in 2026 is "yes, all of them, but not the same way." Three things changed in the last eighteen months to make that true:',
    },
    {
      type: "ol",
      text: "",
      items: [
        "**The good open coding models went sparse.** Mixture-of-experts coders with roughly 3B active parameters per token (Qwen3-Coder-30B-A3B, Qwen3-Coder-Next at 80B-A3B, and similar) give you near-frontier-of-last-year quality on modest hardware. Dense models in the 24–32B range (Devstral Small 2 and friends) are still excellent targets.",
        "**We learned when LoRA is good enough.** Thinking Machines' \"LoRA Without Regret\" (2025) put careful numbers on what practitioners suspected: for small-to-medium supervised fine-tuning and for RL, LoRA applied to *all* layers, MLPs included, matches full fine-tuning — as long as you use a learning rate around 10× higher than you would for full fine-tuning and don't push the batch size too high.",
        "**Agents can run the sweep.** Andrej Karpathy's `autoresearch` (March 2026) showed the loop plainly: a human writes a `program.md`, an agent edits a training script, each experiment gets a fixed budget, and the agent keeps changes that improve the metric and throws away changes that don't. Twelve experiments an hour on one GPU, all night, while you sleep.",
      ],
    },
    {
      type: "p",
      text: "This post puts those three together. It covers which PEFT methods are worth your time, the memory arithmetic that decides what fits, what each of those five machines is actually good for, and how to set up an autoresearch loop for fine-tuning that doesn't just teach the agent to game your eval.",
    },
    {
      type: "p",
      text: "The model names in here will be stale within a year. The arithmetic won't be, and the arithmetic is the part that keeps biting people.",
    },
    {
      type: "h2",
      text: "First: should you fine-tune at all?",
    },
    {
      type: "p",
      text: "Most teams that ask about fine-tuning need better context, not new weights. A good `AGENTS.md`, retrieval over your monorepo, and a harness that lets the model run your tests will get you further, sooner, than any LoRA. Try that first, and keep it around: you'll need it as the baseline your fine-tune has to beat.",
    },
    {
      type: "p",
      text: "Fine-tuning pays off when the knowledge you need is *procedural and dense* rather than *factual and sparse*:",
    },
    {
      type: "ul",
      text: "",
      items: [
        "**Internal frameworks and DSLs** the base model has never seen, used across thousands of files. Retrieval finds one example. Fine-tuning teaches the idiom.",
        "**Under-represented languages and ecosystems.** Base models are noticeably weaker on, say, Scala 3 macros or an in-house build system than on Python.",
        "**Your harness's tool-call format and workflow.** An agentic coder that follows your repo conventions, runs the right test command, and stops when it should is a trajectory-shaped skill, and trajectories train well.",
        "**Distillation for cost or latency.** Taking trajectories from a frontier model and training a 3B-active MoE to imitate them on your task distribution is the most reliably profitable fine-tune I know of.",
        '**Air-gapped or regulated environments**, where "just use the API" is not an option and the local model has to carry more of the load.',
      ],
    },
    {
      type: "p",
      text: "If none of those apply, stop here and go improve your context.",
    },
    {
      type: "h2",
      text: "The memory arithmetic you can't skip",
    },
    {
      type: "p",
      text: 'Every "will it fit?" conversation reduces to four line items: base weights, adapter training state, activations, and the logits. People remember the first, sometimes the second, and get surprised by the last two.',
    },
    {
      type: "h3",
      text: "Base weights",
    },
    {
      type: "table",
      text: "",
      headers: [
        "Precision",
        "Bytes/param",
        "24B dense",
        "32B dense",
        "30B-A3B MoE",
        "80B-A3B MoE",
        "~106B MoE",
      ],
      rows: [
        ["BF16/FP16", "2", "~48 GB", "~64 GB", "~61 GB", "~160 GB", "~212 GB"],
        ["NF4 (QLoRA)", "~0.55", "~13 GB", "~18 GB", "~17 GB", "~45 GB", "~60 GB"],
        ["Full FT, mixed precision AdamW", "~16", "~384 GB", "~512 GB", "—", "—", "—"],
      ],
    },
    {
      type: "p",
      text: "The 16 bytes/param for full fine-tuning is BF16 weights (2) + BF16 grads (2) + FP32 master weights (4) + two FP32 Adam moments (8). That number is why full fine-tuning of anything above ~8B is off the table for every machine in this post except the H200 pair, and even there it stops around 14B dense.",
    },
    {
      type: "p",
      text: "MoE note: you pay memory for *all* parameters but compute for *active* ones. A 30B-A3B model has the memory footprint of a 30B model and roughly the per-token compute of a 3B one. That is exactly why these models suit memory-rich, compute-poor hardware like the DGX Spark.",
    },
    {
      type: "h3",
      text: "Adapter state: small for dense models, surprisingly large for fine-grained MoE",
    },
    {
      type: "p",
      text: "Hugging Face PEFT upcasts adapter weights to FP32 by default, so each trainable adapter parameter costs about 16 bytes: FP32 weight (4) + FP32 grad (4) + Adam moments (8).",
    },
    {
      type: "p",
      text: "For a 32B dense model (hidden 5120, MLP 27648, 64 layers) with rank-32 LoRA on all linear layers, that's about 270M adapter parameters, ~0.8% of the model and ~4 GB of training state. Fine.",
    },
    {
      type: "p",
      text: "Now do the same for a 30B-A3B MoE with 128 experts per layer (hidden 2048, expert MLP width 768, 48 layers). LoRA on attention alone is only ~27M parameters. LoRA on every expert's gate, up and down projections at rank 32 is:",
    },
    {
      type: "code",
      text: "32 × (2048 + 768)  per projection\n× 3 projections × 128 experts × 48 layers\n≈ 1.66B adapter parameters  →  ~26 GB of training state",
    },
    {
      type: "p",
      text: 'That\'s bigger than the 4-bit base model it sits on. "LoRA Without Regret" is clear that MLP/expert layers are where LoRA earns its keep, so attention-only is not the fix. The fix is a **much lower per-expert rank** (rank 4–8 on the experts, 16–32 on attention), an 8-bit or paged optimizer, or both. Each expert sees only a fraction of the tokens anyway, so it needs less capacity than a dense MLP does. When a framework advertises "fine-tune 30B-A3B in 18 GB," find out which modules it actually adapts.',
    },
    {
      type: "p",
      text: "There's a second-order effect for multi-GPU setups too. I'll argue below that LoRA makes data-parallel training over weak PCIe interconnects cheap because you only all-reduce adapter gradients. That holds for dense models (~0.5 GB per sync in BF16 at rank 32). It's less true when the adapter is 1.66B parameters (~3.3 GB per sync). Lower expert ranks fix both problems at once.",
    },
    {
      type: "h3",
      text: "Activations",
    },
    {
      type: "p",
      text: "With gradient checkpointing at layer boundaries, the floor is roughly `seq_len × hidden × 2 bytes × num_layers`:",
    },
    {
      type: "ul",
      text: "",
      items: [
        "32B dense at 32k context: `32768 × 5120 × 2 × 64` ≈ **21 GB**",
        "30B-A3B at 32k context: `32768 × 2048 × 2 × 48` ≈ **6.4 GB**",
        "Either one at 8k: divide by four.",
      ],
    },
    {
      type: "p",
      text: "On top of that comes one layer's worth of un-checkpointed internals during recompute, attention workspace, and fragmentation. Unsloth-style offloading of checkpoints to CPU RAM buys back most of this, at some throughput cost.",
    },
    {
      type: "h3",
      text: "The logits trap",
    },
    {
      type: "p",
      text: 'This is the one that takes down long-context runs with "plenty of headroom." Qwen-family vocabularies are ~152k tokens. Materializing FP32 logits for a 32k-token sequence is:',
    },
    {
      type: "code",
      text: "151,936 × 32,768 × 4 bytes ≈ 19.9 GB",
    },
    {
      type: "p",
      text: "…and the backward pass wants a gradient of the same size. Use a fused linear-cross-entropy kernel (Liger Kernel, Apple's Cut Cross-Entropy, or Unsloth's built-in equivalent) that never materializes the full logit matrix. In my experience it's the single largest memory saving available for coding fine-tunes, because code contexts are long.",
    },
    {
      type: "h2",
      text: "The PEFT menu, ranked by how much it matters",
    },
    {
      type: "p",
      text: "There are dozens of LoRA variants. Most of them are a rounding error next to getting the basics right. In rough order of impact:",
    },
    {
      type: "p",
      text: "**1. Plain LoRA on all linear layers, configured correctly.** Target every attention and MLP/expert projection (`target_modules=\"all-linear\"` in PEFT). Use roughly 10× the learning rate you'd use for full fine-tuning; something like `1e-4` to `2e-4` is a typical starting band for 7–32B models, and your sweep should own that number. Rank matters less than people think for SFT: 16–64 for dense models, lower for experts. For RL with verifiable rewards, very low ranks (even rank 1) work, because RL carries far fewer bits of information per episode than SFT. Don't use giant batch sizes; LoRA tolerates them worse than full fine-tuning does.",
    },
    {
      type: "p",
      text: "**2. QLoRA when the base doesn't fit in BF16.** NF4 base weights, double quantization, paged optimizers. Quality loss from training over a 4-bit base is small in practice. The bigger risk is *mismatch at serving time*, covered below.",
    },
    {
      type: "p",
      text: "**3. rsLoRA scaling.** Scaling by `alpha/sqrt(r)` instead of `alpha/r` keeps the effective learning rate stable as you change rank, which makes rank something you can actually sweep. It costs nothing. Turn it on.",
    },
    {
      type: "p",
      text: "**4. Initialization variants — PiSSA, LoftQ, OLoRA.** PiSSA initializes the adapter from the principal singular vectors of the weight. LoftQ initializes to compensate for quantization error, which is useful specifically with QLoRA. These give modest, sometimes real gains in convergence speed. Worth letting the sweep try; not worth arguing about.",
    },
    {
      type: "p",
      text: "**5. DoRA.** It separates weight magnitude from direction. It sometimes gives a small quality bump at low rank, it's measurably slower per step, and it complicates merging. Let the agent test it on your data; don't assume.",
    },
    {
      type: "p",
      text: "**6. LoRA+.** Uses a higher learning rate for the `B` matrix than for `A`. It's another knob, and a cheap one for the sweep.",
    },
    {
      type: "p",
      text: "**When LoRA isn't enough.** For continued pre-training on a large corpus (billions of tokens of an internal language), LoRA learns less, as the \"LoRA Learns Less and Forgets Less\" paper puts it. That's a trade-off, not a defect: you also forget less. If you genuinely need capacity:",
    },
    {
      type: "ul",
      text: "",
      items: [
        "**Spectrum** fully fine-tunes only the top-k% of layers ranked by signal-to-noise ratio. It's a good middle ground on 2×H200.",
        "**GaLore** and its successors project *gradients* into a low-rank space, giving full-parameter learning with LoRA-like optimizer memory, at a throughput cost.",
        "**Full fine-tuning** of a smaller model often beats LoRA on a bigger one for narrow tasks. Keep it on the table for 1–8B targets.",
      ],
    },
    {
      type: "p",
      text: "**MoE-specific rules:**",
    },
    {
      type: "ul",
      text: "",
      items: [
        "**Freeze the router.** Training it on a narrow distribution tends to collapse expert load balance. If you must train it, keep the auxiliary load-balancing loss on and watch per-expert token counts.",
        "**Rank experts low and attention higher,** for the arithmetic reasons above.",
        "**Check your framework's MoE path.** Expert weights are increasingly stored as fused 3D tensors rather than lists of `nn.Linear`. Whether 4-bit quantization and LoRA attach to them correctly depends on library versions. Verify by counting trainable parameters before you trust a run.",
      ],
    },
    {
      type: "h2",
      text: "Data matters more than the method",
    },
    {
      type: "p",
      text: "Ten minutes on the adapter config, ten days on the data. For coding fine-tunes specifically:",
    },
    {
      type: "ul",
      text: "",
      items: [
        "**Mask the prompt.** Train on completions and assistant turns only. Including the prompt in the loss on repo-context-heavy data mostly teaches the model to memorize your file headers.",
        "**Keep the model's native chat template and tool-call format.** If the base model emits tool calls in a particular structured format, your trajectories must use exactly that format. Changing the template at fine-tune time is the most common cause of a model that scores well on loss and falls apart in the harness.",
        "**FIM for completion models.** If the target is IDE autocomplete, train with fill-in-the-middle formatting using the base model's FIM sentinel tokens. This is a different data pipeline from agentic SFT. Don't mix them carelessly.",
        '**Trajectories beat snippets for agentic use.** Successful multi-turn traces of "read files, edit, run tests, fix, stop," filtered by whether the tests actually passed, teach the behavior you want. Rejection sampling from a stronger model, keeping only passing traces, is the workhorse here.',
        "**Replay general data.** Mixing 10–30% general coding and instruction data into your domain set is the cheapest insurance against catastrophic forgetting. The exact ratio is a good thing for the sweep to own.",
        "**Decontaminate and split by repository, not by file.** If files from the same repo land in train and eval, your held-out loss will lie to you.",
      ],
    },
    {
      type: "h2",
      text: "Five machines, five different jobs",
    },
    {
      type: "p",
      text: 'Here\'s the summary before the details. "Largest comfortable" means room for 8k context with a realistic batch size, not the theoretical maximum at sequence length 512.',
    },
    {
      type: "table",
      text: "",
      headers: [
        "Setup",
        "Memory",
        "BF16",
        "FlashAttention 2",
        "Interconnect",
        "Largest comfortable QLoRA",
        "BF16 LoRA",
        "Full FT",
        "Best role",
      ],
      rows: [
        [
          "2× H200",
          "282 GB HBM3e",
          "✓ (+FP8)",
          "✓ (and FA3)",
          "NVLink",
          "~235B-class MoE",
          "~106B MoE (tight)",
          "≤ ~14B dense",
          "Final runs, RL, big MoE",
        ],
        [
          "4× V100 32GB",
          "128 GB HBM2",
          "✗ FP16 only",
          "✗",
          "NVLink if SXM2",
          "24B/GPU, ~80B across 4",
          "~14B across 4",
          "~5B",
          "Proxy lanes, mid-size QLoRA",
        ],
        [
          "DGX Spark",
          "128 GB unified (~115 usable)",
          "✓ (+FP4/FP8)",
          "check build",
          "none (200GbE to a 2nd Spark)",
          "~106–120B MoE",
          "30B-A3B",
          "~3–4B",
          "Big-but-slow, quiet overnight lane",
        ],
        [
          "4× RTX 3090",
          "96 GB GDDR6X",
          "✓",
          "✓",
          "PCIe (+NVLink pairs)",
          "24B/GPU, 30B-A3B with care",
          "~32B across 4",
          "~4–5B",
          "4 parallel lanes",
        ],
        [
          "8× Titan RTX",
          "192 GB GDDR6",
          "✗ FP16 only",
          "✗",
          "PCIe 3 (+NVLink pairs)",
          "24B/GPU",
          "~32B across 2–4",
          "don't",
          "8 parallel proxy lanes",
        ],
      ],
    },
    {
      type: "p",
      text: "The thread running through all of them: **LoRA's most underrated property is not memory savings, it's experiment parallelism.** If the base model fits on one card, every card is an independent experiment lane. No interconnect worries, no sharding bugs, no stragglers. For an autoresearch loop, *number of experiments per night* is the metric that matters, and four mediocre GPUs running four experiments beat one great GPU running one.",
    },
    {
      type: "h3",
      text: "2× H200: the one that can do everything, so be deliberate",
    },
    {
      type: "p",
      text: "141 GB of HBM3e per card at ~4.8 TB/s, Hopper tensor cores, FP8, NVLink (900 GB/s on SXM/HGX; H200 NVL PCIe cards use NVLink bridges).",
    },
    {
      type: "p",
      text: "**What fits:**",
    },
    {
      type: "ul",
      text: "",
      items: [
        "BF16 LoRA on a 30B-A3B MoE or 32B dense model **per card** (61–64 GB of weights leaves plenty for activations at 32k). That means two independent lanes on the class of model you'll most likely deploy.",
        "BF16 LoRA on 80B-A3B across both cards with FSDP2, or QLoRA on one card (~45 GB).",
        "QLoRA on ~235B-class MoE across both cards. A 480B-class model does not fit at 4-bit with room to train; don't try.",
        "Full fine-tuning of 8B comfortably and 14B with checkpointing and care (16 bytes/param × 14B ≈ 224 GB before activations).",
      ],
    },
    {
      type: "p",
      text: "**How to use it:**",
    },
    {
      type: "ul",
      text: "",
      items: [
        "**Default to DDP over FSDP whenever the model fits on one card.** It's simpler and faster, and with LoRA the gradient all-reduce is tiny. Reach for FSDP2 only when you have to.",
        "**This is your RL box.** GRPO-style RL with verifiable rewards (unit tests pass or fail) is dominated by rollout generation, and rollout generation is decode, and decode is bandwidth-bound. Put vLLM on one card for rollouts and the trainer on the other, syncing LoRA weights to the inference server every few steps. Low-rank LoRA (8–32) is fine for RL.",
        "FP8 training via Transformer Engine or torchao is available, but for LoRA on a frozen BF16 base the win is smaller than the headlines suggest. Leave it for full fine-tuning runs.",
      ],
    },
    {
      type: "p",
      text: "**Role in autoresearch:** the *promotion* tier. Proxy lanes on cheaper hardware find candidate configs. The H200s rerun the top few at full scale and full context on the real target model. Don't burn H200 hours on learning-rate sweeps over a 4B proxy.",
    },
    {
      type: "h3",
      text: "4× V100: still useful, but you are now maintaining legacy software",
    },
    {
      type: "p",
      text: "32 GB HBM2 per card (16 GB variants exist; halve everything below), ~900 GB/s, Volta tensor cores, NVLink at 300 GB/s on SXM2 boards.",
    },
    {
      type: "p",
      text: "**The constraints that matter:**",
    },
    {
      type: "ul",
      text: "",
      items: [
        "**No BF16.** You train in FP16 with loss scaling. Most current models were pretrained in BF16 and some have activations that overflow FP16's 65,504 ceiling. Watch for the gradient scaler repeatedly skipping steps or for `inf` in specific layers. Keep norms and the LM head in FP32. Model families differ a lot here; test before committing.",
        "**No FlashAttention 2** (it needs Ampere or newer). Use PyTorch SDPA's memory-efficient backend, which supports Volta. Long context costs more memory than on newer cards; plan for 4–8k.",
        "**The software floor is moving away from you.** CUDA 13 dropped Volta. Recent PyTorch builds for newer CUDA versions dropped it too, while the CUDA 12.6 builds kept it. Pin your PyTorch/CUDA pair, pin bitsandbytes and confirm its wheel includes `sm_70` kernels, and expect newer inference engines to stop supporting the card. llama.cpp stays a reliable fallback for evaluation.",
        "Hybrid linear-attention architectures (Qwen3-Next-style, Gated DeltaNet) rely on Triton kernels that may not run, or run well, on Volta. Check before choosing such a model as a V100 target.",
      ],
    },
    {
      type: "p",
      text: "**What fits:** QLoRA on 14–24B dense per card comfortably and 32B per card tightly. QLoRA on 30B-A3B per card with low expert ranks. BF16-weight LoRA (FP16 compute) on ~14B sharded across four. Full fine-tuning up to ~5B with FSDP over NVLink.",
    },
    {
      type: "p",
      text: "**Role in autoresearch:** four lanes running QLoRA on a 7–14B proxy, or on the real 24B target if you accept fewer experiments per night. If your board is PCIe without NVLink, treat it as four independent lanes and never shard across them.",
    },
    {
      type: "h3",
      text: "DGX Spark: capacity without bandwidth",
    },
    {
      type: "p",
      text: "A GB10 Grace Blackwell superchip: 128 GB of LPDDR5x shared by CPU and GPU at ~273 GB/s, an ARM CPU, Blackwell tensor cores with FP4/FP8, ~240 W. Two units can be linked over ConnectX-7.",
    },
    {
      type: "p",
      text: "**The mental model:** it holds models an H200 holds, and moves bytes at roughly 1/17th the speed. For *training* with decent batch sizes you're mostly compute-bound, and the Spark has roughly an order of magnitude less dense BF16 throughput than one H200. So big models fit and train *slowly*. For decode-heavy work (RL rollouts, execution-based eval with long generations), bandwidth binds hard.",
    },
    {
      type: "p",
      text: "**What fits:** BF16 LoRA on 30B-A3B (~61 GB). QLoRA on 80B-A3B (~45 GB) with lots of headroom. QLoRA on 106–120B-class MoE. Remember that unified memory is shared with the OS and data loaders, so budget ~110–115 GB, not 128.",
    },
    {
      type: "p",
      text: "**Gotchas:**",
    },
    {
      type: "ul",
      text: "",
      items: [
        "**aarch64 + a new compute capability.** Use NVIDIA's containers and published playbooks (Unsloth, NeMo, LLaMA-Factory have Spark recipes) instead of `pip install`-ing your way through it. Check whether your FlashAttention build supports the GB10's architecture; PyTorch SDPA/cuDNN attention is the safe default.",
        'Don\'t page through unified memory carelessly. Pinned-memory tricks designed for discrete GPUs (CPU-offloaded optimizer states, offloaded checkpoints) behave differently when "CPU memory" and "GPU memory" are the same pool.',
      ],
    },
    {
      type: "p",
      text: '**Role in autoresearch:** a single, quiet, low-power overnight lane that can test configs *on the real large target model*, which no 24 GB card can. It\'s the right box for the question "does what we learned on the 14B proxy still hold on the 80B MoE?" Use it for long, slow confirmation runs, not wide sweeps.',
    },
    {
      type: "h3",
      text: "4× RTX 3090: the best autoresearch rig per dollar",
    },
    {
      type: "p",
      text: "24 GB GDDR6X per card, ~936 GB/s, Ampere: BF16 and FlashAttention 2 both work. Usually PCIe on a consumer or workstation board, often running at x8 or x4, with optional 2-way NVLink bridges between pairs.",
    },
    {
      type: "p",
      text: "**What fits:**",
    },
    {
      type: "ul",
      text: "",
      items: [
        "QLoRA on 14B dense comfortably per card, and on 24B dense (~13 GB base) at 8k per card.",
        "QLoRA on 30B-A3B per card is **borderline**: ~17 GB of base weights plus expert adapter state plus activations. Make it work with expert rank ≤ 8, an 8-bit paged optimizer, fused cross-entropy and short context, or give each lane two cards with the model split across them.",
        "BF16 LoRA on ~32B sharded across all four, but see below about sharding over PCIe.",
      ],
    },
    {
      type: "p",
      text: "**The interconnect question.** GeForce drivers disable peer-to-peer transfers by default, so NCCL traffic between cards goes through host memory. Sharding the *base model* (FSDP, tensor parallel) over that is painful. But **data-parallel LoRA only all-reduces adapter gradients**: hundreds of MB for a dense model, and with gradient accumulation that happens once every several micro-batches. It works fine. The exception is fine-grained MoE with high expert rank, per the arithmetic above.",
    },
    {
      type: "p",
      text: "**Operational notes:** Power-limit the cards to ~250–280 W. You lose little training throughput, and four 350 W cards on one desktop PSU is how fires start. Check that each card actually trained at its expected speed. A card in an x4 slot or a thermally throttling card will quietly make one lane slower, which matters for wall-clock-budgeted experiments (more on that below).",
    },
    {
      type: "p",
      text: "**Role in autoresearch:** four independent lanes. With a QLoRA run on a 14B target sized to ~20 minutes, that's ~12 experiments an hour, roughly a hundred overnight. That's enough to actually map out a search space.",
    },
    {
      type: "h3",
      text: "8× Titan RTX: an experiment farm, not a training cluster",
    },
    {
      type: "p",
      text: "24 GB GDDR6 per card, ~672 GB/s, Turing: FP16 tensor cores, no BF16, no FlashAttention 2. Almost certainly PCIe 3.0, likely a dual-socket host, with 2-way NVLink bridges at best.",
    },
    {
      type: "p",
      text: "**What not to do:** shard one big run across all eight. PCIe 3 through PCIe switches and across a CPU socket interconnect is a terrible fabric for FSDP, and you'll spend your time chasing NCCL timeouts rather than learning anything.",
    },
    {
      type: "p",
      text: "**What to do:** treat it as **eight independent single-GPU lanes**. Pin each lane's data loader to the CPU socket that owns its PCIe root (`numactl`), and run QLoRA on a 4–14B proxy model on each card. The same FP16 caveats as the V100 apply, but Turing remains supported by CUDA 13, and Triton kernels (Liger, Unsloth) support it. That's why free-tier Colab T4s, also Turing, can run QLoRA at all.",
    },
    {
      type: "p",
      text: "**Role in autoresearch:** the widest lane count in this lineup. Eight lanes × ~4 experiments an hour on a small proxy is the kind of throughput that lets an agent test data-mixture hypotheses properly, with repeats.",
    },
    {
      type: "h2",
      text: "Autoresearch for fine-tuning: the loop, adapted",
    },
    {
      type: "p",
      text: "Karpathy's `autoresearch` is beautifully minimal: one GPU, one editable `train.py`, a fixed five-minute wall-clock budget, one metric (validation bits-per-byte), and an agent following a human-written `program.md`. Each iteration: propose a change, train, evaluate, commit if better, `git reset` if not, log it, repeat.",
    },
    {
      type: "p",
      text: "Fine-tuning a coding model breaks four of its simplifying assumptions, and each needs a deliberate fix.",
    },
    {
      type: "h3",
      text: "Break #1: one lane becomes many",
    },
    {
      type: "p",
      text: "On every machine above except the Spark, you have several GPUs and want several experiments in flight. Two workable patterns:",
    },
    {
      type: "ul",
      text: "",
      items: [
        "**N agents, N worktrees, one shared ledger.** Each lane gets its own git worktree and branch and its own agent session. All agents read (but only append to their own rows in) a shared `results.tsv`, so lane 3 knows lane 1 already found that rank 128 doesn't help. Every few hours, a merge step promotes the global best config into every lane's branch.",
        "**One agent, a batch queue.** A single agent proposes a *batch* of N diffs per round, a runner fans them out to lanes, and the agent reviews all N results before the next batch. This gives more coherent exploration and fewer duplicate experiments, but every round waits for the slowest lane.",
      ],
    },
    {
      type: "p",
      text: "I prefer the first for wide, heterogeneous search early on and the second for refinement near the end.",
    },
    {
      type: "h3",
      text: "Break #2: wall-clock budgets don't compare across lanes",
    },
    {
      type: "p",
      text: "A fixed wall-clock budget is elegant on one GPU: architecture changes have to pay for themselves in speed. Across heterogeneous lanes (a Titan lane and a 3090 lane, or a 3090 stuck in an x4 slot), it silently makes the lane, not the config, the main variable. **Fix the token budget** (a set number of training tokens per experiment) and keep wall-clock only as a kill switch. If you want the agent to optimize throughput too, report tokens/second as a secondary metric, but don't let it trade quality for speed silently.",
    },
    {
      type: "h3",
      text: 'Break #3: "lower loss" is not "better coding model"',
    },
    {
      type: "p",
      text: "Validation loss is fast and cheap and correlates with what you want, until the agent finds the ways it doesn't. Shorter sequences, dropping hard examples, and overfitting to the eval split's style all lower loss. Use a tiered metric:",
    },
    {
      type: "ul",
      text: "",
      items: [
        "**Tier 0, every experiment (~2 minutes):** completion-only loss on a held-out set of *repositories* (not files) from your domain. This is the agent's gradient signal.",
        "**Tier 1, any experiment that beats the incumbent on Tier 0:** execution-based pass@1 on 100–200 held-out internal tasks with real unit tests, generated at temperature 0, plus a small general-coding regression set (a slice of LiveCodeBench, say) to catch forgetting. A change is kept only if Tier 1 improves *and* the regression set doesn't drop by more than a fixed margin.",
        "**Tier 2, human-triggered promotion:** the full agentic eval in your real harness, on the target model, **in the quantization you'll deploy** (more on that below).",
      ],
    },
    {
      type: "h3",
      text: "Break #4: the noise floor",
    },
    {
      type: "p",
      text: 'Fine-tuning results vary with seed more than people expect, especially with small eval sets. Before the agent runs anything, **run the baseline config three to five times with different seeds** and record the standard deviation of each tier\'s metric. Write the acceptance threshold into `program.md`, for example "improvement must exceed 2σ." Without that, a hundred overnight experiments will produce a dozen "improvements" that are pure noise, and the agent will build on them.',
    },
    {
      type: "h3",
      text: "Guarding the eval from the optimizer",
    },
    {
      type: "p",
      text: "An autoresearch agent is an optimizer, and optimizers find holes. Make the boundary physical, not just a polite request in the prompt:",
    },
    {
      type: "ul",
      text: "",
      items: [
        "Eval code and eval data live on a **read-only mount** inside the lane's container. The runner checks a hash of the eval harness before every scoring run and refuses to score if it changed.",
        'The agent sees **scores, never eval examples.** Tier 1 failure summaries should say "14/150 failed, mostly timeouts," not show the failing test.',
        "Keep a **hidden promotion set** that no agent has ever been scored against, and use it only at Tier 2. If Tier 1 keeps rising while the hidden set stays flat, your loop is overfitting the eval; stop and rotate sets.",
        'The **tokenizer, chat template and train/eval split are off-limits.** These are where the most damaging "improvements" hide.',
      ],
    },
    {
      type: "h3",
      text: "What the agent should own",
    },
    {
      type: "p",
      text: "Search space, roughly in order of how much they matter for coding fine-tunes:",
    },
    {
      type: "ol",
      text: "",
      items: [
        "**Data mixture.** Domain-to-replay ratio, which sources go in, trajectory filtering thresholds, deduplication strictness.",
        "**Learning rate and schedule.** LR, warmup, decay shape, number of epochs.",
        "**Adapter shape.** Rank (separately for attention and experts), alpha with rsLoRA, target modules, dropout.",
        "**Variants.** DoRA, PiSSA/LoftQ initialization, LoRA+ learning-rate ratio.",
        "**Sequence handling.** Max length, packing versus padding, loss weighting for long examples.",
      ],
    },
    {
      type: "p",
      text: "Leave model selection and quantization scheme for serving to humans. They're decisions about deployment, not hyperparameters.",
    },
    {
      type: "h3",
      text: "Proxy to target: the promotion ladder",
    },
    {
      type: "p",
      text: "The whole point of cheap lanes is to search on a **proxy** and confirm on the **target**. What transfers:",
    },
    {
      type: "ul",
      text: "",
      items: [
        "**Data decisions transfer well.** Mixture ratios, filtering and replay fractions found on a 4B or 14B model of the same family mostly hold at 30B.",
        "**Adapter shape transfers reasonably** within a family, especially with rsLoRA.",
        "**Learning rate transfers worst**, particularly from dense proxy to MoE target. Always re-sweep LR with three to five points on the target.",
      ],
    },
    {
      type: "p",
      text: "A concrete ladder for a team with the 3090 rig plus access to the H200s:",
    },
    {
      type: "ol",
      text: "",
      items: [
        "**Night 1–2:** 4 lanes × ~100 experiments on a 14B dense proxy. The agent explores data mixture and adapter shape.",
        "**Night 3:** top 5 configs rerun with 3 seeds each on the proxy. Keep those whose gains survive the noise floor.",
        "**Day 4:** H200s run the survivors on the 30B-A3B target with a 3-point LR sweep each, at full context.",
        "**Day 5:** Tier 2 eval of the best two in deployment quantization in the real harness. Humans decide.",
      ],
    },
    {
      type: "h3",
      text: "A minimal `program.md`",
    },
    {
      type: "code",
      text: "# Goal\nImprove a LoRA fine-tune of the proxy model on our internal Scala codebase.\n\n# You may edit\n- configs/train.yaml (all fields except `model`, `tokenizer`, `chat_template`, `eval`)\n- data/mixture.yaml\n\n# You may not edit\n- anything under eval/ (read-only; the runner will refuse to score if changed)\n- scripts/run_experiment.py\n\n# Budget\nEach experiment trains on exactly 20M tokens. Wall-clock kill switch: 30 minutes.\n\n# Acceptance\nBaseline tier0 loss: 0.812 ± 0.006 (5 seeds). Baseline tier1 pass@1: 41.3% ± 1.4%.\nKeep a change only if tier0 improves by > 0.012 AND tier1 improves by > 2.8 points\nAND regression-set pass@1 drops by no more than 1.0 point. Otherwise revert.\n\n# Process\nRead results.tsv before proposing. One hypothesis per experiment. Write the hypothesis\nin the commit message. Never repeat an experiment already in results.tsv.",
      lang: "markdown",
    },
    {
      type: "h3",
      text: "A minimal lane runner",
    },
    {
      type: "code",
      text: '#!/usr/bin/env python3\n"""One autoresearch lane: train -> score -> keep or revert. The agent edits configs; this file is off-limits."""\nimport hashlib, json, os, subprocess, sys, time\nfrom pathlib import Path\n\nLANE = int(sys.argv[1])\nGPUS = os.environ.get("LANE_GPUS", str(LANE))\nEVAL_HASH = Path("eval/HASH").read_text().strip()\nLEDGER = Path("results.tsv")\nTHRESH = json.loads(Path("eval/thresholds.json").read_text())\n\ndef eval_tree_hash() -> str:\n    h = hashlib.sha256()\n    for p in sorted(Path("eval").rglob("*")):\n        if p.is_file() and p.name != "HASH":\n            h.update(p.read_bytes())\n    return h.hexdigest()\n\ndef run(cmd: list[str], timeout: int) -> subprocess.CompletedProcess:\n    env = {**os.environ, "CUDA_VISIBLE_DEVICES": GPUS}\n    return subprocess.run(cmd, env=env, timeout=timeout, capture_output=True, text=True)\n\ndef score(adapter_dir: str) -> dict:\n    if eval_tree_hash() != EVAL_HASH:\n        raise RuntimeError("eval/ was modified; refusing to score")\n    out = run(["python", "eval/score.py", "--adapter", adapter_dir], timeout=3600)\n    return json.loads(out.stdout)\n\ndef accepted(new: dict, best: dict) -> bool:\n    return (best["tier0"] - new["tier0"] > THRESH["tier0_delta"]\n            and new["tier1"] - best["tier1"] > THRESH["tier1_delta"]\n            and best["regression"] - new["regression"] <= THRESH["regression_drop"])\n\ncommit = subprocess.check_output(["git", "rev-parse", "--short", "HEAD"], text=True).strip()\nadapter_dir = f"runs/lane{LANE}-{commit}"\nstart = time.time()\ntry:\n    run(["python", "scripts/train.py", "--config", "configs/train.yaml", "--out", adapter_dir], timeout=1800)\n    new = score(adapter_dir)\nexcept (subprocess.TimeoutExpired, RuntimeError) as e:\n    new = {"tier0": float("inf"), "tier1": 0.0, "regression": 0.0, "error": str(e)}\n\nbest = json.loads(Path(f"best_lane{LANE}.json").read_text())\nkeep = accepted(new, best)\nif keep:\n    Path(f"best_lane{LANE}.json").write_text(json.dumps(new))\nelse:\n    subprocess.run(["git", "reset", "--hard", "HEAD~1"], check=True)\n\nwith LEDGER.open("a") as f:\n    f.write(f"{LANE}\\t{commit}\\t{new[\'tier0\']:.4f}\\t{new[\'tier1\']:.2f}\\t{new[\'regression\']:.2f}"\n            f"\\t{\'keep\' if keep else \'discard\'}\\t{time.time() - start:.0f}s\\n")',
      lang: "python",
    },
    {
      type: "p",
      text: "The agent (Claude Code, Codex, or a local model in its own harness) edits the configs, commits with its hypothesis as the message, calls the runner, reads the ledger, and goes again. The runner, not the agent, decides what counts as better.",
    },
    {
      type: "p",
      text: "A note on which model drives the loop: the agent's job is reading a ledger and proposing sensible next experiments. A frontier API model does this noticeably better than a local 30B model, and its token cost is trivial next to the GPU-hours it steers. If air-gapping forbids that, a local model can drive it, but give it a narrower search space and stricter `program.md` rules.",
    },
    {
      type: "h2",
      text: "The last mile: serving what you trained",
    },
    {
      type: "p",
      text: "Two mistakes undo good fine-tunes after the training is over.",
    },
    {
      type: "p",
      text: "**Merging into the wrong base.** If you trained QLoRA over an NF4 base, merge the adapter into the original **BF16** weights, then quantize the merged model for serving. Merging into the 4-bit weights and re-quantizing compounds the error. Alternatively, keep the adapter separate: vLLM serves many LoRA adapters over one base efficiently, and llama.cpp can apply GGUF-converted adapters at load time.",
    },
    {
      type: "p",
      text: "**Evaluating in one precision and serving in another.** If you'll serve a Q4_K_M GGUF on developer laptops or an FP8 checkpoint on the H200s, then *that* is the model you evaluate at Tier 2. Fine-tuning gains of a few points can disappear under aggressive post-training quantization, especially when the adapter learned small, precise corrections. Quantization-aware evaluation is non-negotiable; quantization-aware training is worth trying if the gap is large.",
    },
    {
      type: "h2",
      text: "What I'd actually do with each machine",
    },
    {
      type: "ul",
      text: "",
      items: [
        "**2× H200:** promotion and RL. BF16 LoRA on the real 30B-A3B or 32B target, one per card. GRPO with unit-test rewards, vLLM on one card and the trainer on the other. Occasional full fine-tunes of ≤ 8B models.",
        "**4× V100:** four QLoRA proxy lanes on 7–14B, with a pinned legacy software stack. Budget time for FP16 debugging on whichever model family you pick.",
        "**DGX Spark:** the single overnight confirmation lane on the large MoE target. Slow, quiet, and the only small box that can hold the real thing.",
        "**4× RTX 3090:** the main autoresearch rig. Four lanes on a 14–24B proxy, ~100 experiments a night, DDP for the occasional bigger run.",
        "**8× Titan RTX:** eight small-proxy lanes for wide data-mixture searches with repeated seeds. Never shard across it.",
      ],
    },
    {
      type: "p",
      text: "And on every one of them: all-linear LoRA with a properly swept learning rate, low ranks on MoE experts, fused cross-entropy, completion-only loss, replay data, a measured noise floor, an eval the agent can't touch, and a final check in the quantization you'll actually ship.",
    },
    {
      type: "p",
      text: "The hardware lottery decides how fast you go. The loop decides whether the speed is worth anything. A modest rig running a hundred well-guarded experiments a night will out-learn a big cluster running three hand-tuned ones a week, and that might be the most useful thing autoresearch has taught us about fine-tuning.",
    },
    {
      type: "h2",
      text: "References",
    },
    {
      type: "ul",
      text: "",
      items: [
        "Hu et al., *LoRA: Low-Rank Adaptation of Large Language Models* (2021) — [arXiv:2106.09685](https://arxiv.org/abs/2106.09685)",
        "Dettmers et al., *QLoRA: Efficient Finetuning of Quantized LLMs* (2023) — [arXiv:2305.14314](https://arxiv.org/abs/2305.14314)",
        "Kalajdzievski, *A Rank Stabilization Scaling Factor for Fine-Tuning with LoRA* (rsLoRA, 2023) — [arXiv:2312.03732](https://arxiv.org/abs/2312.03732)",
        "Li et al., *LoftQ: LoRA-Fine-Tuning-Aware Quantization* (2023) — [arXiv:2310.08659](https://arxiv.org/abs/2310.08659)",
        "Liu et al., *DoRA: Weight-Decomposed Low-Rank Adaptation* (2024) — [arXiv:2402.09353](https://arxiv.org/abs/2402.09353)",
        "Hayou et al., *LoRA+: Efficient Low Rank Adaptation of Large Models* (2024) — [arXiv:2402.12354](https://arxiv.org/abs/2402.12354)",
        "Zhao et al., *GaLore: Memory-Efficient LLM Training by Gradient Low-Rank Projection* (2024) — [arXiv:2403.03507](https://arxiv.org/abs/2403.03507)",
        "Meng et al., *PiSSA: Principal Singular Values and Singular Vectors Adaptation* (2024) — [arXiv:2404.02948](https://arxiv.org/abs/2404.02948)",
        "Biderman et al., *LoRA Learns Less and Forgets Less* (2024) — [arXiv:2405.09673](https://arxiv.org/abs/2405.09673)",
        "Hartford et al., *Spectrum: Targeted Training on Signal to Noise Ratio* (2024) — [arXiv:2406.06623](https://arxiv.org/abs/2406.06623)",
        "Hsu et al., *Liger Kernel: Efficient Triton Kernels for LLM Training* (2024) — [arXiv:2410.10989](https://arxiv.org/abs/2410.10989)",
        "Wijmans et al., *Cut Your Losses in Large-Vocabulary Language Models* (Cut Cross-Entropy, 2024) — [arXiv:2411.09009](https://arxiv.org/abs/2411.09009)",
        "Schulman et al., *LoRA Without Regret*, Thinking Machines Lab (2025) — [thinkingmachines.ai/blog/lora](https://thinkingmachines.ai/blog/lora/)",
        "Karpathy, `autoresearch` (2026) — [github.com/karpathy/autoresearch](https://github.com/karpathy/autoresearch)",
      ],
    },
  ],
};

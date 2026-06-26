import { createFileRoute, Link } from "@tanstack/react-router";
import { POSTS } from "@/lib/posts.data";

export const Route = createFileRoute("/posts/")({
  head: () => ({
    meta: [
      { title: "Writing — Adam Jan Kaczmarek" },
      { name: "description", content: "Blog posts and notes by Adam Jan Kaczmarek on deep learning, NLP, and reproducible research." },
      { property: "og:title", content: "Writing — Adam Jan Kaczmarek" },
      { property: "og:description", content: "Blog posts and notes on deep learning, NLP, and reproducible research." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: PostsPage,
});

function PostsPage() {
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
            <Link to="/posts" className="text-primary transition-colors">
              writing
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 md:px-10 pt-16 pb-32">
        <div className="mb-12">
          <div className="section-label mb-3">// writing</div>
          <h1 className="text-4xl md:text-5xl mb-3">Blog posts</h1>
          <p className="text-muted-foreground max-w-xl">
            Occasional notes from the lab bench and the production trenches.
          </p>
        </div>

        <div className="space-y-4">
          {POSTS.map((post) => (
            <Link
              key={post.slug}
              to="/posts/$postId"
              params={{ postId: post.slug }}
              className="card-surface p-6 group block"
            >
              <div className="flex items-center gap-3 mono text-xs text-muted-foreground mb-2">
                <span>{post.date}</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span>{post.read} read</span>
              </div>
              <h2 className="text-xl md:text-2xl mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>read post</span>
                <span>→</span>
              </div>
            </Link>
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

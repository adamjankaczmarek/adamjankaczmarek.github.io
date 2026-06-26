import { createFileRoute, Link } from "@tanstack/react-router";
import { getPostBySlug, POSTS } from "@/lib/posts.data";

export const Route = createFileRoute("/posts/$postId")({
  head: ({ params }) => {
    const post = getPostBySlug(params.postId);
    return {
      meta: [
        { title: post ? `${post.title} — Adam Jan Kaczmarek` : "Post — Adam Jan Kaczmarek" },
        { name: "description", content: post?.excerpt ?? "" },
        { property: "og:title", content: post?.title ?? "" },
        { property: "og:description", content: post?.excerpt ?? "" },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: PostPage,
  notFoundComponent: PostNotFound,
});

function PostNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-4xl mb-2">Post not found</h1>
        <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
        <Link
          to="/posts"
          className="mono text-sm px-5 py-2.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity inline-block"
        >
          ← back to writing
        </Link>
      </div>
    </div>
  );
}

function PostPage() {
  const { postId } = Route.useParams();
  const post = getPostBySlug(postId);

  if (!post) {
    return <PostNotFound />;
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
            <Link to="/posts" className="text-primary transition-colors">
              writing
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 md:px-10 pt-12 pb-24">
        <div className="mb-10">
          <Link
            to="/posts"
            className="mono text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 mb-6"
          >
            <span>←</span>
            <span>all posts</span>
          </Link>

          <div className="flex items-center gap-3 mono text-xs text-muted-foreground mb-4">
            <span>{post.date}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground" />
            <span>{post.read} read</span>
          </div>

          <h1 className="text-3xl md:text-4xl leading-tight mb-4">{post.title}</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">{post.excerpt}</p>
        </div>

        <article className="prose prose-invert prose-lg max-w-none">
          {post.content.map((block, i) => {
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
              <div className="mono text-xs text-muted-foreground mb-1">read next</div>
              <div className="flex flex-wrap gap-2">
                {POSTS.filter((p) => p.slug !== post.slug).map((p) => (
                  <Link
                    key={p.slug}
                    to="/posts/$postId"
                    params={{ postId: p.slug }}
                    className="mono text-xs px-3 py-1.5 border border-border rounded-full hover:border-primary/50 hover:text-primary transition-colors"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/posts"
              className="mono text-sm px-5 py-2.5 bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity"
            >
              ← all posts
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

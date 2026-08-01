import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { blogPosts, getPostBySlug, getRelatedPosts } from '@/lib/blog-data';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | CoreWealth Bank Blog`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: 'article', publishedTime: post.publishedAt },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(slug);

  return (
    <div className="min-h-screen bg-background text-white">
      <article className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-gray-500 hover:text-white">Home</Link>
          <span className="text-gray-600">/</span>
          <Link href="/blog" className="text-gray-500 hover:text-white">Blog</Link>
          <span className="text-gray-600">/</span>
          <span className="text-gray-400">{post.category}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#2563EB]/10 text-[#2563EB] text-xs font-bold px-3 py-1 rounded-full">{post.category}</span>
            <span className="text-gray-500 text-xs">{post.readTime} min read</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mb-4">{post.title}</h1>
          <p className="text-gray-400 text-lg leading-relaxed">{post.excerpt}</p>
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
            <div className="w-10 h-10 rounded-full bg-[#2563EB] flex items-center justify-center text-white font-bold text-sm">TP</div>
            <div>
              <p className="text-white text-sm font-medium">{post.author}</p>
              <p className="text-gray-500 text-xs">{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-invert max-w-none mb-16">
          {post.content.split('\n\n').map((paragraph, i) => {
            if (paragraph.startsWith('## ')) {
              return <h2 key={i} className="text-xl font-bold text-white mt-8 mb-3">{paragraph.replace('## ', '')}</h2>;
            }
            if (paragraph.startsWith('- ')) {
              const items = paragraph.split('\n').filter(l => l.startsWith('- '));
              return (
                <ul key={i} className="space-y-2 mb-4">
                  {items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-gray-300 text-sm">
                      <span className="text-[#2563EB] mt-1">&bull;</span>
                      <span>{item.replace('- ', '')}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            if (/^\d+\./.test(paragraph)) {
              const items = paragraph.split('\n').filter(l => /^\d+\./.test(l));
              return (
                <ol key={i} className="space-y-2 mb-4">
                  {items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-gray-300 text-sm">
                      <span className="text-[#2563EB] font-bold min-w-[1.5rem]">{j + 1}.</span>
                      <span>{item.replace(/^\d+\.\s*/, '')}</span>
                    </li>
                  ))}
                </ol>
              );
            }
            return <p key={i} className="text-gray-300 text-sm leading-relaxed mb-4">{paragraph}</p>;
          })}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-12 pt-6 border-t border-border">
          {post.tags.map((tag) => (
            <span key={tag} className="bg-card border border-border text-gray-400 text-xs px-3 py-1 rounded-full">#{tag}</span>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-[#2563EB]/20 via-card to-card border border-[#2563EB]/20 rounded-2xl p-8 text-center mb-16">
          <h3 className="text-xl font-bold mb-2">Ready to Start Investing?</h3>
          <p className="text-gray-400 text-sm mb-4">Join thousands of investors earning daily returns.</p>
          <Link href="/register" className="inline-block bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
            Create Free Account
          </Link>
        </div>

        {/* Related Posts */}
        {related.length > 0 && (
          <section>
            <h3 className="text-xl font-bold mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((rPost) => (
                <Link key={rPost.slug} href={`/blog/${rPost.slug}`} className="group bg-card border border-border rounded-xl p-4 hover:border-[#2563EB]/40 transition-all">
                  <span className="text-[#2563EB] text-xs font-medium">{rPost.category}</span>
                  <h4 className="text-white font-semibold text-sm mt-1 group-hover:text-[#2563EB] transition-colors line-clamp-2">{rPost.title}</h4>
                  <span className="text-gray-500 text-xs mt-2 block">{rPost.readTime} min read</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}

import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import BlogDetailContent from "@/components/blocks/blog/detail";
import { getBlogPostBySlug } from "@/services/blog";

interface BlogDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const blogPost = await getBlogPostBySlug(slug, locale);
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'https://geminicli.org';
  
  if (blogPost) {
    const title = locale === 'zh' 
      ? `${blogPost.title} - Gemini CLI 开发者博客`
      : `${blogPost.title} - Gemini CLI Developer Blog`;
      
    const description = blogPost.description;

    return {
      title,
      description,
      keywords: [
        ...blogPost.tags,
        blogPost.category || 'blog',
        locale === 'zh' ? '开发者博客' : 'developer blog',
        'Gemini CLI'
      ].join(', '),
      authors: blogPost.authorName ? [{ name: blogPost.authorName }] : undefined,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      openGraph: {
        title,
        description,
        url: `${baseUrl}/${locale}/blog/${slug}`,
        siteName: "Gemini CLI Hub",
        type: "article",
        locale: locale,
        publishedTime: blogPost.createdAt.toISOString(),
        modifiedTime: blogPost.updatedAt?.toISOString(),
        authors: blogPost.authorName ? [blogPost.authorName] : undefined,
        section: blogPost.category,
        tags: blogPost.tags,
        images: blogPost.coverUrl ? [
          {
            url: blogPost.coverUrl,
            width: 1200,
            height: 630,
            alt: blogPost.title,
          }
        ] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: blogPost.coverUrl ? [blogPost.coverUrl] : undefined,
        creator: blogPost.authorName ? `@${blogPost.authorName.replace(/\s+/g, '')}` : "@GeminiCLIHub",
      },
      alternates: {
        canonical: `${baseUrl}/${locale}/blog/${slug}`,
        languages: {
          'en': `${baseUrl}/en/blog/${slug}`,
          'zh': `${baseUrl}/zh/blog/${slug}`,
        },
      },
      other: {
        'article:section': blogPost.category || 'Technology',
        'article:tag': blogPost.tags.join(', '),
        'article:author': blogPost.authorName || 'Gemini CLI Hub',
        'article:published_time': blogPost.createdAt.toISOString(),
        'article:modified_time': blogPost.updatedAt?.toISOString() || blogPost.createdAt.toISOString(),
        'blog_keywords': blogPost.tags.join(', '),
      },
    };
  }

  // Fallback metadata when blog post is not available
  return {
    title: locale === 'zh' 
      ? "博客文章 - Gemini CLI Hub" 
      : "Blog Post - Gemini CLI Hub",
    description: locale === 'zh'
      ? "探索 Gemini CLI 开发技术，阅读深度技术文章和开发教程。"
      : "Explore Gemini CLI development techniques, read in-depth technical articles and development tutorials.",
    keywords: 'Gemini CLI, blog, development, tutorial',
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blog/${slug}`,
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const blogPost = await getBlogPostBySlug(slug, locale);
  
  if (!blogPost) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading blog post...</div>}>
      <BlogDetailContent post={blogPost} locale={locale} />
    </Suspense>
  );
}
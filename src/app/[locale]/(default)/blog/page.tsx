import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import BlogContent from "@/components/blocks/blog";
import { Skeleton } from "@/components/ui/skeleton";
import Script from "next/script";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'https://geminicli.org';
  
  const title = locale === 'zh' 
    ? "Gemini CLI 开发者博客 - 深度技术文章与开发教程"
    : "Gemini CLI Developer Blog - In-depth Technical Articles & Development Tutorials";
    
  const description = locale === 'zh'
    ? "探索 Gemini CLI 开发技术，阅读深度技术文章，学习最新的开发教程和最佳实践，提升您的 AI 开发技能。"
    : "Explore Gemini CLI development techniques, read in-depth technical articles, learn the latest development tutorials and best practices to enhance your AI development skills.";
    
  const keywords = locale === 'zh'
    ? "Gemini CLI, 开发者博客, 技术文章, 开发教程, AI 开发, 插件开发, API 集成, 最佳实践"
    : "Gemini CLI, developer blog, technical articles, development tutorials, AI development, plugin development, API integration, best practices";

  return {
    title,
    description,
    keywords,
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
      url: `${baseUrl}/${locale}/blog`,
      siteName: "Gemini CLI Hub",
      type: "website",
      locale: locale,
      images: [
        {
          url: `${baseUrl}/imgs/features/gemini-cli.webp`,
          width: 1200,
          height: 630,
          alt: "Gemini CLI Developer Blog",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${baseUrl}/imgs/features/gemini-cli.webp`],
      creator: "@GeminiCLIHub",
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blog`,
      languages: {
        'en': `${baseUrl}/en/blog`,
        'zh': `${baseUrl}/zh/blog`,
      },
    },
    other: {
      'article:section': 'Technology',
      'article:tag': 'Gemini CLI, Development, Tutorials, AI',
    },
  };
}

function BlogSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-5 w-96 mb-8" />
          <div className="flex gap-4 mb-8">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-6">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const search = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'https://geminicli.org';
  
  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${baseUrl}/${locale}/blog#blog`,
        "url": `${baseUrl}/${locale}/blog`,
        "name": locale === 'zh' ? "Gemini CLI 开发者博客" : "Gemini CLI Developer Blog",
        "description": locale === 'zh' 
          ? "探索 Gemini CLI 开发技术，阅读深度技术文章，学习最新的开发教程和最佳实践"
          : "Explore Gemini CLI development techniques, read in-depth technical articles, learn the latest development tutorials and best practices",
        "publisher": {
          "@type": "Organization",
          "@id": `${baseUrl}/#organization`,
          "name": "Gemini CLI Hub"
        },
        "inLanguage": locale === 'zh' ? "zh-CN" : "en-US"
      },
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/${locale}/blog#webpage`,
        "url": `${baseUrl}/${locale}/blog`,
        "name": locale === 'zh' ? "Gemini CLI 开发者博客" : "Gemini CLI Developer Blog",
        "description": locale === 'zh' 
          ? "探索 Gemini CLI 开发技术，阅读深度技术文章和开发教程"
          : "Explore Gemini CLI development techniques, read in-depth technical articles and development tutorials",
        "isPartOf": {
          "@type": "WebSite",
          "@id": `${baseUrl}/#website`,
          "name": "Gemini CLI Hub",
          "url": baseUrl
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": `${baseUrl}/imgs/features/gemini-cli.webp`,
          "width": 1200,
          "height": 630
        },
        "datePublished": "2024-01-01T00:00:00Z",
        "dateModified": new Date().toISOString(),
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": locale === 'zh' ? "首页" : "Home",
              "item": `${baseUrl}/${locale}`
            },
            {
              "@type": "ListItem", 
              "position": 2,
              "name": locale === 'zh' ? "博客" : "Blog",
              "item": `${baseUrl}/${locale}/blog`
            }
          ]
        }
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <Script
        id="blog-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <Suspense fallback={<BlogSkeleton />}>
        <BlogContent locale={locale} searchParams={search} />
      </Suspense>
    </div>
  );
} 
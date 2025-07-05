import { Suspense } from "react";
import { Metadata } from "next";
import SearchContent from "@/components/blocks/search";
import { Skeleton } from "@/components/ui/skeleton";
import Script from "next/script";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const search = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'https://geminicli.org';
  const query = search.q as string || '';
  
  const title = locale === 'zh' 
    ? query 
      ? `搜索 "${query}" - Gemini CLI Hub`
      : "搜索 - Gemini CLI Hub"
    : query 
      ? `Search "${query}" - Gemini CLI Hub`
      : "Search - Gemini CLI Hub";
    
  const description = locale === 'zh'
    ? query 
      ? `搜索 "${query}" 的结果 - 在 Gemini CLI 新闻、工具评测和开发者博客中查找相关内容`
      : "搜索 Gemini CLI 相关内容 - 新闻、工具评测、开发者博客和社区讨论"
    : query 
      ? `Search results for "${query}" - Find relevant content in Gemini CLI news, tool reviews, and developer blog`
      : "Search Gemini CLI content - News, tool reviews, developer blog and community discussions";
    
  const keywords = locale === 'zh'
    ? "Gemini CLI, 搜索, 新闻搜索, 工具搜索, 博客搜索, 内容搜索"
    : "Gemini CLI, search, news search, tool search, blog search, content search";

  return {
    title,
    description,
    keywords,
    robots: {
      index: query ? false : true, // Don't index search result pages with queries
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
      siteName: "Gemini CLI Hub",
      type: "website",
      locale: locale,
    },
    twitter: {
      card: "summary",
      title,
      description,
      creator: "@GeminiCLIHub",
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/search`,
      languages: {
        'en': `${baseUrl}/en/search`,
        'zh': `${baseUrl}/zh/search`,
      },
    },
  };
}

function SearchSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-5 w-96 mb-8" />
          <div className="flex gap-4 mb-8">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-48" />
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

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const search = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'https://geminicli.org';
  const query = search.q as string || '';
  
  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "url": `${baseUrl}/${locale}/search${query ? `?q=${encodeURIComponent(query)}` : ''}`,
    "name": locale === 'zh' ? "搜索结果" : "Search Results",
    "description": locale === 'zh' 
      ? "在 Gemini CLI Hub 中搜索相关内容"
      : "Search relevant content in Gemini CLI Hub",
    "isPartOf": {
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      "name": "Gemini CLI Hub",
      "url": baseUrl,
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${baseUrl}/${locale}/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Search Results",
      "description": query ? `Search results for "${query}"` : "Search results"
    },
    "inLanguage": locale === 'zh' ? "zh-CN" : "en-US"
  };

  return (
    <div className="min-h-screen">
      <Script
        id="search-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <Suspense fallback={<SearchSkeleton />}>
        <SearchContent locale={locale} searchParams={search} />
      </Suspense>
    </div>
  );
} 
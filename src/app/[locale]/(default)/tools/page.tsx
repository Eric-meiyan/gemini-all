import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import ToolsContent from "@/components/blocks/tools";
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
    ? "Gemini CLI 工具体验中心 - 效率提升工具评测与分享"
    : "Gemini CLI Tools & Reviews - Productivity Enhancement Tools";
    
  const description = locale === 'zh'
    ? "探索 Gemini CLI 工具生态系统，获取最新的工具评测、使用技巧和效率提升方案，帮助开发者选择最适合的工具。"
    : "Explore the Gemini CLI tools ecosystem with the latest tool reviews, usage tips, and productivity solutions to help developers choose the best tools.";
    
  const keywords = locale === 'zh'
    ? "Gemini CLI, 工具评测, 生产力工具, 命令行工具, AI 工具, 开发工具, 效率提升, 工具推荐"
    : "Gemini CLI, tool reviews, productivity tools, command line tools, AI tools, development tools, efficiency, tool recommendations";

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
      url: `${baseUrl}/${locale}/tools`,
      siteName: "Gemini CLI Hub",
      type: "website",
      locale: locale,
      images: [
        {
          url: `${baseUrl}/imgs/features/gemini-cli.webp`,
          width: 1200,
          height: 630,
          alt: "Gemini CLI Tools & Reviews",
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
      canonical: `${baseUrl}/${locale}/tools`,
      languages: {
        'en': `${baseUrl}/en/tools`,
        'zh': `${baseUrl}/zh/tools`,
      },
    },
    other: {
      'article:section': 'Tools',
      'article:tag': 'Gemini CLI, Tools, Reviews, Productivity',
    },
  };
}

function ToolsSkeleton() {
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

export default async function ToolsPage({
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
        "@type": "WebPage",
        "@id": `${baseUrl}/${locale}/tools#webpage`,
        "url": `${baseUrl}/${locale}/tools`,
        "name": locale === 'zh' ? "Gemini CLI 工具体验中心" : "Gemini CLI Tools & Reviews",
        "description": locale === 'zh' 
          ? "探索 Gemini CLI 工具生态系统，获取最新的工具评测、使用技巧和效率提升方案"
          : "Explore the Gemini CLI tools ecosystem with the latest tool reviews, usage tips, and productivity solutions",
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
              "name": locale === 'zh' ? "工具" : "Tools",
              "item": `${baseUrl}/${locale}/tools`
            }
          ]
        }
      },
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}/${locale}/tools#collection`,
        "name": locale === 'zh' ? "Gemini CLI 工具评测" : "Gemini CLI Tool Reviews",
        "description": locale === 'zh' 
          ? "最新的 Gemini CLI 工具评测和使用心得"
          : "Latest Gemini CLI tool reviews and usage experiences",
        "mainEntity": {
          "@type": "ItemList",
          "name": "Tool Reviews",
          "description": "Reviews and experiences with Gemini CLI tools"
        },
        "inLanguage": locale === 'zh' ? "zh-CN" : "en-US"
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <Script
        id="tools-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <Suspense fallback={<ToolsSkeleton />}>
        <ToolsContent locale={locale} searchParams={search} />
      </Suspense>
    </div>
  );
} 
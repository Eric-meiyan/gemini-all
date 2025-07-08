import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import NewsContent from "@/components/blocks/news";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Script from "next/script";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'https://geminicli.org';
  
  return {
    title: locale === 'zh' ? 'Gemini CLI Hub - 您的AI CLI开发资源中心' : 'Gemini CLI Hub - Your AI CLI Development Resource Center',
    description: locale === 'zh' 
      ? 'Gemini CLI Hub是专业的AI CLI开发资源平台，提供最新资讯、工具评测和开发教程。掌握Google Gemini AI、CLI工具开发和人工智能技术的最新动态。'
      : 'Gemini CLI Hub is the ultimate resource center for AI CLI development. Stay updated with latest news, tool reviews, and developer tutorials about Google Gemini AI, CLI tools, and artificial intelligence.',
    keywords: locale === 'zh' 
      ? 'Gemini CLI, AI CLI, Google Gemini, 人工智能, CLI工具, AI开发, 机器学习, 开发教程, 工具评测'
      : 'Gemini CLI, AI CLI, Google Gemini, artificial intelligence, CLI tools, AI development, machine learning, developer tutorials, tool reviews',
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
      title: locale === 'zh' ? 'Gemini CLI Hub - AI CLI开发资源中心' : 'Gemini CLI Hub - AI CLI Development Resource Center',
      description: locale === 'zh' 
        ? 'Gemini CLI Hub是专业的AI CLI开发资源平台，提供最新资讯、工具评测和开发教程。'
        : 'Gemini CLI Hub is the ultimate resource center for AI CLI development with latest news, tool reviews, and developer tutorials.',
      url: `${baseUrl}/${locale === 'en' ? '' : locale}`,
      siteName: "Gemini CLI Hub",
      type: "website",
      locale: locale,
      images: [
        {
          url: `${baseUrl}/imgs/features/gemini-cli.webp`,
          width: 1200,
          height: 630,
          alt: "Gemini CLI Hub - AI CLI Development Resource Center",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: locale === 'zh' ? 'Gemini CLI Hub - AI CLI开发资源中心' : 'Gemini CLI Hub - AI CLI Development Resource Center',
      description: locale === 'zh' 
        ? 'Gemini CLI Hub是专业的AI CLI开发资源平台，提供最新资讯、工具评测和开发教程。'
        : 'Gemini CLI Hub is the ultimate resource center for AI CLI development with latest news, tool reviews, and developer tutorials.',
      images: [`${baseUrl}/imgs/features/gemini-cli.webp`],
      creator: "@GeminiCLIHub",
    },
    alternates: {
      canonical: `${baseUrl}/${locale === 'en' ? '' : locale}`,
      languages: {
        'en': `${baseUrl}/`,
        'zh': `${baseUrl}/zh`,
      },
    },
    other: {
      'article:section': 'Technology',
      'article:tag': 'Gemini CLI, AI, CLI Tools, Google AI, Development',
    },
  };
}

function HomeSkeleton() {
  return (
    <div className="container py-8">
      <div className="mb-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-96" />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-4" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const search = await searchParams;
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'https://geminicli.org';
  
  // Generate structured data for homepage
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "Gemini CLI Hub",
        "alternateName": locale === 'zh' ? "Gemini CLI 中心" : "Gemini CLI Hub",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`,
          "width": 512,
          "height": 512
        },
        "sameAs": [
          "https://github.com/geminicli",
          "https://twitter.com/GeminiCLIHub"
        ],
        "description": locale === 'zh' 
          ? "专业的AI CLI开发资源平台，提供最新资讯、工具评测和开发教程。"
          : "The ultimate resource center for AI CLI development with latest news, tool reviews, and developer tutorials."
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": "Gemini CLI Hub",
        "description": locale === 'zh' 
          ? "专业的AI CLI开发资源平台，提供最新资讯、工具评测和开发教程。"
          : "The ultimate resource center for AI CLI development with latest news, tool reviews, and developer tutorials.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": `${baseUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string"
        },
        "inLanguage": [
          {
            "@type": "Language",
            "name": "English",
            "alternateName": "en"
          },
          {
            "@type": "Language", 
            "name": "Chinese",
            "alternateName": "zh"
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/${locale === 'en' ? '' : locale}#webpage`,
        "url": `${baseUrl}/${locale === 'en' ? '' : locale}`,
        "name": locale === 'zh' ? 'Gemini CLI Hub - AI CLI开发资源中心' : 'Gemini CLI Hub - AI CLI Development Resource Center',
        "description": locale === 'zh' 
          ? 'Gemini CLI Hub是专业的AI CLI开发资源平台，提供最新资讯、工具评测和开发教程。'
          : 'Gemini CLI Hub is the ultimate resource center for AI CLI development with latest news, tool reviews, and developer tutorials.',
        "isPartOf": {
          "@type": "WebSite",
          "@id": `${baseUrl}/#website`
        },
        "primaryImageOfPage": {
          "@type": "ImageObject",
          "url": `${baseUrl}/imgs/features/gemini-cli.webp`,
          "width": 1200,
          "height": 630
        },
        "datePublished": "2024-01-01T00:00:00Z",
        "dateModified": new Date().toISOString(),
        "inLanguage": locale === 'zh' ? "zh-CN" : "en-US"
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <Script
        id="homepage-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <Suspense fallback={<HomeSkeleton />}>
        <NewsContent locale={locale} searchParams={search} />
      </Suspense>
    </div>
  );
}

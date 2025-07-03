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
    title: t("title"),
    description: t("description"),
    keywords: t("keywords"),
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
      title: t("title"),
      description: t("description"),
      url: `${baseUrl}/${locale}/news`,
      siteName: "Gemini CLI Hub",
      type: "website",
      locale: locale,
      images: [
        {
          url: `${baseUrl}/imgs/features/gemini-cli.webp`,
          width: 1200,
          height: 630,
          alt: "Gemini CLI News & Updates",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${baseUrl}/imgs/features/gemini-cli.webp`],
      creator: "@GeminiCLIHub",
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/news`,
      languages: {
        'en': `${baseUrl}/en/news`,
        'zh': `${baseUrl}/zh/news`,
      },
    },
    other: {
      'article:section': 'Technology',
      'article:tag': 'Gemini CLI, AI, CLI Tools, Google AI',
    },
  };
}

function NewsSkeleton() {
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

export default async function NewsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale } = await params;
  const search = await searchParams;
  const t = await getTranslations({ locale, namespace: "news" });
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'https://geminicli.org';
  
  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsMediaOrganization",
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
        "description": t("description")
      },
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/${locale}/news#webpage`,
        "url": `${baseUrl}/${locale}/news`,
        "name": t("title"),
        "description": t("description"),
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
              "name": locale === 'zh' ? "资讯" : "News",
              "item": `${baseUrl}/${locale}/news`
            }
          ]
        }
      },
      {
        "@type": "CollectionPage",
        "@id": `${baseUrl}/${locale}/news#collection`,
        "name": t("title"),
        "description": t("description"),
        "mainEntity": {
          "@type": "ItemList",
          "name": "Gemini CLI News Articles",
          "description": "Latest news and updates about Gemini CLI"
        },
        "keywords": t("keywords"),
        "inLanguage": locale === 'zh' ? "zh-CN" : "en-US"
      }
    ]
  };

  return (
    <div className="min-h-screen">
      <Script
        id="news-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <Suspense fallback={<NewsSkeleton />}>
        <NewsContent locale={locale} searchParams={search} />
      </Suspense>
    </div>
  );
} 
import { Suspense } from 'react';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import NewsDetailContent from '@/components/blocks/news/detail';

interface NewsDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Helper function to fetch news data for metadata
async function getNewsData(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/api/news/latest`, {
      cache: 'force-cache',
      next: { revalidate: 3600 } // Revalidate every hour
    });
    
    if (!response.ok) {
      return null;
    }
    
    const result = await response.json();
    if (result.status === 'success' && result.data) {
      return result.data.find((item: any) => item.uuid === slug) || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching news for metadata:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const newsData = await getNewsData(slug);
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'https://geminicli.org';
  
  if (newsData) {
    return {
      title: `${newsData.title} - Gemini CLI Hub`,
      description: newsData.description || 'Latest news and updates about Gemini CLI and AI development tools.',
      keywords: newsData.tags?.join(', ') || 'Gemini CLI, AI, CLI Tools, Google AI',
      authors: [{ name: newsData.author_name }],
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
        title: newsData.title,
        description: newsData.description,
        url: `${baseUrl}/${locale}/news/${slug}`,
        siteName: "Gemini CLI Hub",
        type: "article",
        locale: locale,
        publishedTime: typeof newsData.created_at === 'string' 
          ? newsData.created_at 
          : newsData.created_at.toISOString(),
        authors: [newsData.author_name],
        images: [
          {
            url: newsData.cover_url || `${baseUrl}/imgs/placeholder.png`,
            width: 1200,
            height: 630,
            alt: newsData.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: newsData.title,
        description: newsData.description,
        images: [newsData.cover_url || `${baseUrl}/imgs/placeholder.png`],
        creator: `@${newsData.author_name}`,
      },
      alternates: {
        canonical: `${baseUrl}/${locale}/news/${slug}`,
        languages: {
          'en': `${baseUrl}/en/news/${slug}`,
          'zh': `${baseUrl}/zh/news/${slug}`,
        },
      },
      other: {
        'article:section': 'Technology',
        'article:tag': newsData.tags?.join(', ') || 'Gemini CLI, AI, CLI Tools',
        'article:author': newsData.author_name,
        'article:published_time': typeof newsData.created_at === 'string' 
          ? newsData.created_at 
          : newsData.created_at.toISOString(),
        'news_keywords': newsData.tags?.join(', ') || 'Gemini CLI, AI, CLI Tools',
      },
    };
  }

  // Fallback metadata when news data is not available
  return {
    title: `News Article - Gemini CLI Hub`,
    description: 'Latest news and updates about Gemini CLI and AI development tools.',
    keywords: 'Gemini CLI, AI, CLI Tools, Google AI, News',
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: 'News Article - Gemini CLI Hub',
      description: 'Latest news and updates about Gemini CLI and AI development tools.',
      url: `${baseUrl}/${locale}/news/${slug}`,
      siteName: "Gemini CLI Hub",
      type: "article",
      locale: locale,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/news/${slug}`,
    },
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<div>Loading news...</div>}>
      <NewsDetailContent locale={locale} slug={slug} />
    </Suspense>
  );
} 
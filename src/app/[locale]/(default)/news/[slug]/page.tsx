import { Suspense } from 'react';
import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import NewsDetailContent from '@/components/blocks/news/detail';

interface NewsDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  return {
    title: `News Detail - Gemini CLI Hub`,
    description: 'Latest news and updates about Gemini CLI',
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
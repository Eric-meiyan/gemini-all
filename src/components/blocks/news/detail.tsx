"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SafeImage, SafeAvatar } from "@/components/ui/safe-image";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import moment from "moment";
import { TransformedNews } from "@/types/newsapi";
import { useNews } from "@/hooks/use-news";

interface NewsDetailContentProps {
  locale: string;
  slug: string;
}

export default function NewsDetailContent({ locale, slug }: NewsDetailContentProps) {
  const t = useTranslations();
  const [currentNews, setCurrentNews] = useState<TransformedNews | null>(null);
  const [relatedNews, setRelatedNews] = useState<TransformedNews[]>([]);
  const { news, loading, error } = useNews();

  useEffect(() => {
    if (news.length > 0 && slug) {
      // Find the current news item by UUID
      const foundNews = news.find(item => item.uuid === slug);
      if (foundNews) {
        setCurrentNews(foundNews);
        
        // Get related news (same category, excluding current)
        const related = news
          .filter(item => item.uuid !== slug && item.category === foundNews.category)
          .slice(0, 3);
        setRelatedNews(related);
      }
    }
  }, [news, slug]);

  const formatDate = (date: Date | string) => {
    return moment(date).locale(locale).format("MMMM DD, YYYY");
  };

  const getISOString = (date: Date | string): string => {
    if (typeof date === 'string') {
      return new Date(date).toISOString();
    }
    return date.toISOString();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "official": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "community": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "releases": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "tutorials": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "tools": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "blog": return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "official": return "Official";
      case "community": return "Community";
      case "releases": return "Release";
      case "tutorials": return "Tutorial";
      case "tools": return "Tool Review";
      case "blog": return "Blog";
      default: return "News";
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          
          {/* Back Button Skeleton */}
          <Skeleton className="h-10 w-32 mb-6" />
          
          {/* Article Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-10 w-full mb-6" />
            <div className="flex items-center gap-4 mb-6">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="aspect-video w-full mb-6" />
          </div>
          
          {/* Content Skeleton */}
          <div className="space-y-4 mb-12">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          
          {/* Related News Skeleton */}
          <div>
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="grid gap-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="aspect-video w-full mb-3" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Alert variant="destructive" className="mb-6">
            <Icon name="RiErrorWarningLine" className="h-4 w-4" />
            <AlertDescription>
              {error}. <Button variant="link" className="p-0 h-auto" onClick={() => window.location.reload()}>Try again</Button>
            </AlertDescription>
          </Alert>
          
          <Button variant="outline" asChild>
            <Link href="/">
              <Icon name="RiArrowLeftLine" className="h-4 w-4 mr-2" />
              Back to News
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!currentNews) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Alert className="mb-6">
            <Icon name="RiInformationLine" className="h-4 w-4" />
            <AlertDescription>
              News article not found. It may have been removed or the link is invalid.
            </AlertDescription>
          </Alert>
          
          <Button variant="outline" asChild>
            <Link href="/">
              <Icon name="RiArrowLeftLine" className="h-4 w-4 mr-2" />
              Back to News
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-primary">
            {t("nav.news") || "News"}
          </Link>
          <Icon name="RiArrowRightSLine" className="h-4 w-4" />
          <span>{getCategoryLabel(currentNews.category)}</span>
          <Icon name="RiArrowRightSLine" className="h-4 w-4" />
          <span className="truncate max-w-xs">{currentNews.title}</span>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/">
              <Icon name="RiArrowLeftLine" className="h-4 w-4 mr-2" />
              Back to News
            </Link>
          </Button>
        </div>

        {/* Article Header */}
        <article className="mb-12">
          <header className="mb-8">
            {/* Category Badge */}
            <Badge className={`mb-4 ${getCategoryColor(currentNews.category)}`}>
              {getCategoryLabel(currentNews.category)}
            </Badge>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight">
              {currentNews.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex items-center gap-6 mb-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Icon name="RiCalendarLine" className="h-4 w-4" />
                <time dateTime={getISOString(currentNews.created_at)}>
                  {formatDate(currentNews.created_at)}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="RiTimeLine" className="h-4 w-4" />
                <span>{currentNews.reading_time} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="RiEyeLine" className="h-4 w-4" />
                <span>{Math.floor(Math.random() * 5000) + 500} views</span>
              </div>
            </div>
            
            {/* Author Information */}
            <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <SafeAvatar
                src={currentNews.author_avatar_url}
                alt={currentNews.author_name}
                className="w-12 h-12"
                size="lg"
              />
              <div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {currentNews.author_name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {currentNews.source_name}
                </div>
              </div>
            </div>
            
            {/* Featured Image */}
            <div className="aspect-video rounded-lg overflow-hidden mb-8">
              <SafeImage
                src={currentNews.cover_url}
                alt={currentNews.title}
                className="w-full h-full object-cover"
              />
            </div>
          </header>

          {/* Article Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              {currentNews.description}
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 p-6 my-8">
              <div className="flex items-start gap-3">
                <Icon name="RiInformationLine" className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Read the Full Article
                  </h3>
                  <p className="text-blue-800 dark:text-blue-200 mb-4">
                    This is a summary of the original article. Click the button below to read the complete story on the publisher's website.
                  </p>
                  <Button asChild>
                    <a href={currentNews.source_url} target="_blank" rel="noopener noreferrer">
                      <Icon name="RiExternalLinkLine" className="h-4 w-4 mr-2" />
                      Read Original Article
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {currentNews.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {currentNews.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedNews.map((newsItem) => (
                <Card key={newsItem.uuid} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                  <Link href={`/news/${newsItem.uuid}`}>
                    <div className="aspect-video relative overflow-hidden">
                      <SafeImage
                        src={newsItem.cover_url}
                        alt={newsItem.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <Badge className={`absolute top-3 left-3 text-xs ${getCategoryColor(newsItem.category)}`}>
                        {getCategoryLabel(newsItem.category)}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {newsItem.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                        {newsItem.description}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <time dateTime={getISOString(newsItem.created_at)}>
                          {formatDate(newsItem.created_at)}
                        </time>
                        <span className="mx-2">•</span>
                        <span>{newsItem.reading_time} min read</span>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
} 
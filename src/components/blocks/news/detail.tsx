"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import moment from "moment";
import { TransformedNews } from "@/types/newsapi";

interface NewsDetailContentProps {
  locale: string;
  slug: string;
}

export default function NewsDetailContent({ locale, slug }: NewsDetailContentProps) {
  const t = useTranslations();
  const [news, setNews] = useState<TransformedNews | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Since we're dealing with external news, we'll redirect to the source URL
    // In a real implementation, you might want to store news content in your database
    if (slug) {
      // For now, we'll redirect to the news page as we don't have stored news details
      window.location.href = '/news';
    }
  }, [slug]);

  const formatDate = (date: Date) => {
    return moment(date).locale(locale).format("MMM DD, YYYY");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "official": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "community": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "releases": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "tutorials": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div>
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="aspect-video w-full mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link href="/news" className="hover:text-primary">
            {t("nav.news")}
          </Link>
          <Icon name="RiArrowRightSLine" className="h-4 w-4" />
          <span>News Detail</span>
        </nav>

        {/* Info Message */}
        <Alert className="mb-6">
          <Icon name="RiInformationLine" className="h-4 w-4" />
          <AlertDescription>
            This feature redirects to external news sources. For the full article, you'll be taken to the original publisher's website.
          </AlertDescription>
        </Alert>

        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/news">
              <Icon name="RiArrowLeftLine" className="h-4 w-4 mr-2" />
              Back to News
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 
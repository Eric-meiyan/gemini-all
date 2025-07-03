"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import moment from "moment";
import { useNews } from "@/hooks/use-news";
import { TransformedNews } from "@/types/newsapi";
import { SafeImage, SafeAvatar } from "@/components/ui/safe-image";

interface NewsContentProps {
  locale: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function NewsContent({ locale, searchParams }: NewsContentProps) {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState((searchParams.q as string) || "");
  const [selectedCategory, setSelectedCategory] = useState((searchParams.category as string) || "all");
  const [sortBy, setSortBy] = useState((searchParams.sort as string) || "latest");
  const [filteredNews, setFilteredNews] = useState<TransformedNews[]>([]);
  
  // Fetch news data with refresh every 30 minutes
  const { news, loading, error, refresh } = useNews({ 
    refreshInterval: 30 * 60 * 1000 // 30 minutes
  });

  const categories = [
    { value: "all", label: t("common.all") },
    { value: "official", label: t("news.categories.official") },
    { value: "community", label: t("news.categories.community") },
    { value: "releases", label: t("news.categories.releases") },
    { value: "tutorials", label: t("news.categories.tutorials") }
  ];

  useEffect(() => {
    let filtered = news;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((newsItem: TransformedNews) => 
        newsItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        newsItem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        newsItem.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((newsItem: TransformedNews) => newsItem.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "latest":
        filtered.sort((a: TransformedNews, b: TransformedNews) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "popular":
        // Would sort by view_count in real implementation
        break;
      case "alphabetical":
        filtered.sort((a: TransformedNews, b: TransformedNews) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredNews(filtered);
  }, [searchQuery, selectedCategory, sortBy, news]);

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

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          {t("news.title")}
          {!loading && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refresh}
              className="ml-4"
            >
              <Icon name="RiRefreshLine" className="h-4 w-4" />
            </Button>
          )}
        </h1>
        <p className="text-muted-foreground text-lg">{t("news.description")}</p>
        
        {/* Error Alert */}
        {error && (
          <Alert className="mt-4" variant="destructive">
            <Icon name="RiErrorWarningLine" className="h-4 w-4" />
            <AlertDescription>
              {error}. <Button variant="link" onClick={refresh} className="p-0 h-auto">Try again</Button>
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Icon name="RiSearchLine" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("common.search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder={t("common.categories")} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">{t("common.latest")}</SelectItem>
            <SelectItem value="popular">{t("common.popular")}</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-8">
          <div>
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4 mb-4" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div>
                          <Skeleton className="h-4 w-20 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div>
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-video w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3 mb-4" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <div>
                          <Skeleton className="h-3 w-16 mb-1" />
                          <Skeleton className="h-3 w-12" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-6" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Featured News */}
      {!loading && filteredNews.some(news => news.featured) && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("common.featured")}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {filteredNews.filter(news => news.featured).map((news) => (
              <Card key={news.uuid} className="overflow-hidden">
                <div className="aspect-video relative">
                  <SafeImage 
                    src={news.cover_url} 
                    alt={news.title}
                    className="w-full h-full"
                  />
                  <Badge className={`absolute top-4 left-4 ${getCategoryColor(news.category)}`}>
                    {t(`news.categories.${news.category}`)}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
                  <p className="text-muted-foreground mb-4">{news.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <SafeAvatar 
                        src={news.author_avatar_url} 
                        alt={news.author_name}
                        size="md"
                      />
                      <div className="text-sm">
                        <p className="font-medium">{news.author_name}</p>
                        <p className="text-muted-foreground">{formatDate(news.created_at)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {news.reading_time} {t("common.reading_time")}
                      </span>
                      <Button variant="outline" size="sm" asChild>
                        <a href={news.source_url} target="_blank" rel="noopener noreferrer">
                          {t("common.read_more")}
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All News */}
      {!loading && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("common.latest")}</h2>
          
          {filteredNews.length === 0 && !error ? (
            <div className="text-center py-12">
              <Icon name="RiNewspaperLine" className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">No news found</p>
              <p className="text-muted-foreground">Try adjusting your search or category filters</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredNews.map((news) => (
            <Card key={news.uuid} className="overflow-hidden">
              <div className="aspect-video relative">
                <SafeImage 
                  src={news.cover_url} 
                  alt={news.title}
                  className="w-full h-full"
                />
                <Badge className={`absolute top-4 left-4 ${getCategoryColor(news.category)}`}>
                  {t(`news.categories.${news.category}`)}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">{news.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{news.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SafeAvatar 
                      src={news.author_avatar_url} 
                      alt={news.author_name}
                      size="sm"
                    />
                    <div className="text-xs">
                      <p className="font-medium">{news.author_name}</p>
                      <p className="text-muted-foreground">{formatDate(news.created_at)}</p>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" asChild>
                    <a href={news.source_url} target="_blank" rel="noopener noreferrer">
                      <Icon name="RiArrowRightLine" className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <Icon name="RiArrowLeftLine" className="h-4 w-4" />
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="RiArrowRightLine" className="h-4 w-4" />
            Next
          </Button>
        </div>
      </div>
    </div>
  );
} 
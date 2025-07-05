"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import { useNews } from "@/hooks/use-news";
import { TransformedNews } from "@/types/newsapi";
import NewsCard from "@/components/blocks/news/card";

interface ToolsContentProps {
  locale: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ToolsContent({ locale, searchParams }: ToolsContentProps) {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState((searchParams.q as string) || "");
  const [sortBy, setSortBy] = useState((searchParams.sort as string) || "latest");
  const [filteredNews, setFilteredNews] = useState<TransformedNews[]>([]);
  
  // Fetch news data with refresh every 30 minutes
  const { news, loading, error, refresh } = useNews({ 
    refreshInterval: 30 * 60 * 1000 // 30 minutes
  });

  useEffect(() => {
    // Filter only tools-related news first
    let filtered = news.filter(item => item.category === "tools");

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((newsItem: TransformedNews) => 
        newsItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        newsItem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        newsItem.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort
    switch (sortBy) {
      case "latest":
        filtered.sort((a: TransformedNews, b: TransformedNews) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "popular":
        // Would sort by view_count in real implementation
        break;
      case "alphabetical":
        filtered.sort((a: TransformedNews, b: TransformedNews) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredNews(filtered);
  }, [searchQuery, sortBy, news]);

  // Loading skeleton
  if (loading) {
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
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-6">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert variant="destructive" className="mb-8">
            <Icon name="RiErrorWarningLine" className="h-4 w-4" />
            <AlertDescription>
              {error}. <Button variant="link" onClick={refresh} className="p-0 h-auto">Try again</Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="RiToolsLine" className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Tool Reviews & Experiences
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            Discover productivity tools, read in-depth reviews, and learn from the experiences of other developers using Gemini CLI and related tools.
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icon name="RiSearchLine" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tool reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest Reviews</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="alphabetical">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Results Count */}
        {filteredNews.length > 0 && (
          <div className="mb-6 text-sm text-gray-600">
            Found {filteredNews.length} tool review{filteredNews.length !== 1 ? 's' : ''}
          </div>
        )}

        {/* Featured Tools Section */}
        {filteredNews.length > 0 && sortBy === "latest" && !searchQuery && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Icon name="RiStarLine" className="h-6 w-6 text-yellow-500" />
              Featured Tool Reviews
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {filteredNews.slice(0, 2).map((newsItem) => (
                <NewsCard
                  key={newsItem.uuid}
                  news={newsItem}
                  locale={locale}
                  variant="featured"
                />
              ))}
            </div>
          </div>
        )}

        {/* All Tools Grid */}
        {filteredNews.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Icon name="RiGridLine" className="h-6 w-6 text-blue-600" />
              {searchQuery ? "Search Results" : "All Tool Reviews"}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredNews.slice(searchQuery || sortBy !== "latest" ? 0 : 2).map((newsItem) => (
                <NewsCard
                  key={newsItem.uuid}
                  news={newsItem}
                  locale={locale}
                  variant="default"
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon name="RiSearchEyeLine" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchQuery ? "No tool reviews found" : "No tool reviews available"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? "Try adjusting your search terms or check back later for new content."
                : "Check back soon for tool reviews and experiences from the community."
              }
            </p>
            {searchQuery && (
              <Button 
                onClick={() => setSearchQuery("")}
                variant="outline"
                className="mr-4"
              >
                Clear Search
              </Button>
            )}
            <Link href="/news">
              <Button>
                <Icon name="RiArrowLeftLine" className="mr-2 h-4 w-4" />
                Back to News
              </Button>
            </Link>
          </div>
        )}

        {/* CTA Section */}
        {filteredNews.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Share Your Tool Experience</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Have you used Gemini CLI or related tools? Share your experience and help other developers make informed decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                <Icon name="RiEditLine" className="mr-2 h-4 w-4" />
                Write a Review
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <Icon name="RiCommunityLine" className="mr-2 h-4 w-4" />
                Join Community
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

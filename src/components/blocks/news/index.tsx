"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import { useNews } from "@/hooks/use-news";
import { TransformedNews } from "@/types/newsapi";
import HeroBanner from "@/components/blocks/hero-banner";
import NewsCard from "@/components/blocks/news/card";

interface NewsContentProps {
  locale: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function NewsContent({ locale, searchParams }: NewsContentProps) {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState((searchParams.q as string) || "");
  const [filteredNews, setFilteredNews] = useState<TransformedNews[]>([]);
  
  // Fetch news data with refresh every 30 minutes
  const { news, loading, error, refresh } = useNews({ 
    refreshInterval: 30 * 60 * 1000 // 30 minutes
  });

  // Filter news by category
  const latestNews = news.filter(item => 
    item.category === "official" || item.category === "community" || item.category === "releases"
  );
  const toolReviews = news.filter(item => item.category === "tools");
  const developerBlogs = news.filter(item => item.category === "blog" || item.category === "tutorials");

  // Get featured news for banner
  const featuredNews = news.find(item => item.featured) || news[0];

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

    setFilteredNews(filtered);
  }, [searchQuery, news]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Banner Skeleton */}
          <div className="mb-12">
            <Skeleton className="w-full h-96 rounded-xl" />
          </div>
          
          {/* Content Skeleton */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-3/4">
              <div className="mb-10">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="grid md:grid-cols-2 gap-6">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <Skeleton className="w-full h-48" />
                      <div className="p-5">
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-4 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:w-1/4">
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
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
        {/* Hero Banner */}
        {featuredNews && (
          <HeroBanner news={featuredNews} locale={locale} />
        )}

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content Area */}
          <div className="lg:w-3/4">
            {/* Latest News Section */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
                <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  View All
                  <Icon name="RiArrowRightSLine" className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {latestNews.slice(0, 4).map((newsItem) => (
                  <NewsCard
                    key={newsItem.uuid}
                    news={newsItem}
                    locale={locale}
                    variant="default"
                  />
                ))}
              </div>
            </div>

            {/* Tool Reviews Section */}
            <div className="mb-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Popular Tool Reviews</h2>
                <Link href="/tools" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  View All
                  <Icon name="RiArrowRightSLine" className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {toolReviews.slice(0, 2).map((newsItem) => (
                  <NewsCard
                    key={newsItem.uuid}
                    news={newsItem}
                    locale={locale}
                    variant="featured"
                  />
                ))}
              </div>
            </div>

            {/* Developer Blogs Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Featured Developer Blogs</h2>
                <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                  View All
                  <Icon name="RiArrowRightSLine" className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {developerBlogs.slice(0, 3).map((newsItem) => (
                  <NewsCard
                    key={newsItem.uuid}
                    news={newsItem}
                    locale={locale}
                    variant="default"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-20 space-y-6">
              {/* Search Box */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Search News</h3>
                <div className="relative">
                  <Input
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Icon name="RiSearchLine" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                </div>
              </div>

              {/* Popular Tags */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['Gemini CLI', 'AI Programming', 'Productivity Tools', 'Code Generation', 'Google', 'Command Line', 'Automation', 'Plugin Development', 'Tutorials', 'Best Practices'].map((tag, index) => (
                    <button
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full hover:bg-blue-100 transition-colors duration-200"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>



              {/* Latest Discussions */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Latest Discussions</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((topic) => (
                    <div key={topic} className="block hover:bg-gray-50 -mx-3 px-3 py-2 rounded-lg cursor-pointer">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        Can Gemini CLI Completely Replace Traditional Code Editors?
                      </h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>42 replies</span>
                        <span className="mx-2">•</span>
                        <span>2 hours ago</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Announcements */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Community Announcements</h3>
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <h4 className="text-sm font-medium text-white mb-2">
                    Gemini CLI Online Sharing Session
                  </h4>
                  <p className="text-xs text-blue-100 mb-3">
                    Google engineers will share Gemini CLI's internal design philosophy and future plans
                  </p>
                  <div className="flex items-center text-xs text-blue-200">
                    <Icon name="RiCalendarLine" className="mr-1 h-3 w-3" />
                    <span>July 15, 2025 20:00</span>
                  </div>
                </div>
                <Button className="w-full bg-white text-blue-700 hover:bg-blue-50">
                  View All Announcements
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import { useNews } from "@/hooks/use-news";
import { TransformedNews } from "@/types/newsapi";
import NewsCard from "@/components/blocks/news/card";

interface SearchContentProps {
  locale: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SearchContent({ locale, searchParams }: SearchContentProps) {
  const t = useTranslations();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState((searchParams.q as string) || "");
  const [sortBy, setSortBy] = useState((searchParams.sort as string) || "relevance");
  const [category, setCategory] = useState((searchParams.category as string) || "all");
  const [activeTab, setActiveTab] = useState((searchParams.tab as string) || "all");
  const [filteredNews, setFilteredNews] = useState<TransformedNews[]>([]);
  const [searchResults, setSearchResults] = useState<{
    all: TransformedNews[];
    news: TransformedNews[];
    tools: TransformedNews[];
    blog: TransformedNews[];
  }>({
    all: [],
    news: [],
    tools: [],
    blog: []
  });
  
  // Fetch news data
  const { news, loading, error, refresh } = useNews({ 
    refreshInterval: 30 * 60 * 1000 // 30 minutes
  });

  // Search and filter logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNews([]);
      setSearchResults({ all: [], news: [], tools: [], blog: [] });
      return;
    }

    const query = searchQuery.toLowerCase();
    
    // Filter by search query
    const filtered = news.filter((newsItem: TransformedNews) => 
      newsItem.title.toLowerCase().includes(query) ||
      newsItem.description.toLowerCase().includes(query) ||
      newsItem.tags.some((tag: string) => tag.toLowerCase().includes(query)) ||
      newsItem.author_name.toLowerCase().includes(query)
    );

    // Categorize results
    const categorizedResults = {
      all: filtered,
      news: filtered.filter(item => 
        item.category === "official" || 
        item.category === "community" || 
        item.category === "releases" || 
        item.category === "tutorials"
      ),
      tools: filtered.filter(item => item.category === "tools"),
      blog: filtered.filter(item => item.category === "blog")
    };

    // Sort results
    const sortResults = (items: TransformedNews[]) => {
      switch (sortBy) {
        case "relevance":
          // Simple relevance scoring based on title match
          return items.sort((a, b) => {
            const aScore = a.title.toLowerCase().includes(query) ? 2 : 0;
            const bScore = b.title.toLowerCase().includes(query) ? 2 : 0;
            return bScore - aScore;
          });
        case "latest":
          return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        case "oldest":
          return items.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        case "alphabetical":
          return items.sort((a, b) => a.title.localeCompare(b.title));
        default:
          return items;
      }
    };

    const sortedResults = {
      all: sortResults([...categorizedResults.all]),
      news: sortResults([...categorizedResults.news]),
      tools: sortResults([...categorizedResults.tools]),
      blog: sortResults([...categorizedResults.blog])
    };

    setSearchResults(sortedResults);
    setFilteredNews(sortedResults[activeTab as keyof typeof sortedResults] || sortedResults.all);
  }, [searchQuery, sortBy, activeTab, news]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      if (sortBy !== 'relevance') params.set('sort', sortBy);
      if (activeTab !== 'all') params.set('tab', activeTab);
      router.push(`/search?${params.toString()}`);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setFilteredNews([]);
    setSearchResults({ all: [], news: [], tools: [], blog: [] });
    router.push('/search');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Skeleton className="h-10 w-64 mb-4" />
            <Skeleton className="h-5 w-96 mb-8" />
            <div className="flex gap-4 mb-8">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-32" />
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
            <Icon name="RiSearchLine" className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Search"}
            </h1>
          </div>
          
          {searchQuery && (
            <p className="text-lg text-gray-600 mb-6">
              Found {searchResults.all.length} result{searchResults.all.length !== 1 ? 's' : ''} across all content
            </p>
          )}

          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Icon name="RiSearchLine" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search news, tools, blog posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" disabled={!searchQuery.trim()}>
              Search
            </Button>
            {searchQuery && (
              <Button type="button" variant="outline" onClick={handleClearSearch}>
                Clear
              </Button>
            )}
          </form>

          {/* Sort Options */}
          {searchQuery && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </header>

        {/* Search Results */}
        {searchQuery ? (
          <div>
            {searchResults.all.length > 0 ? (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="all" className="flex items-center gap-2">
                    <Icon name="RiGlobalLine" className="h-4 w-4" />
                    All ({searchResults.all.length})
                  </TabsTrigger>
                  <TabsTrigger value="news" className="flex items-center gap-2">
                    <Icon name="RiNewspaperLine" className="h-4 w-4" />
                    News ({searchResults.news.length})
                  </TabsTrigger>
                  <TabsTrigger value="tools" className="flex items-center gap-2">
                    <Icon name="RiToolsLine" className="h-4 w-4" />
                    Tools ({searchResults.tools.length})
                  </TabsTrigger>
                  <TabsTrigger value="blog" className="flex items-center gap-2">
                    <Icon name="RiFileTextLine" className="h-4 w-4" />
                    Blog ({searchResults.blog.length})
                  </TabsTrigger>
                </TabsList>

                {(['all', 'news', 'tools', 'blog'] as const).map((tab) => (
                  <TabsContent key={tab} value={tab}>
                    {searchResults[tab].length > 0 ? (
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {searchResults[tab].map((newsItem) => (
                          <NewsCard
                            key={newsItem.uuid}
                            news={newsItem}
                            locale={locale}
                            variant="default"
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Icon name="RiSearchEyeLine" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                          No {tab === 'all' ? 'results' : tab} found
                        </h3>
                        <p className="text-gray-500">
                          Try adjusting your search terms or check other categories.
                        </p>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <div className="text-center py-12">
                <Icon name="RiSearchEyeLine" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No results found for "{searchQuery}"
                </h3>
                <p className="text-gray-500 mb-6">
                  Try different keywords or check your spelling.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleClearSearch} variant="outline">
                    Clear Search
                  </Button>
                  <Link href="/">
                    <Button>
                      <Icon name="RiNewspaperLine" className="mr-2 h-4 w-4" />
                      Browse All News
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <Icon name="RiSearchLine" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Search Gemini CLI Hub
            </h3>
            <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
              Find news, tool reviews, blog posts, and more. Use the search box above to discover relevant content across our entire platform.
            </p>
            
            {/* Popular Search Suggestions */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Popular Searches</h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "Gemini API",
                  "CLI tools",
                  "productivity",
                  "automation",
                  "development",
                  "plugins",
                  "tutorials",
                  "workflow"
                ].map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-blue-100 text-gray-600"
                    onClick={() => {
                      setSearchQuery(tag);
                      const params = new URLSearchParams();
                      params.set('q', tag);
                      router.push(`/search?${params.toString()}`);
                    }}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                              <Link href="/" className="group">
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <Icon name="RiNewspaperLine" className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">News Center</h4>
                  <p className="text-sm text-gray-600">Latest Gemini CLI news and updates</p>
                </div>
              </Link>
              
              <Link href="/tools" className="group">
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <Icon name="RiToolsLine" className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Tool Reviews</h4>
                  <p className="text-sm text-gray-600">Productivity tools and experiences</p>
                </div>
              </Link>
              
              <Link href="/blog" className="group">
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <Icon name="RiFileTextLine" className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Developer Blog</h4>
                  <p className="text-sm text-gray-600">Technical articles and tutorials</p>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
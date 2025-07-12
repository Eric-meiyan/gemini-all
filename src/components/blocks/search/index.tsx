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
import SearchResultCard from "@/components/blocks/search-result-card";
import { 
  searchAll, 
  SearchResult, 
  SearchOptions,
  getPopularSearchTerms,
  getSearchHistory,
  saveSearchHistory,
  clearSearchHistory
} from "@/services/search";

interface SearchContentProps {
  locale: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function SearchContent({ locale, searchParams }: SearchContentProps) {
  const t = useTranslations();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState((searchParams.q as string) || "");
  const [sortBy, setSortBy] = useState((searchParams.sort as string) || "relevance");
  const [typeFilter, setTypeFilter] = useState((searchParams.type as string) || "all");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Fetch news data for search
  const { news, loading: newsLoading, error } = useNews({ 
    refreshInterval: 30 * 60 * 1000 // 30 minutes
  });

  // Load search history on mount
  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  // Perform search
  const performSearch = async (query: string, options: Partial<SearchOptions> = {}) => {
    if (!query.trim()) {
      setSearchResults([]);
      setTotalResults(0);
      setHasMore(false);
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const searchOptions: SearchOptions = {
        query,
        type: typeFilter as any,
        sortBy: sortBy as any,
        limit: 20,
        offset: 0,
        ...options
      };

      const response = await searchAll(searchOptions, news, locale);
      setSearchResults(response.results);
      setTotalResults(response.total);
      setHasMore(response.hasMore);
      setSuggestions(response.suggestions || []);
      
      // Save to search history
      if (query.trim()) {
        saveSearchHistory(query);
        setSearchHistory(getSearchHistory());
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setTotalResults(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Search when query, filter, or sort changes
  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
      setTotalResults(0);
      setHasMore(false);
      setSuggestions([]);
    }
  }, [searchQuery, sortBy, typeFilter, news]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      if (sortBy !== 'relevance') params.set('sort', sortBy);
      if (typeFilter !== 'all') params.set('type', typeFilter);
      router.push(`/search?${params.toString()}`);
      setShowSuggestions(false);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setTotalResults(0);
    setHasMore(false);
    setSuggestions([]);
    setShowSuggestions(false);
    router.push('/search');
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    const params = new URLSearchParams();
    params.set('q', suggestion);
    router.push(`/search?${params.toString()}`);
  };

  // Group results by type
  const groupedResults = {
    all: searchResults,
    news: searchResults.filter(r => r.type === 'news'),
    tools: searchResults.filter(r => r.type === 'tools'),
    faq: searchResults.filter(r => r.type === 'faq'),
    github: searchResults.filter(r => r.type === 'github'),
    blog: searchResults.filter(r => r.type === 'blog')
  };

  // Filter options
  const typeOptions = [
    { value: "all", label: locale === 'zh' ? "全部内容" : "All Content", icon: "RiGlobalLine" },
    { value: "news", label: locale === 'zh' ? "新闻" : "News", icon: "RiNewspaperLine" },
    { value: "tools", label: locale === 'zh' ? "工具" : "Tools", icon: "RiToolsLine" },
    { value: "faq", label: locale === 'zh' ? "问答" : "FAQ", icon: "RiQuestionAnswerLine" },
    { value: "github", label: locale === 'zh' ? "开源项目" : "GitHub", icon: "RiGithubLine" },
    { value: "blog", label: locale === 'zh' ? "博客" : "Blog", icon: "RiFileTextLine" }
  ];

  const sortOptions = [
    { value: "relevance", label: locale === 'zh' ? "相关性" : "Relevance" },
    { value: "latest", label: locale === 'zh' ? "最新" : "Latest" },
    { value: "oldest", label: locale === 'zh' ? "最早" : "Oldest" },
    { value: "rating", label: locale === 'zh' ? "评分" : "Rating" },
    { value: "alphabetical", label: locale === 'zh' ? "字母顺序" : "A-Z" }
  ];

  // Loading state
  if (newsLoading) {
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
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <Skeleton className="w-full h-32" />
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
              {error}. <Button variant="link" onClick={() => window.location.reload()} className="p-0 h-auto">
                {locale === 'zh' ? '重试' : 'Try again'}
              </Button>
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
              {searchQuery ? 
                (locale === 'zh' ? `"${searchQuery}" 的搜索结果` : `Search Results for "${searchQuery}"`) :
                (locale === 'zh' ? '全站搜索' : 'Site Search')
              }
            </h1>
          </div>
          
          {searchQuery && (
            <p className="text-lg text-gray-600 mb-6">
              {locale === 'zh' ? 
                `找到 ${totalResults} 个结果` : 
                `Found ${totalResults} result${totalResults !== 1 ? 's' : ''}`
              }
            </p>
          )}

          {/* Search Form */}
          <div className="relative">
            <form onSubmit={handleSearch} className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Icon name="RiSearchLine" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={locale === 'zh' ? 
                    "搜索新闻、工具、问答、开源项目..." :
                    "Search news, tools, FAQ, GitHub projects..."
                  }
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={!searchQuery.trim()}>
                {locale === 'zh' ? '搜索' : 'Search'}
              </Button>
              {searchQuery && (
                <Button type="button" variant="outline" onClick={handleClearSearch}>
                  {locale === 'zh' ? '清除' : 'Clear'}
                </Button>
              )}
            </form>

            {/* Search Suggestions */}
            {showSuggestions && (searchHistory.length > 0 || suggestions.length > 0) && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                {searchHistory.length > 0 && (
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        {locale === 'zh' ? '搜索历史' : 'Search History'}
                      </h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          clearSearchHistory();
                          setSearchHistory([]);
                        }}
                        className="text-xs"
                      >
                        {locale === 'zh' ? '清除' : 'Clear'}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {searchHistory.slice(0, 5).map((item, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-blue-100"
                          onClick={() => handleSuggestionClick(item)}
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {suggestions.length > 0 && (
                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {locale === 'zh' ? '相关建议' : 'Suggestions'}
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-50"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Filters */}
          {searchQuery && (
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {locale === 'zh' ? '筛选条件：' : 'Filters:'}
              </span>
              <div className="flex gap-4 flex-wrap">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={locale === 'zh' ? '内容类型' : 'Content Type'} />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <Icon name={option.icon} className="h-4 w-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={locale === 'zh' ? '排序方式' : 'Sort By'} />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </header>

        {/* Search Results */}
        {searchQuery ? (
          <div>
            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <Skeleton className="w-16 h-16 rounded-xl" />
                        <div className="flex-1">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-full mb-2" />
                          <Skeleton className="h-4 w-2/3" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchResults.length > 0 ? (
              <Tabs value={typeFilter} onValueChange={setTypeFilter}>
                <TabsList className="grid w-full grid-cols-6 mb-8">
                  {typeOptions.map(option => (
                    <TabsTrigger key={option.value} value={option.value} className="flex items-center gap-2">
                      <Icon name={option.icon} className="h-4 w-4" />
                      <span className="hidden sm:inline">{option.label}</span>
                      <span className="sm:hidden">{option.label.split(' ')[0]}</span>
                      ({groupedResults[option.value as keyof typeof groupedResults].length})
                    </TabsTrigger>
                  ))}
                </TabsList>

                {typeOptions.map(option => (
                  <TabsContent key={option.value} value={option.value}>
                    {groupedResults[option.value as keyof typeof groupedResults].length > 0 ? (
                      <div className="space-y-6">
                        {groupedResults[option.value as keyof typeof groupedResults].map((result) => (
                          <SearchResultCard
                            key={`${result.type}-${result.id}`}
                            result={result}
                            locale={locale}
                            variant="default"
                            showType={option.value === 'all'}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Icon name="RiSearchEyeLine" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">
                          {locale === 'zh' ? 
                            `没有找到${option.label}内容` :
                            `No ${option.label.toLowerCase()} found`
                          }
                        </h3>
                        <p className="text-gray-500">
                          {locale === 'zh' ? 
                            '尝试调整搜索条件或查看其他类别。' :
                            'Try adjusting your search terms or check other categories.'
                          }
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
                  {locale === 'zh' ? 
                    `没有找到 "${searchQuery}" 的结果` :
                    `No results found for "${searchQuery}"`
                  }
                </h3>
                <p className="text-gray-500 mb-6">
                  {locale === 'zh' ? 
                    '尝试使用不同的关键词或检查拼写。' :
                    'Try different keywords or check your spelling.'
                  }
                </p>
                
                {suggestions.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      {locale === 'zh' ? '试试这些相关搜索：' : 'Try these related searches:'}
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-blue-50"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleClearSearch} variant="outline">
                    {locale === 'zh' ? '清除搜索' : 'Clear Search'}
                  </Button>
                  <Link href="/">
                    <Button>
                      <Icon name="RiHomeLine" className="mr-2 h-4 w-4" />
                      {locale === 'zh' ? '返回首页' : 'Back to Home'}
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
              {locale === 'zh' ? 'Gemini CLI Hub 全站搜索' : 'Search Gemini CLI Hub'}
            </h3>
            <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
              {locale === 'zh' ? 
                '搜索新闻、工具评测、FAQ问答、开源项目等内容。使用上方搜索框发现相关内容。' :
                'Find news, tool reviews, FAQ, GitHub projects and more. Use the search box above to discover relevant content across our platform.'
              }
            </p>
            
            {/* Popular Search Suggestions */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">
                {locale === 'zh' ? '热门搜索' : 'Popular Searches'}
              </h4>
              <div className="flex flex-wrap gap-2 justify-center">
                {getPopularSearchTerms(locale).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer hover:bg-blue-100 text-gray-600"
                    onClick={() => handleSuggestionClick(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quick Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <Link href="/" className="group">
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <Icon name="RiNewspaperLine" className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {locale === 'zh' ? '新闻中心' : 'News Center'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {locale === 'zh' ? '最新的 Gemini CLI 新闻和更新' : 'Latest Gemini CLI news and updates'}
                  </p>
                </div>
              </Link>
              
              <Link href="/tools" className="group">
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <Icon name="RiToolsLine" className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {locale === 'zh' ? '工具评测' : 'Tool Reviews'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {locale === 'zh' ? '生产力工具和使用体验' : 'Productivity tools and experiences'}
                  </p>
                </div>
              </Link>
              
              <Link href="/blog" className="group">
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <Icon name="RiFileTextLine" className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {locale === 'zh' ? '开发者博客' : 'Developer Blog'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {locale === 'zh' ? '技术文章和教程' : 'Technical articles and tutorials'}
                  </p>
                </div>
              </Link>

              <div className="group cursor-pointer" onClick={() => handleSuggestionClick('FAQ')}>
                <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <Icon name="RiQuestionAnswerLine" className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {locale === 'zh' ? '常见问题' : 'FAQ'}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {locale === 'zh' ? '使用帮助和问题解答' : 'Help documentation and Q&A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
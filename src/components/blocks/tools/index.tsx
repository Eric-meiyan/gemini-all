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
import ToolCard from "@/components/blocks/tool-card";
import { ToolReview } from "@/types/tools";
import { getTools, getFeaturedTools, searchTools, toolCategories, sortOptions } from "@/services/tools";

interface ToolsContentProps {
  locale: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ToolsContent({ locale, searchParams }: ToolsContentProps) {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState((searchParams.q as string) || "");
  const [category, setCategory] = useState((searchParams.category as string) || "all");
  const [sortBy, setSortBy] = useState((searchParams.sort as string) || "rating");
  const [tools, setTools] = useState<ToolReview[]>([]);
  const [featuredTools, setFeaturedTools] = useState<ToolReview[]>([]);
  const [filteredTools, setFilteredTools] = useState<ToolReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tools data
  useEffect(() => {
    const loadTools = async () => {
      try {
        setLoading(true);
        const [allTools, featured] = await Promise.all([
          getTools(),
          getFeaturedTools()
        ]);
        setTools(allTools);
        setFeaturedTools(featured);
        setError(null);
      } catch (err) {
        setError("Failed to load tools data");
        console.error("Error loading tools:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTools();
  }, []);

  // Filter and sort tools
  useEffect(() => {
    let filtered = tools;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tool.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase())) ||
        tool.developer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter(tool => tool.category === category);
    }

    // Sort tools
    switch (sortBy) {
      case "rating":
        filtered.sort((a, b) => b.overallRating - a.overallRating);
        break;
      case "reviews":
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "latest":
        filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-free":
        filtered.sort((a, b) => {
          const aScore = a.price === "free" ? 3 : a.price === "freemium" ? 2 : 1;
          const bScore = b.price === "free" ? 3 : b.price === "freemium" ? 2 : 1;
          return bScore - aScore;
        });
        break;
    }

    setFilteredTools(filtered);
  }, [searchQuery, category, sortBy, tools]);

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
              <Skeleton className="h-10 w-48" />
            </div>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Skeleton className="w-16 h-16 rounded-xl" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
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
              {error}. <Button variant="link" onClick={() => window.location.reload()} className="p-0 h-auto">Try again</Button>
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
              {locale === 'zh' ? 'AI 工具评测中心' : 'AI Tools & Reviews'}
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            {locale === 'zh' 
              ? '发现最优秀的AI开发工具，查看详细评测，找到最适合你的开发伙伴。'
              : 'Discover the best AI development tools with comprehensive reviews, ratings, and real user experiences.'
            }
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icon name="RiSearchLine" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={locale === 'zh' ? '搜索AI工具...' : 'Search AI tools...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {toolCategories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Sort by" />
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
        </header>

        {/* Results Count */}
        {!searchQuery && !category && (
          <div className="mb-6 text-sm text-gray-600">
            Showing {filteredTools.length} AI development tools
          </div>
        )}

        {(searchQuery || category !== "all") && (
          <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
            <span>Found {filteredTools.length} tool{filteredTools.length !== 1 ? 's' : ''}</span>
            {(searchQuery || category !== "all") && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setCategory("all");
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}

        {/* Featured Tools Section */}
        {featuredTools.length > 0 && !searchQuery && category === "all" && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Icon name="RiStarFill" className="h-6 w-6 text-yellow-500" />
              {locale === 'zh' ? '精选工具推荐' : 'Featured Tools'}
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredTools.slice(0, 2).map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  locale={locale}
                  variant="featured"
                />
              ))}
            </div>
          </div>
        )}

        {/* All Tools Grid */}
        {filteredTools.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Icon name="RiGridLine" className="h-6 w-6 text-blue-600" />
              {searchQuery ? 
                (locale === 'zh' ? '搜索结果' : 'Search Results') : 
                (locale === 'zh' ? '所有工具' : 'All Tools')
              }
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
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
              {searchQuery ? 
                (locale === 'zh' ? '未找到相关工具' : 'No tools found') : 
                (locale === 'zh' ? '暂无工具数据' : 'No tools available')
              }
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? (locale === 'zh' ? '尝试调整搜索条件或稍后再试。' : 'Try adjusting your search terms or check back later.')
                : (locale === 'zh' ? '工具评测数据即将上线，敬请期待。' : 'Tool reviews and data will be available soon.')
              }
            </p>
            {searchQuery && (
              <Button 
                onClick={() => setSearchQuery("")}
                variant="outline"
                className="mr-4"
              >
                {locale === 'zh' ? '清除搜索' : 'Clear Search'}
              </Button>
            )}
            <Link href="/">
              <Button>
                <Icon name="RiArrowLeftLine" className="mr-2 h-4 w-4" />
                {locale === 'zh' ? '返回首页' : 'Back to Home'}
              </Button>
            </Link>
          </div>
        )}

        {/* CTA Section */}
        {filteredTools.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              {locale === 'zh' ? '分享你的工具体验' : 'Share Your Tool Experience'}
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              {locale === 'zh' 
                ? '你是否使用过Gemini CLI或其他AI开发工具？分享你的使用体验，帮助其他开发者做出明智的选择。'
                : 'Have you used Gemini CLI or other AI development tools? Share your experience and help other developers make informed decisions.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                <Icon name="RiEditLine" className="mr-2 h-4 w-4" />
                {locale === 'zh' ? '写评测' : 'Write a Review'}
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <Icon name="RiCommunityLine" className="mr-2 h-4 w-4" />
                {locale === 'zh' ? '加入社区' : 'Join Community'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

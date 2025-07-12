"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import { BlogPost, BlogSearchOptions, DifficultyLevel } from "@/types/content";
import { getBlogPosts, getFeaturedBlogPosts, getPopularTags } from "@/services/blog";

interface BlogContentProps {
  locale: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function BlogContent({ locale, searchParams }: BlogContentProps) {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState((searchParams.q as string) || "");
  const [sortBy, setSortBy] = useState((searchParams.sort as string) || "latest");
  const [category, setCategory] = useState((searchParams.category as string) || "all");
  const [difficulty, setDifficulty] = useState((searchParams.difficulty as string) || "all");
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [popularTags, setPopularTags] = useState<Array<{ tag: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPosts, setTotalPosts] = useState(0);

  // Difficulty levels
  const difficulties = [
    { value: "all", label: "All Levels" },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" }
  ];

  // Load initial data
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Load featured posts
        const featured = await getFeaturedBlogPosts(3);
        setFeaturedPosts(featured);
        
        // Load popular tags
        const tags = await getPopularTags();
        setPopularTags(tags);
        
        setError(null);
      } catch (err) {
        setError("Failed to load blog data");
        console.error("Error loading blog data:", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [locale]);

  // Load filtered posts
  useEffect(() => {
    async function loadPosts() {
      try {
        const options: BlogSearchOptions = {
          query: searchQuery || undefined,
          category: category !== "all" ? category : undefined,
          difficulty: difficulty !== "all" ? difficulty as DifficultyLevel : undefined,
          sortBy: sortBy as any,
          locale,
          limit: 20
        };
        
        const response = await getBlogPosts(options);
        setBlogPosts(response.posts);
        setTotalPosts(response.total);
        setCategories(["all", ...response.categories]);
      } catch (err) {
        console.error("Error loading posts:", err);
      }
    }
    
    loadPosts();
  }, [searchQuery, sortBy, category, difficulty, locale]);

  // Utility functions
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const featured = await getFeaturedBlogPosts(3);
      setFeaturedPosts(featured);
      
      const options: BlogSearchOptions = {
        query: searchQuery || undefined,
        category: category !== "all" ? category : undefined,
        difficulty: difficulty !== "all" ? difficulty as DifficultyLevel : undefined,
        sortBy: sortBy as any,
        locale,
        limit: 20
      };
      
      const response = await getBlogPosts(options);
      setBlogPosts(response.posts);
      setTotalPosts(response.total);
      setCategories(["all", ...response.categories]);
      
      setError(null);
    } catch (err) {
      setError("Failed to refresh blog data");
    } finally {
      setLoading(false);
    }
  };

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
              {error}. <Button variant="link" onClick={refreshData} className="p-0 h-auto">Try again</Button>
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
            <Icon name="RiFileTextLine" className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {locale === 'zh' ? '开发者博客与教程' : 'Developer Blog & Tutorials'}
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            {locale === 'zh' 
              ? '探索深度技术文章、开发教程和来自 Gemini CLI 社区的见解。学习最佳实践、高级技巧，并了解最新发展动态。'
              : 'Explore in-depth technical articles, development tutorials, and insights from the Gemini CLI community. Learn best practices, advanced techniques, and stay updated with the latest developments.'
            }
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icon name="RiSearchLine" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={locale === 'zh' ? '搜索文章和教程...' : 'Search articles and tutorials...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={locale === 'zh' ? '分类' : 'Category'} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat === 'all' ? (locale === 'zh' ? '全部文章' : 'All Articles') : cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={locale === 'zh' ? '难度' : 'Difficulty'} />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((diff) => (
                  <SelectItem key={diff.value} value={diff.value}>
                    {locale === 'zh' 
                      ? (diff.value === 'all' ? '全部难度' : 
                         diff.value === 'beginner' ? '初级' :
                         diff.value === 'intermediate' ? '中级' : '高级')
                      : diff.label
                    }
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder={locale === 'zh' ? '排序' : 'Sort by'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">{locale === 'zh' ? '最新文章' : 'Latest Articles'}</SelectItem>
                <SelectItem value="popular">{locale === 'zh' ? '最受欢迎' : 'Most Popular'}</SelectItem>
                <SelectItem value="alphabetical">{locale === 'zh' ? '按字母排序' : 'Alphabetical'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        {/* Popular Tags */}
        {popularTags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icon name="RiHashtag" className="h-5 w-5 text-blue-600" />
              {locale === 'zh' ? '热门标签' : 'Popular Tags'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tagInfo) => (
                <Badge
                  key={tagInfo.tag}
                  variant="secondary"
                  className="cursor-pointer hover:bg-blue-100 text-gray-600"
                  onClick={() => setSearchQuery(tagInfo.tag)}
                >
                  {tagInfo.tag} ({tagInfo.count})
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Results Count */}
        {totalPosts > 0 && (
          <div className="mb-6 text-sm text-gray-600">
            {locale === 'zh' 
              ? `找到 ${totalPosts} 篇文章${category !== "all" ? ` - ${category}` : ''}${difficulty !== "all" ? ` - ${difficulty}` : ''}`
              : `Found ${totalPosts} article${totalPosts !== 1 ? 's' : ''}${category !== "all" ? ` in ${category}` : ''}${difficulty !== "all" ? ` - ${difficulty} level` : ''}`
            }
          </div>
        )}

        {/* Featured Articles Section */}
        {featuredPosts.length > 0 && !searchQuery && category === "all" && difficulty === "all" && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Icon name="RiStarLine" className="h-6 w-6 text-yellow-500" />
              {locale === 'zh' ? '特色文章' : 'Featured Articles'}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <Card key={post.uuid} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img 
                      src={post.coverUrl || '/imgs/blogs/default-cover.webp'} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    {post.difficulty && (
                      <Badge className={`absolute top-4 left-4 ${getDifficultyColor(post.difficulty)}`}>
                        {locale === 'zh' 
                          ? (post.difficulty === 'beginner' ? '初级' :
                             post.difficulty === 'intermediate' ? '中级' : '高级')
                          : post.difficulty
                        }
                      </Badge>
                    )}
                    <Badge className="absolute top-4 right-4 bg-yellow-500 text-white">
                      <Icon name="RiStarFill" className="h-3 w-3 mr-1" />
                      {locale === 'zh' ? '特色' : 'Featured'}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {post.readingTime} {locale === 'zh' ? '分钟阅读' : 'min read'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
                          <AvatarFallback className="text-xs">{post.authorName?.charAt(0) || 'A'}</AvatarFallback>
                        </Avatar>
                        <div className="text-xs">
                          <p className="font-medium">{post.authorName}</p>
                          <p className="text-gray-500">{formatDate(post.createdAt)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Icon name="RiEyeLine" className="h-3 w-3" />
                          {post.viewCount}
                        </span>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/blog/${post.slug}`}>
                            {locale === 'zh' ? '阅读' : 'Read'}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Articles Grid */}
        {blogPosts.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Icon name="RiArticleLine" className="h-6 w-6 text-blue-600" />
              {searchQuery 
                ? (locale === 'zh' ? '搜索结果' : 'Search Results')
                : (locale === 'zh' ? '全部文章' : 'All Articles')
              }
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <Card key={post.uuid} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video relative">
                    <img 
                      src={post.coverUrl || '/imgs/blogs/default-cover.webp'} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    {post.difficulty && (
                      <Badge className={`absolute top-4 left-4 ${getDifficultyColor(post.difficulty)}`}>
                        {locale === 'zh' 
                          ? (post.difficulty === 'beginner' ? '初级' :
                             post.difficulty === 'intermediate' ? '中级' : '高级')
                          : post.difficulty
                        }
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {post.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {post.readingTime} {locale === 'zh' ? '分钟阅读' : 'min read'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {post.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{post.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={post.authorAvatarUrl} alt={post.authorName} />
                          <AvatarFallback className="text-xs">{post.authorName?.charAt(0) || 'A'}</AvatarFallback>
                        </Avatar>
                        <div className="text-xs">
                          <p className="font-medium">{post.authorName}</p>
                          <p className="text-gray-500">{formatDate(post.createdAt)}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Icon name="RiEyeLine" className="h-3 w-3" />
                          {post.viewCount}
                        </span>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/blog/${post.slug}`}>
                            {locale === 'zh' ? '阅读' : 'Read'}
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Icon name="RiFileTextLine" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchQuery 
                ? (locale === 'zh' ? '未找到文章' : 'No articles found')
                : (locale === 'zh' ? '暂无文章' : 'No articles available')
              }
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? (locale === 'zh' ? '尝试调整搜索条件或浏览不同分类。' : 'Try adjusting your search terms or browse different categories.')
                : (locale === 'zh' ? '请稍后回来查看我们社区的新技术文章和教程。' : 'Check back soon for new technical articles and tutorials from our community.')
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {searchQuery && (
                <Button 
                  onClick={() => setSearchQuery("")}
                  variant="outline"
                >
                  {locale === 'zh' ? '清除搜索' : 'Clear Search'}
                </Button>
              )}
              {(category !== "all" || difficulty !== "all") && (
                <Button 
                  onClick={() => {
                    setCategory("all");
                    setDifficulty("all");
                  }}
                  variant="outline"
                >
                  {locale === 'zh' ? '显示全部分类' : 'Show All Categories'}
                </Button>
              )}
              <Link href="/">
                <Button>
                  <Icon name="RiArrowLeftLine" className="mr-2 h-4 w-4" />
                  {locale === 'zh' ? '回到首页' : 'Back to Home'}
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Newsletter CTA */}
        {blogPosts.length > 0 && (
          <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              {locale === 'zh' ? '订阅我们的博客更新' : 'Stay Updated with Our Blog'}
            </h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              {locale === 'zh' 
                ? '当我们发布新的技术文章、教程和有关 Gemini CLI 开发的见解时，获得通知。'
                : 'Get notified when we publish new technical articles, tutorials, and insights about Gemini CLI development.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-purple-600 hover:bg-gray-100">
                <Icon name="RiMailLine" className="mr-2 h-4 w-4" />
                {locale === 'zh' ? '订阅新闻简报' : 'Subscribe to Newsletter'}
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10">
                <Icon name="RiRssLine" className="mr-2 h-4 w-4" />
                {locale === 'zh' ? 'RSS 订阅' : 'RSS Feed'}
              </Button>
            </div>
          </div>
        )}

        {/* Contribute CTA */}
        <div className="mt-8 bg-white rounded-xl p-8 text-center border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {locale === 'zh' ? '分享您的知识' : 'Share Your Knowledge'}
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {locale === 'zh' 
              ? '有 Gemini CLI 的使用经验？想要分享教程或技术见解？我们很乐意在我们的博客上展示您的内容。'
              : 'Have experience with Gemini CLI? Want to share a tutorial or technical insight? We\'d love to feature your content on our blog.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Icon name="RiEditLine" className="mr-2 h-4 w-4" />
              {locale === 'zh' ? '撰写文章' : 'Write an Article'}
            </Button>
            <Button variant="outline">
              <Icon name="RiQuestionLine" className="mr-2 h-4 w-4" />
              {locale === 'zh' ? '投稿指南' : 'Submission Guidelines'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

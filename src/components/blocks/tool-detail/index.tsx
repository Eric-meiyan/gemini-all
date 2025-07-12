"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import { ToolCommentSection } from "@/components/blocks/comment-section";
import RelatedArticles from "@/components/blocks/related-articles";
import { ToolReview } from "@/types/tools";
import { ContentCategory } from "@/types/content";
import { getRelatedTools } from "@/services/tools";
import { getBlogPosts } from "@/services/blog";

interface ToolDetailContentProps {
  tool: ToolReview;
  locale: string;
}

export default function ToolDetailContent({ tool, locale }: ToolDetailContentProps) {
  const [relatedTools, setRelatedTools] = useState<ToolReview[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    const loadRelatedContent = async () => {
      try {
        // 加载相关工具
        const related = await getRelatedTools(tool.id, 3);
        setRelatedTools(related);

        // 加载相关博客文章
        const blogResponse = await getBlogPosts({ 
          query: tool.name,
          limit: 3 
        });
        setRelatedPosts(blogResponse.posts);
      } catch (error) {
        console.error("Error loading related content:", error);
      }
    };

    loadRelatedContent();
  }, [tool.id, tool.name, locale]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4.0) return "text-blue-600";
    if (rating >= 3.5) return "text-yellow-600";
    return "text-orange-600";
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "AI Tools": "bg-purple-100 text-purple-800",
      "Productivity": "bg-blue-100 text-blue-800", 
      "Development": "bg-green-100 text-green-800",
      "Design": "bg-pink-100 text-pink-800",
      "Utilities": "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 面包屑导航 */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">
            {locale === 'zh' ? '首页' : 'Home'}
          </Link>
          <Icon name="RiArrowRightSLine" className="h-4 w-4" />
          <Link href="/tools" className="hover:text-blue-600">
            {locale === 'zh' ? '工具评测' : 'Tools'}
          </Link>
          <Icon name="RiArrowRightSLine" className="h-4 w-4" />
          <span className="text-gray-900">{tool.name}</span>
        </nav>

        {/* 头部信息 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <img 
                  src={tool.logo || '/imgs/tools/default-logo.png'} 
                  alt={`${tool.name} logo`}
                  className="w-20 h-20 rounded-xl shadow-md"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl font-bold text-gray-900">{tool.name}</h1>
                  <Badge className={getCategoryColor(tool.category)}>
                    {tool.category}
                  </Badge>
                  {tool.verified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Icon name="RiVerifiedBadgeFill" className="h-3 w-3 mr-1" />
                      {locale === 'zh' ? '已验证' : 'Verified'}
                    </Badge>
                  )}
                </div>
                
                <p className="text-lg text-gray-600 mb-4">{tool.description}</p>
                
                <div className="flex items-center gap-6 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Icon 
                          key={i}
                          name={i < Math.floor(tool.overallRating) ? "RiStarFill" : "RiStarLine"}
                          className={`h-5 w-5 ${getRatingColor(tool.overallRating)}`}
                        />
                      ))}
                    </div>
                    <span className={`text-lg font-semibold ${getRatingColor(tool.overallRating)}`}>
                      {tool.overallRating.toFixed(1)}
                    </span>
                    <span className="text-gray-500">
                      ({tool.reviewCount} {locale === 'zh' ? '评价' : 'reviews'})
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-gray-500">
                    <Icon name="RiCalendarLine" className="h-4 w-4" />
                    <span>{locale === 'zh' ? '更新于' : 'Updated'} {formatDate(tool.updatedAt)}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {tool.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <Button asChild size="lg">
                    <a 
                      href={tool.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <Icon name="RiExternalLinkLine" className="h-4 w-4" />
                      {locale === 'zh' ? '访问官网' : 'Visit Website'}
                    </a>
                  </Button>
                  
                  {tool.price === 'free' ? (
                    <Badge className="bg-green-500 text-white px-3 py-1">
                      {locale === 'zh' ? '免费' : 'Free'}
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      {tool.price}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* 主要内容 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 详细信息标签页 */}
            <Card>
              <CardContent className="p-0">
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">
                      {locale === 'zh' ? '概览' : 'Overview'}
                    </TabsTrigger>
                    <TabsTrigger value="features">
                      {locale === 'zh' ? '功能' : 'Features'}
                    </TabsTrigger>
                    <TabsTrigger value="ratings">
                      {locale === 'zh' ? '评分' : 'Ratings'}
                    </TabsTrigger>
                    <TabsTrigger value="pricing">
                      {locale === 'zh' ? '价格' : 'Pricing'}
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          {locale === 'zh' ? '工具简介' : 'Tool Description'}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">{tool.description}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold mb-3">
                          {locale === 'zh' ? '开发商信息' : 'Developer Information'}
                        </h3>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`/imgs/developers/${tool.developer.toLowerCase().replace(/\s+/g, '-')}.png`} />
                            <AvatarFallback>{tool.developer.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{tool.developer}</p>
                            <p className="text-sm text-gray-500">
                              {locale === 'zh' ? '软件开发商' : 'Software Developer'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="features" className="p-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        {locale === 'zh' ? '主要功能' : 'Key Features'}
                      </h3>
                      <ul className="space-y-3">
                        {tool.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <Icon name="RiCheckboxCircleFill" className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="ratings" className="p-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">
                        {locale === 'zh' ? '详细评分' : 'Detailed Ratings'}
                      </h3>
                      
                      <div className="space-y-4">
                        {Object.entries(tool.ratings).map(([category, rating]) => (
                          <div key={category}>
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium capitalize">
                                {locale === 'zh' 
                                  ? (category === 'performance' ? '性能' :
                                     category === 'usability' ? '易用性' :
                                     category === 'features' ? '功能' : '支持')
                                  : category
                                }
                              </span>
                              <span className="text-sm text-gray-600">{rating.toFixed(1)}/5</span>
                            </div>
                            <Progress value={rating * 20} className="h-2" />
                          </div>
                        ))}
                      </div>
                      
                      <Separator />
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-green-600 mb-3">
                            {locale === 'zh' ? '优点' : 'Pros'}
                          </h4>
                          <ul className="space-y-2">
                            {tool.pros.map((pro, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Icon name="RiAddCircleFill" className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700">{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-red-600 mb-3">
                            {locale === 'zh' ? '缺点' : 'Cons'}
                          </h4>
                          <ul className="space-y-2">
                            {tool.cons.map((con, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <Icon name="RiSubtractFill" className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700">{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="pricing" className="p-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">
                        {locale === 'zh' ? '价格信息' : 'Pricing Information'}
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-600 mb-2">{tool.priceDetails || tool.price}</div>
                        <p className="text-gray-600">
                          {locale === 'zh' 
                            ? '访问官网了解详细的价格方案和功能对比。'
                            : 'Visit the official website for detailed pricing plans and feature comparison.'
                          }
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* 评论区 */}
            <ToolCommentSection 
              toolId={tool.id}
              toolName={tool.name}
              locale={locale}
            />
          </div>

          {/* 侧边栏 */}
          <div className="space-y-6">
            {/* 快速信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {locale === 'zh' ? '快速信息' : 'Quick Info'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {locale === 'zh' ? '分类' : 'Category'}
                  </span>
                  <span className="font-medium">{tool.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {locale === 'zh' ? '价格' : 'Pricing'}
                  </span>
                  <span className="font-medium">{tool.priceDetails || tool.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {locale === 'zh' ? '开发商' : 'Developer'}
                  </span>
                  <span className="font-medium">{tool.developer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {locale === 'zh' ? '最后更新' : 'Last Updated'}
                  </span>
                  <span className="font-medium">{formatDate(tool.updatedAt)}</span>
                </div>
              </CardContent>
            </Card>

            {/* 相关工具 */}
            {relatedTools.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {locale === 'zh' ? '相关工具' : 'Related Tools'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedTools.map((relatedTool) => (
                    <Link 
                      key={relatedTool.id}
                      href={`/tools/${relatedTool.id}`}
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={relatedTool.logo || '/imgs/tools/default-logo.png'}
                          alt={relatedTool.name}
                          className="w-10 h-10 rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm truncate">{relatedTool.name}</h4>
                          <div className="flex items-center gap-1">
                            <Icon name="RiStarFill" className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs text-gray-600">
                              {relatedTool.overallRating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* 操作按钮 */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Button className="w-full" asChild>
                  <a 
                    href={tool.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Icon name="RiExternalLinkLine" className="h-4 w-4 mr-2" />
                    {locale === 'zh' ? '访问官网' : 'Visit Website'}
                  </a>
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Icon name="RiBookmarkLine" className="h-4 w-4 mr-2" />
                  {locale === 'zh' ? '收藏工具' : 'Bookmark Tool'}
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Icon name="RiShareLine" className="h-4 w-4 mr-2" />
                  {locale === 'zh' ? '分享工具' : 'Share Tool'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 相关文章 */}
        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <RelatedArticles 
              currentPost={{
                uuid: `tool-${tool.id}`,
                slug: tool.id,
                title: tool.name,
                description: tool.description,
                tags: tool.tags,
                category: tool.category as ContentCategory,
                difficulty: "intermediate",
                createdAt: tool.createdAt,
                locale: locale,
                contentType: "blog" as const,
                viewCount: 0,
                featured: false,
                status: "published"
              }}
              locale={locale}
              maxItems={3}
            />
          </div>
        )}
      </div>
    </div>
  );
}
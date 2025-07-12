// 相关文章推荐组件
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import { BlogPost } from "@/types/content";
import { getRelatedBlogPosts } from "@/services/blog";

interface RelatedArticlesProps {
  currentPost: BlogPost;
  locale: string;
  maxItems?: number;
}

export default function RelatedArticles({ 
  currentPost, 
  locale, 
  maxItems = 4 
}: RelatedArticlesProps) {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRelatedPosts() {
      setLoading(true);
      try {
        const posts = await getRelatedBlogPosts(currentPost.slug, maxItems);
        setRelatedPosts(posts);
      } catch (error) {
        console.error("Error loading related posts:", error);
      } finally {
        setLoading(false);
      }
    }

    loadRelatedPosts();
  }, [currentPost.uuid, maxItems]);

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

  if (loading) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {locale === 'zh' ? '相关文章' : 'Related Articles'}
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: maxItems }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video relative">
                <Skeleton className="w-full h-full" />
              </div>
              <CardContent className="p-4">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-4" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (relatedPosts.length === 0) {
    return (
      <div className="text-center py-8">
        <Icon name="RiFileTextLine" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">
          {locale === 'zh' 
            ? '暂无相关文章' 
            : 'No related articles found'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Icon name="RiBookmarkLine" className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">
          {locale === 'zh' ? '相关文章' : 'Related Articles'}
        </h3>
        <Badge variant="secondary" className="text-xs">
          {relatedPosts.length}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {relatedPosts.map((post) => (
          <Card key={post.uuid} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <img 
                src={post.coverUrl || '/imgs/blogs/default-cover.webp'} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
              {post.difficulty && (
                <Badge className={`absolute top-3 left-3 text-xs ${getDifficultyColor(post.difficulty)}`}>
                  {locale === 'zh' 
                    ? (post.difficulty === 'beginner' ? '初级' :
                       post.difficulty === 'intermediate' ? '中级' : '高级')
                    : post.difficulty
                  }
                </Badge>
              )}
            </div>
            
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs">
                  {post.category}
                </Badge>
                <span className="text-xs text-gray-500">
                  {post.readingTime} {locale === 'zh' ? '分钟阅读' : 'min read'}
                </span>
              </div>
              
              <h4 className="text-lg font-semibold mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                <Link href={`/blog/posts/${post.slug}`}>
                  {post.title}
                </Link>
              </h4>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {post.description}
              </p>
              
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
                    <AvatarFallback className="text-xs">
                      {post.authorName?.charAt(0) || 'A'}
                    </AvatarFallback>
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
                    <Link href={`/blog/posts/${post.slug}`}>
                      <Icon name="RiArrowRightLine" className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View All Link */}
      <div className="text-center pt-4">
        <Button variant="outline" asChild>
          <Link href="/blog">
            <Icon name="RiBookOpenLine" className="mr-2 h-4 w-4" />
            {locale === 'zh' ? '查看全部文章' : 'View All Articles'}
          </Link>
        </Button>
      </div>
    </div>
  );
}
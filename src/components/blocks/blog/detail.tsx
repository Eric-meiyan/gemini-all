"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SafeImage, SafeAvatar } from "@/components/ui/safe-image";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import { BlogCommentSection } from "@/components/blocks/comment-section";
import RelatedArticles from "@/components/blocks/related-articles";
import { BlogPost } from "@/types/content";
import { getRelatedBlogPosts } from "@/services/blog";
import moment from "moment";

interface BlogDetailContentProps {
  post: BlogPost;
  locale: string;
}

export default function BlogDetailContent({ post, locale }: BlogDetailContentProps) {
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadRelatedPosts = async () => {
      try {
        const related = await getRelatedBlogPosts(post.slug, 3);
        setRelatedPosts(related);
      } catch (error) {
        console.error("Error loading related posts:", error);
      }
    };

    loadRelatedPosts();
  }, [post]);

  const formatDate = (date: Date) => {
    return moment(date).locale(locale === 'zh' ? 'zh-cn' : 'en').format("MMMM DD, YYYY");
  };

  const getReadingTime = (content?: string) => {
    if (!content) return post.readingTime || 5;
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case "tutorial": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "development": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "performance": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "security": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "support": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "workflow": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "community": return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyLabel = (difficulty?: string) => {
    if (locale === 'zh') {
      switch (difficulty) {
        case "beginner": return "初级";
        case "intermediate": return "中级";
        case "advanced": return "高级";
        default: return "通用";
      }
    }
    return difficulty || "general";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">
            {locale === 'zh' ? '首页' : 'Home'}
          </Link>
          <Icon name="RiArrowRightSLine" className="h-4 w-4" />
          <Link href="/blog" className="hover:text-blue-600">
            {locale === 'zh' ? '博客' : 'Blog'}
          </Link>
          <Icon name="RiArrowRightSLine" className="h-4 w-4" />
          <span className="text-gray-900 truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/blog">
              <Icon name="RiArrowLeftLine" className="h-4 w-4 mr-2" />
              {locale === 'zh' ? '返回博客' : 'Back to Blog'}
            </Link>
          </Button>
        </div>

        {/* Article Content */}
        <article className="bg-white rounded-xl shadow-sm overflow-hidden mb-12">
          {/* Article Header */}
          <header className="p-8 pb-6">
            {/* Category and Difficulty Badges */}
            <div className="flex items-center gap-3 mb-4">
              {post.category && (
                <Badge className={getCategoryColor(post.category)}>
                  {post.category}
                </Badge>
              )}
              {post.difficulty && (
                <Badge className={getDifficultyColor(post.difficulty)}>
                  {getDifficultyLabel(post.difficulty)}
                </Badge>
              )}
              {post.featured && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  <Icon name="RiStarFill" className="h-3 w-3 mr-1" />
                  {locale === 'zh' ? '精选' : 'Featured'}
                </Badge>
              )}
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            {/* Description */}
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {post.description}
            </p>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Icon name="RiCalendarLine" className="h-4 w-4" />
                <time dateTime={post.createdAt.toISOString()}>
                  {formatDate(post.createdAt)}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="RiTimeLine" className="h-4 w-4" />
                <span>{getReadingTime(post.content)} {locale === 'zh' ? '分钟阅读' : 'min read'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="RiEyeLine" className="h-4 w-4" />
                <span>{post.viewCount.toLocaleString()} {locale === 'zh' ? '阅读' : 'views'}</span>
              </div>
            </div>
            
            {/* Author Information */}
            {post.authorName && (
              <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                <SafeAvatar
                  src={post.authorAvatarUrl || "/imgs/avatars/default.webp"}
                  alt={post.authorName || "Author"}
                  className="w-12 h-12"
                  size="lg"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {post.authorName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {locale === 'zh' ? '技术作者' : 'Technical Author'}
                  </div>
                </div>
              </div>
            )}
            
            {/* Featured Image */}
            {post.coverUrl && (
              <div className="aspect-video rounded-lg overflow-hidden mb-6">
                <SafeImage
                  src={post.coverUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </header>

          <Separator />

          {/* Article Body */}
          <div className="p-8">
            {post.content ? (
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br>') }} />
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="RiFileTextLine" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {locale === 'zh' ? '内容正在准备中' : 'Content Coming Soon'}
                </h3>
                <p className="text-gray-500">
                  {locale === 'zh' 
                    ? '我们正在为这篇文章准备详细的内容，敬请期待。'
                    : 'We are preparing detailed content for this article. Stay tuned!'
                  }
                </p>
              </div>
            )}

            {/* External Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-4">
                {post.sourceUrl && (
                  <Button variant="outline" asChild>
                    <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer">
                      <Icon name="RiExternalLinkLine" className="h-4 w-4 mr-2" />
                      {locale === 'zh' ? '原文链接' : 'Source Article'}
                    </a>
                  </Button>
                )}
                {post.githubUrl && (
                  <Button variant="outline" asChild>
                    <a href={post.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Icon name="RiGithubLine" className="h-4 w-4 mr-2" />
                      {locale === 'zh' ? '查看代码' : 'View Code'}
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  {locale === 'zh' ? '相关标签' : 'Tags'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* Comments Section */}
        <section className="mb-12">
          <BlogCommentSection 
            postSlug={post.slug}
            postTitle={post.title}
            locale={locale}
          />
        </section>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mb-8">
            <RelatedArticles 
              currentPost={{
                uuid: post.uuid,
                slug: post.slug,
                title: post.title,
                description: post.description,
                tags: post.tags,
                category: post.category || "blog",
                difficulty: post.difficulty || "intermediate",
                createdAt: post.createdAt,
                locale: locale,
                contentType: "blog" as const,
                viewCount: post.viewCount,
                featured: post.featured,
                status: post.status
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
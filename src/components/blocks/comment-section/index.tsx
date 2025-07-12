// Giscus评论系统组件
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Giscus from "@giscus/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/icon";
import { getGiscusConfig, validateGiscusConfig, categoryMapping, themeMapping } from "@/lib/giscus-config";

interface CommentSectionProps {
  // 页面标识相关
  title?: string;
  identifier?: string; // 用于映射到GitHub Discussion
  category?: "General" | "Ideas" | "Q&A" | "Show and tell" | "Announcements";
  
  // 显示配置
  locale?: string;
  showTitle?: boolean;
  showStats?: boolean;
  
  // 样式配置
  className?: string;
  loading?: boolean;
}

export default function CommentSection({
  title,
  identifier,
  category = "General",
  locale = "en",
  showTitle = true,
  showStats = true,
  className = "",
  loading = false
}: CommentSectionProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [giscusConfig, setGiscusConfig] = useState<any>(null);

  // 等待组件挂载，避免水合不匹配
  useEffect(() => {
    setMounted(true);
    const config = getGiscusConfig(locale);
    setGiscusConfig(config);
  }, [locale]);

  // 确定当前主题
  const currentTheme = theme === "system" ? systemTheme : theme;
  const giscusTheme = currentTheme === "dark" ? "dark" : "light";

  // 检查配置是否有效
  const isConfigValid = giscusConfig && validateGiscusConfig(giscusConfig);

  if (!mounted || !giscusConfig) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon name="RiChatQuoteLine" className="h-5 w-5 text-gray-400" />
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div className="h-32 w-full bg-gray-100 rounded animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          {showTitle && (
            <CardTitle className="flex items-center gap-2">
              <Icon name="RiChatQuoteLine" className="h-5 w-5 text-blue-600" />
              {locale === "zh" ? "讨论区" : "Comments"}
              <Badge variant="secondary" className="ml-auto">
                <Icon name="RiLoaderLine" className="h-3 w-3 mr-1 animate-spin" />
                {locale === "zh" ? "加载中" : "Loading"}
              </Badge>
            </CardTitle>
          )}
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Icon name="RiLoaderLine" className="h-8 w-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">
              {locale === "zh" ? "正在加载评论..." : "Loading comments..."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 如果配置无效，显示配置提示
  if (!isConfigValid) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="RiErrorWarningLine" className="h-5 w-5 text-orange-500" />
            {locale === "zh" ? "评论系统配置" : "Comments Configuration"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Icon name="RiSettings3Line" className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              {locale === "zh" ? "评论系统需要配置" : "Comments System Needs Configuration"}
            </h3>
            <p className="text-gray-500 mb-4">
              {locale === "zh" 
                ? "请在环境变量中配置 Giscus 相关设置以启用评论功能。"
                : "Please configure Giscus settings in environment variables to enable comments."
              }
            </p>
            <div className="text-xs text-gray-400 space-y-1">
              <p>NEXT_PUBLIC_GISCUS_REPO</p>
              <p>NEXT_PUBLIC_GISCUS_REPO_ID</p>
              <p>NEXT_PUBLIC_GISCUS_CATEGORY_ID</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="RiChatQuoteLine" className="h-5 w-5 text-blue-600" />
            {title || (locale === "zh" ? "讨论区" : "Comments")}
            {showStats && (
              <Badge variant="secondary" className="ml-auto">
                <Icon name="RiGithubLine" className="h-3 w-3 mr-1" />
                GitHub Discussions
              </Badge>
            )}
          </CardTitle>
          
          <p className="text-sm text-gray-600">
            {locale === "zh" 
              ? "使用 GitHub 账号登录参与讨论。支持 Markdown 语法和代码高亮。"
              : "Sign in with GitHub to join the discussion. Supports Markdown syntax and code highlighting."
            }
          </p>
          <Separator />
        </CardHeader>
      )}

      <CardContent className="p-0">
        <div className="p-6">
          <Giscus
            repo={giscusConfig.repo}
            repoId={giscusConfig.repoId}
            category={category}
            categoryId={giscusConfig.categoryId}
            mapping="pathname"
            term={identifier}
            strict="0"
            reactionsEnabled="1"
            emitMetadata="1"
            inputPosition="top"
            theme={giscusTheme}
            lang={giscusConfig.lang}
          />
        </div>
      </CardContent>

      {/* 底部信息 */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Icon name="RiShieldCheckLine" className="h-3 w-3" />
              {locale === "zh" ? "自动垃圾过滤" : "Spam Protection"}
            </span>
            <span className="flex items-center gap-1">
              <Icon name="RiMarkdownLine" className="h-3 w-3" />
              {locale === "zh" ? "支持 Markdown" : "Markdown Support"}
            </span>
          </div>
          
          <a 
            href="https://giscus.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            {locale === "zh" ? "技术支持" : "Powered by"} Giscus
            <Icon name="RiExternalLinkLine" className="h-3 w-3" />
          </a>
        </div>
      </div>
    </Card>
  );
}

// 为不同页面类型提供的预设组件

// 博客文章评论
export function BlogCommentSection({ 
  postSlug, 
  postTitle, 
  locale = "en" 
}: { 
  postSlug: string; 
  postTitle: string; 
  locale?: string; 
}) {
  return (
    <CommentSection
      title={locale === "zh" ? `"${postTitle}" 的讨论` : `Discussion for "${postTitle}"`}
      identifier={`blog-${postSlug}`}
      category={categoryMapping.blog}
      locale={locale}
      showTitle={true}
      showStats={true}
    />
  );
}

// 工具评测评论
export function ToolCommentSection({ 
  toolId, 
  toolName, 
  locale = "en" 
}: { 
  toolId: string; 
  toolName: string; 
  locale?: string; 
}) {
  return (
    <CommentSection
      title={locale === "zh" ? `"${toolName}" 工具讨论` : `"${toolName}" Tool Discussion`}
      identifier={`tool-${toolId}`}
      category={categoryMapping.tool}
      locale={locale}
      showTitle={true}
      showStats={true}
    />
  );
}

// 通用页面评论
export function PageCommentSection({ 
  pageId, 
  pageTitle, 
  locale = "en" 
}: { 
  pageId: string; 
  pageTitle?: string; 
  locale?: string; 
}) {
  return (
    <CommentSection
      title={pageTitle ? `${pageTitle} - ${locale === "zh" ? "讨论" : "Discussion"}` : undefined}
      identifier={`page-${pageId}`}
      category={categoryMapping.page}
      locale={locale}
      showTitle={!!pageTitle}
      showStats={true}
    />
  );
}
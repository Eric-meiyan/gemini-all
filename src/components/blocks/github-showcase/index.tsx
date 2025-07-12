"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import { GitHubStats, GitHubProjectConfig } from "@/types/github";
import { getProjectStats, getMultipleProjectStats, githubProjects } from "@/services/github";

interface GitHubStatsCardProps {
  stats: GitHubStats;
  locale: string;
  variant?: "default" | "compact";
}

// 单个项目统计卡片
function GitHubStatsCard({ stats, locale, variant = "default" }: GitHubStatsCardProps) {
  const { repository, releases, contributors, stats: projectStats } = stats;

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return locale === 'zh' ? '未知' : 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US');
  };

  const getHealthColor = (score: number): string => {
    if (score >= 80) return "text-green-600 bg-green-50";
    if (score >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  if (variant === "compact") {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <Icon name="RiGithubFill" className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">{repository.name}</h4>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Icon name="RiStarLine" className="w-3 h-3" />
                  {formatNumber(repository.stargazers_count)}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="RiGitForkLine" className="w-3 h-3" />
                  {formatNumber(repository.forks_count)}
                </span>
                <div className={`px-2 py-1 rounded-full text-xs ${getHealthColor(projectStats.healthScore)}`}>
                  {projectStats.healthScore}%
                </div>
              </div>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link href={repository.html_url} target="_blank">
                <Icon name="RiExternalLinkLine" className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <Icon name="RiGithubFill" className="w-8 h-8 text-gray-700" />
            </div>
            <div>
              <CardTitle className="text-lg">{repository.name}</CardTitle>
              <p className="text-sm text-gray-500 truncate max-w-xs">
                {repository.description}
              </p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthColor(projectStats.healthScore)}`}>
            {locale === 'zh' ? '健康度' : 'Health'}: {projectStats.healthScore}%
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 主要统计数据 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-yellow-600 mb-1">
              <Icon name="RiStarLine" className="w-4 h-4" />
              <span className="font-semibold">{formatNumber(repository.stargazers_count)}</span>
            </div>
            <p className="text-xs text-gray-500">{locale === 'zh' ? '星标' : 'Stars'}</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <Icon name="RiGitForkLine" className="w-4 h-4" />
              <span className="font-semibold">{formatNumber(repository.forks_count)}</span>
            </div>
            <p className="text-xs text-gray-500">{locale === 'zh' ? '分叉' : 'Forks'}</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
              <Icon name="RiErrorWarningLine" className="w-4 h-4" />
              <span className="font-semibold">{formatNumber(repository.open_issues_count)}</span>
            </div>
            <p className="text-xs text-gray-500">{locale === 'zh' ? '问题' : 'Issues'}</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
              <Icon name="RiTeamLine" className="w-4 h-4" />
              <span className="font-semibold">{contributors.length}</span>
            </div>
            <p className="text-xs text-gray-500">{locale === 'zh' ? '贡献者' : 'Contributors'}</p>
          </div>
        </div>

        {/* 语言和许可证 */}
        <div className="flex items-center gap-4 text-sm">
          {repository.language && (
            <Badge variant="secondary">
              {repository.language}
            </Badge>
          )}
          {repository.license && (
            <Badge variant="outline">
              {repository.license.name}
            </Badge>
          )}
        </div>

        {/* 最新信息 */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              {locale === 'zh' ? '最后提交：' : 'Last commit:'}
            </span>
            <span className="font-medium">
              {formatDate(projectStats.lastCommitDate)}
            </span>
          </div>
          
          {releases.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                {locale === 'zh' ? '最新版本：' : 'Latest release:'}
              </span>
              <span className="font-medium">
                {releases[0].tag_name}
              </span>
            </div>
          )}
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href={repository.html_url} target="_blank">
              <Icon name="RiGithubLine" className="w-4 h-4 mr-2" />
              {locale === 'zh' ? '查看仓库' : 'View Repository'}
            </Link>
          </Button>
          
          {releases.length > 0 && (
            <Button variant="outline" size="sm" asChild>
              <Link href={releases[0].html_url} target="_blank">
                <Icon name="RiDownloadLine" className="w-4 h-4 mr-2" />
                {locale === 'zh' ? '下载' : 'Download'}
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface GitHubProjectsShowcaseProps {
  locale: string;
  projects?: GitHubProjectConfig[];
  title?: string;
  description?: string;
  variant?: "grid" | "list";
  maxItems?: number;
}

// GitHub项目展示组件
export default function GitHubProjectsShowcase({ 
  locale, 
  projects = githubProjects,
  title,
  description,
  variant = "grid",
  maxItems
}: GitHubProjectsShowcaseProps) {
  const [stats, setStats] = useState<GitHubStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const projectsToFetch = maxItems ? projects.slice(0, maxItems) : projects;
        const response = await getMultipleProjectStats(projectsToFetch);
        
        if (response.error) {
          setError(response.error);
        }
        
        if (response.data) {
          setStats(response.data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [projects, maxItems]);

  // 加载状态
  if (loading) {
    return (
      <div className="space-y-6">
        {title && (
          <div className="text-center">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
        )}
        <div className={`grid gap-6 ${variant === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : ""}`}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="text-center">
                      <Skeleton className="h-6 w-12 mx-auto mb-1" />
                      <Skeleton className="h-3 w-8 mx-auto" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 错误状态
  if (error && stats.length === 0) {
    return (
      <Alert variant="destructive">
        <Icon name="RiErrorWarningLine" className="h-4 w-4" />
        <AlertDescription>
          {locale === 'zh' ? '获取GitHub数据失败：' : 'Failed to fetch GitHub data: '}{error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* 标题和描述 */}
      {(title || description) && (
        <div className="text-center">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
          )}
          {description && (
            <p className="text-gray-600 max-w-3xl mx-auto">{description}</p>
          )}
        </div>
      )}

      {/* 错误警告（部分成功时） */}
      {error && stats.length > 0 && (
        <Alert>
          <Icon name="RiInformationLine" className="h-4 w-4" />
          <AlertDescription>
            {locale === 'zh' ? '部分数据获取失败：' : 'Some data failed to load: '}{error}
          </AlertDescription>
        </Alert>
      )}

      {/* 项目统计展示 */}
      {stats.length > 0 && (
        <div className={`grid gap-6 ${
          variant === "grid" 
            ? "md:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"
        }`}>
          {stats.map((stat) => (
            <GitHubStatsCard
              key={stat.repository.id}
              stats={stat}
              locale={locale}
              variant={variant === "list" ? "compact" : "default"}
            />
          ))}
        </div>
      )}

      {/* 空状态 */}
      {!loading && stats.length === 0 && (
        <div className="text-center py-12">
          <Icon name="RiGithubLine" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {locale === 'zh' ? '暂无GitHub数据' : 'No GitHub data available'}
          </h3>
          <p className="text-gray-500">
            {locale === 'zh' 
              ? '请稍后重试或检查网络连接。' 
              : 'Please try again later or check your network connection.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
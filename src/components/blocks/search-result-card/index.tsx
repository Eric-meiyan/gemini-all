"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import { SearchResult } from "@/services/search";

interface SearchResultCardProps {
  result: SearchResult;
  locale: string;
  variant?: "default" | "compact";
  showType?: boolean;
}

export default function SearchResultCard({ 
  result, 
  locale, 
  variant = "default",
  showType = true 
}: SearchResultCardProps) {

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "news": return "RiNewspaperLine";
      case "tools": return "RiToolsLine";
      case "faq": return "RiQuestionAnswerLine";
      case "github": return "RiGithubLine";
      case "blog": return "RiFileTextLine";
      default: return "RiFileTextLine";
    }
  };

  const getTypeLabel = (type: string) => {
    if (locale === 'zh') {
      switch (type) {
        case "news": return "新闻";
        case "tools": return "工具";
        case "faq": return "问答";
        case "github": return "开源";
        case "blog": return "博客";
        default: return "内容";
      }
    } else {
      switch (type) {
        case "news": return "News";
        case "tools": return "Tool";
        case "faq": return "FAQ";
        case "github": return "GitHub";
        case "blog": return "Blog";
        default: return "Content";
      }
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "news": return "bg-blue-100 text-blue-800";
      case "tools": return "bg-green-100 text-green-800";
      case "faq": return "bg-purple-100 text-purple-800";
      case "github": return "bg-gray-100 text-gray-800";
      case "blog": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderMetadata = () => {
    if (!result.metadata) return null;

    const { rating, starCount, forkCount, healthScore } = result.metadata;

    return (
      <div className="flex items-center gap-3 text-xs text-gray-500">
        {rating && (
          <div className="flex items-center gap-1">
            <Icon name="RiStarFill" className="w-3 h-3 text-yellow-400" />
            <span>{rating.toFixed(1)}</span>
          </div>
        )}
        {starCount && (
          <div className="flex items-center gap-1">
            <Icon name="RiStarLine" className="w-3 h-3" />
            <span>{starCount.toLocaleString()}</span>
          </div>
        )}
        {forkCount && (
          <div className="flex items-center gap-1">
            <Icon name="RiGitForkLine" className="w-3 h-3" />
            <span>{forkCount.toLocaleString()}</span>
          </div>
        )}
        {healthScore && (
          <div className="flex items-center gap-1">
            <Icon name="RiHeartPulseLine" className="w-3 h-3" />
            <span>{healthScore}%</span>
          </div>
        )}
      </div>
    );
  };

  if (variant === "compact") {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {result.thumbnail && (
              <SafeImage
                src={result.thumbnail}
                alt={result.title}
                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm truncate">{result.title}</h3>
                {showType && (
                  <Badge variant="secondary" className={`text-xs ${getTypeColor(result.type)}`}>
                    {getTypeLabel(result.type)}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-600 line-clamp-1">
                {result.description}
              </p>
              {renderMetadata()}
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link href={result.url} target={result.type === 'github' ? '_blank' : '_self'}>
                <Icon name="RiEyeLine" className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 group">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            {result.thumbnail && (
              <SafeImage
                src={result.thumbnail}
                alt={result.title}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-gray-50"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Icon name={getTypeIcon(result.type)} className="w-5 h-5 text-gray-500" />
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                  {result.title}
                </h3>
                {showType && (
                  <Badge variant="secondary" className={getTypeColor(result.type)}>
                    {getTypeLabel(result.type)}
                  </Badge>
                )}
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {result.description}
              </p>

              {/* Metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  {result.author && (
                    <div className="flex items-center gap-1">
                      <Icon name="RiUserLine" className="w-3 h-3" />
                      <span>{result.author}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Icon name="RiCalendarLine" className="w-3 h-3" />
                    <span>{formatDate(result.updatedAt || result.createdAt)}</span>
                  </div>
                  {result.category && (
                    <Badge variant="outline" className="text-xs">
                      {result.category}
                    </Badge>
                  )}
                </div>
                {renderMetadata()}
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {result.tags && result.tags.length > 0 && (
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-1">
              {result.tags.slice(0, 4).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {result.tags.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{result.tags.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t flex items-center gap-3">
          <Button asChild className="flex-1">
            <Link href={result.url} target={result.type === 'github' ? '_blank' : '_self'}>
              <Icon name="RiEyeLine" className="mr-2 h-4 w-4" />
              {locale === 'zh' ? '查看详情' : 'View Details'}
            </Link>
          </Button>
          
          {result.type === 'github' && (
            <Button variant="outline" size="sm" asChild>
              <Link href={result.url} target="_blank">
                <Icon name="RiExternalLinkLine" className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
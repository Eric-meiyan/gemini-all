"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SafeImage, SafeAvatar } from "@/components/ui/safe-image";
import { TransformedNews } from "@/types/newsapi";
import { Link } from "@/i18n/navigation";
import moment from "moment";
import Icon from "@/components/icon";

interface NewsCardProps {
  news: TransformedNews;
  locale: string;
  variant?: "default" | "featured" | "compact";
  showCategory?: boolean;
  showAuthor?: boolean;
  showStats?: boolean;
}

export default function NewsCard({
  news,
  locale,
  variant = "default",
  showCategory = true,
  showAuthor = true,
  showStats = true,
}: NewsCardProps) {
  const formatDate = (date: Date | string) => {
    return moment(date).locale(locale).format("MMM DD, YYYY");
  };

  const getISOString = (date: Date | string): string => {
    if (typeof date === 'string') {
      return new Date(date).toISOString();
    }
    return date.toISOString();
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "official":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case "community":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "releases":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200";
      case "tutorials":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "official":
        return "Official";
      case "community":
        return "Community";
      case "releases":
        return "Releases";
      case "tutorials":
        return "Tutorials";
      default:
        return "News";
    }
  };

  if (variant === "featured") {
    return (
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] bg-white">
        <Link href={`/news/${news.uuid}`} className="block">
          <div className="relative h-64 overflow-hidden">
            <SafeImage
              src={news.cover_url}
              alt={news.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
            {showCategory && (
              <Badge className={`absolute top-4 left-4 text-xs font-semibold ${getCategoryColor(news.category)} border-0`}>
                {getCategoryLabel(news.category)}
              </Badge>
            )}
          </div>
          <CardContent className="p-6">
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <time dateTime={getISOString(news.created_at)}>
                {formatDate(news.created_at)}
              </time>
              <span className="mx-2">•</span>
              <span>{news.reading_time} min read</span>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
              {news.title}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
              {news.description}
            </p>
            {showAuthor && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SafeAvatar
                    src={news.author_avatar_url}
                    alt={news.author_name}
                    className="w-10 h-10"
                    size="lg"
                  />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {news.author_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {news.source_name}
                    </div>
                  </div>
                </div>
                {showStats && (
                  <div className="flex items-center space-x-4 text-gray-500 text-sm">
                    <span className="flex items-center gap-1">
                      <Icon name="RiEyeLine" className="h-4 w-4" />
                      {Math.floor(Math.random() * 5000) + 500}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="RiChat1Line" className="h-4 w-4" />
                      {Math.floor(Math.random() * 100) + 10}
                    </span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Link>
      </Card>
    );
  }

  if (variant === "compact") {
    return (
      <Card className="group overflow-hidden hover:shadow-md transition-all duration-300 transform hover:scale-[1.01] bg-white">
        <Link href={`/news/${news.uuid}`} className="block">
          <div className="flex p-4 gap-4">
            <div className="flex-shrink-0">
              <SafeImage
                src={news.cover_url}
                alt={news.title}
                className="w-20 h-20 rounded-lg object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              {showCategory && (
                <Badge className={`mb-2 text-xs ${getCategoryColor(news.category)} border-0`}>
                  {getCategoryLabel(news.category)}
                </Badge>
              )}
              <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-1">
                {news.title}
              </h3>
              <div className="flex items-center text-xs text-gray-500 mb-2">
                <time dateTime={getISOString(news.created_at)}>
                  {formatDate(news.created_at)}
                </time>
                <span className="mx-1">•</span>
                <span>{news.reading_time}min</span>
              </div>
              {showAuthor && (
                <div className="flex items-center gap-2">
                  <SafeAvatar
                    src={news.author_avatar_url}
                    alt={news.author_name}
                    className="w-6 h-6"
                    size="sm"
                  />
                  <span className="text-xs text-gray-600 truncate">
                    {news.author_name}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] bg-white">
      <Link href={`/news/${news.uuid}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <SafeImage
            src={news.cover_url}
            alt={news.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
          {showCategory && (
            <Badge className={`absolute top-3 left-3 text-xs font-semibold ${getCategoryColor(news.category)} border-0`}>
              {getCategoryLabel(news.category)}
            </Badge>
          )}
        </div>
        <CardContent className="p-5">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <time dateTime={getISOString(news.created_at)}>
              {formatDate(news.created_at)}
            </time>
            <span className="mx-2">•</span>
            <span>{news.reading_time} min read</span>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {news.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
            {news.description}
          </p>
          {showAuthor && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SafeAvatar
                  src={news.author_avatar_url}
                  alt={news.author_name}
                  className="w-8 h-8"
                  size="md"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {news.author_name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {news.source_name}
                  </div>
                </div>
              </div>
              {showStats && (
                <div className="flex items-center space-x-3 text-gray-500 text-sm">
                  <span className="flex items-center gap-1">
                    <Icon name="RiEyeLine" className="h-4 w-4" />
                    {Math.floor(Math.random() * 3000) + 200}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="RiChat1Line" className="h-4 w-4" />
                    {Math.floor(Math.random() * 50) + 5}
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
} 
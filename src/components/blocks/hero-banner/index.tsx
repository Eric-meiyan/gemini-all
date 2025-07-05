"use client";

import { TransformedNews } from "@/types/newsapi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import { Link } from "@/i18n/navigation";
import moment from "moment";
import Icon from "@/components/icon";

interface HeroBannerProps {
  news: TransformedNews;
  locale: string;
}

export default function HeroBanner({ news, locale }: HeroBannerProps) {
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
        return "bg-blue-800/70 text-blue-100";
      case "community":
        return "bg-green-800/70 text-green-100";
      case "releases":
        return "bg-purple-800/70 text-purple-100";
      case "tutorials":
        return "bg-orange-800/70 text-orange-100";
      default:
        return "bg-gray-800/70 text-gray-100";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "official":
        return "Latest News";
      case "community":
        return "Community";
      case "releases":
        return "New Release";
      case "tutorials":
        return "Tutorial";
      default:
        return "News";
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden mb-12 h-96 group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <SafeImage
          src={news.cover_url}
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/60 to-transparent" />

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="max-w-2xl px-8 py-6">
          <Badge className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 border-0 ${getCategoryColor(news.category)}`}>
            {getCategoryLabel(news.category)}
          </Badge>
          
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            {news.title}
          </h1>
          
          <p className="text-lg text-blue-50 mb-6 line-clamp-3 leading-relaxed">
            {news.description}
          </p>

          {/* Meta Information */}
          <div className="flex items-center text-sm text-blue-100 mb-6 gap-4">
            <div className="flex items-center gap-2">
              <Icon name="RiCalendarLine" className="h-4 w-4" />
              <time dateTime={getISOString(news.created_at)}>
                {formatDate(news.created_at)}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="RiTimeLine" className="h-4 w-4" />
              <span>{news.reading_time} min read</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="RiUserLine" className="h-4 w-4" />
              <span>{news.author_name}</span>
            </div>
          </div>

          {/* Action Button */}
          <Link href={`/news/${news.uuid}`}>
            <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
              Learn More
              <Icon name="RiArrowRightLine" className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-tl-full" />
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full" />
    </div>
  );
} 
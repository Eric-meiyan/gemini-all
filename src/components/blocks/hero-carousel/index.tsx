"use client";

import { useState, useEffect } from "react";
import { TransformedNews } from "@/types/newsapi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import { Link } from "@/i18n/navigation";
import moment from "moment";
import Icon from "@/components/icon";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

interface HeroCarouselProps {
  items: HeroCarouselItem[];
  locale: string;
}

export interface HeroCarouselItem {
  id: string;
  type: "news" | "feature" | "announcement" | "stat";
  title: string;
  description: string;
  image: string;
  category?: string;
  badge?: string;
  link?: string;
  author?: string;
  date?: Date | string;
  readingTime?: number;
  stats?: {
    label: string;
    value: string;
  }[];
}

export default function HeroCarousel({ items, locale }: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const formatDate = (date: Date | string) => {
    return moment(date).locale(locale).format("MMM DD, YYYY");
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
      case "feature":
        return "bg-indigo-800/70 text-indigo-100";
      case "announcement":
        return "bg-rose-800/70 text-rose-100";
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
      case "feature":
        return "Featured";
      case "announcement":
        return "Announcement";
      default:
        return "News";
    }
  };

  const renderCarouselItem = (item: HeroCarouselItem) => {
    const baseContent = (
      <div className="relative rounded-xl overflow-hidden h-96 group">
        {/* Background Image */}
        <div className="absolute inset-0">
          <SafeImage
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/60 to-transparent" />

        {/* Content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-2xl px-8 py-6">
            {(item.badge || item.category) && (
              <Badge className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 border-0 ${getCategoryColor(item.category || 'default')}`}>
                {item.badge || getCategoryLabel(item.category || 'default')}
              </Badge>
            )}
            
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
              {item.title}
            </h1>
            
            <p className="text-lg text-blue-50 mb-6 line-clamp-3 leading-relaxed">
              {item.description}
            </p>

            {/* Meta Information */}
            {item.type === "news" && (
              <div className="flex items-center text-sm text-blue-100 mb-6 gap-4">
                {item.date && (
                  <div className="flex items-center gap-2">
                    <Icon name="RiCalendarLine" className="h-4 w-4" />
                    <time>{formatDate(item.date)}</time>
                  </div>
                )}
                {item.readingTime && (
                  <div className="flex items-center gap-2">
                    <Icon name="RiTimeLine" className="h-4 w-4" />
                    <span>{item.readingTime} min read</span>
                  </div>
                )}
                {item.author && (
                  <div className="flex items-center gap-2">
                    <Icon name="RiUserLine" className="h-4 w-4" />
                    <span>{item.author}</span>
                  </div>
                )}
              </div>
            )}

            {/* Stats for stat type */}
            {item.type === "stat" && item.stats && (
              <div className="flex items-center gap-6 mb-6">
                {item.stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-blue-100">{stat.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Action Button */}
            {item.link && (
              <Link href={item.link}>
                <Button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                  {item.type === "news" ? "Read More" : 
                   item.type === "feature" ? "Learn More" : 
                   item.type === "announcement" ? "View Details" : 
                   "Explore"}
                  <Icon name="RiArrowRightLine" className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-tl-full" />
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/10 to-transparent rounded-bl-full" />
      </div>
    );

    return baseContent;
  };

  if (!items || items.length === 0) {
    return null;
  }

  // Single item - no carousel
  if (items.length === 1) {
    return <div className="mb-12">{renderCarouselItem(items[0])}</div>;
  }

  return (
    <div className="mb-12">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
        ]}
      >
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem key={item.id}>
              {renderCarouselItem(item)}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
      
      {/* Carousel Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === current - 1 
                ? "bg-blue-600 scale-110" 
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}

// Helper function to convert news to carousel item
export function newsToCarouselItem(news: TransformedNews): HeroCarouselItem {
  return {
    id: news.uuid,
    type: "news",
    title: news.title,
    description: news.description,
    image: news.cover_url,
    category: news.category,
    link: `/news/${news.uuid}`,
    author: news.author_name,
    date: news.created_at,
    readingTime: news.reading_time,
  };
}
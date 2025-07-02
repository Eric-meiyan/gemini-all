"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import moment from "moment";

// Mock data for now - will be replaced with real data later
const mockNews = [
  {
    uuid: "1",
    title: "Google Gemini 2.0 Flash Released with Enhanced CLI Support",
    description: "The latest version of Google Gemini introduces improved command-line interface capabilities with better performance and new features.",
    category: "official",
    author_name: "Google AI Team",
    author_avatar_url: "/imgs/users/google-team.png",
    cover_url: "/imgs/news/gemini-2-0-flash.png",
    created_at: new Date("2024-12-15"),
    reading_time: 5,
    featured: true,
    tags: ["gemini", "cli", "release", "google"],
    source_url: "https://developers.googleblog.com/gemini-2-0-flash"
  },
  {
    uuid: "2", 
    title: "Community Tutorial: Advanced Gemini CLI Workflows",
    description: "Learn how to create sophisticated automation workflows using Gemini CLI with real-world examples and best practices.",
    category: "tutorials",
    author_name: "Alex Chen",
    author_avatar_url: "/imgs/users/alex-chen.png",
    cover_url: "/imgs/news/cli-workflows.png",
    created_at: new Date("2024-12-14"),
    reading_time: 8,
    featured: false,
    tags: ["tutorial", "workflow", "automation", "advanced"],
    source_url: "https://medium.com/gemini-cli-advanced-workflows"
  },
  {
    uuid: "3",
    title: "New CLI Extensions Available in Marketplace",
    description: "Discover the latest community-developed extensions that enhance your Gemini CLI experience with additional functionality.",
    category: "community",
    author_name: "CLI Hub Team",
    author_avatar_url: "/imgs/users/cli-hub.png", 
    cover_url: "/imgs/news/marketplace-extensions.png",
    created_at: new Date("2024-12-13"),
    reading_time: 4,
    featured: false,
    tags: ["extensions", "marketplace", "community"],
    source_url: "#"
  }
];

interface NewsContentProps {
  locale: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function NewsContent({ locale, searchParams }: NewsContentProps) {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState((searchParams.q as string) || "");
  const [selectedCategory, setSelectedCategory] = useState((searchParams.category as string) || "all");
  const [sortBy, setSortBy] = useState((searchParams.sort as string) || "latest");
  const [filteredNews, setFilteredNews] = useState(mockNews);

  const categories = [
    { value: "all", label: t("common.all") },
    { value: "official", label: t("news.categories.official") },
    { value: "community", label: t("news.categories.community") },
    { value: "releases", label: t("news.categories.releases") },
    { value: "tutorials", label: t("news.categories.tutorials") }
  ];

  useEffect(() => {
    let filtered = mockNews;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(news => 
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        news.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(news => news.category === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "latest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "popular":
        // Would sort by view_count in real implementation
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredNews(filtered);
  }, [searchQuery, selectedCategory, sortBy]);

  const formatDate = (date: Date) => {
    return moment(date).locale(locale).format("MMM DD, YYYY");
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "official": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "community": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "releases": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "tutorials": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{t("news.title")}</h1>
        <p className="text-muted-foreground text-lg">{t("news.description")}</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Icon name="RiSearchLine" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t("common.search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder={t("common.categories")} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">{t("common.latest")}</SelectItem>
            <SelectItem value="popular">{t("common.popular")}</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Featured News */}
      {filteredNews.some(news => news.featured) && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("common.featured")}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {filteredNews.filter(news => news.featured).map((news) => (
              <Card key={news.uuid} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img 
                    src={news.cover_url} 
                    alt={news.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className={`absolute top-4 left-4 ${getCategoryColor(news.category)}`}>
                    {t(`news.categories.${news.category}`)}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{news.title}</h3>
                  <p className="text-muted-foreground mb-4">{news.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img 
                        src={news.author_avatar_url} 
                        alt={news.author_name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="text-sm">
                        <p className="font-medium">{news.author_name}</p>
                        <p className="text-muted-foreground">{formatDate(news.created_at)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {news.reading_time} {t("common.reading_time")}
                      </span>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={news.source_url} target="_blank">
                          {t("common.read_more")}
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

      {/* All News */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("common.latest")}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredNews.map((news) => (
            <Card key={news.uuid} className="overflow-hidden">
              <div className="aspect-video relative">
                <img 
                  src={news.cover_url} 
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
                <Badge className={`absolute top-4 left-4 ${getCategoryColor(news.category)}`}>
                  {t(`news.categories.${news.category}`)}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">{news.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{news.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img 
                      src={news.author_avatar_url} 
                      alt={news.author_name}
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="text-xs">
                      <p className="font-medium">{news.author_name}</p>
                      <p className="text-muted-foreground">{formatDate(news.created_at)}</p>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={news.source_url} target="_blank">
                      <Icon name="RiArrowRightLine" className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <Icon name="RiArrowLeftLine" className="h-4 w-4" />
            Previous
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
            1
          </Button>
          <Button variant="outline" size="sm">
            2
          </Button>
          <Button variant="outline" size="sm">
            3
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="RiArrowRightLine" className="h-4 w-4" />
            Next
          </Button>
        </div>
      </div>
    </div>
  );
} 
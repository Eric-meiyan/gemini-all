"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import moment from "moment";

// Mock data for blogs
const mockBlogs = [
  {
    uuid: "1",
    title: "Getting Started with Gemini CLI: A Complete Guide",
    description: "Learn the fundamentals of Gemini CLI from installation to advanced usage patterns. Perfect for beginners looking to master AI-powered command line tools.",
    content_type: "blog",
    author_name: "Sarah Johnson",
    author_avatar_url: "/imgs/users/sarah-johnson.png",
    cover_url: "/imgs/blogs/getting-started-guide.png",
    created_at: new Date("2024-12-10"),
    reading_time: 12,
    featured: true,
    tags: ["getting-started", "beginner", "tutorial"],
    difficulty: "beginner",
    view_count: 1520,
    source_url: "/blogs/getting-started-gemini-cli"
  },
  {
    uuid: "2",
    title: "Advanced API Integration Patterns with Gemini CLI",
    description: "Explore sophisticated patterns for integrating Gemini CLI with external APIs, including error handling, rate limiting, and async operations.",
    content_type: "blog",
    author_name: "Alex Chen",
    author_avatar_url: "/imgs/users/alex-chen.png",
    cover_url: "/imgs/blogs/api-integration.png",
    created_at: new Date("2024-12-08"),
    reading_time: 18,
    featured: true,
    tags: ["api", "advanced", "integration", "patterns"],
    difficulty: "advanced",
    view_count: 890,
    source_url: "/blogs/advanced-api-integration"
  },
  {
    uuid: "3",
    title: "Gemini CLI Performance Optimization Tips",
    description: "Discover techniques to optimize your Gemini CLI applications for better performance, including caching strategies and efficient prompt design.",
    content_type: "blog",
    author_name: "Mike Rodriguez",
    author_avatar_url: "/imgs/users/mike-rodriguez.png",
    cover_url: "/imgs/blogs/performance-optimization.png",
    created_at: new Date("2024-12-05"),
    reading_time: 15,
    featured: false,
    tags: ["performance", "optimization", "best-practices"],
    difficulty: "intermediate",
    view_count: 645,
    source_url: "/blogs/performance-optimization"
  },
  {
    uuid: "4",
    title: "Building Secure Gemini CLI Applications",
    description: "Essential security practices for Gemini CLI applications, including API key management, input validation, and data protection.",
    content_type: "blog",
    author_name: "Emily Davis",
    author_avatar_url: "/imgs/users/emily-davis.png",
    cover_url: "/imgs/blogs/security-practices.png",
    created_at: new Date("2024-12-03"),
    reading_time: 10,
    featured: false,
    tags: ["security", "best-practices", "api-keys"],
    difficulty: "intermediate",
    view_count: 432,
    source_url: "/blogs/security-practices"
  },
  {
    uuid: "5",
    title: "Troubleshooting Common Gemini CLI Issues",
    description: "A comprehensive guide to diagnosing and fixing the most common issues developers encounter when working with Gemini CLI.",
    content_type: "blog",
    author_name: "David Kim",
    author_avatar_url: "/imgs/users/david-kim.png",
    cover_url: "/imgs/blogs/troubleshooting.png",
    created_at: new Date("2024-12-01"),
    reading_time: 8,
    featured: false,
    tags: ["troubleshooting", "debugging", "common-issues"],
    difficulty: "beginner",
    view_count: 789,
    source_url: "/blogs/troubleshooting"
  }
];

const allTags = [
  "getting-started", "beginner", "tutorial", "api", "advanced", 
  "integration", "patterns", "performance", "optimization", 
  "best-practices", "security", "api-keys", "troubleshooting", "debugging"
];

interface BlogsContentProps {
  locale: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function BlogsContent({ locale, searchParams }: BlogsContentProps) {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState((searchParams.q as string) || "");
  const [selectedTag, setSelectedTag] = useState((searchParams.tag as string) || "all");
  const [selectedDifficulty, setSelectedDifficulty] = useState((searchParams.difficulty as string) || "all");
  const [sortBy, setSortBy] = useState((searchParams.sort as string) || "latest");
  const [filteredBlogs, setFilteredBlogs] = useState(mockBlogs);

  const difficulties = [
    { value: "all", label: t("common.all") },
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" }
  ];

  const tags = [
    { value: "all", label: t("common.all") },
    ...allTags.map(tag => ({ 
      value: tag, 
      label: tag.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    }))
  ];

  useEffect(() => {
    let filtered = mockBlogs;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by tag
    if (selectedTag !== "all") {
      filtered = filtered.filter(blog => blog.tags.includes(selectedTag));
    }

    // Filter by difficulty
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter(blog => blog.difficulty === selectedDifficulty);
    }

    // Sort
    switch (sortBy) {
      case "latest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "popular":
        filtered.sort((a, b) => b.view_count - a.view_count);
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredBlogs(filtered);
  }, [searchQuery, selectedTag, selectedDifficulty, sortBy]);

  const formatDate = (date: Date) => {
    return moment(date).locale(locale).format("MMM DD, YYYY");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{t("blogs.title")}</h1>
        <p className="text-muted-foreground text-lg">{t("blogs.description")}</p>
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
        
        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder={t("common.tags")} />
          </SelectTrigger>
          <SelectContent>
            {tags.map((tag) => (
              <SelectItem key={tag.value} value={tag.value}>
                {tag.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map((difficulty) => (
              <SelectItem key={difficulty.value} value={difficulty.value}>
                {difficulty.label}
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

      {/* Featured Blogs */}
      {filteredBlogs.some(blog => blog.featured) && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t("common.featured")}</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {filteredBlogs.filter(blog => blog.featured).map((blog) => (
              <Card key={blog.uuid} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img 
                    src={blog.cover_url} 
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className={`absolute top-4 left-4 ${getDifficultyColor(blog.difficulty)}`}>
                    {blog.difficulty}
                  </Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                  <p className="text-muted-foreground mb-4">{blog.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {blog.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{blog.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={blog.author_avatar_url} alt={blog.author_name} />
                        <AvatarFallback>{blog.author_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="text-sm">
                        <p className="font-medium">{blog.author_name}</p>
                        <p className="text-muted-foreground">{formatDate(blog.created_at)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {blog.reading_time} {t("common.reading_time")}
                      </span>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={blog.source_url}>
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

      {/* All Blogs */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">{t("common.latest")}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBlogs.map((blog) => (
            <Card key={blog.uuid} className="overflow-hidden">
              <div className="aspect-video relative">
                <img 
                  src={blog.cover_url} 
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
                <Badge className={`absolute top-4 left-4 ${getDifficultyColor(blog.difficulty)}`}>
                  {blog.difficulty}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">{blog.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{blog.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {blog.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {blog.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{blog.tags.length - 2}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={blog.author_avatar_url} alt={blog.author_name} />
                      <AvatarFallback className="text-xs">{blog.author_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-xs">
                      <p className="font-medium">{blog.author_name}</p>
                      <p className="text-muted-foreground">{formatDate(blog.created_at)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {blog.reading_time}m
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={blog.source_url}>
                        <Icon name="RiArrowRightLine" className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
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
// 通用内容类型定义

// 基础内容接口
export interface BaseContent {
  uuid: string;
  slug: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date;
  status: "draft" | "published" | "archived";
  locale: string;
  tags: string[];
  viewCount: number;
  featured: boolean;
}

// 作者信息接口
export interface Author {
  name: string;
  avatarUrl?: string;
  bio?: string;
  socialLinks?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

// 内容分类
export type ContentCategory = 
  | "tutorial" 
  | "development" 
  | "performance" 
  | "security" 
  | "support" 
  | "workflow" 
  | "community"
  | "official" 
  | "releases" 
  | "tools" 
  | "blog";

// 难度等级
export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

// 内容类型
export type ContentType = "blog" | "news" | "tool" | "page";

// 博客文章接口
export interface BlogPost extends BaseContent {
  contentType: "blog";
  content?: string;
  coverUrl?: string;
  author?: Author;
  authorName?: string; // 向后兼容
  authorAvatarUrl?: string; // 向后兼容
  category?: ContentCategory;
  sourceUrl?: string;
  githubUrl?: string;
  rating?: number;
  difficulty?: DifficultyLevel;
  readingTime?: number;
}

// 新闻文章接口
export interface NewsArticle extends BaseContent {
  contentType: "news";
  category: ContentCategory;
  author?: Author;
  authorName: string; // 向后兼容
  authorAvatarUrl: string; // 向后兼容
  coverUrl: string;
  readingTime: number;
  sourceUrl: string;
  sourceName: string;
}

// 工具评测接口
export interface ToolReview extends BaseContent {
  contentType: "tool";
  id: string; // 兼容现有的 id 字段
  name: string; // 兼容现有的 name 字段
  category: string;
  longDescription?: string;
  logo: string;
  screenshots: string[];
  version: string;
  developer: string;
  website: string;
  github?: string;
  downloadUrl?: string;
  price: "free" | "freemium" | "paid";
  priceDetails?: string;
  
  // Ratings
  overallRating: number; // 1-5
  ratings: {
    performance: number;
    usability: number;
    features: number;
    support: number;
  };
  reviewCount: number;
  
  // Features
  features: string[];
  platforms: string[]; // ["Windows", "macOS", "Linux", "Web"]
  languages: string[]; // Programming languages supported
  integrations: string[]; // Other tools it integrates with
  
  verified: boolean; // Verified by our team
  pros: string[];
  cons: string[];
  useCase: string; // Brief description of when to use this tool
}

// 搜索选项基础接口
export interface BaseSearchOptions {
  query?: string;
  category?: string;
  tag?: string;
  difficulty?: DifficultyLevel | "all";
  sortBy?: "latest" | "popular" | "alphabetical" | "rating";
  limit?: number;
  offset?: number;
  locale?: string;
  featured?: boolean;
}

// 搜索响应基础接口
export interface BaseSearchResponse<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  categories: string[];
  tags: string[];
}

// 博客搜索选项
export interface BlogSearchOptions extends BaseSearchOptions {
  contentType?: "blog";
}

// 博客搜索响应
export interface BlogSearchResponse extends BaseSearchResponse<BlogPost> {
  posts: BlogPost[]; // 向后兼容
}

// 新闻搜索选项
export interface NewsSearchOptions extends BaseSearchOptions {
  contentType?: "news";
}

// 新闻搜索响应
export interface NewsSearchResponse extends BaseSearchResponse<NewsArticle> {
  articles: NewsArticle[];
}

// 工具搜索选项
export interface ToolSearchOptions extends BaseSearchOptions {
  contentType?: "tool";
  priceType?: "free" | "freemium" | "paid";
  platform?: string;
  language?: string;
}

// 工具搜索响应
export interface ToolSearchResponse extends BaseSearchResponse<ToolReview> {
  tools: ToolReview[];
}

// 统一搜索选项
export interface UnifiedSearchOptions extends BaseSearchOptions {
  contentTypes?: ContentType[];
}

// 统一搜索结果
export interface UnifiedSearchResult {
  blogs: BlogPost[];
  news: NewsArticle[];
  tools: ToolReview[];
  total: number;
  facets: {
    categories: Array<{ name: string; count: number }>;
    tags: Array<{ name: string; count: number }>;
    contentTypes: Array<{ type: ContentType; count: number }>;
  };
}

// 评论系统类型
export interface CommentConfig {
  repo: string;
  repoId: string;
  categoryId: string;
  lang: string;
}

// Giscus 分类映射
export type GiscusCategory = "General" | "Ideas" | "Q&A" | "Show and tell" | "Announcements";
// NewsAPI types for Gemini CLI Hub
export interface NewsAPISource {
  id: string | null;
  name: string;
}

export interface NewsAPIArticle {
  source: NewsAPISource;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

export interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

export interface NewsAPIError {
  status: string;
  code: string;
  message: string;
}

// Our transformed news item type
export interface TransformedNews {
  uuid: string;
  title: string;
  description: string;
  category: "official" | "community" | "releases" | "tutorials" | "tools" | "blog";
  author_name: string;
  author_avatar_url: string;
  cover_url: string;
  created_at: Date | string; // Can be Date object or string (after JSON serialization)
  reading_time: number;
  featured: boolean;
  tags: string[];
  source_url: string;
  source_name: string;
} 
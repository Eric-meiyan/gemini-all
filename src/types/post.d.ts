export interface Post {
  id: number;
  uuid: string;
  slug?: string;
  title?: string;
  description?: string;
  content?: string;
  created_at?: Date;
  updated_at?: Date;
  status: "draft" | "published";
  cover_url?: string;
  author_name?: string;
  author_avatar_url?: string;
  locale: string;
  // New fields for content types
  content_type: "news" | "blog" | "tool";
  category?: string;
  tags?: string; // JSON array of tags
  source_url?: string; // Original article URL
  github_url?: string; // GitHub repository (for tools)
  rating?: number; // Rating 1-5 (for tools)
  difficulty?: "beginner" | "intermediate" | "advanced";
  view_count: number;
  featured: boolean;
  reading_time?: number; // estimated reading time in minutes
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  count: number;
  created_at: Date;
}

export interface Bookmark {
  id: number;
  user_uuid: string;
  post_uuid: string;
  created_at: Date;
}

export interface Subscription {
  id: number;
  email: string;
  status: "active" | "unsubscribed";
  created_at: Date;
  confirmed_at?: Date;
  categories?: string; // JSON array of subscribed categories
}

export interface ContentView {
  id: number;
  post_uuid: string;
  user_uuid?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

// Content type specific interfaces
export interface NewsPost extends Post {
  content_type: "news";
  category?: "official" | "community" | "releases" | "tutorials";
}

export interface BlogPost extends Post {
  content_type: "blog";
  tags?: string[];
  reading_time?: number;
}

export interface ToolPost extends Post {
  content_type: "tool";
  category?: "cli_extensions" | "ide_plugins" | "config_tools" | "monitoring" | "development";
  github_url?: string;
  rating?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
}

// Content filters and search
export interface ContentFilter {
  content_type?: "news" | "blog" | "tool";
  category?: string;
  tags?: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
  featured?: boolean;
  status?: "draft" | "published";
  locale?: string;
}

export interface ContentSearchParams {
  query?: string;
  filter?: ContentFilter;
  sort?: "latest" | "popular" | "rating" | "alphabetical";
  page?: number;
  limit?: number;
}

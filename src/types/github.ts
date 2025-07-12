// GitHub API 相关类型定义
export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
  topics: string[];
  license?: {
    key: string;
    name: string;
    spdx_id: string;
  };
  owner: {
    login: string;
    id: number;
    avatar_url: string;
    html_url: string;
    type: string;
  };
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  draft: boolean;
  prerelease: boolean;
  created_at: string;
  published_at: string;
  html_url: string;
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
  assets: Array<{
    name: string;
    size: number;
    download_count: number;
    browser_download_url: string;
  }>;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
  };
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
  html_url: string;
}

export interface GitHubContributor {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  contributions: number;
  type: string;
}

export interface GitHubStats {
  repository: GitHubRepository;
  releases: GitHubRelease[];
  recentCommits: GitHubCommit[];
  contributors: GitHubContributor[];
  // 计算的统计数据
  stats: {
    totalCommits: number;
    totalReleases: number;
    lastCommitDate: string;
    lastReleaseDate: string;
    contributorsCount: number;
    issuesCount: number;
    healthScore: number; // 0-100 项目健康度评分
  };
}

// 项目配置类型
export interface GitHubProjectConfig {
  owner: string;
  repo: string;
  displayName: string;
  description: string;
  category: string;
  featured: boolean;
}

// API 响应类型
export interface GitHubApiResponse<T> {
  data: T | null;
  error: string | null;
  lastUpdated: string;
  rateLimit?: {
    remaining: number;
    reset: number;
  };
}

// 缓存相关类型
export interface GitHubDataCache {
  [key: string]: {
    data: GitHubStats;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
  };
}
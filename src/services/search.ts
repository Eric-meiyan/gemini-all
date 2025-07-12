// 全站搜索服务
import { TransformedNews } from "@/types/newsapi";
import { ToolReview } from "@/types/tools";
import { GitHubStats } from "@/types/github";
import { getTools } from "@/services/tools";
import { getMultipleProjectStats, githubProjects } from "@/services/github";
import { getBlogPosts } from "@/services/blog";

// 搜索结果类型定义
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  content?: string;
  url: string;
  type: "news" | "tools" | "faq" | "github" | "blog";
  category?: string;
  tags: string[];
  author?: string;
  createdAt: Date;
  updatedAt?: Date;
  score: number; // 相关性评分
  thumbnail?: string;
  metadata?: {
    rating?: number;
    starCount?: number;
    forkCount?: number;
    issueCount?: number;
    healthScore?: number;
  };
}

export interface SearchOptions {
  query: string;
  type?: "all" | "news" | "tools" | "faq" | "github" | "blog";
  sortBy?: "relevance" | "latest" | "oldest" | "rating" | "alphabetical";
  limit?: number;
  offset?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  hasMore: boolean;
  query: string;
  suggestions?: string[];
}

// FAQ数据 (从FAQ组件中提取)
const faqData = [
  {
    id: "install-gemini-cli",
    question: "How do I install Gemini CLI?",
    questionZh: "如何安装 Gemini CLI？",
    answer: "You can install Gemini CLI in several ways...",
    answerZh: "您可以通过以下方式安装 Gemini CLI...",
    category: "installation",
    tags: ["installation", "setup", "npm", "download"],
  },
  {
    id: "api-key-setup", 
    question: "How do I set up API keys?",
    questionZh: "如何配置 API 密钥？",
    answer: "Setting up API keys is straightforward...",
    answerZh: "配置 API 密钥非常简单...",
    category: "installation",
    tags: ["api", "key", "configuration", "setup"],
  },
  {
    id: "basic-usage",
    question: "What are the basic usage commands for Gemini CLI?",
    questionZh: "Gemini CLI 的基本使用方法是什么？",
    answer: "Here are some common basic commands...",
    answerZh: "以下是一些常用的基本命令...",
    category: "usage",
    tags: ["commands", "basic", "generate", "review"],
  },
  {
    id: "ide-integration",
    question: "How do I integrate Gemini CLI with my IDE?",
    questionZh: "如何将 Gemini CLI 集成到我的 IDE 中？",
    answer: "Gemini CLI supports various IDE integrations...",
    answerZh: "Gemini CLI 支持多种 IDE 集成...",
    category: "usage",
    tags: ["ide", "integration", "vscode", "jetbrains", "vim"],
  },
  {
    id: "error-rate-limit",
    question: "What should I do when I get \"Rate limit exceeded\" error?",
    questionZh: "遇到 \"Rate limit exceeded\" 错误怎么办？",
    answer: "When encountering rate limit errors...",
    answerZh: "当遇到速率限制错误时，您可以...",
    category: "troubleshooting",
    tags: ["error", "rate-limit", "quota", "troubleshooting"],
  },
  {
    id: "custom-prompts",
    question: "How do I create and manage custom prompt templates?",
    questionZh: "如何创建和管理自定义提示模板？",
    answer: "You can create reusable prompt templates...",
    answerZh: "您可以创建可重用的提示模板...",
    category: "advanced",
    tags: ["templates", "prompts", "customization", "advanced"],
  },
  {
    id: "performance-optimization", 
    question: "How can I optimize Gemini CLI performance?",
    questionZh: "如何优化 Gemini CLI 的性能？",
    answer: "Several ways to improve Gemini CLI performance...",
    answerZh: "提升 Gemini CLI 性能的几种方法...",
    category: "advanced",
    tags: ["performance", "optimization", "cache", "concurrent"],
  },
  {
    id: "troubleshooting-common",
    question: "What are common troubleshooting steps?",
    questionZh: "常见的故障排除步骤有哪些？",
    answer: "Standard troubleshooting workflow when encountering issues...",
    answerZh: "遇到问题时的标准排查流程...",
    category: "troubleshooting",
    tags: ["troubleshooting", "debugging", "issues", "help"],
  }
];

// 文本相似度计算
function calculateRelevanceScore(query: string, text: string, boost: number = 1): number {
  if (!query || !text) return 0;
  
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  
  let score = 0;
  
  // 完全匹配
  if (textLower === queryLower) score += 100;
  
  // 包含完整查询词
  if (textLower.includes(queryLower)) score += 50;
  
  // 分词匹配
  const queryWords = queryLower.split(/\s+/);
  const textWords = textLower.split(/\s+/);
  
  queryWords.forEach(queryWord => {
    if (queryWord.length < 2) return;
    
    textWords.forEach(textWord => {
      if (textWord.includes(queryWord)) {
        score += 20;
      } else if (queryWord.includes(textWord) && textWord.length > 2) {
        score += 10;
      }
    });
  });
  
  return score * boost;
}

// 搜索新闻内容
export async function searchNews(query: string, news: TransformedNews[], locale: string = 'en'): Promise<SearchResult[]> {
  if (!query.trim() || !news.length) return [];
  
  const results: SearchResult[] = [];
  
  news.forEach(item => {
    let score = 0;
    
    // 计算相关性评分
    score += calculateRelevanceScore(query, item.title, 3);
    score += calculateRelevanceScore(query, item.description, 2);
    score += calculateRelevanceScore(query, item.author_name, 1);
    
    // 标签匹配
    item.tags.forEach(tag => {
      score += calculateRelevanceScore(query, tag, 1.5);
    });
    
    if (score > 0) {
      results.push({
        id: item.uuid,
        title: item.title,
        description: item.description,
        url: `/news/${item.uuid}`,
        type: "news",
        category: item.category,
        tags: item.tags,
        author: item.author_name,
        createdAt: new Date(item.created_at),
        score,
        thumbnail: item.cover_url
      });
    }
  });
  
  return results;
}

// 搜索工具评测
export async function searchTools(query: string, locale: string = 'en'): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  
  try {
    const tools = await getTools();
    const results: SearchResult[] = [];
    
    tools.forEach(tool => {
      let score = 0;
      
      // 计算相关性评分
      score += calculateRelevanceScore(query, tool.name, 3);
      score += calculateRelevanceScore(query, tool.description, 2);
      score += calculateRelevanceScore(query, tool.developer, 1.5);
      score += calculateRelevanceScore(query, tool.category, 1.5);
      
      // 特性匹配
      tool.features.forEach(feature => {
        score += calculateRelevanceScore(query, feature, 1);
      });
      
      // 标签匹配
      tool.tags.forEach(tag => {
        score += calculateRelevanceScore(query, tag, 1.5);
      });
      
      // 优缺点匹配
      tool.pros.forEach(pro => {
        score += calculateRelevanceScore(query, pro, 0.8);
      });
      tool.cons.forEach(con => {
        score += calculateRelevanceScore(query, con, 0.8);
      });
      
      if (score > 0) {
        results.push({
          id: tool.id,
          title: tool.name,
          description: tool.description,
          url: `/tools/${tool.id}`,
          type: "tools",
          category: tool.category,
          tags: tool.tags,
          createdAt: tool.createdAt,
          updatedAt: tool.updatedAt,
          score,
          thumbnail: tool.logo,
          metadata: {
            rating: tool.overallRating
          }
        });
      }
    });
    
    return results;
  } catch (error) {
    console.error('Error searching tools:', error);
    return [];
  }
}

// 搜索FAQ
export async function searchFAQ(query: string, locale: string = 'en'): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  
  const results: SearchResult[] = [];
  
  faqData.forEach(faq => {
    let score = 0;
    
    const question = locale === 'zh' ? faq.questionZh : faq.question;
    const answer = locale === 'zh' ? faq.answerZh : faq.answer;
    
    // 计算相关性评分
    score += calculateRelevanceScore(query, question, 3);
    score += calculateRelevanceScore(query, answer, 2);
    
    // 标签匹配
    faq.tags.forEach(tag => {
      score += calculateRelevanceScore(query, tag, 1.5);
    });
    
    if (score > 0) {
      results.push({
        id: faq.id,
        title: question,
        description: answer.substring(0, 200) + "...",
        content: answer,
        url: `/faq#${faq.id}`,
        type: "faq",
        category: faq.category,
        tags: faq.tags,
        createdAt: new Date('2024-01-01'), // FAQ没有明确日期，使用默认值
        score
      });
    }
  });
  
  return results;
}

// 搜索博客文章
export async function searchBlog(query: string, locale: string = 'en'): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  
  try {
    const response = await getBlogPosts({ query: query, limit: 50 });
    const results: SearchResult[] = [];
    
    response.posts.forEach(post => {
      let score = 0;
      
      // 计算相关性评分
      score += calculateRelevanceScore(query, post.title, 3);
      score += calculateRelevanceScore(query, post.description, 2);
      score += calculateRelevanceScore(query, post.authorName || '', 1);
      score += calculateRelevanceScore(query, post.category || '', 1.5);
      
      // 标签匹配
      post.tags.forEach(tag => {
        score += calculateRelevanceScore(query, tag, 1.5);
      });
      
      // 内容匹配（如果有内容）
      if (post.content) {
        score += calculateRelevanceScore(query, post.content, 1);
      }
      
      if (score > 0) {
        results.push({
          id: post.uuid,
          title: post.title,
          description: post.description,
          content: post.content,
          url: `/blog/posts/${post.slug}`,
          type: "blog",
          category: post.category,
          tags: post.tags,
          author: post.authorName,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          score,
          thumbnail: post.coverUrl,
          metadata: {
            rating: post.rating
          }
        });
      }
    });
    
    return results;
  } catch (error) {
    console.error('Error searching blog:', error);
    return [];
  }
}
export async function searchGitHub(query: string, locale: string = 'en'): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  
  try {
    const response = await getMultipleProjectStats(githubProjects);
    if (!response.data) return [];
    
    const results: SearchResult[] = [];
    
    response.data.forEach(stats => {
      let score = 0;
      const repo = stats.repository;
      
      // 计算相关性评分
      score += calculateRelevanceScore(query, repo.name, 3);
      score += calculateRelevanceScore(query, repo.description || '', 2);
      score += calculateRelevanceScore(query, repo.language || '', 1.5);
      
      // 主题匹配
      repo.topics.forEach(topic => {
        score += calculateRelevanceScore(query, topic, 1.5);
      });
      
      if (score > 0) {
        results.push({
          id: repo.id.toString(),
          title: repo.name,
          description: repo.description || 'No description available',
          url: repo.html_url,
          type: "github",
          category: "open-source",
          tags: repo.topics || [],
          author: repo.owner.login,
          createdAt: new Date(repo.created_at),
          updatedAt: new Date(repo.updated_at),
          score,
          thumbnail: repo.owner.avatar_url,
          metadata: {
            starCount: repo.stargazers_count,
            forkCount: repo.forks_count,
            issueCount: repo.open_issues_count,
            healthScore: stats.stats.healthScore
          }
        });
      }
    });
    
    return results;
  } catch (error) {
    console.error('Error searching GitHub:', error);
    return [];
  }
}

// 综合搜索
export async function searchAll(options: SearchOptions, news: TransformedNews[] = [], locale: string = 'en'): Promise<SearchResponse> {
  const { query, type = 'all', sortBy = 'relevance', limit = 20, offset = 0 } = options;
  
  if (!query.trim()) {
    return {
      results: [],
      total: 0,
      hasMore: false,
      query,
      suggestions: []
    };
  }
  
  let allResults: SearchResult[] = [];
  
  try {
    // 根据类型搜索不同内容源
    if (type === 'all' || type === 'news') {
      const newsResults = await searchNews(query, news, locale);
      allResults = allResults.concat(newsResults);
    }
    
    if (type === 'all' || type === 'tools') {
      const toolResults = await searchTools(query, locale);
      allResults = allResults.concat(toolResults);
    }
    
    if (type === 'all' || type === 'faq') {
      const faqResults = await searchFAQ(query, locale);
      allResults = allResults.concat(faqResults);
    }
    
    if (type === 'all' || type === 'github') {
      const githubResults = await searchGitHub(query, locale);
      allResults = allResults.concat(githubResults);
    }
    
    if (type === 'all' || type === 'blog') {
      const blogResults = await searchBlog(query, locale);
      allResults = allResults.concat(blogResults);
    }
    
    // 排序
    allResults.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return b.score - a.score;
        case 'latest':
          return (b.updatedAt || b.createdAt).getTime() - (a.updatedAt || a.createdAt).getTime();
        case 'oldest':
          return (a.updatedAt || a.createdAt).getTime() - (b.updatedAt || b.createdAt).getTime();
        case 'rating':
          return (b.metadata?.rating || 0) - (a.metadata?.rating || 0);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return b.score - a.score;
      }
    });
    
    // 分页
    const total = allResults.length;
    const paginatedResults = allResults.slice(offset, offset + limit);
    const hasMore = offset + limit < total;
    
    // 生成搜索建议（简单实现）
    const suggestions = generateSearchSuggestions(query, allResults);
    
    return {
      results: paginatedResults,
      total,
      hasMore,
      query,
      suggestions
    };
    
  } catch (error) {
    console.error('Error in searchAll:', error);
    return {
      results: [],
      total: 0,
      hasMore: false,
      query,
      suggestions: []
    };
  }
}

// 生成搜索建议
function generateSearchSuggestions(query: string, results: SearchResult[]): string[] {
  const suggestions: Set<string> = new Set();
  
  // 从搜索结果中提取相关关键词
  results.slice(0, 10).forEach(result => {
    // 提取标签
    result.tags.forEach(tag => {
      if (tag.toLowerCase().includes(query.toLowerCase()) || 
          query.toLowerCase().includes(tag.toLowerCase())) {
        suggestions.add(tag);
      }
    });
    
    // 提取类别
    if (result.category) {
      suggestions.add(result.category);
    }
  });
  
  // 预定义的热门搜索词
  const popularTerms = [
    "Gemini API", "CLI tools", "productivity", "automation", 
    "development", "plugins", "tutorials", "workflow",
    "AI assistant", "code generation", "troubleshooting"
  ];
  
  popularTerms.forEach(term => {
    if (term.toLowerCase().includes(query.toLowerCase())) {
      suggestions.add(term);
    }
  });
  
  return Array.from(suggestions).slice(0, 5);
}

// 获取热门搜索词
export function getPopularSearchTerms(locale: string = 'en'): string[] {
  return locale === 'zh' 
    ? ["Gemini API", "CLI 工具", "生产力", "自动化", "开发", "插件", "教程", "工作流"]
    : ["Gemini API", "CLI tools", "productivity", "automation", "development", "plugins", "tutorials", "workflow"];
}

// 获取搜索历史（本地存储）
export function getSearchHistory(): string[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const history = localStorage.getItem('gemini-search-history');
    return history ? JSON.parse(history) : [];
  } catch {
    return [];
  }
}

// 保存搜索历史
export function saveSearchHistory(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) return;
  
  try {
    const history = getSearchHistory();
    const newHistory = [query, ...history.filter(q => q !== query)].slice(0, 10);
    localStorage.setItem('gemini-search-history', JSON.stringify(newHistory));
  } catch (error) {
    console.error('Error saving search history:', error);
  }
}

// 清除搜索历史
export function clearSearchHistory(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('gemini-search-history');
  } catch (error) {
    console.error('Error clearing search history:', error);
  }
}
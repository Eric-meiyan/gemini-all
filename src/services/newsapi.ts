import { NewsAPIResponse, NewsAPIArticle, TransformedNews } from '@/types/newsapi';

const NEWS_API_KEY = process.env.NEWS_API_KEY || process.env.NEXT_PUBLIC_NEWS_API_KEY;
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';

// Category mapping based on source and keywords
const getCategoryFromArticle = (article: NewsAPIArticle): "official" | "community" | "releases" | "tutorials" | "tools" | "blog" => {
  const title = article.title.toLowerCase();
  const description = (article.description || '').toLowerCase();
  const source = article.source.name.toLowerCase();
  
  // Official sources
  if (source.includes('google') || source.includes('developers') || source.includes('cloud')) {
    return 'official';
  }
  
  // Tool reviews and experiences
  if (title.includes('review') || title.includes('experience') || title.includes('using') ||
      title.includes('tool') || title.includes('efficiency') || title.includes('productivity') ||
      title.includes('refactor') || title.includes('boost') || title.includes('improve') ||
      description.includes('review') || description.includes('using') || description.includes('tool') ||
      description.includes('efficiency') || description.includes('productivity')) {
    return 'tools';
  }
  
  // Developer blogs and insights
  if (title.includes('development') || title.includes('plugin') || title.includes('api') ||
      title.includes('integration') || title.includes('workflow') || title.includes('tips') ||
      title.includes('insight') || title.includes('experience') || title.includes('build') ||
      description.includes('development') || description.includes('plugin') || description.includes('workflow') ||
      description.includes('insight') || description.includes('build')) {
    return 'blog';
  }
  
  // Release keywords
  if (title.includes('release') || title.includes('version') || title.includes('update') || 
      description.includes('release') || description.includes('version')) {
    return 'releases';
  }
  
  // Tutorial keywords
  if (title.includes('tutorial') || title.includes('guide') || title.includes('how to') ||
      description.includes('tutorial') || description.includes('guide') || description.includes('learn')) {
    return 'tutorials';
  }
  
  // Default to community
  return 'community';
};

// Extract tags from title and description
const extractTags = (article: NewsAPIArticle): string[] => {
  const text = `${article.title} ${article.description || ''}`.toLowerCase();
  const tags: string[] = [];
  
  // Predefined tag patterns
  const tagPatterns = [
    { pattern: /gemini/i, tag: 'gemini' },
    { pattern: /cli/i, tag: 'cli' },
    { pattern: /api/i, tag: 'api' },
    { pattern: /ai|artificial intelligence/i, tag: 'ai' },
    { pattern: /google/i, tag: 'google' },
    { pattern: /tutorial/i, tag: 'tutorial' },
    { pattern: /guide/i, tag: 'guide' },
    { pattern: /release/i, tag: 'release' },
    { pattern: /update/i, tag: 'update' },
    { pattern: /performance/i, tag: 'performance' },
    { pattern: /security/i, tag: 'security' },
    { pattern: /feature/i, tag: 'feature' }
  ];
  
  tagPatterns.forEach(({ pattern, tag }) => {
    if (pattern.test(text) && !tags.includes(tag)) {
      tags.push(tag);
    }
  });
  
  return tags;
};

// Calculate reading time (rough estimate)
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(' ').length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

// Get author avatar (using existing avatar files or external service)
const getAuthorAvatar = (source: string): string => {
  // Use a hash function to consistently assign avatars
  const getAvatarIndex = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash) % 13 + 1; // We have 1.png to 13.png
  };

  const sourceLower = source.toLowerCase();
  
  // For specific sources, use consistent avatars
  if (sourceLower.includes('google') || sourceLower.includes('developers') || sourceLower.includes('cloud')) {
    return '/imgs/users/1.png'; // Google sources use avatar 1
  }
  
  if (sourceLower.includes('medium')) {
    return '/imgs/users/2.png';
  }
  
  if (sourceLower.includes('github')) {
    return '/imgs/users/3.png';
  }
  
  // For other sources, use hash-based selection for consistency
  const avatarIndex = getAvatarIndex(source);
  return `/imgs/users/${avatarIndex}.png`;
};

// Helper function to get timestamp from Date or string
const getTimestamp = (dateValue: Date | string): number => {
  if (typeof dateValue === 'string') {
    return new Date(dateValue).getTime();
  }
  return dateValue.getTime();
};

// Generate consistent UUID from URL
const generateConsistentUUID = (url: string): string => {
  // Use a simple hash function to generate consistent UUID from URL
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert hash to hex string and format as UUID
  const hashStr = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hashStr.slice(0, 8)}-${hashStr.slice(0, 4)}-${hashStr.slice(0, 4)}-${hashStr.slice(0, 4)}-${hashStr.slice(0, 12)}`;
};

// Transform NewsAPI article to our format
const transformArticle = (article: NewsAPIArticle): TransformedNews => {
  const tags = extractTags(article);
  const category = getCategoryFromArticle(article);
  const readingTime = calculateReadingTime(article.content || article.description || '');
  
  return {
    uuid: generateConsistentUUID(article.url),
    title: article.title,
    description: article.description || '',
    category,
    author_name: article.author || article.source.name,
    author_avatar_url: getAuthorAvatar(article.source.name),
    cover_url: article.urlToImage || '/imgs/placeholder.png',
    created_at: new Date(article.publishedAt),
    reading_time: readingTime,
    featured: false, // Will be set based on criteria
    tags,
    source_url: article.url,
    source_name: article.source.name
  };
};

// Fetch Gemini CLI related news
export async function getGeminiNews(): Promise<TransformedNews[]> {
  if (!NEWS_API_KEY) {
    console.warn('NEWS_API_KEY not found, returning empty array');
    return [];
  }

  try {
    // Search for Gemini CLI related articles
    const searchQueries = [
      'Gemini CLI',
      'Google Gemini API',
      'Gemini AI tools',
      'Google AI Gemini'
    ];
    
    const allArticles: NewsAPIArticle[] = [];
    
    for (const query of searchQueries) {
      const url = new URL(`${NEWS_API_BASE_URL}/everything`);
      url.searchParams.append('q', query);
      url.searchParams.append('language', 'en');
      url.searchParams.append('sortBy', 'publishedAt');
      url.searchParams.append('pageSize', '20');
      url.searchParams.append('apiKey', NEWS_API_KEY);
      
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        console.error(`NewsAPI error: ${response.status} ${response.statusText}`);
        continue;
      }
      
      const data: NewsAPIResponse = await response.json();
      allArticles.push(...data.articles);
    }
    
    // Remove duplicates based on URL
    const uniqueArticles = allArticles.filter((article, index, self) => 
      index === self.findIndex(a => a.url === article.url)
    );
    
    // Transform articles
    const transformedNews = uniqueArticles.map(transformArticle);
    
    // Sort by date (newest first)
    transformedNews.sort((a, b) => getTimestamp(b.created_at) - getTimestamp(a.created_at));
    
    // Mark top 2 articles as featured
    transformedNews.slice(0, 2).forEach(article => {
      article.featured = true;
    });
    
    return transformedNews;
    
  } catch (error) {
    console.error('Error fetching Gemini news:', error);
    return [];
  }
}

// Fetch news from specific domains
export async function getOfficialGeminiNews(): Promise<TransformedNews[]> {
  if (!NEWS_API_KEY) {
    console.warn('NEWS_API_KEY not found, returning empty array');
    return [];
  }

  try {
    const url = new URL(`${NEWS_API_BASE_URL}/everything`);
    url.searchParams.append('q', 'Gemini OR "Google AI"');
    url.searchParams.append('domains', 'developers.google.com,blog.google.com,cloud.google.com');
    url.searchParams.append('language', 'en');
    url.searchParams.append('sortBy', 'publishedAt');
    url.searchParams.append('pageSize', '10');
    url.searchParams.append('apiKey', NEWS_API_KEY);
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status} ${response.statusText}`);
    }
    
    const data: NewsAPIResponse = await response.json();
    
    // Transform and return articles
    const transformedNews = data.articles.map(transformArticle);
    
    // Mark all as official and featured
    transformedNews.forEach(article => {
      article.category = 'official';
      article.featured = true;
    });
    
    return transformedNews.sort((a, b) => getTimestamp(b.created_at) - getTimestamp(a.created_at));
    
  } catch (error) {
    console.error('Error fetching official Gemini news:', error);
    return [];
  }
} 
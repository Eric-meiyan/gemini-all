import { 
  GitHubRepository, 
  GitHubRelease, 
  GitHubCommit, 
  GitHubContributor, 
  GitHubStats,
  GitHubProjectConfig,
  GitHubApiResponse,
  GitHubDataCache
} from "@/types/github";

// GitHub API 基础配置
const GITHUB_API_BASE = "https://api.github.com";
const CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

// 内存缓存
const cache: GitHubDataCache = {};

// GitHub 项目配置
export const githubProjects: GitHubProjectConfig[] = [
  {
    owner: "google",
    repo: "generative-ai",
    displayName: "Google Generative AI",
    description: "Google's official generative AI SDK",
    category: "AI Development",
    featured: true
  },
  {
    owner: "microsoft",
    repo: "vscode",
    displayName: "Visual Studio Code",
    description: "Popular code editor with AI extensions",
    category: "Code Editor", 
    featured: true
  },
  {
    owner: "github",
    repo: "copilot.vim",
    displayName: "GitHub Copilot",
    description: "AI pair programmer for Vim",
    category: "AI Assistant",
    featured: true
  },
  {
    owner: "Exafunction",
    repo: "codeium",
    displayName: "Codeium",
    description: "Free AI code completion tool",
    category: "AI Assistant",
    featured: false
  },
  {
    owner: "tabnine",
    repo: "TabNine",
    displayName: "Tabnine",
    description: "AI code completion with privacy",
    category: "AI Assistant",
    featured: false
  }
];

// 创建GitHub API请求
async function githubApiRequest<T>(endpoint: string): Promise<GitHubApiResponse<T>> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'GeminiCLI-Hub/1.0.0',
        // 注意：生产环境中应该使用环境变量设置GitHub Token
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      },
      next: { revalidate: 300 } // Next.js 缓存5分钟
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      data,
      error: null,
      lastUpdated: new Date().toISOString(),
      rateLimit: {
        remaining: parseInt(response.headers.get('x-ratelimit-remaining') || '0'),
        reset: parseInt(response.headers.get('x-ratelimit-reset') || '0')
      }
    };
  } catch (error) {
    console.error('GitHub API request failed:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      lastUpdated: new Date().toISOString()
    };
  }
}

// 获取仓库信息
export async function getRepositoryInfo(owner: string, repo: string): Promise<GitHubApiResponse<GitHubRepository>> {
  return githubApiRequest<GitHubRepository>(`/repos/${owner}/${repo}`);
}

// 获取最新发布版本
export async function getLatestReleases(owner: string, repo: string, limit: number = 5): Promise<GitHubApiResponse<GitHubRelease[]>> {
  return githubApiRequest<GitHubRelease[]>(`/repos/${owner}/${repo}/releases?per_page=${limit}`);
}

// 获取最近提交
export async function getRecentCommits(owner: string, repo: string, limit: number = 10): Promise<GitHubApiResponse<GitHubCommit[]>> {
  return githubApiRequest<GitHubCommit[]>(`/repos/${owner}/${repo}/commits?per_page=${limit}`);
}

// 获取贡献者信息
export async function getContributors(owner: string, repo: string, limit: number = 10): Promise<GitHubApiResponse<GitHubContributor[]>> {
  return githubApiRequest<GitHubContributor[]>(`/repos/${owner}/${repo}/contributors?per_page=${limit}`);
}

// 计算项目健康度评分
function calculateHealthScore(repo: GitHubRepository, releases: GitHubRelease[], commits: GitHubCommit[]): number {
  let score = 50; // 基础分

  // 星标数量评分 (0-25分)
  if (repo.stargazers_count > 10000) score += 25;
  else if (repo.stargazers_count > 1000) score += 20;
  else if (repo.stargazers_count > 100) score += 15;
  else if (repo.stargazers_count > 10) score += 10;
  else score += 5;

  // 活跃度评分 (0-15分)
  const lastPushDate = new Date(repo.pushed_at);
  const daysSinceLastPush = (Date.now() - lastPushDate.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceLastPush <= 7) score += 15;
  else if (daysSinceLastPush <= 30) score += 10;
  else if (daysSinceLastPush <= 90) score += 5;

  // 发布频率评分 (0-10分)
  if (releases.length >= 5) score += 10;
  else if (releases.length >= 3) score += 7;
  else if (releases.length >= 1) score += 5;

  return Math.min(100, Math.max(0, score));
}

// 获取完整的项目统计数据
export async function getProjectStats(owner: string, repo: string): Promise<GitHubApiResponse<GitHubStats>> {
  const cacheKey = `${owner}/${repo}`;
  
  // 检查缓存
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < cache[cacheKey].ttl) {
    return {
      data: cache[cacheKey].data,
      error: null,
      lastUpdated: new Date(cache[cacheKey].timestamp).toISOString()
    };
  }

  try {
    // 并行获取所有数据
    const [repoResponse, releasesResponse, commitsResponse, contributorsResponse] = await Promise.all([
      getRepositoryInfo(owner, repo),
      getLatestReleases(owner, repo),
      getRecentCommits(owner, repo),
      getContributors(owner, repo)
    ]);

    // 检查是否有错误
    if (repoResponse.error || !repoResponse.data) {
      return {
        data: null,
        error: repoResponse.error || 'Failed to fetch repository data',
        lastUpdated: new Date().toISOString()
      };
    }

    const repository = repoResponse.data;
    const releases = releasesResponse.data || [];
    const recentCommits = commitsResponse.data || [];
    const contributors = contributorsResponse.data || [];

    // 计算统计数据
    const stats = {
      totalCommits: contributors.reduce((sum, c) => sum + c.contributions, 0),
      totalReleases: releases.length,
      lastCommitDate: recentCommits[0]?.commit.author.date || '',
      lastReleaseDate: releases[0]?.published_at || '',
      contributorsCount: contributors.length,
      issuesCount: repository.open_issues_count,
      healthScore: calculateHealthScore(repository, releases, recentCommits)
    };

    const result: GitHubStats = {
      repository,
      releases,
      recentCommits,
      contributors,
      stats
    };

    // 缓存结果
    cache[cacheKey] = {
      data: result,
      timestamp: Date.now(),
      ttl: CACHE_TTL
    };

    return {
      data: result,
      error: null,
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    console.error('Error fetching project stats:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      lastUpdated: new Date().toISOString()
    };
  }
}

// 获取多个项目的统计数据
export async function getMultipleProjectStats(projects: GitHubProjectConfig[]): Promise<GitHubApiResponse<GitHubStats[]>> {
  try {
    const results = await Promise.allSettled(
      projects.map(project => getProjectStats(project.owner, project.repo))
    );

    const successfulResults: GitHubStats[] = [];
    const errors: string[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.data) {
        successfulResults.push(result.value.data);
      } else {
        const project = projects[index];
        const error = result.status === 'rejected' 
          ? result.reason 
          : result.value.error;
        errors.push(`${project.owner}/${project.repo}: ${error}`);
      }
    });

    return {
      data: successfulResults,
      error: errors.length > 0 ? errors.join('; ') : null,
      lastUpdated: new Date().toISOString()
    };

  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      lastUpdated: new Date().toISOString()
    };
  }
}

// 清除缓存
export function clearGitHubCache(): void {
  Object.keys(cache).forEach(key => delete cache[key]);
}

// 获取缓存状态
export function getCacheStatus(): { [key: string]: { age: number; ttl: number } } {
  const status: { [key: string]: { age: number; ttl: number } } = {};
  Object.entries(cache).forEach(([key, value]) => {
    status[key] = {
      age: Date.now() - value.timestamp,
      ttl: value.ttl
    };
  });
  return status;
}
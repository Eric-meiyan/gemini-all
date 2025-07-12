import { GitHubStats } from "@/types/github";
import { getMultipleProjectStats, githubProjects } from "@/services/github";

// StatItem 类型定义（从统计组件中导入的类型）
interface StatItem {
  label: string;
  value: string;
  icon: string;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// GitHub统计数据生成函数
export async function generateGitHubStats(locale: string = 'en'): Promise<StatItem[]> {
  try {
    const response = await getMultipleProjectStats(githubProjects.slice(0, 3)); // 获取前3个项目
    
    if (!response.data || response.data.length === 0) {
      return [];
    }

    const stats = response.data;
    
    // 聚合统计数据
    const totalStars = stats.reduce((sum, stat) => sum + stat.repository.stargazers_count, 0);
    const totalForks = stats.reduce((sum, stat) => sum + stat.repository.forks_count, 0);
    const totalIssues = stats.reduce((sum, stat) => sum + stat.repository.open_issues_count, 0);
    const avgHealthScore = Math.round(stats.reduce((sum, stat) => sum + stat.stats.healthScore, 0) / stats.length);

    return [
      {
        label: locale === 'zh' ? '项目星标' : 'Project Stars',
        value: totalStars > 1000 ? `${(totalStars / 1000).toFixed(1)}K` : totalStars.toString(),
        icon: "RiStarFill",
        description: locale === 'zh' ? '开源项目获得的星标总数' : 'Total stars received by open source projects',
        trend: {
          value: 12,
          isPositive: true
        }
      },
      {
        label: locale === 'zh' ? '项目分叉' : 'Project Forks',
        value: totalForks > 1000 ? `${(totalForks / 1000).toFixed(1)}K` : totalForks.toString(),
        icon: "RiGitForkLine",
        description: locale === 'zh' ? '开源项目被分叉的次数' : 'Times the open source projects have been forked'
      },
      {
        label: locale === 'zh' ? '活跃问题' : 'Active Issues',
        value: totalIssues.toString(),
        icon: "RiErrorWarningLine",
        description: locale === 'zh' ? '当前未解决的问题数量' : 'Number of currently unresolved issues'
      },
      {
        label: locale === 'zh' ? '项目健康度' : 'Project Health',
        value: `${avgHealthScore}%`,
        icon: "RiHeartPulseLine",
        description: locale === 'zh' ? '基于活跃度和维护情况的综合评分' : 'Comprehensive score based on activity and maintenance',
        trend: {
          value: avgHealthScore > 75 ? 8 : avgHealthScore > 50 ? 5 : 2,
          isPositive: avgHealthScore > 60
        }
      }
    ];
  } catch (error) {
    console.error('Failed to generate GitHub stats:', error);
    return [];
  }
}
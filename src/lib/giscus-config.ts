// Giscus 评论系统配置
// 使用环境变量来管理GitHub仓库信息

export interface GiscusConfig {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: "pathname" | "url" | "title" | "og:title" | "specific" | "number";
  theme: "light" | "dark" | "preferred_color_scheme" | "transparent_dark" | "dark_dimmed";
  lang: string;
}

// 默认配置
export const defaultGiscusConfig: Partial<GiscusConfig> = {
  mapping: "pathname",
  theme: "preferred_color_scheme",
  lang: "en"
};

// 从环境变量获取配置
export function getGiscusConfig(locale: string = "en"): GiscusConfig {
  // 这些值需要在 .env.local 中配置
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO || "geminicli-all/discussions";
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "";
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "General";
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "";

  return {
    repo,
    repoId,
    category,
    categoryId,
    mapping: "pathname",
    theme: "preferred_color_scheme",
    lang: locale === "zh" ? "zh-CN" : "en"
  };
}

// 验证配置是否完整
export function validateGiscusConfig(config: GiscusConfig): boolean {
  return !!(config.repo && config.repoId && config.categoryId);
}

// 不同页面类型的分类映射
export const categoryMapping = {
  blog: "General",           // 博客文章
  tool: "Show and tell",     // 工具评测
  news: "Announcements",     // 新闻
  page: "Q&A",              // 通用页面
  feature: "Ideas"          // 功能建议
} as const;

// 主题映射
export const themeMapping = {
  light: "light",
  dark: "dark",
  system: "preferred_color_scheme"
} as const;
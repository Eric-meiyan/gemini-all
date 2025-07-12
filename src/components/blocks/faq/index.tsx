"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "installation" | "usage" | "troubleshooting" | "advanced";
  tags: string[];
  helpful?: number;
}

interface FAQProps {
  locale: string;
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function FAQ({ locale, searchParams }: FAQProps) {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState((searchParams?.q as string) || "");
  const [selectedCategory, setSelectedCategory] = useState((searchParams?.category as string) || "all");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // FAQ data - in a real app this would come from a CMS or database
  const faqData: FAQItem[] = [
    {
      id: "install-gemini-cli",
      question: locale === 'zh' ? "如何安装 Gemini CLI？" : "How do I install Gemini CLI?",
      answer: locale === 'zh' 
        ? "您可以通过以下方式安装 Gemini CLI：\n\n1. **npm 安装**（推荐）：\n```bash\nnpm install -g @google/gemini-cli\n```\n\n2. **直接下载**：\n从官方网站下载适合您操作系统的安装包\n\n3. **通过包管理器**：\n- macOS: `brew install gemini-cli`\n- Windows: `winget install Google.GeminiCLI`\n- Linux: `apt install gemini-cli` 或 `yum install gemini-cli`"
        : "You can install Gemini CLI in several ways:\n\n1. **npm installation** (recommended):\n```bash\nnpm install -g @google/gemini-cli\n```\n\n2. **Direct download**:\nDownload the installer for your operating system from the official website\n\n3. **Package managers**:\n- macOS: `brew install gemini-cli`\n- Windows: `winget install Google.GeminiCLI`\n- Linux: `apt install gemini-cli` or `yum install gemini-cli`",
      category: "installation",
      tags: ["installation", "setup", "npm", "download"],
      helpful: 89
    },
    {
      id: "api-key-setup",
      question: locale === 'zh' ? "如何配置 API 密钥？" : "How do I set up API keys?",
      answer: locale === 'zh'
        ? "配置 API 密钥非常简单：\n\n1. **获取 API 密钥**：\n访问 Google AI Studio (https://makersuite.google.com/app/apikey) 获取免费的 API 密钥\n\n2. **设置环境变量**：\n```bash\nexport GEMINI_API_KEY=your_api_key_here\n```\n\n3. **或者使用配置命令**：\n```bash\ngemini config set api-key your_api_key_here\n```\n\n4. **验证配置**：\n```bash\ngemini config get api-key\n```"
        : "Setting up API keys is straightforward:\n\n1. **Get your API key**:\nVisit Google AI Studio (https://makersuite.google.com/app/apikey) to get a free API key\n\n2. **Set environment variable**:\n```bash\nexport GEMINI_API_KEY=your_api_key_here\n```\n\n3. **Or use the config command**:\n```bash\ngemini config set api-key your_api_key_here\n```\n\n4. **Verify configuration**:\n```bash\ngemini config get api-key\n```",
      category: "installation",
      tags: ["api", "key", "configuration", "setup"],
      helpful: 76
    },
    {
      id: "basic-usage",
      question: locale === 'zh' ? "Gemini CLI 的基本使用方法是什么？" : "What are the basic usage commands for Gemini CLI?",
      answer: locale === 'zh'
        ? "以下是一些常用的基本命令：\n\n**代码生成**：\n```bash\ngemini generate \"创建一个 React 组件\"\n```\n\n**代码审查**：\n```bash\ngemini review ./src/components/MyComponent.tsx\n```\n\n**文档生成**：\n```bash\ngemini docs ./src --output ./docs\n```\n\n**交互式聊天**：\n```bash\ngemini chat\n```\n\n**批处理**：\n```bash\ngemini batch --input prompts.txt\n```"
        : "Here are some common basic commands:\n\n**Code generation**:\n```bash\ngemini generate \"Create a React component\"\n```\n\n**Code review**:\n```bash\ngemini review ./src/components/MyComponent.tsx\n```\n\n**Documentation generation**:\n```bash\ngemini docs ./src --output ./docs\n```\n\n**Interactive chat**:\n```bash\ngemini chat\n```\n\n**Batch processing**:\n```bash\ngemini batch --input prompts.txt\n```",
      category: "usage",
      tags: ["commands", "basic", "generate", "review"],
      helpful: 92
    },
    {
      id: "ide-integration",
      question: locale === 'zh' ? "如何将 Gemini CLI 集成到我的 IDE 中？" : "How do I integrate Gemini CLI with my IDE?",
      answer: locale === 'zh'
        ? "Gemini CLI 支持多种 IDE 集成：\n\n**VS Code**：\n1. 安装 Gemini CLI 扩展\n2. 在设置中配置 API 密钥\n3. 使用 Ctrl+Shift+P 调用命令面板\n\n**JetBrains IDEs**：\n1. 在插件市场搜索 \"Gemini CLI\"\n2. 安装并重启 IDE\n3. 在工具菜单中找到 Gemini 选项\n\n**Vim/Neovim**：\n```vim\nPlug 'google/gemini-cli.vim'\n```\n\n**自定义集成**：\n使用 `gemini --json` 输出格式进行自定义集成"
        : "Gemini CLI supports various IDE integrations:\n\n**VS Code**:\n1. Install the Gemini CLI extension\n2. Configure your API key in settings\n3. Use Ctrl+Shift+P to access the command palette\n\n**JetBrains IDEs**:\n1. Search for \"Gemini CLI\" in the plugin marketplace\n2. Install and restart your IDE\n3. Find Gemini options in the Tools menu\n\n**Vim/Neovim**:\n```vim\nPlug 'google/gemini-cli.vim'\n```\n\n**Custom integration**:\nUse `gemini --json` output format for custom integrations",
      category: "usage",
      tags: ["ide", "integration", "vscode", "jetbrains", "vim"],
      helpful: 68
    },
    {
      id: "error-rate-limit",
      question: locale === 'zh' ? "遇到 \"Rate limit exceeded\" 错误怎么办？" : "What should I do when I get \"Rate limit exceeded\" error?",
      answer: locale === 'zh'
        ? "当遇到速率限制错误时，您可以：\n\n**短期解决方案**：\n1. 等待一段时间（通常 1-5 分钟）后重试\n2. 使用 `--delay` 参数增加请求间隔：\n```bash\ngemini generate \"your prompt\" --delay 2000\n```\n\n**长期解决方案**：\n1. 升级到付费 API 计划以获得更高的限制\n2. 实施请求缓存避免重复调用\n3. 使用批处理模式处理多个请求\n\n**监控使用情况**：\n```bash\ngemini quota --show-usage\n```"
        : "When encountering rate limit errors, you can:\n\n**Short-term solutions**:\n1. Wait for a while (usually 1-5 minutes) and retry\n2. Use `--delay` parameter to increase request intervals:\n```bash\ngemini generate \"your prompt\" --delay 2000\n```\n\n**Long-term solutions**:\n1. Upgrade to a paid API plan for higher limits\n2. Implement request caching to avoid duplicate calls\n3. Use batch mode for processing multiple requests\n\n**Monitor usage**:\n```bash\ngemini quota --show-usage\n```",
      category: "troubleshooting",
      tags: ["error", "rate-limit", "quota", "troubleshooting"],
      helpful: 54
    },
    {
      id: "custom-prompts",
      question: locale === 'zh' ? "如何创建和管理自定义提示模板？" : "How do I create and manage custom prompt templates?",
      answer: locale === 'zh'
        ? "您可以创建可重用的提示模板：\n\n**创建模板**：\n```bash\ngemini template create \"react-component\" \"Create a React functional component named {{name}} with props {{props}}\"\n```\n\n**使用模板**：\n```bash\ngemini generate --template react-component --vars name=Button,props=\"text,onClick\"\n```\n\n**管理模板**：\n```bash\n# 列出所有模板\ngemini template list\n\n# 编辑模板\ngemini template edit react-component\n\n# 删除模板\ngemini template delete react-component\n```\n\n**模板文件**：\n您也可以创建 `.gemini` 文件来存储复杂的模板"
        : "You can create reusable prompt templates:\n\n**Create templates**:\n```bash\ngemini template create \"react-component\" \"Create a React functional component named {{name}} with props {{props}}\"\n```\n\n**Use templates**:\n```bash\ngemini generate --template react-component --vars name=Button,props=\"text,onClick\"\n```\n\n**Manage templates**:\n```bash\n# List all templates\ngemini template list\n\n# Edit template\ngemini template edit react-component\n\n# Delete template\ngemini template delete react-component\n```\n\n**Template files**:\nYou can also create `.gemini` files to store complex templates",
      category: "advanced",
      tags: ["templates", "prompts", "customization", "advanced"],
      helpful: 41
    },
    {
      id: "performance-optimization",
      question: locale === 'zh' ? "如何优化 Gemini CLI 的性能？" : "How can I optimize Gemini CLI performance?",
      answer: locale === 'zh'
        ? "提升 Gemini CLI 性能的几种方法：\n\n**缓存优化**：\n```bash\n# 启用响应缓存\ngemini config set cache.enabled true\n# 设置缓存时间（秒）\ngemini config set cache.ttl 3600\n```\n\n**并发处理**：\n```bash\n# 设置并发请求数\ngemini batch --concurrent 3 --input prompts.txt\n```\n\n**模型选择**：\n```bash\n# 使用更快的模型进行简单任务\ngemini generate \"hello world\" --model gemini-pro\n```\n\n**网络优化**：\n- 确保稳定的网络连接\n- 考虑使用代理服务器提升连接速度\n- 设置合适的超时时间"
        : "Several ways to improve Gemini CLI performance:\n\n**Cache optimization**:\n```bash\n# Enable response caching\ngemini config set cache.enabled true\n# Set cache TTL in seconds\ngemini config set cache.ttl 3600\n```\n\n**Concurrent processing**:\n```bash\n# Set concurrent request count\ngemini batch --concurrent 3 --input prompts.txt\n```\n\n**Model selection**:\n```bash\n# Use faster models for simple tasks\ngemini generate \"hello world\" --model gemini-pro\n```\n\n**Network optimization**:\n- Ensure stable network connection\n- Consider using proxy servers for better connectivity\n- Set appropriate timeout values",
      category: "advanced",
      tags: ["performance", "optimization", "cache", "concurrent"],
      helpful: 37
    },
    {
      id: "troubleshooting-common",
      question: locale === 'zh' ? "常见的故障排除步骤有哪些？" : "What are common troubleshooting steps?",
      answer: locale === 'zh'
        ? "遇到问题时的标准排查流程：\n\n**1. 检查基本配置**：\n```bash\ngemini config list\ngemini --version\n```\n\n**2. 验证网络连接**：\n```bash\ngemini test-connection\n```\n\n**3. 检查日志**：\n```bash\ngemini logs --last 50\n```\n\n**4. 重置配置**：\n```bash\ngemini config reset\n```\n\n**5. 更新到最新版本**：\n```bash\nnpm update -g @google/gemini-cli\n```\n\n**6. 清除缓存**：\n```bash\ngemini cache clear\n```\n\n如果问题仍然存在，请访问 GitHub Issues 或社区论坛寻求帮助。"
        : "Standard troubleshooting workflow when encountering issues:\n\n**1. Check basic configuration**:\n```bash\ngemini config list\ngemini --version\n```\n\n**2. Verify network connection**:\n```bash\ngemini test-connection\n```\n\n**3. Check logs**:\n```bash\ngemini logs --last 50\n```\n\n**4. Reset configuration**:\n```bash\ngemini config reset\n```\n\n**5. Update to latest version**:\n```bash\nnpm update -g @google/gemini-cli\n```\n\n**6. Clear cache**:\n```bash\ngemini cache clear\n```\n\nIf issues persist, please visit GitHub Issues or community forums for help.",
      category: "troubleshooting",
      tags: ["troubleshooting", "debugging", "issues", "help"],
      helpful: 63
    }
  ];

  // Filter FAQs based on search and category
  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Category data
  const categories = [
    { value: "all", label: locale === 'zh' ? "全部" : "All", icon: "RiQuestionLine" },
    { value: "general", label: locale === 'zh' ? "常规" : "General", icon: "RiInformationLine" },
    { value: "installation", label: locale === 'zh' ? "安装" : "Installation", icon: "RiDownloadLine" },
    { value: "usage", label: locale === 'zh' ? "使用" : "Usage", icon: "RiCommandLine" },
    { value: "troubleshooting", label: locale === 'zh' ? "故障排除" : "Troubleshooting", icon: "RiToolsLine" },
    { value: "advanced", label: locale === 'zh' ? "高级" : "Advanced", icon: "RiSettings3Line" }
  ];

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Icon name="RiQuestionAnswerLine" className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              {locale === 'zh' ? '常见问题解答' : 'Frequently Asked Questions'}
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {locale === 'zh' 
              ? '查找关于 Gemini CLI 安装、配置和使用的常见问题解答。如果您没有找到答案，请联系我们的支持团队。'
              : 'Find answers to common questions about Gemini CLI installation, configuration, and usage. If you can\'t find your answer, contact our support team.'
            }
          </p>
        </header>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Icon name="RiSearchLine" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder={locale === 'zh' ? '搜索问题...' : 'Search questions...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Icon name={category.icon} className="h-4 w-4" />
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Results */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id} className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleExpanded(faq.id)}
                      className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {faq.question}
                          </h3>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline" className="capitalize">
                              {categories.find(c => c.value === faq.category)?.label}
                            </Badge>
                            {faq.helpful && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Icon name="RiThumbUpLine" className="h-4 w-4" />
                                <span>{faq.helpful}% helpful</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <Icon 
                          name={expandedItems.has(faq.id) ? "RiArrowUpSLine" : "RiArrowDownSLine"} 
                          className="h-5 w-5 text-gray-400 ml-4" 
                        />
                      </div>
                    </button>
                    
                    {expandedItems.has(faq.id) && (
                      <div className="px-6 pb-6 border-t border-gray-100">
                        <div className="pt-4">
                          <div className="prose prose-blue max-w-none">
                            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                              {faq.answer}
                            </div>
                          </div>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mt-4">
                            {faq.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          {/* Helpful buttons */}
                          <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100">
                            <span className="text-sm text-gray-600">
                              {locale === 'zh' ? '这个回答有帮助吗？' : 'Was this answer helpful?'}
                            </span>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Icon name="RiThumbUpLine" className="h-4 w-4 mr-1" />
                                {locale === 'zh' ? '是' : 'Yes'}
                              </Button>
                              <Button variant="outline" size="sm">
                                <Icon name="RiThumbDownLine" className="h-4 w-4 mr-1" />
                                {locale === 'zh' ? '否' : 'No'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="RiSearchEyeLine" className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {locale === 'zh' ? '未找到相关问题' : 'No questions found'}
              </h3>
              <p className="text-gray-500 mb-6">
                {locale === 'zh' 
                  ? '尝试调整搜索条件或选择不同的类别。' 
                  : 'Try adjusting your search terms or selecting a different category.'
                }
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                variant="outline"
              >
                {locale === 'zh' ? '清除筛选条件' : 'Clear filters'}
              </Button>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="max-w-4xl mx-auto mt-16">
          <Card className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Icon name="RiCustomerServiceLine" className="h-8 w-8" />
                <h3 className="text-2xl font-bold">
                  {locale === 'zh' ? '还有其他问题？' : 'Still have questions?'}
                </h3>
              </div>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                {locale === 'zh'
                  ? '我们的支持团队随时准备为您提供帮助。无论是技术问题还是功能建议，我们都很乐意倾听。'
                  : 'Our support team is ready to help you. Whether it\'s technical issues or feature suggestions, we\'re happy to listen.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                  <Link href="/contact">
                    <Icon name="RiMailLine" className="mr-2 h-4 w-4" />
                    {locale === 'zh' ? '联系支持' : 'Contact Support'}
                  </Link>
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link href="https://github.com/google/gemini-cli/issues" target="_blank">
                    <Icon name="RiGithubLine" className="mr-2 h-4 w-4" />
                    {locale === 'zh' ? 'GitHub Issues' : 'GitHub Issues'}
                  </Link>
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link href="/community">
                    <Icon name="RiCommunityLine" className="mr-2 h-4 w-4" />
                    {locale === 'zh' ? '社区论坛' : 'Community Forum'}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

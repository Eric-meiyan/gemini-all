# 环境配置指南

这份文档详细说明了如何配置 Gemini CLI Hub 项目的环境变量和相关设置。

## 📋 环境变量概述

项目使用 Next.js 的环境变量系统，支持多种环境配置。

### 环境文件结构

```
.env.local          # 本地开发环境（git 忽略）
.env.development    # 开发环境默认配置
.env.production     # 生产环境配置
.env.example        # 环境变量模板
```

## 🔧 必需的环境变量

### 数据库配置

```bash
# PostgreSQL 数据库连接
DATABASE_URL="postgresql://username:password@localhost:5432/gemini_cli_hub"

# 或者使用分别的数据库配置
DB_HOST="localhost"
DB_PORT="5432"
DB_NAME="gemini_cli_hub"
DB_USER="your_username"
DB_PASSWORD="your_password"
```

### 认证配置

```bash
# NextAuth.js 配置
NEXTAUTH_URL="http://localhost:3000"  # 开发环境
NEXTAUTH_SECRET="your-super-secret-key-here"  # 生产环境必须

# OAuth 提供商配置
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
```

### 基础配置

```bash
# 网站基础配置
NEXT_PUBLIC_WEB_URL="http://localhost:3000"  # 开发环境
# NEXT_PUBLIC_WEB_URL="https://yourdomain.com"  # 生产环境

# API 密钥
NEXT_PUBLIC_API_KEY="your_public_api_key"
```

## 💬 评论系统配置（Giscus）

评论系统使用 GitHub Discussions，需要以下配置：

```bash
# Giscus 评论系统配置
NEXT_PUBLIC_GISCUS_REPO="your-username/your-repo-name"
NEXT_PUBLIC_GISCUS_REPO_ID="R_kgDOxxxxxxx"
NEXT_PUBLIC_GISCUS_CATEGORY_ID="DIC_kwDOxxxxxxx"
```

### 如何获取 Giscus 配置参数

1. **前提条件**：
   - GitHub 仓库必须是公开的
   - 仓库已启用 Discussions 功能
   - 已安装 [giscus app](https://github.com/apps/giscus)

2. **获取参数**：
   - 访问 [giscus.app](https://giscus.app/zh-CN)
   - 输入您的仓库信息：`your-username/your-repo-name`
   - 选择页面映射方式：推荐 `pathname`
   - 选择 Discussion 分类：推荐 `General`
   - 复制生成的配置参数

3. **配置示例**：
   ```bash
   # 示例配置
   NEXT_PUBLIC_GISCUS_REPO="anthropics/geminicli-all"
   NEXT_PUBLIC_GISCUS_REPO_ID="R_kgDOH123456"
   NEXT_PUBLIC_GISCUS_CATEGORY_ID="DIC_kwDOH123456_04567890"
   ```

## 🚀 部署环境配置

### Vercel 部署

如果使用 Vercel 部署，在项目设置中添加以下环境变量：

```bash
# 生产环境必需
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret"
NEXT_PUBLIC_WEB_URL="https://yourdomain.com"

# 数据库（如果使用云数据库）
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# OAuth 配置
GITHUB_CLIENT_ID="production_github_client_id"
GITHUB_CLIENT_SECRET="production_github_client_secret"
GOOGLE_CLIENT_ID="production_google_client_id"
GOOGLE_CLIENT_SECRET="production_google_client_secret"

# Giscus 配置
NEXT_PUBLIC_GISCUS_REPO="your-username/your-repo-name"
NEXT_PUBLIC_GISCUS_REPO_ID="R_kgDOxxxxxxx"
NEXT_PUBLIC_GISCUS_CATEGORY_ID="DIC_kwDOxxxxxxx"
```

### Netlify 部署

在 Netlify 控制台的环境变量部分添加相同的配置。

## 🔒 安全配置

### 密钥生成

```bash
# 生成 NEXTAUTH_SECRET
openssl rand -base64 32

# 或者使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 环境变量安全注意事项

1. **永远不要**在代码中硬编码敏感信息
2. **永远不要**将 `.env.local` 提交到 git
3. **使用不同的密钥**用于开发和生产环境
4. **定期轮换**生产环境的密钥
5. **限制访问权限**，只有必要的人员才能访问生产环境变量

## 📝 配置验证

### 开发环境检查清单

- [ ] `.env.local` 文件已创建
- [ ] 数据库连接正常
- [ ] GitHub OAuth 应用已配置
- [ ] Google OAuth 应用已配置（可选）
- [ ] Giscus 仓库已设置

### 生产环境检查清单

- [ ] 所有环境变量已在部署平台设置
- [ ] `NEXTAUTH_SECRET` 已生成并设置
- [ ] `NEXTAUTH_URL` 设置为正确的域名
- [ ] 数据库连接字符串正确
- [ ] OAuth 应用回调 URL 已更新为生产域名
- [ ] Giscus 配置已验证

## 🛠️ 故障排除

### 常见问题

1. **评论系统不显示**：
   - 检查 Giscus 环境变量是否正确
   - 确认仓库是公开的且启用了 Discussions
   - 验证 giscus app 已安装

2. **OAuth 登录失败**：
   - 检查客户端 ID 和密钥是否正确
   - 确认回调 URL 配置正确
   - 验证环境变量名称无误

3. **数据库连接失败**：
   - 检查连接字符串格式
   - 确认数据库服务运行正常
   - 验证网络连接和防火墙设置

### 调试命令

```bash
# 检查环境变量是否加载
npm run env-check

# 验证数据库连接
npm run db:check

# 测试 OAuth 配置
npm run auth:test
```

## 📚 相关文档

- [Next.js 环境变量文档](https://nextjs.org/docs/basic-features/environment-variables)
- [NextAuth.js 配置文档](https://next-auth.js.org/configuration/options)
- [Giscus 官方文档](https://giscus.app/)
- [Vercel 环境变量指南](https://vercel.com/docs/concepts/projects/environment-variables)

## 🆘 获取帮助

如果遇到配置问题，请：

1. 检查本文档的故障排除部分
2. 查看项目的 GitHub Issues
3. 参考相关官方文档
4. 创建新的 Issue 寻求帮助
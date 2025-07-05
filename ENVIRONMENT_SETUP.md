# 环境变量配置说明

## 必需的环境变量

为了解决开发过程中的错误，请创建一个 `.env.local` 文件并添加以下配置：

```bash
# NextAuth Secret - 认证必需
NEXTAUTH_SECRET=your-super-secret-key-change-this-in-production

# NextAuth URL - 认证重定向必需  
NEXTAUTH_URL=http://localhost:3000

# 网站URL - 用于SEO和元数据
NEXT_PUBLIC_WEB_URL=http://localhost:3000

# 新闻API配置
NEXT_PUBLIC_NEWS_API_ENABLED=true

# 显示"Built with ShipAny"在页脚
NEXT_PUBLIC_SHOW_POWERED_BY=true
```

## 可选的环境变量

```bash
# 数据库URL (如果使用数据库)
# DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Google Analytics配置
# NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=your-ga-id

# Plausible Analytics配置  
# NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com

# OpenPanel Analytics配置
# NEXT_PUBLIC_OPEN_PANEL_CLIENT_ID=your-client-id

# Stripe支付配置
# STRIPE_SECRET_KEY=sk_test_...
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
# STRIPE_WEBHOOK_SECRET=whsec_...

# Google OAuth配置
# AUTH_GOOGLE_ID=your-google-client-id
# AUTH_GOOGLE_SECRET=your-google-client-secret
# NEXT_PUBLIC_AUTH_GOOGLE_ENABLED=true
# NEXT_PUBLIC_AUTH_GOOGLE_ID=your-google-client-id
# NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED=true

# GitHub OAuth配置
# AUTH_GITHUB_ID=your-github-client-id  
# AUTH_GITHUB_SECRET=your-github-client-secret
# NEXT_PUBLIC_AUTH_GITHUB_ENABLED=true
```

## 快速设置

1. 在项目根目录创建 `.env.local` 文件
2. 复制上面的必需环境变量
3. 根据需要添加可选的环境变量
4. 重启开发服务器

```bash
pnpm dev
```

## 注意事项

- `.env.local` 文件已在 `.gitignore` 中，不会被提交到代码库
- 生产环境请使用安全的随机字符串作为 `NEXTAUTH_SECRET`
- 所有以 `NEXT_PUBLIC_` 开头的变量会暴露给客户端 
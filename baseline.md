# ShipAny Framework 架构设计文档

## 项目概述

**ShipAny** 是一个基于 Next.js 的 AI SaaS 快速开发框架，旨在帮助开发者在几小时内构建和部署 AI 创业项目，而不是几天。该框架提供了完整的模板、组件库和基础设施配置。

### 基本信息
- **项目名称**: shipany-template-one
- **版本**: 2.5.1
- **作者**: idoubi
- **官网**: https://shipany.ai
- **许可证**: ShipAny AI SaaS Boilerplate License Agreement

## 技术栈架构

### 核心技术栈
- **前端框架**: Next.js 15.2.3 (App Router)
- **React**: 19.0.0 (函数式组件)
- **TypeScript**: 5.7.2 (类型安全)
- **样式框架**: Tailwind CSS 4.1.4
- **UI 组件库**: Shadcn/UI (基于 Radix UI)

### 数据层
- **数据库 ORM**: Drizzle ORM 0.44.2
- **数据库**: PostgreSQL (通过 postgres 3.4.7)
- **数据迁移**: Drizzle Kit 0.31.1

### 认证与支付
- **认证系统**: NextAuth.js 5.0.0-beta.25
  - Google OAuth
  - GitHub OAuth  
  - Google One Tap 登录
- **支付集成**: Stripe 17.5.0 (支持订阅和一次性付费)

### AI 集成
- **AI SDK**: ai 4.1.64
- **支持的 AI 提供商**:
  - OpenAI (@ai-sdk/openai)
  - DeepSeek (@ai-sdk/deepseek)
  - Replicate (@ai-sdk/replicate)
  - OpenRouter (@openrouter/ai-sdk-provider)
  - Kling (自定义视频生成提供商)

### 国际化与主题
- **国际化**: next-intl 4.1.0
- **主题系统**: next-themes 0.4.4
- **支持语言**: 英语(en)、中文(zh)

### 其他核心依赖
- **表单处理**: React Hook Form + Zod 验证
- **通知系统**: Sonner
- **图标库**: Lucide React, Tabler Icons, React Icons
- **动画**: Framer Motion
- **富文本编辑**: TipTap, MDX
- **图表库**: Recharts
- **拖拽**: @dnd-kit/*

## 目录结构详解

```
src/
├── app/                          # Next.js App Router 应用入口
│   ├── [locale]/                 # 国际化路由
│   │   ├── (admin)/             # 管理员面板 (路由组)
│   │   │   └── admin/           # 管理后台页面
│   │   │       ├── feedbacks/   # 反馈管理
│   │   │       ├── orders/      # 订单管理  
│   │   │       ├── posts/       # 文章管理
│   │   │       └── users/       # 用户管理
│   │   ├── (default)/           # 默认用户面板 (路由组)
│   │   │   ├── (console)/       # 用户控制台
│   │   │   │   ├── api-keys/    # API密钥管理
│   │   │   │   ├── my-credits/  # 积分管理
│   │   │   │   ├── my-invites/  # 邀请管理
│   │   │   │   └── my-orders/   # 订单查看
│   │   │   ├── i/[code]/        # 邀请码页面
│   │   │   ├── posts/           # 博客文章
│   │   │   ├── pricing/         # 定价页面
│   │   │   └── showcase/        # 展示页面
│   │   └── auth/                # 认证页面
│   ├── api/                     # API 路由
│   │   ├── auth/                # 认证相关 API
│   │   ├── checkout/            # 支付检出
│   │   ├── demo/                # AI 功能演示
│   │   └── stripe-notify/       # Stripe 回调
│   └── globals.css              # 全局样式
├── aisdk/                       # AI 功能 SDK
│   ├── generate-video/          # 视频生成
│   ├── kling/                   # Kling AI 提供商
│   └── provider/                # AI 提供商抽象
├── auth/                        # 认证配置
├── components/                  # React 组件
│   ├── blocks/                  # 页面级组件块
│   │   ├── hero/               # 首页英雄区
│   │   ├── pricing/            # 定价组件
│   │   ├── feature/            # 功能展示
│   │   ├── testimonial/        # 用户证言
│   │   └── ...                 # 其他页面块
│   ├── ui/                     # 基础 UI 组件 (Shadcn/UI)
│   ├── console/                # 用户控制台组件
│   ├── dashboard/              # 管理后台组件
│   └── ...                     # 其他功能组件
├── contexts/                   # React Context
├── db/                         # 数据库相关
│   ├── schema.ts              # 数据库模式定义
│   └── migrations/            # 数据库迁移文件
├── hooks/                      # 自定义 React Hooks
├── i18n/                       # 国际化配置
│   ├── pages/                 # 页面级翻译
│   └── messages/              # 全局消息翻译
├── lib/                        # 通用工具库
├── models/                     # 数据模型层
├── services/                   # 业务逻辑层
├── types/                      # TypeScript 类型定义
└── providers/                  # React 提供者组件
```

## 核心功能模块

### 1. 用户认证系统
- **多提供商登录**: Google, GitHub, Google One Tap
- **会话管理**: JWT token 处理
- **用户信息存储**: 包含邀请关系、积分等扩展信息

### 2. 支付与订阅系统
- **Stripe 集成**: 支持信用卡、微信支付、支付宝
- **订阅模式**: 月付/年付订阅
- **一次性付费**: 支持买断模式
- **多货币支持**: USD, CNY
- **积分系统**: 基于积分的使用计费

### 3. AI 功能集成
- **统一 AI SDK**: 抽象不同 AI 提供商接口
- **视频生成**: Kling AI 视频生成功能
- **文本生成**: 支持多个 LLM 提供商
- **图像生成**: 集成图像生成能力
- **流式响应**: 支持 AI 流式输出

### 4. 内容管理系统
- **博客系统**: MDX 支持的文章管理
- **富文本编辑**: TipTap 编辑器
- **多语言内容**: 支持不同语言的内容版本

### 5. 用户管理与控制台
- **用户面板**: 积分查看、API密钥管理、订单查看
- **管理后台**: 用户管理、订单管理、反馈管理、文章管理
- **数据可视化**: 图表展示运营数据

### 6. 邀请与推广系统
- **邀请码机制**: 用户邀请新用户注册
- **推广奖励**: 基于邀请的奖励机制
- **分销联盟**: 支持联盟推广功能

## 数据库设计

### 核心数据表
```sql
-- 用户表
users: 用户基本信息、登录方式、邀请关系
-- 订单表  
orders: 支付订单、订阅信息、Stripe 集成
-- 积分表
credits: 积分交易记录、过期时间
-- API密钥表
apikeys: 用户 API 密钥管理
-- 文章表
posts: 博客文章内容、多语言支持
-- 联盟表
affiliates: 推广关系、奖励记录
-- 反馈表
feedbacks: 用户反馈收集
```

## 架构特性

### 1. 模块化设计
- **组件化**: 可复用的 UI 组件和业务组件
- **服务层分离**: 明确的数据层、业务逻辑层、表现层
- **类型安全**: 完整的 TypeScript 类型定义

### 2. 国际化支持
- **路由级国际化**: [locale] 动态路由
- **内容国际化**: 页面内容、UI 消息的多语言支持
- **自动语言检测**: 基于浏览器语言的自动切换

### 3. 主题系统
- **动态主题切换**: 明暗主题支持
- **CSS 变量**: 基于 CSS 变量的主题系统
- **自定义主题**: 支持自定义颜色主题

### 4. 响应式设计
- **移动优先**: Tailwind CSS 响应式设计
- **自适应布局**: 支持不同屏幕尺寸
- **PWA 就绪**: 支持渐进式 Web 应用

### 5. 性能优化
- **代码分割**: Next.js 自动代码分割
- **图片优化**: Next.js Image 组件优化
- **缓存策略**: 合理的缓存机制
- **Turbopack**: 开发时使用 Turbopack 加速

### 6. 部署支持
- **Vercel 优化**: 针对 Vercel 部署优化
- **Cloudflare 支持**: 提供 Cloudflare 部署分支
- **Docker 支持**: 提供 Docker 部署配置
- **环境变量**: 完整的环境配置管理

## 开发工作流

### 1. 本地开发
```bash
# 安装依赖
pnpm install

# 开发服务器 (使用 Turbopack)
pnpm dev

# 数据库操作
pnpm db:generate  # 生成迁移
pnpm db:migrate   # 执行迁移
pnpm db:studio    # 数据库可视化
```

### 2. 构建部署
```bash
# 生产构建
pnpm build

# 生产服务器
pnpm start

# Docker 构建
pnpm docker:build
```

### 3. 代码质量
- **ESLint**: 代码规范检查
- **TypeScript**: 类型检查
- **自动格式化**: 开发工具集成

## 扩展能力

### 1. AI 提供商扩展
- **统一接口**: 易于集成新的 AI 提供商
- **模型抽象**: 支持不同类型的 AI 模型
- **设置管理**: 灵活的 AI 模型配置

### 2. 支付网关扩展
- **Stripe 为主**: 完整的 Stripe 集成
- **多币种**: 支持不同货币和支付方式
- **订阅管理**: 完整的订阅生命周期管理

### 3. 内容扩展
- **MDX 支持**: 灵活的内容创作
- **多媒体**: 图片、视频等媒体支持
- **SEO 优化**: 完整的 SEO 元数据支持

### 4. 功能扩展
- **插件化**: 模块化的功能扩展机制
- **API 优先**: RESTful API 设计
- **事件系统**: 基于事件的功能解耦

## 总结

ShipAny 是一个功能完整、架构清晰的 AI SaaS 快速开发框架。它提供了从用户认证、支付订阅、AI 集成到内容管理的完整解决方案，特别适合快速构建和部署 AI 创业项目。框架采用现代化的技术栈，具有良好的可扩展性和维护性，是构建 AI SaaS 应用的理想选择。

**核心价值**:
- 🚀 快速启动: 几小时内从想法到产品
- 🎯 功能完整: 涵盖 SaaS 应用的所有核心功能  
- 🌍 国际化: 天然的多语言和多地区支持
- 💡 AI 就绪: 深度集成多个 AI 提供商
- 💰 商业化: 完整的支付和订阅系统
- 🔧 易扩展: 模块化设计，易于定制和扩展

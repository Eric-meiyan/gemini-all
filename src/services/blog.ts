import { BlogPost } from '../types/content';
import { AppError } from '../lib/error-handling';

// Blog content with properly escaped markdown
const createBlogContent = (content: string): string => {
  return content;
};

export const mockBlogPosts: BlogPost[] = [
  {
    uuid: "blog-1",
    slug: "getting-started-guide",
    title: "Getting Started with Gemini CLI: A Complete Guide",
    description: "Learn how to set up and use Gemini CLI for enhanced development productivity. Complete with installation, configuration, and best practices.",
    createdAt: new Date("2024-12-10"),
    status: "published" as const,
    locale: "en",
    tags: ["beginner", "setup", "tutorial", "getting-started"],
    viewCount: 1245,
    featured: true,
    contentType: "blog" as const,
    content: createBlogContent(`# Getting Started with Gemini CLI: A Complete Guide

Welcome to the comprehensive guide for Gemini CLI, the powerful command-line interface that brings Google's Gemini AI capabilities directly to your development workflow. This guide will take you from installation to advanced usage patterns.

## What is Gemini CLI?

Gemini CLI is a command-line tool that provides direct access to Google's Gemini AI models, enabling developers to integrate AI capabilities into their development workflows, automation scripts, and applications.

### Key Features

- **Direct API Access**: Communicate with Gemini models from the command line
- **Multiple Output Formats**: JSON, Markdown, plain text, and custom formats
- **Batch Processing**: Handle multiple requests efficiently
- **Configuration Management**: Persistent settings and profiles
- **Integration Ready**: Easy integration with scripts and CI/CD pipelines

## Installation

### Prerequisites

Before installing Gemini CLI, ensure you have:

- Node.js 16 or higher
- npm or yarn package manager
- A Google AI API key (get one at [ai.google.dev](https://ai.google.dev))

### Install via npm

\`\`\`bash
# Install globally
npm install -g @google/gemini-cli

# Or install locally in your project
npm install @google/gemini-cli
\`\`\`

### Install via yarn

\`\`\`bash
# Install globally
yarn global add @google/gemini-cli

# Or install locally
yarn add @google/gemini-cli
\`\`\`

### Verify Installation

\`\`\`bash
gemini --version
\`\`\`

## Configuration

### Setting Up Your API Key

1. **Get your API key** from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. **Configure the CLI**:

\`\`\`bash
# Method 1: Interactive setup
gemini auth setup

# Method 2: Environment variable
export GEMINI_API_KEY="your-api-key-here"

# Method 3: Configuration file
gemini config set apiKey "your-api-key-here"
\`\`\`

### Basic Configuration Options

\`\`\`bash
# Set default model
gemini config set model "gemini-pro"

# Set default temperature
gemini config set temperature 0.7

# Set default max tokens
gemini config set maxTokens 1024

# View current configuration
gemini config show
\`\`\`

## Basic Usage

### Your First Command

\`\`\`bash
# Simple text generation
gemini generate "Hello, Gemini!"

# Generate with specific parameters
gemini generate "Explain quantum computing" --temperature=0.3 --max-tokens=500
\`\`\`

### Common Command Patterns

\`\`\`bash
# Code generation
gemini generate "Create a React component for a user profile card" --format=jsx

# Code explanation
gemini explain ./src/complex-function.js

# Code review
gemini review ./src/api/user-service.ts --focus=security

# Documentation generation
gemini docs generate ./src/utils/ --output=./docs/utils.md
\`\`\`

## Advanced Features

### Working with Files

\`\`\`bash
# Analyze multiple files
gemini analyze ./src/**/*.ts --pattern="security vulnerabilities"

# Generate tests for a file
gemini test-gen ./src/user-service.js --framework=jest

# Refactor code
gemini refactor ./legacy-code.js --target="modern ES6+"
\`\`\`

### Batch Processing

\`\`\`bash
# Process multiple prompts from a file
gemini batch --input=prompts.txt --output=results.json

# Batch analyze files
gemini batch-analyze ./src/ --pattern="*.js" --focus="performance"
\`\`\`

### Output Formatting

\`\`\`bash
# JSON output
gemini generate "API response format" --format=json

# Markdown output
gemini generate "Project documentation" --format=markdown

# Custom template
gemini generate "User story" --template=user-story --format=custom
\`\`\`

## Integration Patterns

### Git Hooks

Create a pre-commit hook for code review:

\`\`\`bash
#!/bin/bash
# .git/hooks/pre-commit

# Get changed files
changed_files=$(git diff --cached --name-only --diff-filter=ACM | grep '\\.js$\\|\\.ts$')

if [ -n "$changed_files" ]; then
    echo "Running AI code review..."
    for file in $changed_files; do
        gemini review "$file" --format=summary
    done
fi
\`\`\`

### CI/CD Integration

GitHub Actions example:

\`\`\`yaml
name: AI Code Review
on: [pull_request]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install Gemini CLI
      run: npm install -g @google/gemini-cli
    
    - name: Run AI Review
      env:
        GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}
      run: |
        gemini review . --format=github-comment > review.md
        
    - name: Comment PR
      uses: actions/github-script@v6
      with:
        script: |
          const fs = require('fs');
          const review = fs.readFileSync('review.md', 'utf8');
          github.rest.issues.createComment({
            issue_number: context.issue.number,
            owner: context.repo.owner,
            repo: context.repo.repo,
            body: review
          });
\`\`\`

### Script Integration

\`\`\`javascript
// Node.js script integration
const { execSync } = require('child_process');

function generateCode(prompt, options = {}) {
  const command = \`gemini generate "\${prompt}" --format=json\`;
  const result = execSync(command, { encoding: 'utf8' });
  return JSON.parse(result);
}

// Example usage
const component = generateCode("React TypeScript component for data table", {
  framework: "react",
  language: "typescript"
});

console.log(component);
\`\`\`

## Best Practices

### Prompt Engineering

1. **Be Specific**: Clear, detailed prompts yield better results
2. **Provide Context**: Include relevant information about your project
3. **Use Examples**: Show the desired output format
4. **Iterate**: Refine prompts based on results

\`\`\`bash
# ❌ Vague prompt
gemini generate "make a function"

# ✅ Specific prompt
gemini generate "Create a TypeScript function that validates email addresses using regex, handles edge cases, and returns boolean"
\`\`\`

### Performance Optimization

1. **Use Caching**: Enable caching for repeated requests
2. **Batch Operations**: Process multiple items together
3. **Optimize Token Usage**: Be mindful of input/output length
4. **Use Appropriate Models**: Choose the right model for your task

\`\`\`bash
# Enable caching
gemini config set cache.enabled true

# Batch processing
gemini batch --input=requests.json --workers=3

# Optimize for speed
gemini generate "quick summary" --model=gemini-pro-flash
\`\`\`

### Security Considerations

1. **Protect API Keys**: Never commit keys to version control
2. **Validate Inputs**: Sanitize prompts in automated scenarios
3. **Review Outputs**: Always review AI-generated code
4. **Use Environment Variables**: Store sensitive configuration securely

\`\`\`bash
# Use environment variables
export GEMINI_API_KEY="your-key"
export GEMINI_PROJECT_ID="your-project"

# Set proper file permissions
chmod 600 ~/.gemini/config.json
\`\`\`

## Troubleshooting

### Common Issues

**API Key Problems**:
\`\`\`bash
# Check if API key is set
gemini auth check

# Reset configuration
gemini config reset

# Test with explicit key
GEMINI_API_KEY="your-key" gemini generate "test"
\`\`\`

**Network Issues**:
\`\`\`bash
# Check connectivity
curl -I https://generativelanguage.googleapis.com

# Use proxy if needed
gemini config set proxy "http://proxy.company.com:8080"

# Increase timeout
gemini config set timeout 60000
\`\`\`

**Performance Issues**:
\`\`\`bash
# Enable verbose logging
gemini generate "test" --verbose

# Check rate limits
gemini status limits

# Use streaming for large outputs
gemini generate "large content" --stream
\`\`\`

## Advanced Configuration

### Custom Templates

Create custom output templates:

\`\`\`bash
# Create template directory
mkdir -p ~/.gemini/templates

# Create a custom template
cat > ~/.gemini/templates/api-doc.md << 'EOF'
# API Documentation

## Endpoint: {{endpoint}}

**Method**: {{method}}  
**Description**: {{description}}

### Parameters
{{#each parameters}}
- \`{{name}}\` ({{type}}): {{description}}
{{/each}}

### Example Response
\`\`\`json
{{example_response}}
\`\`\`
EOF

# Use the template
gemini generate "Document the user API" --template=api-doc
\`\`\`

### Environment Profiles

\`\`\`bash
# Create development profile
gemini profile create dev --model=gemini-pro --temperature=0.7

# Create production profile
gemini profile create prod --model=gemini-pro --temperature=0.2

# Switch profiles
gemini profile use dev
gemini profile use prod

# List profiles
gemini profile list
\`\`\`

## Community and Resources

### Getting Help

- **Documentation**: [Official Docs](https://ai.google.dev/cli)
- **Community Forum**: [GitHub Discussions](https://github.com/google/gemini-cli/discussions)
- **Issues**: [GitHub Issues](https://github.com/google/gemini-cli/issues)
- **Examples**: [Community Examples](https://github.com/gemini-cli-examples)

### Contributing

We welcome contributions! Check out our:
- [Contributing Guidelines](https://github.com/google/gemini-cli/blob/main/CONTRIBUTING.md)
- [Code of Conduct](https://github.com/google/gemini-cli/blob/main/CODE_OF_CONDUCT.md)
- [Development Setup](https://github.com/google/gemini-cli/blob/main/DEVELOPMENT.md)

## Conclusion

Gemini CLI opens up powerful possibilities for integrating AI into your development workflow. From simple code generation to complex automation pipelines, it's designed to enhance productivity while maintaining flexibility.

Start with basic commands, gradually incorporate advanced features, and don't hesitate to experiment with different approaches. The AI is there to assist and augment your capabilities, not replace your expertise.

Happy coding with Gemini CLI!

---

*Last updated: December 2024*  
*Version: 2.1.0*`),
    coverUrl: "/imgs/blogs/getting-started.webp",
    authorName: "Alex Chen",
    authorAvatarUrl: "/imgs/avatars/alex-chen.webp",
    category: "tutorial",
    difficulty: "beginner",
    readingTime: 12
  },
  {
    uuid: "blog-2",
    slug: "api-integration-patterns",
    title: "Advanced API Integration Patterns with Gemini CLI",
    description: "Explore advanced techniques for integrating Gemini CLI into complex applications and workflows.",
    createdAt: new Date("2024-12-08"),
    status: "published" as const,
    locale: "en",
    tags: ["api", "integration", "advanced", "patterns"],
    viewCount: 892,
    featured: true,
    contentType: "blog" as const,
    content: createBlogContent(`# Advanced API Integration Patterns with Gemini CLI

Building robust applications with AI capabilities requires thoughtful integration patterns. This guide explores advanced techniques for incorporating Gemini CLI into complex systems.

## Core Integration Concepts

### Synchronous vs Asynchronous Patterns

**Synchronous Integration:**
\`\`\`javascript
// Direct API calls for immediate results
const result = await gemini.generate(prompt);
console.log(result);
\`\`\`

**Asynchronous Integration:**
\`\`\`javascript
// Queue-based processing for high-volume scenarios
const jobId = await gemini.enqueue(prompt);
const result = await gemini.pollResult(jobId);
\`\`\`

## Error Handling and Retry Logic

Implement robust error handling:

\`\`\`javascript
class GeminiApiClient {
  async generateWithRetry(prompt, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.generate(prompt);
      } catch (error) {
        if (attempt === maxRetries) throw error;
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }
  }
}
\`\`\`

## Caching Strategies

Implement intelligent caching for better performance:

\`\`\`javascript
class CachedGeminiClient {
  constructor() {
    this.cache = new Map();
  }
  
  async generate(prompt) {
    const cacheKey = this.createCacheKey(prompt);
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const result = await this.apiCall(prompt);
    this.cache.set(cacheKey, result);
    
    return result;
  }
}
\`\`\`

This approach ensures optimal performance and cost management in production environments.`),
    coverUrl: "/imgs/blogs/api-integration.webp",
    authorName: "Sarah Kim",
    authorAvatarUrl: "/imgs/avatars/sarah-kim.webp",
    category: "development",
    difficulty: "advanced",
    readingTime: 18
  },
  {
    uuid: "blog-3",
    slug: "performance-optimization",
    title: "Gemini CLI Performance Optimization Tips",
    description: "Discover techniques to optimize your Gemini CLI applications for better performance, including caching strategies and efficient prompt design.",
    createdAt: new Date("2024-12-05"),
    status: "published" as const,
    locale: "en",
    tags: ["performance", "optimization", "best-practices", "caching"],
    viewCount: 645,
    featured: false,
    contentType: "blog" as const,
    content: createBlogContent(`# Gemini CLI Performance Optimization Tips

Performance optimization is crucial for production applications. This guide covers proven techniques to maximize efficiency and minimize latency.

## Understanding Performance Bottlenecks

Common performance issues include:
- API request latency
- Token processing overhead
- Memory usage
- Concurrency limitations

## Optimization Strategies

### 1. Prompt Engineering
\`\`\`bash
# Efficient prompt design
gemini generate "Create TypeScript interface for User" --format=typescript
\`\`\`

### 2. Caching Implementation
\`\`\`javascript
const cache = new Map();
function getCachedResult(prompt) {
  if (cache.has(prompt)) {
    return cache.get(prompt);
  }
  // Generate and cache
}
\`\`\`

### 3. Batch Processing
\`\`\`bash
gemini batch --input=prompts.json --workers=3
\`\`\`

These optimizations can improve response times by up to 60% in production environments.`),
    coverUrl: "/imgs/blogs/performance-optimization.webp",
    authorName: "Mike Rodriguez",
    authorAvatarUrl: "/imgs/avatars/mike-rodriguez.webp",
    category: "performance",
    difficulty: "intermediate",
    readingTime: 15
  }
];

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 10)); // Simulate async
    return mockBlogPosts;
  } catch (error) {
    throw new AppError('Failed to fetch blog posts', 'FETCH_ERROR', 500);
  }
};

export const getBlogPostBySlug = async (slug: string, locale?: string): Promise<BlogPost | null> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 10)); // Simulate async
    const post = mockBlogPosts.find(post => 
      post.slug === slug && (!locale || post.locale === locale)
    );
    
    if (!post) {
      throw new AppError(`Blog post not found: ${slug}`, 'NOT_FOUND', 404);
    }
    
    return post;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to fetch blog post', 'FETCH_ERROR', 500);
  }
};

export const getFeaturedBlogPosts = (limit: number = 3): BlogPost[] => {
  return mockBlogPosts
    .filter(post => post.featured)
    .slice(0, limit);
};

export const getBlogPostsByCategory = (category: string): BlogPost[] => {
  return mockBlogPosts.filter(post => post.category === category);
};

export const getBlogPostsByTag = (tag: string): BlogPost[] => {
  return mockBlogPosts.filter(post => post.tags?.includes(tag));
};

export const getRecentBlogPosts = (limit: number = 5): BlogPost[] => {
  return mockBlogPosts
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
};

export const getBlogPosts = (options?: { 
  query?: string; 
  category?: string; 
  tag?: string; 
  difficulty?: string; 
  limit?: number; 
  offset?: number; 
}): { posts: BlogPost[]; total: number; categories: string[] } => {
  let filteredPosts = [...mockBlogPosts];
  
  if (options?.query) {
    const searchTerm = options.query.toLowerCase();
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.description.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
  
  if (options?.category) {
    filteredPosts = filteredPosts.filter(post => post.category === options.category);
  }
  
  if (options?.tag) {
    filteredPosts = filteredPosts.filter(post => post.tags.includes(options.tag!));
  }
  
  if (options?.difficulty) {
    filteredPosts = filteredPosts.filter(post => post.difficulty === options.difficulty);
  }
  
  const total = filteredPosts.length;
  
  if (options?.offset) {
    filteredPosts = filteredPosts.slice(options.offset);
  }
  
  if (options?.limit) {
    filteredPosts = filteredPosts.slice(0, options.limit);
  }
  
  // Get unique categories
  const allCategories = mockBlogPosts.map(post => post.category).filter(Boolean);
  const categories = Array.from(new Set(allCategories)) as string[];
  
  return { posts: filteredPosts, total, categories };
};

export const getPopularTags = (): { tag: string; count: number }[] => {
  const tagCounts: { [key: string]: number } = {};
  
  mockBlogPosts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  return Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([tag, count]) => ({ tag, count }));
};

export const getRelatedBlogPosts = (currentSlug: string, limit: number = 3): BlogPost[] => {
  const currentPost = mockBlogPosts.find(post => post.slug === currentSlug);
  if (!currentPost) return [];
  
  // Find posts with similar tags or category
  const relatedPosts = mockBlogPosts
    .filter(post => post.slug !== currentSlug)
    .filter(post => 
      post.category === currentPost.category ||
      post.tags.some(tag => currentPost.tags.includes(tag))
    )
    .sort((a, b) => {
      // Score by tag similarity
      const aScore = a.tags.filter(tag => currentPost.tags.includes(tag)).length;
      const bScore = b.tags.filter(tag => currentPost.tags.includes(tag)).length;
      return bScore - aScore;
    })
    .slice(0, limit);
  
  // If not enough related posts, fill with recent posts
  if (relatedPosts.length < limit) {
    const additional = getRecentBlogPosts(limit)
      .filter(post => post.slug !== currentSlug && !relatedPosts.includes(post))
      .slice(0, limit - relatedPosts.length);
    relatedPosts.push(...additional);
  }
  
  return relatedPosts;
};
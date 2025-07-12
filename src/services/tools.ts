import { ToolReview } from "../types/tools";

// Mock tool data - in a real app this would come from a database or API
export const mockTools: ToolReview[] = [
  {
    id: "gemini-cli-official",
    name: "Gemini CLI",
    category: "AI Development",
    description: "Official command-line interface for Google's Gemini AI models, enabling developers to integrate AI capabilities directly into their development workflow.",
    longDescription: "The official Gemini CLI provides a powerful command-line interface for interacting with Google's advanced AI models. Built for developers who want to integrate AI capabilities seamlessly into their existing workflows, it offers comprehensive features for text generation, code analysis, and creative tasks. With support for multiple output formats, batch processing, and extensive configuration options, Gemini CLI stands out as a versatile tool for both individual developers and teams. The tool excels in scenarios requiring rapid prototyping, code documentation, and intelligent code analysis. Its integration capabilities with popular development tools make it an excellent choice for CI/CD pipelines and automated workflows. The CLI's strength lies in its simplicity combined with powerful features, allowing both beginners and advanced users to leverage Google's cutting-edge AI technology effectively.",
    logo: "/imgs/features/gemini-cli.webp",
    screenshots: ["/imgs/features/1.png", "/imgs/features/2.png"],
    version: "2.1.0",
    developer: "Google",
    website: "https://ai.google.dev/cli",
    github: "https://github.com/google/gemini-cli",
    downloadUrl: "https://ai.google.dev/cli/install",
    price: "free",
    
    overallRating: 4.7,
    ratings: {
      performance: 4.8,
      usability: 4.5,
      features: 4.9,
      support: 4.6
    },
    reviewCount: 342,
    
    features: [
      "Natural language code generation",
      "Code analysis and review",
      "Documentation generation",
      "Multi-language support",
      "Integration with popular IDEs",
      "Customizable prompts",
      "Batch processing",
      "API key management"
    ],
    platforms: ["Windows", "macOS", "Linux"],
    languages: ["Python", "JavaScript", "TypeScript", "Go", "Java", "C++"],
    integrations: ["VS Code", "Vim", "Emacs", "JetBrains IDEs", "GitHub"],
    
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-07-10"),
    featured: true,
    verified: true,
    
    tags: ["AI", "CLI", "Google", "Code Generation", "Productivity"],
    pros: [
      "Excellent integration with development tools and CI/CD pipelines",
      "High-quality AI responses powered by Google's latest models",
      "Regular updates and improvements from Google's AI team",
      "Comprehensive documentation with practical examples",
      "Active community support and extensive GitHub resources",
      "Free to use with generous rate limits",
      "Cross-platform compatibility (Windows, macOS, Linux)",
      "Flexible output formats (JSON, Markdown, plain text)",
      "Robust error handling and retry mechanisms",
      "Secure API key management and configuration"
    ],
    cons: [
      "Requires stable internet connection for all operations",
      "Initial learning curve for advanced features and prompt engineering",
      "API rate limits may affect high-volume usage scenarios",
      "Command-line interface may not appeal to GUI-preferring users",
      "Limited offline capabilities compared to local AI tools",
      "Dependency on Google's service availability and terms"
    ],
    useCase: "Perfect for developers and DevOps engineers looking to enhance their coding productivity with AI assistance. Ideal for automating code generation, documentation creation, code reviews, and integrating AI capabilities into existing development workflows. Particularly valuable for teams implementing CI/CD pipelines with AI-powered quality checks and automation."
  },
  
  {
    id: "cursor-ai-editor",
    name: "Cursor AI Editor",
    category: "Code Editor",
    description: "AI-powered code editor that understands your codebase and provides intelligent suggestions, refactoring, and code generation capabilities.",
    longDescription: "Cursor AI Editor represents the next generation of code editors, built from the ground up with AI as a first-class citizen. Unlike traditional editors with AI plugins, Cursor integrates AI deeply into every aspect of the coding experience. The editor understands your entire codebase context, enabling it to provide remarkably accurate suggestions and assistance. Its AI can help with complex refactoring tasks, explain code functionality, generate new features based on natural language descriptions, and even predict what you're trying to accomplish before you finish typing. The editor's strength lies in its ability to maintain context across multiple files and provide suggestions that are not just syntactically correct, but also semantically meaningful within your project's architecture. With its modern interface and powerful AI capabilities, Cursor is particularly effective for rapid prototyping and exploring new ideas.",
    logo: "/imgs/features/3.png",
    screenshots: ["/imgs/features/4.png", "/imgs/features/5.png"],
    version: "1.5.2",
    developer: "Cursor Team",
    website: "https://cursor.sh",
    github: "https://github.com/getcursor/cursor",
    price: "freemium",
    priceDetails: "Free tier available, Pro at $20/month",
    
    overallRating: 4.5,
    ratings: {
      performance: 4.3,
      usability: 4.7,
      features: 4.6,
      support: 4.4
    },
    reviewCount: 189,
    
    features: [
      "AI-powered code completion",
      "Intelligent refactoring",
      "Context-aware suggestions",
      "Codebase understanding",
      "Multi-file editing",
      "Custom AI instructions",
      "Git integration",
      "Extension support"
    ],
    platforms: ["Windows", "macOS", "Linux"],
    languages: ["JavaScript", "TypeScript", "Python", "React", "Vue", "Svelte"],
    integrations: ["Git", "GitHub", "GitLab", "Docker", "Node.js"],
    
    createdAt: new Date("2023-11-20"),
    updatedAt: new Date("2024-07-05"),
    featured: true,
    verified: true,
    
    tags: ["AI", "Editor", "Code Completion", "Refactoring"],
    pros: [
      "Excellent AI code suggestions with deep codebase understanding",
      "Intuitive user interface designed for AI-first development",
      "Fast performance with minimal latency in AI responses",
      "Great for rapid prototyping and experimental development",
      "Context-aware refactoring across multiple files",
      "Natural language to code generation capabilities",
      "Modern editor features with AI enhancement",
      "Seamless integration of AI into the development workflow"
    ],
    cons: [
      "Subscription required for advanced AI features and unlimited usage",
      "Limited language support compared to established editors like VS Code",
      "Newer tool with smaller plugin ecosystem",
      "Learning curve for developers used to traditional editors",
      "Dependency on internet connection for AI features",
      "May not suit teams with strict privacy requirements"
    ],
    useCase: "Ideal for developers who want an AI-first coding experience with intelligent assistance. Perfect for startups and individual developers working on modern web applications who prioritize rapid development and AI-powered productivity over extensive plugin ecosystems."
  },

  {
    id: "github-copilot",
    name: "GitHub Copilot",
    category: "AI Assistant",
    description: "AI pair programmer that suggests code completions and entire functions in real-time, trained on billions of lines of code.",
    longDescription: "GitHub Copilot is arguably the most well-known AI coding assistant, developed by GitHub in partnership with OpenAI. Trained on billions of lines of public code from GitHub repositories, Copilot has learned patterns and best practices from the global developer community. It excels at understanding context from comments and existing code to generate relevant suggestions. Copilot's strength lies in its broad language support and deep integration with popular development environments. The tool can generate everything from simple function implementations to complex algorithms based on natural language comments. With the introduction of Copilot Chat, developers can now have conversational interactions with the AI to explain code, debug issues, and get implementation guidance. Its enterprise features include code referencing, compliance tools, and usage analytics, making it suitable for organizations of all sizes.",
    logo: "/imgs/features/6.png",
    screenshots: ["/imgs/features/7.png", "/imgs/features/8.png"],
    version: "1.120.0",
    developer: "GitHub",
    website: "https://github.com/features/copilot",
    price: "paid",
    priceDetails: "$10/month individual, $19/month business",
    
    overallRating: 4.3,
    ratings: {
      performance: 4.2,
      usability: 4.5,
      features: 4.4,
      support: 4.1
    },
    reviewCount: 567,
    
    features: [
      "Real-time code suggestions",
      "Multi-language support",
      "Context-aware completions",
      "Function generation",
      "Comment-to-code conversion",
      "IDE integration",
      "Learning from your code style",
      "Chat interface (Copilot Chat)"
    ],
    platforms: ["Web", "VS Code", "JetBrains", "Neovim"],
    languages: ["Python", "JavaScript", "TypeScript", "Ruby", "Go", "C#", "C++", "Java"],
    integrations: ["VS Code", "Visual Studio", "JetBrains IDEs", "Neovim"],
    
    createdAt: new Date("2021-06-29"),
    updatedAt: new Date("2024-07-08"),
    featured: false,
    verified: true,
    
    tags: ["AI", "GitHub", "Code Assistant", "Autocomplete"],
    pros: [
      "Excellent code suggestions based on vast training data",
      "Wide language support covering most popular programming languages",
      "Strong IDE integrations with VS Code, JetBrains, and others",
      "Continuously improving with regular model updates",
      "Large training dataset from GitHub's public repositories",
      "Enterprise features for compliance and security",
      "Conversational AI interface with Copilot Chat",
      "Well-established tool with proven track record",
      "Strong context awareness within files",
      "Good at generating boilerplate and common patterns"
    ],
    cons: [
      "Subscription required with no free tier",
      "Can suggest outdated patterns or deprecated methods",
      "Privacy concerns with code analysis and data usage",
      "Sometimes suggests inefficient or overly complex code",
      "May encourage copy-paste programming without understanding",
      "Limited ability to understand broader project architecture",
      "Potential copyright and licensing concerns with generated code"
    ],
    useCase: "Best for professional developers and teams working in popular languages who want AI assistance integrated into their existing workflow. Particularly valuable for organizations already using GitHub ecosystem and needing enterprise-grade AI coding assistance with compliance features."
  },

  {
    id: "codeium-ai",
    name: "Codeium",
    category: "AI Assistant",
    description: "Free AI-powered code completion tool that offers intelligent suggestions across 70+ programming languages with enterprise-grade security.",
    longDescription: "Codeium stands out in the AI coding assistant landscape by offering powerful features completely free of charge. Developed by Exafunction, this tool provides comprehensive AI-powered code completion, chat functionality, and code analysis across more than 70 programming languages. What sets Codeium apart is its strong emphasis on privacy and security – the tool processes code securely and offers on-premises deployment options for enterprises with strict data requirements. The AI model is trained on a diverse dataset and provides contextual suggestions that understand both syntax and semantics. Codeium's chat feature allows developers to ask questions about their code, get explanations, and receive help with debugging. The tool's performance is competitive with paid alternatives while maintaining a commitment to keeping core features free. For enterprises, Codeium offers additional features like personalized models and enhanced security controls.",
    logo: "/imgs/features/9.png",
    screenshots: ["/imgs/showcases/1.png", "/imgs/showcases/2.png"],
    version: "1.3.14",
    developer: "Exafunction",
    website: "https://codeium.com",
    github: "https://github.com/Exafunction/codeium",
    price: "free",
    
    overallRating: 4.2,
    ratings: {
      performance: 4.0,
      usability: 4.3,
      features: 4.1,
      support: 4.4
    },
    reviewCount: 203,
    
    features: [
      "AI code completion",
      "70+ language support", 
      "Chat functionality",
      "Code explanation",
      "Bug detection",
      "Test generation",
      "Free unlimited usage",
      "Privacy-focused"
    ],
    platforms: ["VS Code", "JetBrains", "Neovim", "Emacs", "Web"],
    languages: ["Python", "JavaScript", "TypeScript", "Java", "C++", "Go", "Rust", "PHP"],
    integrations: ["VS Code", "IntelliJ IDEA", "PyCharm", "WebStorm", "Neovim"],
    
    createdAt: new Date("2022-08-15"),
    updatedAt: new Date("2024-07-12"),
    featured: false,
    verified: true,
    
    tags: ["AI", "Free", "Code Completion", "Privacy"],
    pros: [
      "Completely free to use with no usage limits or paywalls",
      "Excellent language support covering 70+ programming languages",
      "Strong privacy protection with secure code processing",
      "Fast and responsive performance comparable to paid alternatives",
      "No usage limits or artificial restrictions on free tier",
      "Chat functionality for code explanations and debugging help",
      "Enterprise security options and on-premises deployment",
      "Regular updates and improvements to AI models",
      "Wide IDE support across different development environments",
      "Transparent privacy policy and data handling practices"
    ],
    cons: [
      "Newer tool with smaller community compared to established competitors",
      "Less sophisticated AI suggestions compared to some paid alternatives",
      "Limited enterprise features in free tier",
      "Smaller training dataset compared to GitHub Copilot",
      "Documentation and learning resources still developing",
      "May have occasional performance variations during peak usage"
    ],
    useCase: "Perfect for individual developers, students, and small teams who want powerful AI assistance without subscription costs or privacy concerns. Ideal for organizations with strict data security requirements that need on-premises AI coding solutions."
  },

  {
    id: "tabnine-ai",
    name: "Tabnine",
    category: "AI Assistant",
    description: "AI code assistant that provides personalized suggestions based on your code patterns and supports private model training for enterprises.",
    longDescription: "Tabnine is one of the pioneers in AI-powered code completion, having been in the market since 2019. What distinguishes Tabnine is its focus on personalization and privacy through local processing capabilities. The tool learns from your coding patterns and style to provide increasingly personalized suggestions over time. For enterprise customers, Tabnine offers the unique ability to train private models on company codebases, ensuring that AI suggestions align with internal coding standards and practices. The tool supports both cloud-based and on-device processing, allowing organizations to choose their preferred approach based on security requirements. Tabnine's AI can complete whole lines or functions, and its enterprise features include team model sharing, where organizations can share trained models across development teams. While the interface may feel more traditional compared to newer competitors, Tabnine's strength lies in its mature enterprise features and strong privacy controls.",
    logo: "/imgs/showcases/3.png",
    screenshots: ["/imgs/showcases/4.png", "/imgs/showcases/5.png"],
    version: "4.4.191",
    developer: "Tabnine",
    website: "https://www.tabnine.com",
    price: "freemium",
    priceDetails: "Free tier available, Pro at $12/month",
    
    overallRating: 4.0,
    ratings: {
      performance: 3.9,
      usability: 4.2,
      features: 4.0,
      support: 3.9
    },
    reviewCount: 445,
    
    features: [
      "Personalized AI suggestions",
      "Private model training",
      "Code completion",
      "Whole-line completions",
      "Local processing option",
      "Team model sharing",
      "Enterprise security",
      "Multiple IDE support"
    ],
    platforms: ["VS Code", "IntelliJ", "Eclipse", "Sublime", "Atom", "Vim"],
    languages: ["JavaScript", "Python", "Java", "C++", "C#", "PHP", "Ruby", "Go"],
    integrations: ["Most popular IDEs", "CI/CD pipelines"],
    
    createdAt: new Date("2019-03-10"),
    updatedAt: new Date("2024-07-09"),
    featured: false,
    verified: true,
    
    tags: ["AI", "Personalized", "Enterprise", "Privacy"],
    pros: [
      "Personalized AI suggestions that learn from your coding style",
      "Strong enterprise features with private model training",
      "Local processing available for enhanced privacy and security",
      "Wide IDE support across most popular development environments",
      "Long-established tool with proven enterprise adoption",
      "Team model sharing capabilities for consistent coding standards",
      "Flexible deployment options (cloud, on-premises, hybrid)",
      "Comprehensive compliance and security certifications",
      "Continuous learning from team coding patterns",
      "Mature enterprise support and service level agreements"
    ],
    cons: [
      "Less accurate AI suggestions compared to newer competitors",
      "Interface feels dated compared to modern AI coding tools",
      "Premium enterprise features can be expensive for smaller teams",
      "Setup complexity for advanced enterprise features",
      "Slower adoption of latest AI model improvements",
      "Limited chat or conversational AI capabilities",
      "Steeper learning curve for maximizing personalization benefits"
    ],
    useCase: "Good for established enterprises and teams that need personalized AI assistance with strong privacy controls and compliance requirements. Ideal for organizations wanting to train AI models on their internal codebases while maintaining data sovereignty and security standards."
  }
];

// Service functions
export async function getTools(): Promise<ToolReview[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockTools;
}

export async function getToolById(id: string): Promise<ToolReview | null> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockTools.find(tool => tool.id === id) || null;
}

export async function getToolsByCategory(category: string): Promise<ToolReview[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockTools.filter(tool => tool.category === category);
}

export async function getFeaturedTools(): Promise<ToolReview[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockTools.filter(tool => tool.featured);
}

export async function searchTools(query: string): Promise<ToolReview[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  const lowercaseQuery = query.toLowerCase();
  return mockTools.filter(tool => 
    tool.name.toLowerCase().includes(lowercaseQuery) ||
    tool.description.toLowerCase().includes(lowercaseQuery) ||
    tool.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    tool.features.some(feature => feature.toLowerCase().includes(lowercaseQuery))
  );
}

// Category mappings
export const toolCategories = [
  { value: "all", label: "All Categories" },
  { value: "AI Development", label: "AI Development" },
  { value: "Code Editor", label: "Code Editors" },
  { value: "AI Assistant", label: "AI Assistants" },
  { value: "Productivity", label: "Productivity" },
  { value: "Development", label: "Development Tools" }
];

export const sortOptions = [
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviews" },
  { value: "latest", label: "Recently Updated" },
  { value: "name", label: "Alphabetical" },
  { value: "price-free", label: "Free First" }
];

// 获取相关工具
export async function getRelatedTools(currentToolId: string, limit: number = 4): Promise<ToolReview[]> {
  try {
    const allTools = await getTools();
    const currentTool = allTools.find(tool => tool.id === currentToolId);
    
    if (!currentTool) return [];
    
    // 排除当前工具
    let relatedTools = allTools.filter(tool => tool.id !== currentToolId);
    
    // 按相关性排序
    const toolsWithScore = relatedTools.map(tool => {
      let score = 0;
      
      // 相同分类加分
      if (tool.category === currentTool.category) score += 10;
      
      // 共同标签加分
      const commonTags = tool.tags.filter(tag => currentTool.tags.includes(tag));
      score += commonTags.length * 3;
      
      // 评分相近加分
      const ratingDiff = Math.abs(tool.overallRating - currentTool.overallRating);
      score += Math.max(0, 5 - ratingDiff);
      
      return { ...tool, score };
    });
    
    // 按分数排序
    toolsWithScore.sort((a: any, b: any) => b.score - a.score);
    
    return toolsWithScore.slice(0, limit);
  } catch (error) {
    console.error('Error getting related tools:', error);
    return [];
  }
}
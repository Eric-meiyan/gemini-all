import { ToolReview } from "@/types/tools";

// Mock tool data - in a real app this would come from a database or API
export const mockTools: ToolReview[] = [
  {
    id: "gemini-cli-official",
    name: "Gemini CLI",
    category: "AI Development",
    description: "Official command-line interface for Google's Gemini AI models, enabling developers to integrate AI capabilities directly into their development workflow.",
    longDescription: "The official Gemini CLI provides a powerful command-line interface for interacting with Google's advanced AI models. Built for developers who want to integrate AI capabilities seamlessly into their existing workflows, it offers comprehensive features for text generation, code analysis, and creative tasks.",
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
      "Excellent integration with development tools",
      "High-quality AI responses",
      "Regular updates and improvements",
      "Comprehensive documentation",
      "Active community support"
    ],
    cons: [
      "Requires stable internet connection",
      "Learning curve for advanced features",
      "API rate limits on free tier"
    ],
    useCase: "Perfect for developers looking to enhance their coding productivity with AI assistance."
  },
  
  {
    id: "cursor-ai-editor",
    name: "Cursor AI Editor",
    category: "Code Editor",
    description: "AI-powered code editor that understands your codebase and provides intelligent suggestions, refactoring, and code generation capabilities.",
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
      "Excellent AI code suggestions",
      "Intuitive user interface",
      "Fast performance",
      "Great for rapid prototyping"
    ],
    cons: [
      "Subscription required for advanced features",
      "Limited language support compared to VS Code",
      "Newer tool with smaller ecosystem"
    ],
    useCase: "Ideal for developers who want an AI-first coding experience with intelligent assistance."
  },

  {
    id: "github-copilot",
    name: "GitHub Copilot",
    category: "AI Assistant",
    description: "AI pair programmer that suggests code completions and entire functions in real-time, trained on billions of lines of code.",
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
      "Excellent code suggestions",
      "Wide language support",
      "Strong IDE integrations",
      "Continuously improving",
      "Large training dataset"
    ],
    cons: [
      "Subscription required",
      "Can suggest outdated patterns",
      "Privacy concerns with code analysis",
      "Sometimes suggests inefficient code"
    ],
    useCase: "Best for developers working in popular languages who want AI assistance integrated into their existing workflow."
  },

  {
    id: "codeium-ai",
    name: "Codeium",
    category: "AI Assistant",
    description: "Free AI-powered code completion tool that offers intelligent suggestions across 70+ programming languages with enterprise-grade security.",
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
      "Completely free to use",
      "Excellent language support",
      "Strong privacy protection",
      "Fast and responsive",
      "No usage limits"
    ],
    cons: [
      "Newer tool with smaller community",
      "Less sophisticated than paid alternatives",
      "Limited enterprise features"
    ],
    useCase: "Perfect for developers who want powerful AI assistance without subscription costs or privacy concerns."
  },

  {
    id: "tabnine-ai",
    name: "Tabnine",
    category: "AI Assistant",
    description: "AI code assistant that provides personalized suggestions based on your code patterns and supports private model training for enterprises.",
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
      "Personalized to your coding style",
      "Strong enterprise features",
      "Local processing available",
      "Wide IDE support",
      "Long-established tool"
    ],
    cons: [
      "Less accurate than newer competitors",
      "Interface feels dated",
      "Premium features can be expensive",
      "Setup complexity for enterprise features"
    ],
    useCase: "Good for teams and enterprises that need personalized AI assistance with strong privacy controls."
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
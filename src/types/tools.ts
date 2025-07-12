// Tool-specific types
export interface ToolReview {
  id: string;
  name: string;
  category: string;
  description: string;
  longDescription?: string;
  logo: string;
  screenshots: string[];
  version: string;
  developer: string;
  website: string;
  github?: string;
  downloadUrl?: string;
  price: "free" | "freemium" | "paid";
  priceDetails?: string;
  
  // Ratings
  overallRating: number; // 1-5
  ratings: {
    performance: number;
    usability: number;
    features: number;
    support: number;
  };
  reviewCount: number;
  
  // Features
  features: string[];
  platforms: string[]; // ["Windows", "macOS", "Linux", "Web"]
  languages: string[]; // Programming languages supported
  integrations: string[]; // Other tools it integrates with
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  featured: boolean;
  verified: boolean; // Verified by our team
  
  // SEO and display
  tags: string[];
  pros: string[];
  cons: string[];
  useCase: string; // Brief description of when to use this tool
}
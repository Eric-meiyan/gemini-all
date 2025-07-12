"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/icon";

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

interface StatsProps {
  title?: string;
  description?: string;
  stats: StatItem[];
  layout?: "grid" | "horizontal";
  animated?: boolean;
}

export default function Statistics({ 
  title = "Platform Statistics",
  description,
  stats, 
  layout = "grid",
  animated = true 
}: StatsProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [animated]);

  if (!stats || stats.length === 0) {
    return null;
  }

  const renderStat = (stat: StatItem, index: number) => {
    return (
      <Card 
        key={index}
        className={`transition-all duration-500 hover:shadow-lg ${
          animated 
            ? isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
            : 'opacity-100'
        }`}
        style={animated ? { transitionDelay: `${index * 100}ms` } : {}}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Icon name={stat.icon} className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </span>
                {stat.trend && (
                  <span 
                    className={`text-sm font-medium ${
                      stat.trend.isPositive ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    <Icon 
                      name={stat.trend.isPositive ? "RiArrowUpLine" : "RiArrowDownLine"} 
                      className="inline h-4 w-4 mr-1" 
                    />
                    {Math.abs(stat.trend.value)}%
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                {stat.label}
              </p>
              {stat.description && (
                <p className="text-xs text-gray-500 line-clamp-2">
                  {stat.description}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {(title || description) && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
            {description && (
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        
        <div className={
          layout === "grid" 
            ? `grid gap-6 ${
                stats.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                stats.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                stats.length === 3 ? 'grid-cols-1 md:grid-cols-3' :
                'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              }`
            : "flex flex-wrap gap-6 justify-center"
        }>
          {stats.map((stat, index) => renderStat(stat, index))}
        </div>
      </div>
    </section>
  );
}

// Predefined stat configurations for common use cases
export const platformStats: StatItem[] = [
  {
    label: "Active Developers",
    value: "5,000+",
    icon: "RiTeamLine",
    description: "Growing community of Gemini CLI developers",
    trend: { value: 15, isPositive: true }
  },
  {
    label: "Tools Reviewed",
    value: "100+",
    icon: "RiToolsLine", 
    description: "Comprehensive tool evaluations and guides",
    trend: { value: 8, isPositive: true }
  },
  {
    label: "Articles Published", 
    value: "500+",
    icon: "RiArticleLine",
    description: "In-depth tutorials and expert insights",
    trend: { value: 22, isPositive: true }
  },
  {
    label: "Expert Contributors",
    value: "50+",
    icon: "RiStarLine",
    description: "Industry experts sharing knowledge",
    trend: { value: 12, isPositive: true }
  }
];

export const communityStats: StatItem[] = [
  {
    label: "GitHub Stars",
    value: "2.3k",
    icon: "RiGithubLine",
    description: "Community appreciation on GitHub"
  },
  {
    label: "Discord Members",
    value: "1.2k",
    icon: "RiDiscordLine", 
    description: "Active discussions and support"
  },
  {
    label: "Monthly Downloads",
    value: "15k",
    icon: "RiDownloadLine",
    description: "Tools and resources downloaded"
  }
];

export const performanceStats: StatItem[] = [
  {
    label: "Page Load Time",
    value: "1.2s",
    icon: "RiSpeedLine",
    description: "Average page load performance",
    trend: { value: 5, isPositive: false }
  },
  {
    label: "Uptime",
    value: "99.9%",
    icon: "RiServerLine",
    description: "Service availability",
    trend: { value: 0.1, isPositive: true }
  }
];
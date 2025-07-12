"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/ui/safe-image";
import { Link } from "@/i18n/navigation";
import Icon from "@/components/icon";
import { ToolReview } from "@/types/tools";

interface ToolCardProps {
  tool: ToolReview;
  locale: string;
  variant?: "default" | "featured" | "compact";
  showFullDetails?: boolean;
}

export default function ToolCard({ 
  tool, 
  locale, 
  variant = "default",
  showFullDetails = false 
}: ToolCardProps) {
  
  const renderStarRating = (rating: number, size: "sm" | "md" = "sm") => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon 
          key={i} 
          name="RiStarFill" 
          className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} text-yellow-400`} 
        />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <Icon 
          key="half" 
          name="RiStarHalfFill" 
          className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} text-yellow-400`} 
        />
      );
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon 
          key={`empty-${i}`} 
          name="RiStarLine" 
          className={`${size === "sm" ? "h-4 w-4" : "h-5 w-5"} text-gray-300`} 
        />
      );
    }
    
    return stars;
  };

  const getPriceDisplay = () => {
    switch (tool.price) {
      case "free":
        return { text: "Free", color: "bg-green-100 text-green-800" };
      case "freemium":
        return { text: "Freemium", color: "bg-blue-100 text-blue-800" };
      case "paid":
        return { text: tool.priceDetails || "Paid", color: "bg-purple-100 text-purple-800" };
      default:
        return { text: "Unknown", color: "bg-gray-100 text-gray-800" };
    }
  };

  const priceInfo = getPriceDisplay();

  if (variant === "compact") {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <SafeImage
              src={tool.logo}
              alt={tool.name}
              className="w-12 h-12 rounded-lg object-contain flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">{tool.name}</h3>
                {tool.verified && (
                  <Icon name="RiVerifiedBadgeFill" className="h-4 w-4 text-blue-500" />
                )}
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1">
                  {renderStarRating(tool.overallRating)}
                </div>
                <span className="text-sm text-gray-600">
                  {tool.overallRating.toFixed(1)} ({tool.reviewCount})
                </span>
              </div>
              <Badge variant="secondary" className={priceInfo.color}>
                {priceInfo.text}
              </Badge>
            </div>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/tools/${tool.id}`}>
                View
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${
      variant === "featured" ? "ring-2 ring-blue-200" : ""
    }`}>
      <CardContent className="p-0">
        {/* Header with logo and basic info */}
        <div className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <SafeImage
              src={tool.logo}
              alt={tool.name}
              className="w-16 h-16 rounded-xl object-contain flex-shrink-0 bg-gray-50 p-2"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h3>
                {tool.verified && (
                  <Icon name="RiVerifiedBadgeFill" className="h-5 w-5 text-blue-500" />
                )}
                {tool.featured && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                    Featured
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  {renderStarRating(tool.overallRating)}
                  <span className="ml-1 font-medium text-gray-900">
                    {tool.overallRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({tool.reviewCount} reviews)
                  </span>
                </div>
                <Badge variant="secondary" className={priceInfo.color}>
                  {priceInfo.text}
                </Badge>
              </div>

              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {tool.description}
              </p>
            </div>
          </div>

          {/* Category and platforms */}
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">{tool.category}</Badge>
            {tool.platforms.slice(0, 3).map((platform) => (
              <Badge key={platform} variant="secondary" className="text-xs">
                {platform}
              </Badge>
            ))}
            {tool.platforms.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{tool.platforms.length - 3}
              </Badge>
            )}
          </div>
        </div>

        {/* Features preview */}
        {tool.features && tool.features.length > 0 && (
          <div className="px-6 pb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h4>
            <div className="flex flex-wrap gap-1">
              {tool.features.slice(0, 4).map((feature, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {tool.features.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{tool.features.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Rating breakdown for detailed view */}
        {showFullDetails && (
          <div className="px-6 pb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Rating Breakdown:</h4>
            <div className="space-y-2">
              {Object.entries(tool.ratings).map(([key, rating]) => (
                <div key={key} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-20 capitalize">{key}:</span>
                  <div className="flex items-center gap-1">
                    {renderStarRating(rating)}
                  </div>
                  <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pros and Cons for detailed view */}
        {showFullDetails && tool.pros && tool.cons && (
          <div className="px-6 pb-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                  <Icon name="RiCheckLine" className="h-4 w-4" />
                  Pros
                </h4>
                <ul className="space-y-1">
                  {tool.pros.slice(0, 3).map((pro, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-1">
                      <Icon name="RiCheckLine" className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
                  <Icon name="RiCloseLine" className="h-4 w-4" />
                  Cons
                </h4>
                <ul className="space-y-1">
                  {tool.cons.slice(0, 3).map((con, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-1">
                      <Icon name="RiCloseLine" className="h-3 w-3 text-red-500 mt-0.5 flex-shrink-0" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="px-6 py-4 bg-gray-50 border-t flex items-center gap-3">
          <Button asChild className="flex-1">
            <Link href={`/tools/${tool.id}`}>
              <Icon name="RiEyeLine" className="mr-2 h-4 w-4" />
              View Details
            </Link>
          </Button>
          
          {tool.website && (
            <Button variant="outline" size="sm" asChild>
              <Link href={tool.website} target="_blank">
                <Icon name="RiExternalLinkLine" className="h-4 w-4" />
              </Link>
            </Button>
          )}
          
          {tool.github && (
            <Button variant="outline" size="sm" asChild>
              <Link href={tool.github} target="_blank">
                <Icon name="RiGithubLine" className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
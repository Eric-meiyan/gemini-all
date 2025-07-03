"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
}

export function SafeImage({ 
  src, 
  alt, 
  className, 
  fallbackSrc = "/imgs/placeholder.png",
  onError 
}: SafeImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && imageSrc !== fallbackSrc) {
      setHasError(true);
      setImageSrc(fallbackSrc);
      onError?.();
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={cn("object-cover", className)}
      onError={handleError}
      loading="lazy"
    />
  );
}

interface SafeAvatarProps {
  src: string;
  alt: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function SafeAvatar({ 
  src, 
  alt, 
  className,
  size = "md"
}: SafeAvatarProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12"
  };

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Generate a colorful placeholder based on alt text
      const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#ef4444', '#f59e0b', '#6366f1'];
      const colorIndex = alt.length % colors.length;
      setImageSrc(`data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
          <rect width="100" height="100" fill="${colors[colorIndex]}"/>
          <text x="50" y="50" font-family="Arial, sans-serif" font-size="36" fill="white" text-anchor="middle" dy="0.35em">
            ${alt.charAt(0).toUpperCase()}
          </text>
        </svg>
      `)}`);
    }
  };

  if (hasError) {
    return (
      <div className={cn(
        "rounded-full flex items-center justify-center text-white font-semibold bg-gradient-to-br from-blue-500 to-purple-600",
        sizeClasses[size],
        className
      )}>
        {alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={cn("rounded-full object-cover", sizeClasses[size], className)}
      onError={handleError}
      loading="lazy"
    />
  );
} 
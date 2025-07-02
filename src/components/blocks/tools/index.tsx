"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Icon from "@/components/icon";
import { Link } from "@/i18n/navigation";
import moment from "moment";

// Mock data for tools
const mockTools = [
  {
    uuid: "1",
    title: "Gemini CLI Assistant",
    description: "A powerful CLI assistant that helps you interact with Google Gemini models directly from the command line.",
    content_type: "tool",
    category: "cli_extensions",
    author_name: "Google AI Team",
    author_avatar_url: "/imgs/users/google-team.png",
    cover_url: "/imgs/tools/gemini-cli-assistant.png",
    created_at: new Date("2024-12-10"),
    featured: true,
    tags: ["cli", "assistant", "autocomplete", "official"],
    difficulty: "beginner",
    rating: 5,
    view_count: 2840,
    github_url: "https://github.com/google/gemini-cli-assistant",
    source_url: "https://github.com/google/gemini-cli-assistant"
  }
];

interface ToolsContentProps {
  locale: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ToolsContent({ locale, searchParams }: ToolsContentProps) {
  const t = useTranslations();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{t("tools.title")}</h1>
        <p className="text-muted-foreground text-lg">{t("tools.description")}</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockTools.map((tool) => (
          <Card key={tool.uuid} className="overflow-hidden">
            <div className="aspect-video relative">
              <img 
                src={tool.cover_url} 
                alt={tool.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-2">{tool.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{tool.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{tool.author_name}</span>
                <Button variant="outline" size="sm" asChild>
                  <Link href={tool.source_url} target="_blank">
                    View Tool
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

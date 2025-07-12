import { Suspense } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolDetailContent from "@/components/blocks/tool-detail";
import { getToolById } from "@/services/tools";

interface ToolDetailPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export async function generateMetadata({
  params,
}: ToolDetailPageProps): Promise<Metadata> {
  const { locale, id } = await params;
  
  try {
    const tool = await getToolById(id);
    
    if (!tool) {
      return {
        title: "Tool Not Found",
        description: "The requested tool could not be found."
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || 'https://geminicli.org';
    
    const title = locale === 'zh' 
      ? `${tool.name} - 工具评测 | Gemini CLI Hub`
      : `${tool.name} - Tool Review | Gemini CLI Hub`;
      
    const description = locale === 'zh'
      ? `深度评测 ${tool.name}：${tool.description}。了解功能特性、使用体验、优缺点和用户评价。`
      : `In-depth review of ${tool.name}: ${tool.description}. Learn about features, user experience, pros and cons, and user ratings.`;

    return {
      title,
      description,
      keywords: [
        tool.name,
        tool.category,
        ...tool.tags,
        locale === 'zh' ? '工具评测' : 'tool review',
        locale === 'zh' ? '软件测试' : 'software testing',
        'Gemini CLI'
      ].join(', '),
      openGraph: {
        title,
        description,
        url: `${baseUrl}/${locale}/tools/${id}`,
        siteName: "Gemini CLI Hub",
        type: "article",
        images: tool.logo ? [
          {
            url: tool.logo,
            width: 1200,
            height: 630,
            alt: `${tool.name} logo`,
          }
        ] : undefined,
        locale: locale,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: tool.logo ? [tool.logo] : undefined,
        creator: "@GeminiCLIHub",
      },
      alternates: {
        canonical: `${baseUrl}/${locale}/tools/${id}`,
        languages: {
          'en': `${baseUrl}/en/tools/${id}`,
          'zh': `${baseUrl}/zh/tools/${id}`,
        },
      },
      other: {
        'article:author': 'Gemini CLI Hub',
        'article:section': tool.category,
        'article:tag': tool.tags.join(', '),
      },
    };
  } catch (error) {
    return {
      title: "Error Loading Tool",
      description: "An error occurred while loading the tool information."
    };
  }
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { locale, id } = await params;
  
  try {
    const tool = await getToolById(id);
    
    if (!tool) {
      notFound();
    }

    return (
      <div className="min-h-screen">
        <Suspense fallback={<div>Loading...</div>}>
          <ToolDetailContent tool={tool} locale={locale} />
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error("Error loading tool:", error);
    notFound();
  }
}
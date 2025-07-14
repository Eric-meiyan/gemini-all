import Pricing from "@/components/blocks/pricing";
import { getPricingPage } from "@/services/page";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  
  const title = locale === "zh" 
    ? "Gemini CLI 定价指南 - 完整成本分析 2025"
    : "Gemini CLI Pricing Guide - Complete Cost Analysis 2025";
    
  const description = locale === "zh"
    ? "完整的 Gemini CLI 定价指南，包含 Google Gemini API 成本、使用计算器和成本优化技巧。2025年最新定价。"
    : "Complete Gemini CLI pricing guide with Google Gemini API costs, usage calculator, and cost optimization tips. Updated for 2025 with latest pricing.";

  const keywords = locale === "zh" 
    ? "gemini cli 定价, gemini api 价格, gemini 成本, google gemini 定价, gemini cli 价格, 2025"
    : "gemini cli pricing, gemini api price, gemini cost, google gemini pricing, gemini cli price, 2025";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === "zh" ? "zh_CN" : "en_US",
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `/pricing`,
      languages: {
        'en': '/en/pricing',
        'zh': '/zh/pricing',
      },
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const page = await getPricingPage(locale);

  return <>{page.pricing && <Pricing pricing={page.pricing} />}</>;
}

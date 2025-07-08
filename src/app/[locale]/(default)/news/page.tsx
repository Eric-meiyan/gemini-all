import { redirect } from "next/navigation";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // 重定向到首页，因为新闻内容现在在首页显示
  if (locale === 'en') {
    redirect('/');
  } else {
    redirect(`/${locale}`);
  }
} 
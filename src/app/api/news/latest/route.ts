import { NextRequest, NextResponse } from 'next/server';
import { getGeminiNews, getOfficialGeminiNews } from '@/services/newsapi';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    let news;
    
    if (category === 'official') {
      news = await getOfficialGeminiNews();
    } else {
      news = await getGeminiNews();
    }
    
    // Apply limit
    const limitedNews = news.slice(0, limit);
    
    return NextResponse.json({
      status: 'success',
      data: limitedNews,
      total: news.length
    });
    
  } catch (error) {
    console.error('Error in /api/news/latest:', error);
    
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch news',
        data: []
      },
      { status: 500 }
    );
  }
}

// Enable CORS for this route
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 
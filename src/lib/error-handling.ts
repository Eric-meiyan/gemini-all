'use client';

// 错误处理工具类
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// 错误处理 Hook
import { useState, useCallback } from 'react';

interface ErrorState {
  error: Error | null;
  isLoading: boolean;
}

export function useErrorHandler() {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isLoading: false
  });

  const handleError = useCallback((error: unknown) => {
    console.error('Error caught by useErrorHandler:', error);
    
    let errorInstance: Error;
    
    if (error instanceof Error) {
      errorInstance = error;
    } else if (typeof error === 'string') {
      errorInstance = new Error(error);
    } else {
      errorInstance = new Error('Unknown error occurred');
    }
    
    setErrorState({ error: errorInstance, isLoading: false });
  }, []);

  const clearError = useCallback(() => {
    setErrorState({ error: null, isLoading: false });
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setErrorState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const executeAsync = useCallback(async <T>(
    asyncFunction: () => Promise<T>
  ): Promise<T | null> => {
    try {
      setLoading(true);
      clearError();
      const result = await asyncFunction();
      setLoading(false);
      return result;
    } catch (error) {
      handleError(error);
      return null;
    }
  }, [handleError, clearError, setLoading]);

  return {
    error: errorState.error,
    isLoading: errorState.isLoading,
    handleError,
    clearError,
    setLoading,
    executeAsync
  };
}

// 全局错误处理函数
export function setupGlobalErrorHandling() {
  // 处理未捕获的 Promise 错误
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault();
  });

  // 处理其他未捕获的错误
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
  });
}

// API 错误处理装饰器
export function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
  fn: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      console.error(`Error in ${fn.name}:`, error);
      
      if (error instanceof Error) {
        throw new AppError(
          error.message,
          'API_ERROR',
          500,
          { originalError: error, functionName: fn.name }
        );
      }
      
      throw new AppError(
        'Unknown API error occurred',
        'UNKNOWN_API_ERROR',
        500,
        { originalError: error, functionName: fn.name }
      );
    }
  }) as T;
}

// 安全的 JSON 解析
export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.warn('Failed to parse JSON:', error);
    return fallback;
  }
}

// 安全的本地存储操作
export const safeLocalStorage = {
  getItem: (key: string, fallback: string = ''): string => {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch (error) {
      console.warn('LocalStorage getItem failed:', error);
      return fallback;
    }
  },
  
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('LocalStorage setItem failed:', error);
      return false;
    }
  },
  
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('LocalStorage removeItem failed:', error);
      return false;
    }
  }
};
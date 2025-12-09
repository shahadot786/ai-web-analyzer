import { useState, useEffect } from 'react';
import type { ScrapeResult } from '../services/api';

interface HistoryItem {
  id: string;
  url: string;
  title: string;
  timestamp: Date;
  seoScore: number;
  qualityScore?: number;
}

const STORAGE_KEY = 'ai-web-analyzer-history';
const MAX_HISTORY = 100;

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (error) {
        console.error('Error loading history:', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  }, [history]);

  const addToHistory = (result: ScrapeResult) => {
    const newItem: HistoryItem = {
      id: result.id,
      url: result.data.url,
      title: result.data.title,
      timestamp: new Date(),
      seoScore: result.analytics.seoScore,
      qualityScore: result.aiAnalysis.contentQualityScore
    };

    setHistory(prev => {
      // Remove duplicate if exists
      const filtered = prev.filter(item => item.url !== newItem.url);
      // Add new item at the beginning
      const updated = [newItem, ...filtered];
      // Keep only MAX_HISTORY items
      return updated.slice(0, MAX_HISTORY);
    });
  };

  const removeFromHistory = (id: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      // Update localStorage immediately
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const searchHistory = (query: string): HistoryItem[] => {
    if (!query.trim()) {
      return history;
    }

    const lowerQuery = query.toLowerCase();
    return history.filter(item =>
      item.url.toLowerCase().includes(lowerQuery) ||
      item.title.toLowerCase().includes(lowerQuery)
    );
  };

  const getHistoryItem = (id: string): HistoryItem | undefined => {
    return history.find(item => item.id === id);
  };

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    searchHistory,
    getHistoryItem
  };
}

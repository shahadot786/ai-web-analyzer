import { useState, useEffect } from 'react';

const STORAGE_KEY = 'ai-web-analyzer-bookmarks';

export interface Bookmark {
  id: string;
  url: string;
  title: string;
  addedAt: Date;
  tags?: string[];
  notes?: string;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Load bookmarks from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBookmarks(parsed.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        })));
      } catch (error) {
        console.error('Error loading bookmarks:', error);
      }
    }
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    if (bookmarks.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    }
  }, [bookmarks]);

  const addBookmark = (bookmark: Omit<Bookmark, 'addedAt'>) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      addedAt: new Date()
    };

    setBookmarks(prev => {
      // Check if already bookmarked
      if (prev.some(b => b.id === bookmark.id)) {
        return prev;
      }
      return [newBookmark, ...prev];
    });
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
  };

  const isBookmarked = (id: string): boolean => {
    return bookmarks.some(b => b.id === id);
  };

  const updateBookmark = (id: string, updates: Partial<Bookmark>) => {
    setBookmarks(prev =>
      prev.map(b => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const clearBookmarks = () => {
    setBookmarks([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    updateBookmark,
    clearBookmarks
  };
}

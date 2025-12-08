import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ScrapeRequest {
  url: string;
  options?: {
    waitForSelector?: string;
    timeout?: number;
    includeAIAnalysis?: boolean;
  };
}

export interface ScrapedData {
  url: string;
  title: string;
  headings: {
    h1: string[];
    h2: string[];
    h3: string[];
    h4: string[];
    h5: string[];
    h6: string[];
  };
  paragraphs: {
    text: string;
    summary?: string;
  }[];
  links: {
    text: string;
    href: string;
    isInternal: boolean;
    isExternal: boolean;
  }[];
  images: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }[];
  metadata: {
    description?: string;
    keywords?: string;
    author?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
  };
  scrapedAt: Date;
}

export interface AIAnalysis {
  contentSummary: string;
  keyTopics: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  readabilityScore?: number;
  seoInsights: {
    titleQuality: string;
    metaDescriptionQuality: string;
    headingStructure: string;
    keywordDensity: string;
    recommendations: string[];
  };
  contentCategories: string[];
}

export interface AnalyticsData {
  totalWords: number;
  readingTime: number;
  linkAnalysis: {
    totalLinks: number;
    internalLinks: number;
    externalLinks: number;
    brokenLinks: number;
  };
  imageAnalysis: {
    totalImages: number;
    imagesWithAlt: number;
    imagesWithoutAlt: number;
    altTextCoverage: number;
  };
  headingAnalysis: {
    totalHeadings: number;
    h1Count: number;
    h2Count: number;
    h3Count: number;
    h4Count: number;
    h5Count: number;
    h6Count: number;
    hasProperHierarchy: boolean;
  };
  seoScore: number;
}

export interface ScrapeResult {
  id: string;
  data: ScrapedData;
  aiAnalysis: AIAnalysis;
  analytics: AnalyticsData;
}

export const scrapeWebsite = async (request: ScrapeRequest): Promise<ScrapeResult> => {
  const response = await apiClient.post('/scrape', request);
  return response.data.data;
};

export const getScrapeResult = async (id: string): Promise<ScrapeResult> => {
  const response = await apiClient.get(`/scrape/${id}`);
  return response.data.data;
};

export const getScrapeHistory = async (): Promise<{ id: string; url: string; timestamp: Date }[]> => {
  const response = await apiClient.get('/history');
  return response.data.data;
};

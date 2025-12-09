// TypeScript interfaces and types for the application

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
    importance?: number;
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
  sentimentConfidence?: number;
  readabilityScore?: number;
  seoInsights: {
    titleQuality: string;
    metaDescriptionQuality: string;
    headingStructure: string;
    keywordDensity: string;
    recommendations: string[];
  };
  contentCategories: string[];
  entities?: {
    people: string[];
    organizations: string[];
    locations: string[];
    technologies: string[];
  };
  keywords?: {
    keyword: string;
    relevance: number;
  }[];
  contentQualityScore?: number;
  contentQualityInsights?: string[];
  competitiveInsights?: string[];
}

export interface AnalyticsData {
  totalWords: number;
  readingTime: number; // in minutes
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
    altTextCoverage: number; // percentage
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
  seoScore: number; // 0-100
}

export interface ScrapeResult {
  id: string;
  data: ScrapedData;
  aiAnalysis: AIAnalysis;
  analytics: AnalyticsData;
  error?: string;
}

export interface ScrapeRequest {
  url: string;
  options?: {
    waitForSelector?: string;
    timeout?: number;
    includeAIAnalysis?: boolean;
  };
}

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

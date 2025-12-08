import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ScrapedData, AIAnalysis } from '../types/index.js';
import { AppError } from '../types/index.js';

class AIService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: any = null;

  private initialize(): void {
    if (this.genAI) return; // Already initialized

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });
  }

  async analyzeContent(scrapedData: ScrapedData): Promise<AIAnalysis> {
    this.initialize(); // Ensure AI service is initialized
    
    try {
      // Prepare content for analysis
      const contentText = this.prepareContentText(scrapedData);

      // Generate content summary
      const contentSummary = await this.generateSummary(contentText);

      // Extract key topics
      const keyTopics = await this.extractKeyTopics(contentText);

      // Analyze sentiment
      const sentiment = await this.analyzeSentiment(contentText);

      // Generate SEO insights
      const seoInsights = await this.generateSEOInsights(scrapedData);

      // Categorize content
      const contentCategories = await this.categorizeContent(contentText);

      // Calculate readability score (simple approximation)
      const readabilityScore = this.calculateReadabilityScore(contentText);

      return {
        contentSummary,
        keyTopics,
        sentiment,
        readabilityScore,
        seoInsights,
        contentCategories
      };

    } catch (error: any) {
      console.error('AI Analysis Error:', error);
      throw new AppError(500, `AI analysis failed: ${error.message}`);
    }
  }

  private prepareContentText(scrapedData: ScrapedData): string {
    const parts: string[] = [];

    if (scrapedData.title) {
      parts.push(`Title: ${scrapedData.title}`);
    }

    // Add all headings
    Object.entries(scrapedData.headings).forEach(([level, headings]) => {
      if (headings.length > 0) {
        parts.push(`${level.toUpperCase()}: ${headings.join(', ')}`);
      }
    });

    // Add paragraphs (limit to first 10 for performance)
    const paragraphTexts = scrapedData.paragraphs
      .slice(0, 10)
      .map(p => p.text)
      .join(' ');
    
    if (paragraphTexts) {
      parts.push(`Content: ${paragraphTexts}`);
    }

    return parts.join('\n\n');
  }

  async generateSummary(content: string): Promise<string> {
    const prompt = `Analyze the following web page content and provide a concise 2-3 sentence summary of what this page is about:\n\n${content.slice(0, 3000)}`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  }

  async extractKeyTopics(content: string): Promise<string[]> {
    const prompt = `Extract 5-7 key topics or themes from the following content. Return only the topics as a comma-separated list:\n\n${content.slice(0, 3000)}`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const topics = response.text()
      .split(',')
      .map((topic: string) => topic.trim())
      .filter((topic: string) => topic.length > 0)
      .slice(0, 7);

    return topics;
  }

  async analyzeSentiment(content: string): Promise<'positive' | 'negative' | 'neutral'> {
    const prompt = `Analyze the overall sentiment of the following content. Respond with only one word: "positive", "negative", or "neutral":\n\n${content.slice(0, 2000)}`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const sentiment = response.text().toLowerCase().trim();

    if (sentiment.includes('positive')) return 'positive';
    if (sentiment.includes('negative')) return 'negative';
    return 'neutral';
  }

  async generateSEOInsights(scrapedData: ScrapedData): Promise<AIAnalysis['seoInsights']> {
    const { title, metadata, headings, paragraphs } = scrapedData;

    // Analyze title quality
    let titleQuality = 'Good';
    if (!title || title.length < 30) {
      titleQuality = 'Too short - should be 30-60 characters';
    } else if (title.length > 60) {
      titleQuality = 'Too long - should be 30-60 characters';
    }

    // Analyze meta description
    let metaDescriptionQuality = 'Good';
    if (!metadata.description) {
      metaDescriptionQuality = 'Missing - add a meta description';
    } else if (metadata.description.length < 120) {
      metaDescriptionQuality = 'Too short - should be 120-160 characters';
    } else if (metadata.description.length > 160) {
      metaDescriptionQuality = 'Too long - should be 120-160 characters';
    }

    // Analyze heading structure
    let headingStructure = 'Good';
    if (headings.h1.length === 0) {
      headingStructure = 'Missing H1 tag - add one H1 per page';
    } else if (headings.h1.length > 1) {
      headingStructure = 'Multiple H1 tags - use only one H1 per page';
    }

    // Simple keyword density analysis
    const allText = paragraphs.map(p => p.text).join(' ').toLowerCase();
    const words = allText.split(/\s+/);
    const wordCount = words.length;
    const keywordDensity = wordCount > 0 
      ? `Approximately ${wordCount} words analyzed` 
      : 'No content to analyze';

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (title.length < 30 || title.length > 60) {
      recommendations.push('Optimize title length to 30-60 characters');
    }
    if (!metadata.description) {
      recommendations.push('Add a meta description (120-160 characters)');
    }
    if (headings.h1.length !== 1) {
      recommendations.push('Use exactly one H1 tag per page');
    }
    if (headings.h2.length === 0) {
      recommendations.push('Add H2 headings to structure your content');
    }
    if (!metadata.ogTitle || !metadata.ogDescription) {
      recommendations.push('Add Open Graph meta tags for social sharing');
    }
    if (paragraphs.length < 3) {
      recommendations.push('Add more content - aim for at least 300 words');
    }

    return {
      titleQuality,
      metaDescriptionQuality,
      headingStructure,
      keywordDensity,
      recommendations
    };
  }

  async categorizeContent(content: string): Promise<string[]> {
    const prompt = `Categorize the following content into 2-4 categories from this list: Technology, Business, Education, Entertainment, Health, Science, Sports, Politics, Lifestyle, News, Blog, E-commerce, Documentation, Portfolio. Return only the categories as a comma-separated list:\n\n${content.slice(0, 2000)}`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const categories = response.text()
      .split(',')
      .map((cat: string) => cat.trim())
      .filter((cat: string) => cat.length > 0)
      .slice(0, 4);

    return categories;
  }

  private calculateReadabilityScore(content: string): number {
    // Simple readability score based on average sentence and word length
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/).filter(w => w.length > 0);
    
    if (sentences.length === 0 || words.length === 0) return 50;

    const avgWordsPerSentence = words.length / sentences.length;
    const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / words.length;

    // Score from 0-100 (higher is easier to read)
    // Ideal: 15-20 words per sentence, 4-5 characters per word
    let score = 100;
    
    if (avgWordsPerSentence > 25) score -= 20;
    else if (avgWordsPerSentence > 20) score -= 10;
    
    if (avgWordLength > 6) score -= 20;
    else if (avgWordLength > 5) score -= 10;

    return Math.max(0, Math.min(100, score));
  }

  async summarizeParagraphs(paragraphs: { text: string }[]): Promise<{ text: string; summary: string }[]> {
    this.initialize(); // Ensure AI service is initialized
    
    const summarizedParagraphs = await Promise.all(
      paragraphs.slice(0, 5).map(async (para) => {
        if (para.text.length < 100) {
          return { ...para, summary: para.text };
        }

        try {
          const prompt = `Summarize the following paragraph in one concise sentence:\n\n${para.text.slice(0, 500)}`;
          const result = await this.model.generateContent(prompt);
          const response = await result.response;
          const summary = response.text().trim();

          return { ...para, summary };
        } catch (error) {
          return { ...para, summary: para.text.slice(0, 100) + '...' };
        }
      })
    );

    // For remaining paragraphs, just truncate
    const remainingParagraphs = paragraphs.slice(5).map(para => ({
      ...para,
      summary: para.text.slice(0, 100) + (para.text.length > 100 ? '...' : '')
    }));

    return [...summarizedParagraphs, ...remainingParagraphs];
  }
}

export const aiService = new AIService();

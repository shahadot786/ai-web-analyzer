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

      // Run all analyses in parallel for better performance
      const [
        contentSummary,
        keyTopics,
        sentiment,
        seoInsights,
        contentCategories,
        entities,
        keywords,
        contentQuality,
        competitiveInsights
      ] = await Promise.all([
        this.generateSummary(contentText),
        this.extractKeyTopics(contentText),
        this.analyzeSentiment(contentText),
        this.generateSEOInsights(scrapedData),
        this.categorizeContent(contentText),
        this.extractEntities(contentText),
        this.extractKeywords(contentText),
        this.assessContentQuality(scrapedData, contentText),
        this.generateCompetitiveInsights(scrapedData, contentText)
      ]);

      // Calculate readability score (simple approximation)
      const readabilityScore = this.calculateReadabilityScore(contentText);

      return {
        contentSummary,
        keyTopics,
        sentiment: sentiment.sentiment,
        sentimentConfidence: sentiment.confidence,
        readabilityScore,
        seoInsights,
        contentCategories,
        entities,
        keywords,
        contentQualityScore: contentQuality.score,
        contentQualityInsights: contentQuality.insights,
        competitiveInsights
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

    // Add paragraphs (limit to first 15 for better analysis)
    const paragraphTexts = scrapedData.paragraphs
      .slice(0, 15)
      .map(p => p.text)
      .join(' ');
    
    if (paragraphTexts) {
      parts.push(`Content: ${paragraphTexts}`);
    }

    return parts.join('\n\n');
  }

  async generateSummary(content: string): Promise<string> {
    const prompt = `Analyze the following web page content and provide a comprehensive 3-4 sentence summary that captures the main purpose, key messages, and value proposition of this page:\n\n${content.slice(0, 4000)}`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  }

  async extractKeyTopics(content: string): Promise<string[]> {
    const prompt = `Extract 5-8 key topics or themes from the following content. Focus on the most important and relevant topics. Return only the topics as a comma-separated list:\n\n${content.slice(0, 4000)}`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const topics = response.text()
      .split(',')
      .map((topic: string) => topic.trim())
      .filter((topic: string) => topic.length > 0)
      .slice(0, 8);

    return topics;
  }

  async analyzeSentiment(content: string): Promise<{ sentiment: 'positive' | 'negative' | 'neutral', confidence: number }> {
    const prompt = `Analyze the overall sentiment of the following content. Respond in this exact format: "sentiment: [positive/negative/neutral], confidence: [0-100]"\n\n${content.slice(0, 3000)}`;

    const result = await this.model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().toLowerCase().trim();

    let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
    let confidence = 70;

    if (text.includes('positive')) sentiment = 'positive';
    else if (text.includes('negative')) sentiment = 'negative';

    const confidenceMatch = text.match(/confidence:\s*(\d+)/);
    if (confidenceMatch) {
      confidence = Math.min(100, Math.max(0, parseInt(confidenceMatch[1])));
    }

    return { sentiment, confidence };
  }

  async extractEntities(content: string): Promise<{ people: string[], organizations: string[], locations: string[], technologies: string[] }> {
    const prompt = `Extract named entities from the following content. Return in this exact format:
People: [comma-separated list]
Organizations: [comma-separated list]
Locations: [comma-separated list]
Technologies: [comma-separated list]

If a category has no entities, write "none".

Content:\n${content.slice(0, 4000)}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const parseEntities = (line: string): string[] => {
        const match = line.match(/:\s*(.+)/);
        if (!match || match[1].toLowerCase().includes('none')) return [];
        return match[1].split(',').map(e => e.trim()).filter(e => e.length > 0).slice(0, 5);
      };

      const lines = text.split('\n');
      const people = parseEntities(lines.find((l: string) => l.toLowerCase().startsWith('people')) || '');
      const organizations = parseEntities(lines.find((l: string) => l.toLowerCase().startsWith('organization')) || '');
      const locations = parseEntities(lines.find((l: string) => l.toLowerCase().startsWith('location')) || '');
      const technologies = parseEntities(lines.find((l: string) => l.toLowerCase().startsWith('technolog')) || '');

      return { people, organizations, locations, technologies };
    } catch (error) {
      return { people: [], organizations: [], locations: [], technologies: [] };
    }
  }

  async extractKeywords(content: string): Promise<{ keyword: string, relevance: number }[]> {
    const prompt = `Extract 8-10 important keywords from the following content with their relevance scores (0-100). Return in this format:
keyword1: 95
keyword2: 87
etc.

Content:\n${content.slice(0, 4000)}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const keywords = text.split('\n')
        .map((line: string) => {
          const match = line.match(/(.+?):\s*(\d+)/);
          if (!match) return null;
          return {
            keyword: match[1].trim(),
            relevance: Math.min(100, Math.max(0, parseInt(match[2])))
          };
        })
        .filter((k: any): k is { keyword: string, relevance: number } => k !== null)
        .slice(0, 10);

      return keywords;
    } catch (error) {
      return [];
    }
  }

  async assessContentQuality(scrapedData: ScrapedData, content: string): Promise<{ score: number, insights: string[] }> {
    const insights: string[] = [];
    let score = 100;

    // Check content length
    const wordCount = content.split(/\s+/).length;
    if (wordCount < 300) {
      score -= 20;
      insights.push('Content is too short - aim for at least 300 words for better engagement');
    } else if (wordCount > 2000) {
      insights.push('Comprehensive content length - excellent for SEO');
    }

    // Check heading structure
    const totalHeadings = Object.values(scrapedData.headings).flat().length;
    if (totalHeadings < 3) {
      score -= 15;
      insights.push('Add more headings to improve content structure and scannability');
    }

    // Check paragraph count
    if (scrapedData.paragraphs.length < 3) {
      score -= 15;
      insights.push('Add more paragraphs to provide comprehensive information');
    }

    // Check images
    if (scrapedData.images.length === 0) {
      score -= 10;
      insights.push('Add images to make content more engaging and visually appealing');
    }

    // Check links
    if (scrapedData.links.length < 3) {
      score -= 10;
      insights.push('Add more internal and external links for better navigation and credibility');
    }

    // Positive insights
    if (scrapedData.metadata.description) {
      insights.push('Meta description present - good for SEO');
    }
    if (scrapedData.headings.h1.length === 1) {
      insights.push('Proper H1 structure - excellent for SEO');
    }

    return { score: Math.max(0, score), insights };
  }

  async generateCompetitiveInsights(_scrapedData: ScrapedData, content: string): Promise<string[]> {
    const prompt = `Based on the following web page content, provide 3-4 competitive insights or recommendations for improvement. Focus on content strategy, user experience, and market positioning:\n\n${content.slice(0, 3000)}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const insights = text.split('\n')
        .map((line: string) => line.replace(/^[-*•]\s*/, '').trim())
        .filter((line: string) => line.length > 10)
        .slice(0, 4);

      return insights;
    } catch (error) {
      return [];
    }
  }

  async generateSEOInsights(scrapedData: ScrapedData): Promise<AIAnalysis['seoInsights']> {
    const { title, metadata, headings, paragraphs } = scrapedData;

    // Analyze title quality
    let titleQuality = 'Excellent - optimal length and structure';
    if (!title || title.length < 30) {
      titleQuality = 'Too short - should be 30-60 characters for better SEO';
    } else if (title.length > 60) {
      titleQuality = 'Too long - should be 30-60 characters to avoid truncation';
    }

    // Analyze meta description
    let metaDescriptionQuality = 'Excellent - well optimized';
    if (!metadata.description) {
      metaDescriptionQuality = 'Missing - add a compelling meta description (120-160 characters)';
    } else if (metadata.description.length < 120) {
      metaDescriptionQuality = 'Too short - expand to 120-160 characters for better visibility';
    } else if (metadata.description.length > 160) {
      metaDescriptionQuality = 'Too long - reduce to 120-160 characters to avoid truncation';
    }

    // Analyze heading structure
    let headingStructure = 'Excellent - proper hierarchy';
    if (headings.h1.length === 0) {
      headingStructure = 'Critical: Missing H1 tag - add exactly one H1 per page';
    } else if (headings.h1.length > 1) {
      headingStructure = 'Warning: Multiple H1 tags detected - use only one H1 per page';
    } else if (headings.h2.length === 0) {
      headingStructure = 'Good H1, but add H2 headings for better content structure';
    }

    // Simple keyword density analysis
    const allText = paragraphs.map(p => p.text).join(' ').toLowerCase();
    const words = allText.split(/\s+/);
    const wordCount = words.length;
    const keywordDensity = wordCount > 0 
      ? `${wordCount} words analyzed - ${wordCount > 300 ? 'good' : 'needs more'} content depth` 
      : 'No content to analyze';

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (title.length < 30 || title.length > 60) {
      recommendations.push('Optimize title length to 30-60 characters for better search visibility');
    }
    if (!metadata.description) {
      recommendations.push('Add a compelling meta description (120-160 characters) to improve click-through rates');
    }
    if (headings.h1.length !== 1) {
      recommendations.push('Use exactly one H1 tag per page for optimal SEO structure');
    }
    if (headings.h2.length === 0) {
      recommendations.push('Add H2 headings to create clear content hierarchy and improve readability');
    }
    if (!metadata.ogTitle || !metadata.ogDescription) {
      recommendations.push('Add Open Graph meta tags (og:title, og:description) for better social media sharing');
    }
    if (paragraphs.length < 3 || wordCount < 300) {
      recommendations.push('Expand content to at least 300 words for better SEO performance');
    }
    if (scrapedData.images.length > 0) {
      const imagesWithoutAlt = scrapedData.images.filter(img => !img.alt).length;
      if (imagesWithoutAlt > 0) {
        recommendations.push(`Add alt text to ${imagesWithoutAlt} image(s) for accessibility and SEO`);
      }
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
    const prompt = `Categorize the following content into 2-4 most relevant categories from this list: Technology, Business, Education, Entertainment, Health, Science, Sports, Politics, Lifestyle, News, Blog, E-commerce, Documentation, Portfolio, Marketing, Finance, Travel, Food, Fashion. Return only the categories as a comma-separated list:\n\n${content.slice(0, 3000)}`;

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
    // Enhanced readability score based on Flesch-Kincaid principles
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/).filter(w => w.length > 0);
    
    if (sentences.length === 0 || words.length === 0) return 50;

    const avgWordsPerSentence = words.length / sentences.length;

    // Count syllables (approximation)
    const syllables = words.reduce((sum, word) => {
      return sum + Math.max(1, word.toLowerCase().match(/[aeiouy]+/g)?.length || 1);
    }, 0);
    const avgSyllablesPerWord = syllables / words.length;

    // Flesch Reading Ease formula (modified)
    let score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
    
    // Normalize to 0-100 scale
    score = Math.max(0, Math.min(100, score));

    return Math.round(score);
  }

  async summarizeParagraphs(paragraphs: { text: string }[]): Promise<{ text: string; summary: string; importance?: number }[]> {
    this.initialize(); // Ensure AI service is initialized
    
    // Summarize first 8 paragraphs with importance scoring
    const summarizedParagraphs = await Promise.all(
      paragraphs.slice(0, 8).map(async (para, index) => {
        if (para.text.length < 100) {
          return { ...para, summary: para.text, importance: 50 };
        }

        try {
          const prompt = `Summarize the following paragraph in one concise, informative sentence. Also rate its importance (0-100):\n\n${para.text.slice(0, 600)}`;
          const result = await this.model.generateContent(prompt);
          const response = await result.response;
          const text = response.text().trim();
          
          // Extract importance score if present
          const importanceMatch = text.match(/importance:\s*(\d+)/i);
          const importance = importanceMatch ? parseInt(importanceMatch[1]) : (index === 0 ? 90 : 70);
          
          // Remove importance notation from summary
          const summary = text.replace(/importance:\s*\d+/i, '').trim();

          return { ...para, summary, importance };
        } catch (error) {
          return { ...para, summary: para.text.slice(0, 150) + '...', importance: 50 };
        }
      })
    );

    // For remaining paragraphs, just truncate
    const remainingParagraphs = paragraphs.slice(8).map((para, index) => ({
      ...para,
      summary: para.text.slice(0, 150) + (para.text.length > 150 ? '...' : ''),
      importance: Math.max(10, 50 - index * 5)
    }));

    return [...summarizedParagraphs, ...remainingParagraphs];
  }
}

export const aiService = new AIService();

import type { ScrapedData, AnalyticsData } from '../types/index.js';

class AnalyticsService {
  generateAnalytics(scrapedData: ScrapedData): AnalyticsData {
    const linkAnalysis = this.analyzeLinkData(scrapedData.links);
    const imageAnalysis = this.analyzeImages(scrapedData.images);
    const headingAnalysis = this.analyzeHeadings(scrapedData.headings);
    const { totalWords, readingTime } = this.analyzeContent(scrapedData.paragraphs);
    const seoScore = this.calculateSEOScore(scrapedData, headingAnalysis, imageAnalysis);

    return {
      totalWords,
      readingTime,
      linkAnalysis,
      imageAnalysis,
      headingAnalysis,
      seoScore
    };
  }

  private analyzeLinkData(links: ScrapedData['links']): AnalyticsData['linkAnalysis'] {
    const totalLinks = links.length;
    const internalLinks = links.filter(link => link.isInternal).length;
    const externalLinks = links.filter(link => link.isExternal).length;
    
    // Simple broken link detection (links with empty text or suspicious patterns)
    const brokenLinks = links.filter(link => 
      !link.text || 
      link.href.includes('undefined') || 
      link.href.includes('null') ||
      link.href === '#'
    ).length;

    return {
      totalLinks,
      internalLinks,
      externalLinks,
      brokenLinks
    };
  }

  private analyzeImages(images: ScrapedData['images']): AnalyticsData['imageAnalysis'] {
    const totalImages = images.length;
    const imagesWithAlt = images.filter(img => img.alt && img.alt.trim().length > 0).length;
    const imagesWithoutAlt = totalImages - imagesWithAlt;
    const altTextCoverage = totalImages > 0 
      ? Math.round((imagesWithAlt / totalImages) * 100) 
      : 0;

    return {
      totalImages,
      imagesWithAlt,
      imagesWithoutAlt,
      altTextCoverage
    };
  }

  private analyzeHeadings(headings: ScrapedData['headings']): AnalyticsData['headingAnalysis'] {
    const h1Count = headings.h1.length;
    const h2Count = headings.h2.length;
    const h3Count = headings.h3.length;
    const h4Count = headings.h4.length;
    const h5Count = headings.h5.length;
    const h6Count = headings.h6.length;

    const totalHeadings = h1Count + h2Count + h3Count + h4Count + h5Count + h6Count;

    // Check for proper heading hierarchy (should have exactly one H1, and H2s before H3s, etc.)
    const hasProperHierarchy = h1Count === 1 && (h2Count > 0 || totalHeadings === 1);

    return {
      totalHeadings,
      h1Count,
      h2Count,
      h3Count,
      h4Count,
      h5Count,
      h6Count,
      hasProperHierarchy
    };
  }

  private analyzeContent(paragraphs: ScrapedData['paragraphs']): { totalWords: number; readingTime: number } {
    const allText = paragraphs.map(p => p.text).join(' ');
    const words = allText.split(/\s+/).filter(word => word.length > 0);
    const totalWords = words.length;

    // Average reading speed: 200-250 words per minute
    const readingTime = Math.ceil(totalWords / 225);

    return { totalWords, readingTime };
  }

  private calculateSEOScore(
    scrapedData: ScrapedData,
    headingAnalysis: AnalyticsData['headingAnalysis'],
    imageAnalysis: AnalyticsData['imageAnalysis']
  ): number {
    let score = 0;

    // Title (20 points)
    if (scrapedData.title) {
      score += 10;
      if (scrapedData.title.length >= 30 && scrapedData.title.length <= 60) {
        score += 10;
      } else if (scrapedData.title.length > 0) {
        score += 5;
      }
    }

    // Meta description (20 points)
    if (scrapedData.metadata.description) {
      score += 10;
      if (scrapedData.metadata.description.length >= 120 && scrapedData.metadata.description.length <= 160) {
        score += 10;
      } else {
        score += 5;
      }
    }

    // Heading structure (20 points)
    if (headingAnalysis.hasProperHierarchy) {
      score += 15;
    } else if (headingAnalysis.h1Count === 1) {
      score += 10;
    } else if (headingAnalysis.h1Count > 0) {
      score += 5;
    }

    if (headingAnalysis.h2Count > 0) {
      score += 5;
    }

    // Image optimization (15 points)
    if (imageAnalysis.totalImages > 0) {
      score += 5;
      if (imageAnalysis.altTextCoverage >= 80) {
        score += 10;
      } else if (imageAnalysis.altTextCoverage >= 50) {
        score += 5;
      }
    } else {
      score += 5; // No images is okay
    }

    // Content length (15 points)
    const totalWords = scrapedData.paragraphs.reduce((sum, p) => {
      return sum + p.text.split(/\s+/).length;
    }, 0);

    if (totalWords >= 300) {
      score += 15;
    } else if (totalWords >= 150) {
      score += 10;
    } else if (totalWords >= 50) {
      score += 5;
    }

    // Open Graph tags (10 points)
    if (scrapedData.metadata.ogTitle && scrapedData.metadata.ogDescription) {
      score += 10;
    } else if (scrapedData.metadata.ogTitle || scrapedData.metadata.ogDescription) {
      score += 5;
    }

    return Math.min(100, score);
  }
}

export const analyticsService = new AnalyticsService();

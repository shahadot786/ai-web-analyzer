import type { ScrapedData, AnalyticsData } from '../types/index.js';

class AnalyticsService {
  generateAnalytics(data: ScrapedData): AnalyticsData {
    // Calculate total words from paragraphs
    const totalWords = data.paragraphs.reduce((sum, p) => {
      const words = p.text.trim().split(/\s+/).filter(word => word.length > 0);
      return sum + words.length;
    }, 0);

    // Calculate reading time (average 200 words per minute)
    const readingTime = Math.ceil(totalWords / 200);

    // Analyze links
    const linkAnalysis = this.analyzeLinkStructure(data.links);

    // Analyze images
    const imageAnalysis = this.analyzeImages(data.images);

    // Analyze headings
    const headingAnalysis = this.analyzeHeadings(data.headings);

    // Calculate SEO score
    const seoScore = this.calculateSEOScore(data, imageAnalysis, headingAnalysis);

    return {
      totalWords,
      readingTime,
      linkAnalysis,
      imageAnalysis,
      headingAnalysis,
      seoScore
    };
  }

  private analyzeLinkStructure(links: ScrapedData['links']): AnalyticsData['linkAnalysis'] {
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



  private calculateSEOScore(
    data: ScrapedData,
    imageAnalysis: AnalyticsData['imageAnalysis'],
    headingAnalysis: AnalyticsData['headingAnalysis']
  ): number {
    let score = 0;

    // Title (20 points)
    if (data.title) {
      score += 10;
      if (data.title.length >= 30 && data.title.length <= 60) {
        score += 10;
      } else if (data.title.length > 0) {
        score += 5;
      }
    }

    // Meta description (20 points)
    if (data.metadata.description) {
      score += 10;
      if (data.metadata.description.length >= 120 && data.metadata.description.length <= 160) {
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
    const totalWords = data.paragraphs.reduce((sum, p) => {
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
    if (data.metadata.ogTitle && data.metadata.ogDescription) {
      score += 10;
    } else if (data.metadata.ogTitle || data.metadata.ogDescription) {
      score += 5;
    }

    return Math.min(100, score);
  }
}

export const analyticsService = new AnalyticsService();

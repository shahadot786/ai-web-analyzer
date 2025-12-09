import puppeteer from 'puppeteer';
import type { ScrapeResult } from '../types/index.js';

class PDFService {
  async generatePDF(result: ScrapeResult): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      
      // Generate HTML content for PDF
      const htmlContent = this.generateHTMLContent(result);
      
      await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
      });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        }
      });

      return pdfBuffer;
    } finally {
      await browser.close();
    }
  }

  private generateHTMLContent(result: ScrapeResult): string {
    const { data, aiAnalysis, analytics } = result;

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AI Web Analyzer Report - ${data.title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #fff;
    }
    
    .container {
      max-width: 100%;
      padding: 20px;
    }
    
    .header {
      border-bottom: 3px solid #4F46E5;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    .header h1 {
      color: #4F46E5;
      font-size: 28px;
      margin-bottom: 10px;
    }
    
    .header .url {
      color: #666;
      font-size: 14px;
      word-break: break-all;
    }
    
    .scores {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      flex-wrap: wrap;
    }
    
    .score-card {
      flex: 1;
      min-width: 150px;
      padding: 15px;
      border-radius: 8px;
      background: #f8f9fa;
      border-left: 4px solid #4F46E5;
    }
    
    .score-card .label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    
    .score-card .value {
      font-size: 32px;
      font-weight: bold;
      color: #4F46E5;
    }
    
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    
    .section h2 {
      font-size: 20px;
      color: #1f2937;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .section h3 {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 10px;
      margin-top: 15px;
    }
    
    .section p {
      margin-bottom: 10px;
      color: #4b5563;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      margin-right: 8px;
      margin-bottom: 8px;
      background: #e0e7ff;
      color: #4F46E5;
    }
    
    .badge.success {
      background: #d1fae5;
      color: #065f46;
    }
    
    .badge.warning {
      background: #fef3c7;
      color: #92400e;
    }
    
    .badge.error {
      background: #fee2e2;
      color: #991b1b;
    }
    
    .list {
      list-style: none;
      padding-left: 0;
    }
    
    .list li {
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
      color: #4b5563;
    }
    
    .list li:last-child {
      border-bottom: none;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .card {
      padding: 12px;
      background: #f9fafb;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }
    
    .card .card-label {
      font-size: 11px;
      color: #6b7280;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    
    .card .card-value {
      font-size: 14px;
      color: #1f2937;
    }
    
    .keyword {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      margin-right: 8px;
      margin-bottom: 8px;
      font-size: 13px;
    }
    
    .keyword .relevance {
      background: #4F46E5;
      color: white;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    
    @media print {
      .page-break {
        page-break-before: always;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <h1>🌐 AI Web Analyzer Report</h1>
      <div class="url">${data.url}</div>
      <div style="margin-top: 10px; font-size: 14px; color: #666;">
        Generated on ${new Date().toLocaleString()}
      </div>
    </div>

    <!-- Scores -->
    <div class="scores">
      <div class="score-card">
        <div class="label">SEO Score</div>
        <div class="value">${analytics.seoScore}/100</div>
      </div>
      ${aiAnalysis.contentQualityScore !== undefined ? `
      <div class="score-card">
        <div class="label">Quality Score</div>
        <div class="value">${aiAnalysis.contentQualityScore}/100</div>
      </div>
      ` : ''}
      <div class="score-card">
        <div class="label">Total Words</div>
        <div class="value">${analytics.totalWords.toLocaleString()}</div>
      </div>
      <div class="score-card">
        <div class="label">Reading Time</div>
        <div class="value">${analytics.readingTime} min</div>
      </div>
    </div>

    <!-- AI Analysis -->
    <div class="section">
      <h2>🤖 AI Analysis</h2>
      
      <h3>Content Summary</h3>
      <p>${aiAnalysis.contentSummary}</p>

      ${aiAnalysis.keyTopics && aiAnalysis.keyTopics.length > 0 ? `
      <h3>Key Topics</h3>
      <div>
        ${aiAnalysis.keyTopics.map(topic => `<span class="badge">${topic}</span>`).join('')}
      </div>
      ` : ''}

      ${aiAnalysis.sentiment ? `
      <h3>Sentiment Analysis</h3>
      <p>
        <span class="badge ${aiAnalysis.sentiment === 'positive' ? 'success' : aiAnalysis.sentiment === 'negative' ? 'error' : ''}" style="text-transform: capitalize;">
          ${aiAnalysis.sentiment}
        </span>
        ${aiAnalysis.sentimentConfidence ? `(${aiAnalysis.sentimentConfidence}% confidence)` : ''}
      </p>
      ` : ''}

      ${aiAnalysis.readabilityScore !== undefined ? `
      <h3>Readability Score</h3>
      <p><span class="badge">${aiAnalysis.readabilityScore}/100</span></p>
      ` : ''}
    </div>

    <!-- Entities -->
    ${aiAnalysis.entities && (aiAnalysis.entities.people.length > 0 || aiAnalysis.entities.organizations.length > 0 || aiAnalysis.entities.locations.length > 0 || aiAnalysis.entities.technologies.length > 0) ? `
    <div class="section">
      <h2>👥 Entities Detected</h2>
      <div class="grid">
        ${aiAnalysis.entities.people.length > 0 ? `
        <div class="card">
          <div class="card-label">People</div>
          <div class="card-value">${aiAnalysis.entities.people.join(', ')}</div>
        </div>
        ` : ''}
        ${aiAnalysis.entities.organizations.length > 0 ? `
        <div class="card">
          <div class="card-label">Organizations</div>
          <div class="card-value">${aiAnalysis.entities.organizations.join(', ')}</div>
        </div>
        ` : ''}
        ${aiAnalysis.entities.locations.length > 0 ? `
        <div class="card">
          <div class="card-label">Locations</div>
          <div class="card-value">${aiAnalysis.entities.locations.join(', ')}</div>
        </div>
        ` : ''}
        ${aiAnalysis.entities.technologies.length > 0 ? `
        <div class="card">
          <div class="card-label">Technologies</div>
          <div class="card-value">${aiAnalysis.entities.technologies.join(', ')}</div>
        </div>
        ` : ''}
      </div>
    </div>
    ` : ''}

    <!-- Keywords -->
    ${aiAnalysis.keywords && aiAnalysis.keywords.length > 0 ? `
    <div class="section">
      <h2>🔑 Keywords</h2>
      <div>
        ${aiAnalysis.keywords.map(kw => `
          <span class="keyword">
            ${kw.keyword}
            <span class="relevance">${kw.relevance}%</span>
          </span>
        `).join('')}
      </div>
    </div>
    ` : ''}

    <!-- SEO Insights -->
    <div class="section page-break">
      <h2>📊 SEO Insights</h2>
      
      <div class="grid">
        <div class="card">
          <div class="card-label">Title Quality</div>
          <div class="card-value">${aiAnalysis.seoInsights.titleQuality}</div>
        </div>
        <div class="card">
          <div class="card-label">Meta Description</div>
          <div class="card-value">${aiAnalysis.seoInsights.metaDescriptionQuality}</div>
        </div>
        <div class="card">
          <div class="card-label">Heading Structure</div>
          <div class="card-value">${aiAnalysis.seoInsights.headingStructure}</div>
        </div>
        <div class="card">
          <div class="card-label">Content Analysis</div>
          <div class="card-value">${aiAnalysis.seoInsights.keywordDensity}</div>
        </div>
      </div>

      ${aiAnalysis.seoInsights.recommendations.length > 0 ? `
      <h3>Recommendations</h3>
      <ul class="list">
        ${aiAnalysis.seoInsights.recommendations.map(rec => `<li>• ${rec}</li>`).join('')}
      </ul>
      ` : ''}
    </div>

    <!-- Content Quality -->
    ${aiAnalysis.contentQualityInsights && aiAnalysis.contentQualityInsights.length > 0 ? `
    <div class="section">
      <h2>✨ Content Quality Insights</h2>
      <ul class="list">
        ${aiAnalysis.contentQualityInsights.map(insight => `<li>• ${insight}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <!-- Competitive Insights -->
    ${aiAnalysis.competitiveInsights && aiAnalysis.competitiveInsights.length > 0 ? `
    <div class="section">
      <h2>🏆 Competitive Insights</h2>
      <ul class="list">
        ${aiAnalysis.competitiveInsights.map(insight => `<li>• ${insight}</li>`).join('')}
      </ul>
    </div>
    ` : ''}

    <!-- Analytics -->
    <div class="section page-break">
      <h2>📈 Analytics</h2>
      
      <div class="grid">
        <div class="card">
          <div class="card-label">Total Links</div>
          <div class="card-value">${analytics.linkAnalysis.totalLinks} (${analytics.linkAnalysis.internalLinks} internal, ${analytics.linkAnalysis.externalLinks} external)</div>
        </div>
        <div class="card">
          <div class="card-label">Images</div>
          <div class="card-value">${analytics.imageAnalysis.totalImages} (${analytics.imageAnalysis.altTextCoverage}% with alt text)</div>
        </div>
        <div class="card">
          <div class="card-label">Headings</div>
          <div class="card-value">H1: ${analytics.headingAnalysis.h1Count}, H2: ${analytics.headingAnalysis.h2Count}, H3: ${analytics.headingAnalysis.h3Count}</div>
        </div>
        <div class="card">
          <div class="card-label">Content Metrics</div>
          <div class="card-value">${analytics.totalWords} words, ${analytics.readingTime} min read</div>
        </div>
      </div>
    </div>

    <!-- Headings Structure -->
    ${data.headings.h1.length > 0 || data.headings.h2.length > 0 ? `
    <div class="section">
      <h2>📝 Headings Structure</h2>
      
      ${data.headings.h1.length > 0 ? `
      <h3>H1 Headings (${data.headings.h1.length})</h3>
      <ul class="list">
        ${data.headings.h1.map(h => `<li>${h}</li>`).join('')}
      </ul>
      ` : ''}

      ${data.headings.h2.length > 0 ? `
      <h3>H2 Headings (${data.headings.h2.length})</h3>
      <ul class="list">
        ${data.headings.h2.slice(0, 10).map(h => `<li>${h}</li>`).join('')}
        ${data.headings.h2.length > 10 ? `<li style="color: #9ca3af;">... and ${data.headings.h2.length - 10} more</li>` : ''}
      </ul>
      ` : ''}
    </div>
    ` : ''}

    <!-- Footer -->
    <div class="footer">
      <p>Generated by AI Web Analyzer</p>
      <p>Powered by Google Gemini AI & Playwright</p>
    </div>
  </div>
</body>
</html>
    `;
  }
}

export const pdfService = new PDFService();

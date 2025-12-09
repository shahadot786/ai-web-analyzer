import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { useState } from 'react';
import * as XLSX from 'xlsx';
import type { ScrapeResult } from '../services/api';

interface ExportButtonProps {
  resultId: string;
  title: string;
  result: ScrapeResult;
}

export default function ExportButton({ resultId, title, result }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExportPDF = async () => {
    setIsExporting(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3001/api/export/pdf/${resultId}`);
      
      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Get the blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-web-analyzer-${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message || 'Failed to export PDF');
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = () => {
    try {
      const jsonData = JSON.stringify(result, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-web-analyzer-${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      setError(err.message || 'Failed to export JSON');
      console.error('JSON export error:', err);
    }
  };

  const handleExportExcel = () => {
    try {
      const { data, aiAnalysis, analytics } = result;

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Summary Sheet
      const summaryData = [
        ['AI Web Analyzer Report'],
        [''],
        ['URL', data.url],
        ['Title', data.title],
        ['Analyzed At', new Date(data.scrapedAt).toLocaleString()],
        [''],
        ['Scores'],
        ['SEO Score', analytics.seoScore],
        ['Content Quality Score', aiAnalysis.contentQualityScore || 'N/A'],
        ['Readability Score', aiAnalysis.readabilityScore || 'N/A'],
        [''],
        ['Content Metrics'],
        ['Total Words', analytics.totalWords],
        ['Reading Time (min)', analytics.readingTime],
        ['Total Links', analytics.linkAnalysis.totalLinks],
        ['Internal Links', analytics.linkAnalysis.internalLinks],
        ['External Links', analytics.linkAnalysis.externalLinks],
        ['Total Images', analytics.imageAnalysis.totalImages],
        ['Images with Alt Text', analytics.imageAnalysis.imagesWithAlt],
        ['Alt Text Coverage (%)', analytics.imageAnalysis.altTextCoverage],
      ];
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

      // AI Analysis Sheet
      const aiData = [
        ['AI Analysis'],
        [''],
        ['Content Summary'],
        [aiAnalysis.contentSummary],
        [''],
        ['Key Topics'],
        ...aiAnalysis.keyTopics.map(topic => [topic]),
        [''],
        ['Sentiment', aiAnalysis.sentiment || 'N/A'],
        ['Sentiment Confidence (%)', aiAnalysis.sentimentConfidence || 'N/A'],
        [''],
        ['Content Categories'],
        ...aiAnalysis.contentCategories.map(cat => [cat]),
      ];
      const wsAI = XLSX.utils.aoa_to_sheet(aiData);
      XLSX.utils.book_append_sheet(wb, wsAI, 'AI Analysis');

      // Entities Sheet
      if (aiAnalysis.entities) {
        const entitiesData = [
          ['Entities'],
          [''],
          ['People'],
          ...aiAnalysis.entities.people.map(p => [p]),
          [''],
          ['Organizations'],
          ...aiAnalysis.entities.organizations.map(o => [o]),
          [''],
          ['Locations'],
          ...aiAnalysis.entities.locations.map(l => [l]),
          [''],
          ['Technologies'],
          ...aiAnalysis.entities.technologies.map(t => [t]),
        ];
        const wsEntities = XLSX.utils.aoa_to_sheet(entitiesData);
        XLSX.utils.book_append_sheet(wb, wsEntities, 'Entities');
      }

      // Keywords Sheet
      if (aiAnalysis.keywords && aiAnalysis.keywords.length > 0) {
        const keywordsData = [
          ['Keyword', 'Relevance (%)'],
          ...aiAnalysis.keywords.map(kw => [kw.keyword, kw.relevance]),
        ];
        const wsKeywords = XLSX.utils.aoa_to_sheet(keywordsData);
        XLSX.utils.book_append_sheet(wb, wsKeywords, 'Keywords');
      }

      // SEO Insights Sheet
      const seoData = [
        ['SEO Insights'],
        [''],
        ['Title Quality', aiAnalysis.seoInsights.titleQuality],
        ['Meta Description Quality', aiAnalysis.seoInsights.metaDescriptionQuality],
        ['Heading Structure', aiAnalysis.seoInsights.headingStructure],
        ['Keyword Density', aiAnalysis.seoInsights.keywordDensity],
        [''],
        ['Recommendations'],
        ...aiAnalysis.seoInsights.recommendations.map(rec => [rec]),
      ];
      const wsSEO = XLSX.utils.aoa_to_sheet(seoData);
      XLSX.utils.book_append_sheet(wb, wsSEO, 'SEO Insights');

      // Content Quality Sheet
      if (aiAnalysis.contentQualityInsights && aiAnalysis.contentQualityInsights.length > 0) {
        const qualityData = [
          ['Content Quality Insights'],
          [''],
          ...aiAnalysis.contentQualityInsights.map(insight => [insight]),
        ];
        const wsQuality = XLSX.utils.aoa_to_sheet(qualityData);
        XLSX.utils.book_append_sheet(wb, wsQuality, 'Content Quality');
      }

      // Competitive Insights Sheet
      if (aiAnalysis.competitiveInsights && aiAnalysis.competitiveInsights.length > 0) {
        const compData = [
          ['Competitive Insights'],
          [''],
          ...aiAnalysis.competitiveInsights.map(insight => [insight]),
        ];
        const wsComp = XLSX.utils.aoa_to_sheet(compData);
        XLSX.utils.book_append_sheet(wb, wsComp, 'Competitive Insights');
      }

      // Headings Sheet
      const headingsData = [
        ['Heading Level', 'Text'],
        ...data.headings.h1.map(h => ['H1', h]),
        ...data.headings.h2.map(h => ['H2', h]),
        ...data.headings.h3.map(h => ['H3', h]),
        ...data.headings.h4.map(h => ['H4', h]),
        ...data.headings.h5.map(h => ['H5', h]),
        ...data.headings.h6.map(h => ['H6', h]),
      ];
      const wsHeadings = XLSX.utils.aoa_to_sheet(headingsData);
      XLSX.utils.book_append_sheet(wb, wsHeadings, 'Headings');

      // Links Sheet
      const linksData = [
        ['Link Text', 'URL', 'Type'],
        ...data.links.map(link => [
          link.text,
          link.href,
          link.isInternal ? 'Internal' : 'External'
        ]),
      ];
      const wsLinks = XLSX.utils.aoa_to_sheet(linksData);
      XLSX.utils.book_append_sheet(wb, wsLinks, 'Links');

      // Images Sheet
      const imagesData = [
        ['Image URL', 'Alt Text', 'Width', 'Height'],
        ...data.images.map(img => [
          img.src,
          img.alt || '(no alt text)',
          img.width || 'N/A',
          img.height || 'N/A'
        ]),
      ];
      const wsImages = XLSX.utils.aoa_to_sheet(imagesData);
      XLSX.utils.book_append_sheet(wb, wsImages, 'Images');

      // Generate Excel file
      XLSX.writeFile(wb, `ai-web-analyzer-${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.xlsx`);
    } catch (err: any) {
      setError(err.message || 'Failed to export Excel');
      console.error('Excel export error:', err);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
      <button
        onClick={handleExportPDF}
        className="btn btn-primary"
        disabled={isExporting}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          padding: 'var(--spacing-sm) var(--spacing-md)'
        }}
      >
        {isExporting ? (
          <>
            <div className="spinner" style={{ width: '16px', height: '16px' }} />
            Generating...
          </>
        ) : (
          <>
            <Download size={16} />
            PDF
          </>
        )}
      </button>

      <button
        onClick={handleExportExcel}
        className="btn btn-secondary"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          padding: 'var(--spacing-sm) var(--spacing-md)'
        }}
      >
        <FileSpreadsheet size={16} />
        Excel
      </button>

      <button
        onClick={handleExportJSON}
        className="btn btn-secondary"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)',
          padding: 'var(--spacing-sm) var(--spacing-md)'
        }}
      >
        <FileText size={16} />
        JSON
      </button>

      {error && (
        <div style={{
          padding: 'var(--spacing-sm)',
          background: 'hsla(0, 84%, 60%, 0.1)',
          border: '1px solid var(--error)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--error)',
          fontSize: '0.875rem',
          flexBasis: '100%'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

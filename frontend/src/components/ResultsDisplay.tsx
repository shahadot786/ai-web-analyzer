import { useState } from 'react';
import { ArrowLeft, ExternalLink, Image as ImageIcon, Link as LinkIcon, FileText, BarChart3, Brain, TrendingUp } from 'lucide-react';
import type { ScrapeResult } from '../services/api';

interface ResultsDisplayProps {
  result: ScrapeResult;
  onReset: () => void;
}

export default function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  const { data, aiAnalysis, analytics } = result;
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showAllParagraphs, setShowAllParagraphs] = useState(false);
  const [showAllLinks, setShowAllLinks] = useState(false);
  const [showAllImages, setShowAllImages] = useState(false);

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-xl">
        <button onClick={onReset} className="btn btn-secondary">
          <ArrowLeft size={20} />
          New Scrape
        </button>
        <div className="flex items-center gap-sm">
          <span className={`badge ${analytics.seoScore >= 70 ? 'badge-success' : analytics.seoScore >= 40 ? 'badge-warning' : 'badge-error'}`}>
            SEO Score: {analytics.seoScore}/100
          </span>
        </div>
      </div>

      {/* Title & URL */}
      <div className="card mb-lg">
        <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>{data.title || 'Untitled Page'}</h2>
        <a href={data.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-sm" style={{ fontSize: '0.875rem' }}>
          <ExternalLink size={16} />
          {data.url}
        </a>
      </div>

      {/* AI Analysis */}
      <div className="card-glass mb-lg">
        <div className="flex items-center gap-sm mb-md">
          <Brain size={24} color="var(--accent)" />
          <h3 style={{ marginBottom: 0 }}>AI Analysis</h3>
        </div>
        
        <div className="grid gap-md">
          <div>
            <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-sm)' }}>Content Summary</h4>
            <p style={{ marginBottom: 0 }}>{aiAnalysis.contentSummary}</p>
          </div>

          {aiAnalysis.keyTopics.length > 0 && (
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-sm)' }}>Key Topics</h4>
              <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                {aiAnalysis.keyTopics.map((topic, i) => (
                  <span key={i} className="badge badge-primary">{topic}</span>
                ))}
              </div>
            </div>
          )}

          {aiAnalysis.contentCategories.length > 0 && (
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-sm)' }}>Categories</h4>
              <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                {aiAnalysis.contentCategories.map((cat, i) => (
                  <span key={i} className="badge">{cat}</span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-2">
            {aiAnalysis.sentiment && (
              <div>
                <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-xs)', color: 'var(--text-tertiary)' }}>Sentiment</h4>
                <span className={`badge ${
                  aiAnalysis.sentiment === 'positive' ? 'badge-success' :
                  aiAnalysis.sentiment === 'negative' ? 'badge-error' : ''
                }`} style={{ textTransform: 'capitalize' }}>
                  {aiAnalysis.sentiment}
                </span>
              </div>
            )}
            {aiAnalysis.readabilityScore !== undefined && (
              <div>
                <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-xs)', color: 'var(--text-tertiary)' }}>Readability</h4>
                <span className="badge badge-primary">{aiAnalysis.readabilityScore}/100</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="card mb-lg">
        <div className="flex items-center gap-sm mb-md">
          <BarChart3 size={24} color="var(--secondary)" />
          <h3 style={{ marginBottom: 0 }}>Analytics Dashboard</h3>
        </div>

        <div className="grid grid-3">
          <div className="card" style={{ background: 'var(--bg-elevated)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
              {analytics.totalWords.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Total Words</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 'var(--spacing-xs)' }}>
              {analytics.readingTime} min read
            </div>
          </div>

          <div className="card" style={{ background: 'var(--bg-elevated)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--secondary)' }}>
              {analytics.linkAnalysis.totalLinks}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Total Links</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 'var(--spacing-xs)' }}>
              {analytics.linkAnalysis.internalLinks} internal, {analytics.linkAnalysis.externalLinks} external
            </div>
          </div>

          <div className="card" style={{ background: 'var(--bg-elevated)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>
              {analytics.imageAnalysis.totalImages}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Images</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' , marginTop: 'var(--spacing-xs)' }}>
              {analytics.imageAnalysis.altTextCoverage}% with alt text
            </div>
          </div>
        </div>
      </div>

      {/* SEO Insights */}
      <div className="card mb-lg">
        <div className="flex items-center gap-sm mb-md">
          <TrendingUp size={24} color="var(--success)" />
          <h3 style={{ marginBottom: 0 }}>SEO Insights</h3>
        </div>

        <div className="grid gap-md">
          <div className="grid grid-2">
            <div>
              <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-xs)', color: 'var(--text-tertiary)' }}>Title Quality</h4>
              <p style={{ marginBottom: 0, fontSize: '0.875rem' }}>{aiAnalysis.seoInsights.titleQuality}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-xs)', color: 'var(--text-tertiary)' }}>Meta Description</h4>
              <p style={{ marginBottom: 0, fontSize: '0.875rem' }}>{aiAnalysis.seoInsights.metaDescriptionQuality}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-xs)', color: 'var(--text-tertiary)' }}>Heading Structure</h4>
              <p style={{ marginBottom: 0, fontSize: '0.875rem' }}>{aiAnalysis.seoInsights.headingStructure}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-xs)', color: 'var(--text-tertiary)' }}>Content Analysis</h4>
              <p style={{ marginBottom: 0, fontSize: '0.875rem' }}>{aiAnalysis.seoInsights.keywordDensity}</p>
            </div>
          </div>

          {aiAnalysis.seoInsights.recommendations.length > 0 && (
            <div>
              <h4 style={{ fontSize: '1rem', marginBottom: 'var(--spacing-sm)' }}>Recommendations</h4>
              <ul style={{ paddingLeft: 'var(--spacing-lg)', margin: 0 }}>
                {aiAnalysis.seoInsights.recommendations.map((rec, i) => (
                  <li key={i} style={{ marginBottom: 'var(--spacing-xs)', color: 'var(--text-secondary)' }}>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Headings */}
      {Object.values(data.headings).some(arr => arr.length > 0) && (
        <div className="card mb-lg">
          <div className="flex items-center gap-sm mb-md">
            <FileText size={24} color="var(--primary)" />
            <h3 style={{ marginBottom: 0 }}>Headings Structure</h3>
          </div>

          <div className="grid gap-md">
            {Object.entries(data.headings).map(([level, headings]) => (
              headings.length > 0 && (
                <div key={level}>
                  <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                    {level} ({headings.length})
                  </h4>
                  <ul style={{ paddingLeft: 'var(--spacing-lg)', margin: 0 }}>
                    {headings.map((heading, i) => (
                      <li key={i} style={{ marginBottom: 'var(--spacing-xs)', color: 'var(--text-secondary)' }}>
                        {heading}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Content Summaries */}
      {data.paragraphs.length > 0 && (
        <div className="card mb-lg">
          <div className="flex items-center gap-sm mb-md">
            <FileText size={24} color="var(--accent)" />
            <h3 style={{ marginBottom: 0 }}>Content Summaries ({data.paragraphs.length})</h3>
          </div>

          <div className="grid gap-md">
            {data.paragraphs.slice(0, showAllParagraphs ? data.paragraphs.length : 10).map((para, i) => (
              <div key={i} style={{
                padding: 'var(--spacing-md)',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                borderLeft: '3px solid var(--primary)',
              }}>
                <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>
                  {para.summary || para.text}
                </p>
              </div>
            ))}
          </div>
          {data.paragraphs.length > 10 && (
            <button
              onClick={() => setShowAllParagraphs(!showAllParagraphs)}
              className="btn btn-secondary"
              style={{ marginTop: 'var(--spacing-md)', width: '100%' }}
            >
              {showAllParagraphs ? 'Show Less' : `Show All ${data.paragraphs.length} Paragraphs`}
            </button>
          )}
        </div>
      )}

      {/* Links */}
      {data.links.length > 0 && (
        <div className="card mb-lg">
          <div className="flex items-center gap-sm mb-md">
            <LinkIcon size={24} color="var(--secondary)" />
            <h3 style={{ marginBottom: 0 }}>Links ({data.links.length})</h3>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: 'var(--spacing-sm)', textAlign: 'left', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Text</th>
                  <th style={{ padding: 'var(--spacing-sm)', textAlign: 'left', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>URL</th>
                  <th style={{ padding: 'var(--spacing-sm)', textAlign: 'left', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {data.links.slice(0, showAllLinks ? data.links.length : 20).map((link, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: 'var(--spacing-sm)', fontSize: '0.875rem' }}>
                      {link.text || '(no text)'}
                    </td>
                    <td style={{ padding: 'var(--spacing-sm)', fontSize: '0.875rem' }}>
                      <a href={link.href} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>
                        {link.href.length > 50 ? link.href.substring(0, 50) + '...' : link.href}
                      </a>
                    </td>
                    <td style={{ padding: 'var(--spacing-sm)' }}>
                      <span className={`badge ${link.isInternal ? 'badge-success' : ''}`}>
                        {link.isInternal ? 'Internal' : 'External'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.links.length > 20 && (
            <button
              onClick={() => setShowAllLinks(!showAllLinks)}
              className="btn btn-secondary"
              style={{ marginTop: 'var(--spacing-md)', width: '100%' }}
            >
              {showAllLinks ? 'Show Less' : `Show All ${data.links.length} Links`}
            </button>
          )}
        </div>
      )}

      {/* Images */}
      {data.images.length > 0 && (
        <div className="card">
          <div className="flex items-center gap-sm mb-md">
            <ImageIcon size={24} color="var(--accent)" />
            <h3 style={{ marginBottom: 0 }}>Images ({data.images.length})</h3>
          </div>

          <div className="grid grid-3">
            {data.images.slice(0, showAllImages ? data.images.length : 12).map((img, i) => (
              <div 
                key={i} 
                style={{
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'all var(--transition-base)',
                }}
                onClick={() => setPreviewImage(img.src)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt || 'Image'}
                  style={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {img.alt && (
                  <div style={{ padding: 'var(--spacing-sm)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {img.alt}
                  </div>
                )}
              </div>
            ))}
          </div>
          {data.images.length > 12 && (
            <button
              onClick={() => setShowAllImages(!showAllImages)}
              className="btn btn-secondary"
              style={{ marginTop: 'var(--spacing-md)', width: '100%' }}
            >
              {showAllImages ? 'Show Less' : `Show All ${data.images.length} Images`}
            </button>
          )}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 'var(--spacing-xl)',
          }}
          onClick={() => setPreviewImage(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img
              src={previewImage}
              alt="Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
                borderRadius: 'var(--radius-lg)',
              }}
            />
            <button
              onClick={() => setPreviewImage(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--spacing-sm) var(--spacing-md)',
                color: 'var(--text-primary)',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

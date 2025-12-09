import { useState } from 'react';
import { ArrowLeft, ExternalLink, ChevronDown, ChevronUp, Download, FileText, BarChart3, Brain, TrendingUp, Tag, Users, MapPin, Cpu } from 'lucide-react';
import type { ScrapeResult } from '../services/api';
import ExportButton from './ExportButton';

interface ResultsDisplayProps {
  result: ScrapeResult;
  onReset: () => void;
}

export default function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  const { data, aiAnalysis, analytics } = result;
  
  // Expandable sections state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    allHeadings: false,
    allParagraphs: false,
    allLinks: false,
    allImages: false,
    entities: false,
    keywords: false,
    quality: false,
    competitive: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Get top 5 most important paragraphs
  const topParagraphs = data.paragraphs
    .sort((a, b) => (b.importance || 0) - (a.importance || 0))
    .slice(0, 5);

  // Get top 10 most relevant links
  const topLinks = data.links.slice(0, 10);

  // Get first 6 images
  const topImages = data.images.slice(0, 6);

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-xl">
        <button onClick={onReset} className="btn btn-secondary">
          <ArrowLeft size={20} />
          New Analysis
        </button>
        <div className="flex items-center gap-sm">
          <ExportButton resultId={result.id} title={data.title} result={result} />
          <span className={`badge ${analytics.seoScore >= 70 ? 'badge-success' : analytics.seoScore >= 40 ? 'badge-warning' : 'badge-error'}`}>
            SEO: {analytics.seoScore}/100
          </span>
          {aiAnalysis.contentQualityScore !== undefined && (
            <span className={`badge ${aiAnalysis.contentQualityScore >= 70 ? 'badge-success' : aiAnalysis.contentQualityScore >= 40 ? 'badge-warning' : 'badge-error'}`}>
              Quality: {aiAnalysis.contentQualityScore}/100
            </span>
          )}
        </div>
      </div>

      {/* Title & URL */}
      <div className="card mb-lg">
        <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>{data.title || 'Untitled Page'}</h2>
        <a href={data.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-sm" style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>
          <ExternalLink size={16} />
          {data.url}
        </a>
      </div>

      {/* AI Analysis Summary */}
      <div className="card-glass mb-lg">
        <div className="flex items-center gap-sm mb-md">
          <Brain size={24} color="var(--accent)" />
          <h3 style={{ marginBottom: 0 }}>AI Analysis</h3>
        </div>
        
        <div className="grid gap-md">
          <div>
            <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Summary</h4>
            <p style={{ marginBottom: 0, lineHeight: 1.6 }}>{aiAnalysis.contentSummary}</p>
          </div>

          {aiAnalysis.keyTopics && aiAnalysis.keyTopics.length > 0 && (
            <div>
              <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Key Topics</h4>
              <div className="flex gap-sm" style={{ flexWrap: 'wrap' }}>
                {aiAnalysis.keyTopics.map((topic, i) => (
                  <span key={i} className="badge badge-primary">{topic}</span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-2">
            {aiAnalysis.sentiment && (
              <div>
                <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-xs)', color: 'var(--text-tertiary)' }}>Sentiment</h4>
                <div className="flex items-center gap-sm">
                  <span className={`badge ${
                    aiAnalysis.sentiment === 'positive' ? 'badge-success' :
                    aiAnalysis.sentiment === 'negative' ? 'badge-error' : ''
                  }`} style={{ textTransform: 'capitalize' }}>
                    {aiAnalysis.sentiment}
                  </span>
                  {aiAnalysis.sentimentConfidence && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      {aiAnalysis.sentimentConfidence}% confidence
                    </span>
                  )}
                </div>
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

      {/* Quick Stats */}
      <div className="grid grid-3 mb-lg">
        <div className="card" style={{ background: 'var(--bg-elevated)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
            {analytics.totalWords.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Words</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 'var(--spacing-xs)' }}>
            {analytics.readingTime} min read
          </div>
        </div>

        <div className="card" style={{ background: 'var(--bg-elevated)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--secondary)' }}>
            {analytics.linkAnalysis.totalLinks}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Links</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 'var(--spacing-xs)' }}>
            {analytics.linkAnalysis.internalLinks} internal
          </div>
        </div>

        <div className="card" style={{ background: 'var(--bg-elevated)' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent)' }}>
            {analytics.imageAnalysis.totalImages}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Images</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 'var(--spacing-xs)' }}>
            {analytics.imageAnalysis.altTextCoverage}% alt text
          </div>
        </div>
      </div>

      {/* Entities (if available) */}
      {aiAnalysis.entities && (aiAnalysis.entities.people.length > 0 || aiAnalysis.entities.organizations.length > 0 || aiAnalysis.entities.locations.length > 0 || aiAnalysis.entities.technologies.length > 0) && (
        <div className="card mb-lg">
          <button
            onClick={() => toggleSection('entities')}
            className="flex items-center justify-between w-full"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text-primary)' }}
          >
            <div className="flex items-center gap-sm">
              <Users size={24} color="var(--primary)" />
              <h3 style={{ marginBottom: 0 }}>Entities Detected</h3>
            </div>
            {expandedSections.entities ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {expandedSections.entities && (
            <div className="grid grid-2 mt-md" style={{ gap: 'var(--spacing-md)' }}>
              {aiAnalysis.entities.people.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)', color: 'var(--text-tertiary)' }}>
                    <Users size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    People
                  </h4>
                  <div className="flex gap-xs" style={{ flexWrap: 'wrap' }}>
                    {aiAnalysis.entities.people.map((person, i) => (
                      <span key={i} className="badge">{person}</span>
                    ))}
                  </div>
                </div>
              )}
              {aiAnalysis.entities.organizations.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)', color: 'var(--text-tertiary)' }}>
                    <Tag size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    Organizations
                  </h4>
                  <div className="flex gap-xs" style={{ flexWrap: 'wrap' }}>
                    {aiAnalysis.entities.organizations.map((org, i) => (
                      <span key={i} className="badge">{org}</span>
                    ))}
                  </div>
                </div>
              )}
              {aiAnalysis.entities.locations.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)', color: 'var(--text-tertiary)' }}>
                    <MapPin size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    Locations
                  </h4>
                  <div className="flex gap-xs" style={{ flexWrap: 'wrap' }}>
                    {aiAnalysis.entities.locations.map((loc, i) => (
                      <span key={i} className="badge">{loc}</span>
                    ))}
                  </div>
                </div>
              )}
              {aiAnalysis.entities.technologies.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)', color: 'var(--text-tertiary)' }}>
                    <Cpu size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                    Technologies
                  </h4>
                  <div className="flex gap-xs" style={{ flexWrap: 'wrap' }}>
                    {aiAnalysis.entities.technologies.map((tech, i) => (
                      <span key={i} className="badge">{tech}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Keywords (if available) */}
      {aiAnalysis.keywords && aiAnalysis.keywords.length > 0 && (
        <div className="card mb-lg">
          <button
            onClick={() => toggleSection('keywords')}
            className="flex items-center justify-between w-full"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text-primary)' }}
          >
            <div className="flex items-center gap-sm">
              <Tag size={24} color="var(--secondary)" />
              <h3 style={{ marginBottom: 0 }}>Keywords ({aiAnalysis.keywords.length})</h3>
            </div>
            {expandedSections.keywords ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {expandedSections.keywords && (
            <div className="mt-md" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
              {aiAnalysis.keywords.map((kw, i) => (
                <div key={i} style={{
                  padding: 'var(--spacing-xs) var(--spacing-sm)',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-xs)'
                }}>
                  <span style={{ fontSize: '0.875rem' }}>{kw.keyword}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-tertiary)',
                    background: 'var(--bg-primary)',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {kw.relevance}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SEO Insights */}
      <div className="card mb-lg">
        <div className="flex items-center gap-sm mb-md">
          <TrendingUp size={24} color="var(--success)" />
          <h3 style={{ marginBottom: 0 }}>SEO Insights</h3>
        </div>

        <div className="grid gap-sm">
          <div style={{ padding: 'var(--spacing-sm)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Title</div>
            <div style={{ fontSize: '0.875rem' }}>{aiAnalysis.seoInsights.titleQuality}</div>
          </div>
          <div style={{ padding: 'var(--spacing-sm)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Meta Description</div>
            <div style={{ fontSize: '0.875rem' }}>{aiAnalysis.seoInsights.metaDescriptionQuality}</div>
          </div>
          <div style={{ padding: 'var(--spacing-sm)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.25rem' }}>Heading Structure</div>
            <div style={{ fontSize: '0.875rem' }}>{aiAnalysis.seoInsights.headingStructure}</div>
          </div>

          {aiAnalysis.seoInsights.recommendations.length > 0 && (
            <div style={{ marginTop: 'var(--spacing-sm)' }}>
              <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)', color: 'var(--text-tertiary)' }}>Recommendations</h4>
              <ul style={{ paddingLeft: 'var(--spacing-lg)', margin: 0 }}>
                {aiAnalysis.seoInsights.recommendations.slice(0, 5).map((rec, i) => (
                  <li key={i} style={{ marginBottom: 'var(--spacing-xs)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Content Quality */}
      {aiAnalysis.contentQualityInsights && aiAnalysis.contentQualityInsights.length > 0 && (
        <div className="card mb-lg">
          <button
            onClick={() => toggleSection('quality')}
            className="flex items-center justify-between w-full"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text-primary)' }}
          >
            <div className="flex items-center gap-sm">
              <BarChart3 size={24} color="var(--primary)" />
              <h3 style={{ marginBottom: 0 }}>Content Quality Insights</h3>
            </div>
            {expandedSections.quality ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {expandedSections.quality && (
            <ul style={{ paddingLeft: 'var(--spacing-lg)', margin: 'var(--spacing-md) 0 0 0' }}>
              {aiAnalysis.contentQualityInsights.map((insight, i) => (
                <li key={i} style={{ marginBottom: 'var(--spacing-xs)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {insight}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Competitive Insights */}
      {aiAnalysis.competitiveInsights && aiAnalysis.competitiveInsights.length > 0 && (
        <div className="card mb-lg">
          <button
            onClick={() => toggleSection('competitive')}
            className="flex items-center justify-between w-full"
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'var(--text-primary)' }}
          >
            <div className="flex items-center gap-sm">
              <TrendingUp size={24} color="var(--accent)" />
              <h3 style={{ marginBottom: 0 }}>Competitive Insights</h3>
            </div>
            {expandedSections.competitive ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>

          {expandedSections.competitive && (
            <ul style={{ paddingLeft: 'var(--spacing-lg)', margin: 'var(--spacing-md) 0 0 0' }}>
              {aiAnalysis.competitiveInsights.map((insight, i) => (
                <li key={i} style={{ marginBottom: 'var(--spacing-xs)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {insight}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Headings - Only H1 and H2 by default */}
      {(data.headings.h1.length > 0 || data.headings.h2.length > 0) && (
        <div className="card mb-lg">
          <div className="flex items-center justify-between mb-md">
            <div className="flex items-center gap-sm">
              <FileText size={24} color="var(--primary)" />
              <h3 style={{ marginBottom: 0 }}>Headings</h3>
            </div>
            {(data.headings.h3.length > 0 || data.headings.h4.length > 0 || data.headings.h5.length > 0 || data.headings.h6.length > 0) && (
              <button
                onClick={() => toggleSection('allHeadings')}
                className="btn btn-secondary"
                style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', fontSize: '0.875rem' }}
              >
                {expandedSections.allHeadings ? 'Show Less' : 'Show All'}
              </button>
            )}
          </div>

          <div className="grid gap-md">
            {data.headings.h1.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  H1 ({data.headings.h1.length})
                </h4>
                <ul style={{ paddingLeft: 'var(--spacing-lg)', margin: 0 }}>
                  {data.headings.h1.map((heading, i) => (
                    <li key={i} style={{ marginBottom: 'var(--spacing-xs)', color: 'var(--text-secondary)' }}>
                      {heading}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.headings.h2.length > 0 && (
              <div>
                <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  H2 ({data.headings.h2.length})
                </h4>
                <ul style={{ paddingLeft: 'var(--spacing-lg)', margin: 0 }}>
                  {data.headings.h2.map((heading, i) => (
                    <li key={i} style={{ marginBottom: 'var(--spacing-xs)', color: 'var(--text-secondary)' }}>
                      {heading}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {expandedSections.allHeadings && (
              <>
                {data.headings.h3.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                      H3 ({data.headings.h3.length})
                    </h4>
                    <ul style={{ paddingLeft: 'var(--spacing-lg)', margin: 0 }}>
                      {data.headings.h3.map((heading, i) => (
                        <li key={i} style={{ marginBottom: 'var(--spacing-xs)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                          {heading}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {data.headings.h4.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                      H4 ({data.headings.h4.length})
                    </h4>
                    <ul style={{ paddingLeft: 'var(--spacing-lg)', margin: 0 }}>
                      {data.headings.h4.map((heading, i) => (
                        <li key={i} style={{ marginBottom: 'var(--spacing-xs)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                          {heading}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Top Paragraphs */}
      {topParagraphs.length > 0 && (
        <div className="card mb-lg">
          <div className="flex items-center justify-between mb-md">
            <div className="flex items-center gap-sm">
              <FileText size={24} color="var(--accent)" />
              <h3 style={{ marginBottom: 0 }}>Key Content ({topParagraphs.length} of {data.paragraphs.length})</h3>
            </div>
            {data.paragraphs.length > 5 && (
              <button
                onClick={() => toggleSection('allParagraphs')}
                className="btn btn-secondary"
                style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', fontSize: '0.875rem' }}
              >
                {expandedSections.allParagraphs ? 'Show Less' : `Show All ${data.paragraphs.length}`}
              </button>
            )}
          </div>

          <div className="grid gap-sm">
            {(expandedSections.allParagraphs ? data.paragraphs : topParagraphs).map((para, i) => (
              <div key={i} style={{
                padding: 'var(--spacing-sm)',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                borderLeft: '3px solid var(--primary)',
              }}>
                <p style={{ fontSize: '0.875rem', marginBottom: 0, lineHeight: 1.6 }}>
                  {para.summary || para.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Links */}
      {topLinks.length > 0 && (
        <div className="card mb-lg">
          <div className="flex items-center justify-between mb-md">
            <div className="flex items-center gap-sm">
              <ExternalLink size={24} color="var(--secondary)" />
              <h3 style={{ marginBottom: 0 }}>Links ({topLinks.length}{data.links.length > 10 ? ` of ${data.links.length}` : ''})</h3>
            </div>
            {data.links.length > 10 && (
              <button
                onClick={() => toggleSection('allLinks')}
                className="btn btn-secondary"
                style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', fontSize: '0.875rem' }}
              >
                {expandedSections.allLinks ? 'Show Less' : `Show All ${data.links.length}`}
              </button>
            )}
          </div>

          <div className="grid gap-xs">
            {(expandedSections.allLinks ? data.links : topLinks).map((link, i) => (
              <div key={i} style={{
                padding: 'var(--spacing-sm)',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 'var(--spacing-sm)'
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                    {link.text || '(no text)'}
                  </div>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-tertiary)',
                    textDecoration: 'none',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block'
                  }}>
                    {link.href}
                  </a>
                </div>
                <span className={`badge ${link.isInternal ? 'badge-success' : ''}`} style={{ flexShrink: 0 }}>
                  {link.isInternal ? 'Internal' : 'External'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Images */}
      {topImages.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-md">
            <div className="flex items-center gap-sm">
              <Download size={24} color="var(--accent)" />
              <h3 style={{ marginBottom: 0 }}>Images ({topImages.length}{data.images.length > 6 ? ` of ${data.images.length}` : ''})</h3>
            </div>
            {data.images.length > 6 && (
              <button
                onClick={() => toggleSection('allImages')}
                className="btn btn-secondary"
                style={{ padding: 'var(--spacing-xs) var(--spacing-sm)', fontSize: '0.875rem' }}
              >
                {expandedSections.allImages ? 'Show Less' : `Show All ${data.images.length}`}
              </button>
            )}
          </div>

          <div className="grid grid-3">
            {(expandedSections.allImages ? data.images : topImages).map((img, i) => (
              <div 
                key={i} 
                style={{
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}
              >
                <img
                  src={img.src}
                  alt={img.alt || 'Image'}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                {img.alt && (
                  <div style={{ padding: 'var(--spacing-xs)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                    {img.alt}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

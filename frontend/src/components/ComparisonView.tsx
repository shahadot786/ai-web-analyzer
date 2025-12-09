import { useState } from 'react';
import { Search, Loader2, ArrowRight, X } from 'lucide-react';
import { scrapeWebsite, type ScrapeResult } from '../services/api';

interface ComparisonViewProps {
  onClose: () => void;
}

export default function ComparisonView({ onClose }: ComparisonViewProps) {
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result1, setResult1] = useState<ScrapeResult | null>(null);
  const [result2, setResult2] = useState<ScrapeResult | null>(null);

  const handleCompare = async () => {
    if (!url1.trim() || !url2.trim()) {
      setError('Please enter both URLs');
      return;
    }

    setLoading(true);
    setError('');
    setResult1(null);
    setResult2(null);

    try {
      const [data1, data2] = await Promise.all([
        scrapeWebsite({ url: url1.trim(), options: { includeAIAnalysis: true } }),
        scrapeWebsite({ url: url2.trim(), options: { includeAIAnalysis: true } })
      ]);

      setResult1(data1);
      setResult2(data2);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to analyze websites');
    } finally {
      setLoading(false);
    }
  };

  const ComparisonMetric = ({ label, value1, value2, isScore = false }: {
    label: string;
    value1: number | string;
    value2: number | string;
    isScore?: boolean;
  }) => {
    const getScoreColor = (score: number) => {
      if (score >= 70) return 'var(--success)';
      if (score >= 40) return 'var(--warning)';
      return 'var(--error)';
    };

    const val1 = typeof value1 === 'number' ? value1 : 0;
    const val2 = typeof value2 === 'number' ? value2 : 0;
    const winner = val1 > val2 ? 1 : val1 < val2 ? 2 : 0;

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: 'var(--spacing-md)',
        padding: 'var(--spacing-md)',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-md)',
        alignItems: 'center'
      }}>
        <div style={{
          textAlign: 'right',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: isScore && typeof value1 === 'number' ? getScoreColor(value1) : 'var(--text-primary)',
          opacity: winner === 2 ? 0.5 : 1
        }}>
          {value1}
        </div>
        <div style={{
          fontSize: '0.875rem',
          color: 'var(--text-tertiary)',
          textAlign: 'center',
          minWidth: '120px'
        }}>
          {label}
        </div>
        <div style={{
          textAlign: 'left',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: isScore && typeof value2 === 'number' ? getScoreColor(value2) : 'var(--text-primary)',
          opacity: winner === 1 ? 0.5 : 1
        }}>
          {value2}
        </div>
      </div>
    );
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: 'var(--spacing-lg)',
      overflowY: 'auto'
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '1200px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--border)'
      }}>
        {/* Header */}
        <div style={{
          padding: 'var(--spacing-lg)',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ margin: 0 }}>Compare Websites</h2>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: 'var(--spacing-sm)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Input Section */}
        <div style={{ padding: 'var(--spacing-lg)', borderBottom: '1px solid var(--border)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: 'var(--spacing-md)',
            alignItems: 'center'
          }}>
            <input
              type="url"
              placeholder="Enter first URL..."
              value={url1}
              onChange={(e) => setUrl1(e.target.value)}
              className="input"
              disabled={loading}
            />
            <ArrowRight size={24} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="url"
              placeholder="Enter second URL..."
              value={url2}
              onChange={(e) => setUrl2(e.target.value)}
              className="input"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleCompare}
            disabled={loading}
            className="btn btn-primary"
            style={{ marginTop: 'var(--spacing-md)', width: '100%' }}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="spinner" />
                Analyzing...
              </>
            ) : (
              <>
                <Search size={20} />
                Compare Websites
              </>
            )}
          </button>

          {error && (
            <div style={{
              marginTop: 'var(--spacing-md)',
              padding: 'var(--spacing-md)',
              background: 'hsla(0, 84%, 60%, 0.1)',
              border: '1px solid var(--error)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--error)'
            }}>
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {result1 && result2 && (
          <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--spacing-lg)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {/* Titles */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto 1fr',
                gap: 'var(--spacing-md)',
                marginBottom: 'var(--spacing-lg)'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-xs)' }}>
                    {result1.data.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', wordBreak: 'break-all' }}>
                    {result1.data.url}
                  </p>
                </div>
                <div style={{ width: '120px' }} />
                <div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-xs)' }}>
                    {result2.data.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', wordBreak: 'break-all' }}>
                    {result2.data.url}
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <ComparisonMetric
                label="SEO Score"
                value1={result1.analytics.seoScore}
                value2={result2.analytics.seoScore}
                isScore
              />
              <ComparisonMetric
                label="Quality Score"
                value1={result1.aiAnalysis.contentQualityScore || 0}
                value2={result2.aiAnalysis.contentQualityScore || 0}
                isScore
              />
              <ComparisonMetric
                label="Readability"
                value1={result1.aiAnalysis.readabilityScore || 0}
                value2={result2.aiAnalysis.readabilityScore || 0}
                isScore
              />
              <ComparisonMetric
                label="Total Words"
                value1={result1.analytics.totalWords}
                value2={result2.analytics.totalWords}
              />
              <ComparisonMetric
                label="Reading Time (min)"
                value1={result1.analytics.readingTime}
                value2={result2.analytics.readingTime}
              />
              <ComparisonMetric
                label="Total Links"
                value1={result1.analytics.linkAnalysis.totalLinks}
                value2={result2.analytics.linkAnalysis.totalLinks}
              />
              <ComparisonMetric
                label="Total Images"
                value1={result1.analytics.imageAnalysis.totalImages}
                value2={result2.analytics.imageAnalysis.totalImages}
              />
              <ComparisonMetric
                label="Alt Text Coverage (%)"
                value1={result1.analytics.imageAnalysis.altTextCoverage}
                value2={result2.analytics.imageAnalysis.altTextCoverage}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

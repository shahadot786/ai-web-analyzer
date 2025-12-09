import { useState } from 'react';
import { Search, Loader2, AlertCircle, Sparkles, History, GitCompare, Share2, X } from 'lucide-react';
import { scrapeWebsite, type ScrapeResult } from './services/api';
import ResultsDisplay from './components/ResultsDisplay';
import ThemeToggle from './components/ThemeToggle';
import HistoryView from './components/HistoryView';
import ComparisonView from './components/ComparisonView';
import { useHistory } from './hooks/useHistory';
import { useBookmarks } from './hooks/useBookmarks';
import './index.css';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ScrapeResult | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  
  const { addToHistory } = useHistory();
  const { addBookmark, isBookmarked } = useBookmarks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a valid URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await scrapeWebsite({
        url: url.trim(),
        options: {
          timeout: 60000,
          includeAIAnalysis: true,
        },
      });
      setResult(data);
      addToHistory(data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to scrape website. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setResult(null);
    setError('');
  };

  const handleShare = () => {
    if (!result) return;
    
    // Create shareable URL (in production, this would generate a unique link)
    const shareableUrl = `${window.location.origin}?result=${result.id}`;
    setShareUrl(shareableUrl);
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableUrl).then(() => {
      alert('Share link copied to clipboard!');
    });
  };

  const handleSelectFromHistory = (id: string) => {
    // In a real app, you'd fetch the result by ID
    setShowHistory(false);
    // For now, just close the modal
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        padding: 'var(--spacing-lg) 0',
      }}>
        <div className="container">
          <div className="flex items-center justify-between mb-sm">
            <div className="flex items-center gap-md">
              <img 
                src="/scraper_logo.png" 
                alt="AI Web Analyzer Logo" 
                style={{ width: '48px', height: '48px' }}
              />
              <h1 className="gradient-text" style={{ marginBottom: 0 }}>
                AI Web Analyzer
              </h1>
            </div>
            <div className="flex items-center gap-sm">
              <button
                onClick={() => setShowHistory(true)}
                className="btn btn-secondary"
                style={{ padding: 'var(--spacing-sm)' }}
                title="View History"
              >
                <History size={20} />
              </button>
              <button
                onClick={() => setShowComparison(true)}
                className="btn btn-secondary"
                style={{ padding: 'var(--spacing-sm)' }}
                title="Compare Websites"
              >
                <GitCompare size={20} />
              </button>
              <ThemeToggle />
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 0 }}>
            Intelligent web analysis with AI-powered insights, SEO recommendations, and content quality scoring
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ paddingTop: 'var(--spacing-2xl)', paddingBottom: 'var(--spacing-2xl)' }}>
        {!result ? (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Hero Section */}
            <div className="text-center mb-xl">
              <div className="flex items-center justify-center gap-sm mb-md">
                <Sparkles size={24} color="var(--accent)" />
                <h2 className="gradient-text" style={{ marginBottom: 0 }}>
                  Powered by AI
                </h2>
              </div>
              <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)' }}>
                Enter any website URL to extract structured data, analyze content, and get SEO insights
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="card-glass fade-in">
              <div className="flex flex-col gap-md">
                <div>
                  <label htmlFor="url" style={{
                    display: 'block',
                    marginBottom: 'var(--spacing-sm)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                  }}>
                    Website URL
                  </label>
                  <input
                    id="url"
                    type="url"
                    className="input"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-sm" style={{
                    padding: 'var(--spacing-md)',
                    background: 'hsla(0, 84%, 60%, 0.1)',
                    border: '1px solid var(--error)',
                    borderRadius: 'var(--radius-md)',
                    color: 'var(--error)',
                  }}>
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || !url.trim()}
                  style={{ width: '100%', padding: 'var(--spacing-md)' }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="spinner" />
                      Analyzing Website...
                    </>
                  ) : (
                    <>
                      <Search size={20} />
                      Analyze Website
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Features */}
            <div className="grid grid-3 mt-xl">
              {[
                { icon: '🔍', title: 'Smart Analysis', desc: 'Extract and analyze content, structure, links, and images' },
                { icon: '🤖', title: 'AI Insights', desc: 'Entity extraction, keywords, sentiment, and quality scoring' },
                { icon: '📊', title: 'SEO & Quality', desc: 'Comprehensive SEO analysis and content quality recommendations' },
              ].map((feature, i) => (
                <div key={i} className="card text-center">
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-sm)' }}>
                    {feature.icon}
                  </div>
                  <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>{feature.title}</h4>
                  <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ResultsDisplay result={result} onReset={handleReset} />
        )}
      </main>

      {/* Modals */}
      {showHistory && (
        <HistoryView
          onClose={() => setShowHistory(false)}
          onSelectResult={handleSelectFromHistory}
        />
      )}

      {showComparison && (
        <ComparisonView onClose={() => setShowComparison(false)} />
      )}
    </div>
  );
}

export default App;

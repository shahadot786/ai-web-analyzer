import { useState } from 'react';
import { Search, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { scrapeWebsite, type ScrapeResult } from './services/api';
import ResultsDisplay from './components/ResultsDisplay';
import './index.css';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<ScrapeResult | null>(null);

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
          timeout: 60000, // Increased to 60 seconds for heavy sites
          includeAIAnalysis: true,
        },
      });
      setResult(data);
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

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        padding: 'var(--spacing-lg) 0',
      }}>
        <div className="container">
          <div className="flex items-center gap-md">
            <img 
              src="/scraper_logo.png" 
              alt="AI Website Scraper Logo" 
              style={{ width: '48px', height: '48px' }}
            />
            <h1 className="gradient-text" style={{ marginBottom: 0 }}>
              AI Website Scraper
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-sm)', marginBottom: 0 }}>
            Extract, analyze, and understand any website with AI-powered insights
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
                      Scrape & Analyze
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Features */}
            <div className="grid grid-3 mt-xl">
              {[
                { icon: '🔍', title: 'Smart Extraction', desc: 'Extract titles, headings, content, links, and images' },
                { icon: '🤖', title: 'AI Analysis', desc: 'Get AI-powered summaries and content insights' },
                { icon: '📊', title: 'SEO Insights', desc: 'Comprehensive SEO analysis and recommendations' },
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
    </div>
  );
}

export default App;

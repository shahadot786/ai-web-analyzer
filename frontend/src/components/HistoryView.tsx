import { useState } from 'react';
import { X, Search, Trash2, Calendar, TrendingUp } from 'lucide-react';
import { useHistory } from '../hooks/useHistory';

interface HistoryViewProps {
  onClose: () => void;
  onSelectResult: (id: string) => void;
}

export default function HistoryView({ onClose, onSelectResult }: HistoryViewProps) {
  const { history, removeFromHistory, clearHistory, searchHistory } = useHistory();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = searchHistory(searchQuery);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'var(--success)';
    if (score >= 40) return 'var(--warning)';
    return 'var(--error)';
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
      padding: 'var(--spacing-lg)'
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '800px',
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
          <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Calendar size={24} />
            Analysis History
          </h2>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ padding: 'var(--spacing-sm)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: 'var(--spacing-lg)', borderBottom: '1px solid var(--border)' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={20}
              style={{
                position: 'absolute',
                left: 'var(--spacing-sm)',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)'
              }}
            />
            <input
              type="text"
              placeholder="Search by URL or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input"
              style={{ paddingLeft: 'calc(var(--spacing-md) + 24px)' }}
            />
          </div>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="btn btn-secondary"
              style={{
                marginTop: 'var(--spacing-sm)',
                fontSize: '0.875rem',
                padding: 'var(--spacing-xs) var(--spacing-sm)'
              }}
            >
              <Trash2 size={16} />
              Clear All History
            </button>
          )}
        </div>

        {/* History List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--spacing-lg)'
        }}>
          {filteredHistory.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: 'var(--spacing-2xl)',
              color: 'var(--text-tertiary)'
            }}>
              {searchQuery ? 'No results found' : 'No analysis history yet'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
              {filteredHistory.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--spacing-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onClick={() => onSelectResult(item.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 'var(--spacing-sm)'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '1rem',
                        marginBottom: 'var(--spacing-xs)',
                        color: 'var(--text-primary)'
                      }}>
                        {item.title}
                      </h3>
                      <p style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-tertiary)',
                        marginBottom: 0,
                        wordBreak: 'break-all'
                      }}>
                        {item.url}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromHistory(item.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-tertiary)',
                        cursor: 'pointer',
                        padding: 'var(--spacing-xs)',
                        borderRadius: 'var(--radius-sm)',
                        transition: 'all var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = 'var(--error)';
                        e.currentTarget.style.background = 'hsla(0, 84%, 60%, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--text-tertiary)';
                        e.currentTarget.style.background = 'none';
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                    fontSize: '0.875rem'
                  }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>
                      {formatDate(item.timestamp)}
                    </span>
                    <span style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-xs)',
                      color: getScoreColor(item.seoScore)
                    }}>
                      <TrendingUp size={16} />
                      SEO: {item.seoScore}/100
                    </span>
                    {item.qualityScore !== undefined && (
                      <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)',
                        color: getScoreColor(item.qualityScore)
                      }}>
                        Quality: {item.qualityScore}/100
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

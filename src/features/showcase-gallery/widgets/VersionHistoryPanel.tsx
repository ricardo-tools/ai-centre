'use client';

import { useState, useEffect } from 'react';
import { ClockCounterClockwise, CaretDown, CaretUp, ArrowCounterClockwise, SpinnerGap } from '@phosphor-icons/react';
import { getShowcaseVersions, restoreShowcaseVersion, type ShowcaseVersion } from '../action';

interface VersionHistoryPanelProps {
  showcaseId: string;
  isOwner: boolean;
}

export function VersionHistoryPanel({ showcaseId, isOwner }: VersionHistoryPanelProps) {
  const [versions, setVersions] = useState<ShowcaseVersion[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getShowcaseVersions(showcaseId).then(v => {
      setVersions(v);
      setLoaded(true);
    });
  }, [showcaseId]);

  if (!loaded || versions.length === 0) return null;

  async function handleRestore(versionNumber: number, versionId: string) {
    setRestoringId(versionId);
    const result = await restoreShowcaseVersion(showcaseId, versionNumber);
    if (result.ok) {
      // Refresh versions
      const updated = await getShowcaseVersions(showcaseId);
      setVersions(updated);
    }
    setRestoringId(null);
  }

  const latestVersion = versions[0]?.versionNumber;

  return (
    <div
      data-testid="version-history-panel"
      style={{
        borderTop: '1px solid var(--color-border)',
        marginTop: 16,
      }}
    >
      <button
        data-testid="version-history-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          width: '100%',
          padding: '12px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--color-text-heading)',
        }}
      >
        <ClockCounterClockwise size={16} />
        Version History ({versions.length})
        {isExpanded ? <CaretUp size={14} /> : <CaretDown size={14} />}
      </button>

      {isExpanded && (
        <div style={{ paddingBottom: 16 }}>
          {versions.map((v) => {
            const isCurrent = v.versionNumber === latestVersion;
            const isRestoring = restoringId === v.id;

            return (
              <div
                key={v.id}
                data-testid={`version-item-${v.versionNumber}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 6,
                  background: isCurrent ? 'var(--color-bg-alt)' : 'transparent',
                  marginBottom: 2,
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text-heading)' }}>
                      v{v.versionNumber}
                    </span>
                    {isCurrent && (
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '1px 5px', borderRadius: 3,
                        background: 'var(--color-success-muted)', color: 'var(--color-success)',
                      }}>
                        current
                      </span>
                    )}
                  </div>
                  <div style={{
                    fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {v.commitMessage}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', opacity: 0.7, marginTop: 2 }}>
                    {new Date(v.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>

                {isOwner && !isCurrent && (
                  <button
                    data-testid={`restore-version-${v.versionNumber}`}
                    onClick={() => handleRestore(v.versionNumber, v.id)}
                    disabled={isRestoring}
                    aria-label={`Restore to version ${v.versionNumber}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      padding: '4px 10px',
                      fontSize: 12,
                      fontWeight: 500,
                      fontFamily: 'inherit',
                      borderRadius: 4,
                      border: '1px solid var(--color-border)',
                      background: 'transparent',
                      color: 'var(--color-text-body)',
                      cursor: isRestoring ? 'not-allowed' : 'pointer',
                      opacity: isRestoring ? 0.5 : 1,
                      flexShrink: 0,
                    }}
                  >
                    {isRestoring ? (
                      <SpinnerGap size={12} weight="bold" style={{ animation: 'spin 1s linear infinite' }} />
                    ) : (
                      <ArrowCounterClockwise size={12} />
                    )}
                    Restore
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

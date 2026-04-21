'use client';

import { useState } from 'react';

export default function CosmicWafflePrototype() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'rules' | 'preview'>('matrix');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--color-text-heading)', lineHeight: 1.2, marginBottom: 'var(--space-1)' }}>
          Workflow Matrix
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
          Configure, preview, and publish workflow automation rules.
        </p>
      </div>

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: 'var(--space-1)', borderBottom: '1px solid var(--color-border)' }}>
        {(['matrix', 'rules', 'preview'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: 'var(--space-2) var(--space-3)',
              fontSize: 13,
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-text-muted)',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--color-primary)' : '2px solid transparent',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              marginBottom: -1,
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'matrix' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-2)' }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: i % 3 === 0 ? 'var(--color-primary-muted)' : 'var(--color-surface)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-1)',
                minHeight: 80,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-heading)' }}>
                Cell {i + 1}
              </span>
              <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                {i % 3 === 0 ? 'Active rule' : 'Empty'}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'rules' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {['Send reminder email at Day 1', 'Escalate to manager at Day 30', 'Auto-pause at Day 60'].map((rule) => (
            <div
              key={rule}
              style={{
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                fontSize: 13,
                color: 'var(--color-text-body)',
              }}
            >
              {rule}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'preview' && (
        <div
          style={{
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--color-border)',
            background: 'var(--color-bg-alt)',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            fontSize: 14,
          }}
        >
          Visual workflow preview will render here.
        </div>
      )}

      <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
        Adaptive agent · V1 placeholder — tab-based matrix with inline editing coming next.
      </p>
    </div>
  );
}

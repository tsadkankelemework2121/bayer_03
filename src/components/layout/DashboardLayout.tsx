import type { ReactNode } from "react";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-page)' }}>
      <div
        className="mx-auto"
        style={{
          maxWidth: '1360px',
          padding: 'var(--space-xl) var(--space-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-lg)',
        }}
      >
        {children}
      </div>
    </div>
  );
}

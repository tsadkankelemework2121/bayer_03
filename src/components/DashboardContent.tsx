import { useFleetData } from '../hooks/useFleetData';
import { Header } from './dashboard/Header';
import { KPIGrid } from './dashboard/KPIGrid';
import { SpeedPanel } from './dashboard/SpeedPanel';
import { ContinuousDrivingPanel } from './dashboard/ContinuousDrivingPanel';
import { NightDrivingPanel } from './dashboard/NightDrivingPanel';
import { Charts } from './dashboard/Charts';
import { EventsPanel } from './dashboard/EventsPanel';
import { Tables } from './dashboard/Tables';

export function DashboardContent() {
  const { data, isLoading, error } = useFleetData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '16px' }}>Loading fleet data...</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              animation: 'pulse 1.5s ease-in-out infinite 0.3s',
            }} />
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--primary)',
              animation: 'pulse 1.5s ease-in-out infinite 0.6s',
            }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <div style={{ textAlign: 'center', padding: 'var(--space-lg)' }}>
          <p style={{ fontSize: '1.1rem', color: '#d32f2f', marginBottom: '16px' }}>
            Failed to load fleet data
          </p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            {error instanceof Error ? error.message : 'Unknown error'}
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-page)' }}>
        <p style={{ color: 'var(--text-muted)' }}>No data available</p>
      </div>
    );
  }

  return (
    <>
      <Header
        organization={data.organization}
        title={data.title}
        month={data.month}
      />

      <main
        className="mx-auto w-full flex-1"
        style={{
          maxWidth: '100%',
          padding: 'var(--space-xl) var(--space-lg)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-xl)',
        }}
      >
        <section id="overview" className="scroll-mt-[100px]">
          <KPIGrid data={data} />
        </section>

        <section id="speed" className="scroll-mt-[100px]">
          <SpeedPanel data={data} />
        </section>

        <section id="compliance" className="scroll-mt-[100px]">
          <Charts data={data} />
        </section>

        <section id="continuous-driving" className="scroll-mt-[100px]">
          <ContinuousDrivingPanel data={data} />
        </section>

        <section id="night-driving" className="scroll-mt-[100px]">
          <NightDrivingPanel data={data} />
        </section>

        <section id="events" className="scroll-mt-[100px]">
          <EventsPanel data={data} />
        </section>

        <section id="fleet-summary" className="scroll-mt-[100px]">
          <Tables data={data} />
        </section>
      </main>
    </>
  );
}


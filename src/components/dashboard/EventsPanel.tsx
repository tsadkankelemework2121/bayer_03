import type { FleetData } from "../../types/fleet";

interface EventsPanelProps {
  data: FleetData;
}

export function EventsPanel({ data }: EventsPanelProps) {
  const events = data.eventsList || [];

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.42s' }}>
      <div className="section-title"><span>System Events Log</span></div>
      <div className="dash-card overflow-hidden">
        {events.length === 0 ? (
          <div style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>No active system events or alerts recorded.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Event Type</th>
                  <th>Timestamp</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{event.vehicle}</td>
                    <td>
                      <span className="risk-badge risk-badge-medium" style={{ fontSize: '0.72rem' }}>
                        {event.type}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{event.time}</td>
                    <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{event.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

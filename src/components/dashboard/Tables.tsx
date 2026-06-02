import type { FleetData } from "../../types/fleet";

interface TablesProps {
  data: FleetData;
}

export function Tables({ data }: TablesProps) {
  const list = data.fleetSummaryList || [];

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      <div className="section-title"><span>Fleet Summary</span></div>
      <div className="dash-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Overspeed Count</th>
                <th>Max Speed</th>
                <th>Total Distance</th>
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id}>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.vehicle}</td>
                  <td style={{ fontWeight: 500 }}>
                    {row.overspeedCount > 0 ? (
                      <span style={{ color: '#d32f2f', fontWeight: 600 }}>{row.overspeedCount}</span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>0</span>
                    )}
                  </td>
                  <td style={{ fontWeight: 500 }}>
                    <span style={{ color: row.maxSpeed > 110 ? '#d32f2f' : 'var(--text-primary)', fontWeight: row.maxSpeed > 110 ? 700 : 500 }}>
                      {row.maxSpeed}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginLeft: '3px' }}>km/h</span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {row.totalDistance}
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginLeft: '3px' }}>km</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

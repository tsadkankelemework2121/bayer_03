import type { FleetData } from "../../types/fleet";

interface TablesProps {
  data: FleetData;
}

function getMedalClass(index: number) {
  if (index === 0) return "medal medal-gold";
  if (index === 1) return "medal medal-silver";
  if (index === 2) return "medal medal-bronze";
  return "medal medal-default";
}

export function Tables({ data }: TablesProps) {
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 'var(--space-md)' }}>
        {/* Violations Table */}
        <div className="lg:col-span-2">
          <div className="section-title"><span>Vehicle Violations</span></div>
          <div className="dash-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Vehicle ID</th>
                    <th>Overspeed Events</th>
                    <th>Max Speed</th>
                    <th>Prohibited (mins)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.violationsList.map((row) => (
                    <tr key={row.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.vehicle}</td>
                      <td style={{ fontWeight: 500 }}>{row.overspeedCount}</td>
                      <td style={{ fontWeight: 500 }}>{row.maxSpeed} <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>km/h</span></td>
                      <td style={{ fontWeight: 500 }}>{row.prohibitedDuration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top 10 Performers */}
        <div>
          <div className="section-title flex items-center" style={{ gap: '8px' }}>
            <span>Top 10 Best Performers</span>
          </div>
          <div className="dash-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th style={{ width: '50px' }}>#</th>
                    <th>Vehicle</th>
                    <th style={{ textAlign: 'right' }}>Score</th>
                  </tr>
                </thead>
                <tbody className="stagger-children">
                  {data.topPerformers.map((row, index) => (
                    <tr key={index}>
                      <td><span className={getMedalClass(index)}>{index + 1}</span></td>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{row.vehicle}</td>
                      <td style={{ textAlign: 'right' }}>
                        <div className="flex items-center justify-end" style={{ gap: '8px' }}>
                          <div className="score-bar-track" style={{ width: '60px' }}>
                            <div className="score-bar-fill" style={{ width: `${row.score}%` }} />
                          </div>
                          <span style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--primary)', minWidth: '24px' }}>{row.score}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

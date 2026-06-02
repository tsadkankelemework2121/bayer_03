import type { FleetData } from "../../types/fleet";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface NightDrivingPanelProps {
  data: FleetData;
}

export function NightDrivingPanel({ data }: NightDrivingPanelProps) {
  const list = data.nightDrivingList || [];

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const remaining = mins % 60;
    return hours === 0 ? `${remaining}m` : `${hours}h ${remaining}m`;
  };

  // Chart data: plate number vs total night driving minutes
  const chartData = list
    .slice(0, 10)
    .map(item => ({
      vehicle: item.vehicle,
      nightMinutes: item.totalNightMinutes,
      tripCount: item.nightDriveCount,
    }));

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
      <div className="section-title"><span>Night Driving (22:00 – 05:00)</span></div>

      {list.length === 0 ? (
        <div className="dash-card" style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>No night driving incidents detected.</p>
        </div>
      ) : (
        <>
          {/* Top: Bar chart */}
          <div className="dash-card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-md)' }}>
            <h3 style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
              Night Driving Duration by Vehicle (Minutes)
            </h3>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={chartData} margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="nightDrivingGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#1e293b" stopOpacity={0.65} />
                      <stop offset="100%" stopColor="#1e293b" stopOpacity={0.95} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4e7ec" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                  <YAxis dataKey="vehicle" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#000' }} width={95} />
                  <Tooltip
                    cursor={{ fill: 'rgba(30, 41, 59, 0.06)' }}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e4e7ec', color: '#000', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', fontSize: '12px' }}
                    formatter={(value: any, name: any) => {
                      if (name === 'Night Minutes') return [`${formatDuration(value as number)}`, name];
                      return [value, name];
                    }}
                  />
                  <Bar dataKey="nightMinutes" name="Night Minutes" fill="url(#nightDrivingGradient)" radius={[0, 6, 6, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom: Detail table with time intervals */}
          <div className="dash-card overflow-hidden">
            <div style={{ padding: 'var(--space-md) var(--space-lg)', borderBottom: '1px solid var(--border-card)' }}>
              <h3 style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Night Driving Detail ({list.reduce((s, v) => s + v.nightDriveCount, 0)} trips across {list.length} vehicles)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Night Trips</th>
                    <th>Total Night Duration</th>
                    <th>Time Intervals</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item, idx) => (
                    <tr key={`${item.vehicle}-${idx}`}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.vehicle}</td>
                      <td style={{ fontSize: '0.85rem' }}>{item.nightDriveCount}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {formatDuration(item.totalNightMinutes)}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          {item.drives.map((d, dIdx) => (
                            <span key={dIdx}>
                              {d.dtStart} → {d.dtEnd} ({formatDuration(d.overlapMinutes)})
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

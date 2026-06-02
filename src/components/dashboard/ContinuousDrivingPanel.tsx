import type { FleetData } from "../../types/fleet";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

interface ContinuousDrivingPanelProps {
  data: FleetData;
}

export function ContinuousDrivingPanel({ data }: ContinuousDrivingPanelProps) {
  const list = data.continuousDrivingList || [];

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const remaining = mins % 60;
    return hours === 0 ? `${remaining}m` : `${hours}h ${remaining}m`;
  };

  // Chart data: aggregate by vehicle (sum route_length per vehicle)
  const chartMap = new Map<string, { vehicle: string; routeLength: number; durationMinutes: number }>();
  list.forEach(item => {
    if (chartMap.has(item.vehicle)) {
      const existing = chartMap.get(item.vehicle)!;
      existing.routeLength += item.routeLength;
      existing.durationMinutes += item.durationMinutes;
    } else {
      chartMap.set(item.vehicle, {
        vehicle: item.vehicle,
        routeLength: Math.round(item.routeLength * 100) / 100,
        durationMinutes: item.durationMinutes,
      });
    }
  });
  const chartData = Array.from(chartMap.values())
    .sort((a, b) => b.routeLength - a.routeLength)
    .slice(0, 10);

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="section-title"><span>Continuous Driving (&gt; 2 Hours)</span></div>

      {list.length === 0 ? (
        <div className="dash-card" style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>No continuous driving incidents detected (threshold: 2 hours).</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'var(--space-md)' }}>
          {/* Left: Bar Chart */}
          <div className="dash-card" style={{ padding: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
              Route Length by Vehicle (km)
            </h3>
            <div style={{ height: '320px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={chartData} margin={{ top: 8, right: 60, left: 8, bottom: 0 }}>
                  <defs>
                    <linearGradient id="contDrivingGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#8ad424" stopOpacity={0.7} />
                      <stop offset="100%" stopColor="#8ad424" stopOpacity={0.95} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4e7ec" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(value) => `${value} km`} />
                  <YAxis dataKey="vehicle" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#000' }} width={95} />
                  <Tooltip
                    cursor={{ fill: 'rgba(138, 212, 36, 0.06)' }}
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e4e7ec', color: '#000', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', fontSize: '12px' }}
                    formatter={(value: any) => [value, 'Length']}
                  />
                  <Bar dataKey="routeLength" name="Route Length" fill="url(#contDrivingGradient)" radius={[0, 6, 6, 0]} barSize={20}>
                    <LabelList dataKey="routeLength" position="right" style={{ fill: '#4b5563', fontSize: 10, fontWeight: 600 }} formatter={(val: any) => `${val} km`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right: Detail Table */}
          <div className="dash-card overflow-hidden">
            <div style={{ padding: 'var(--space-md) var(--space-lg)', borderBottom: '1px solid var(--border-card)' }}>
              <h3 style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Continuous Driving Log ({list.length} {list.length === 1 ? 'trip' : 'trips'})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Duration</th>
                    <th>Route Length</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item, idx) => (
                    <tr key={`${item.vehicle}-${idx}`}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.vehicle}</td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          {item.duration} ({formatDuration(item.durationMinutes)})
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {item.routeLength.toFixed(2)} km
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import type { FleetData } from "../../types/fleet";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

interface NightDrivingPanelProps {
  data: FleetData;
}

export function NightDrivingPanel({ data }: NightDrivingPanelProps) {
  const list = data.nightDrivingList || [];

  const formatDurationHours = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const remaining = mins % 60;
    return hours === 0 ? `${remaining}m` : `${hours}h ${remaining}m`;
  };

  const formatDurationMinutes = (mins: number) => `${Math.round(mins)} min`;

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
        <div className="dash-card" style={{ padding: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
            Night Driving Duration by Vehicle
          </h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={chartData} margin={{ top: 8, right: 72, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="nightDrivingGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#1e293b" stopOpacity={0.65} />
                    <stop offset="100%" stopColor="#1e293b" stopOpacity={0.95} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4e7ec" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={(value) => formatDurationHours(value)} />
                <YAxis dataKey="vehicle" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#000' }} width={95} />
                <Tooltip
                  cursor={{ fill: 'rgba(30, 41, 59, 0.06)' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e4e7ec', color: '#000', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', fontSize: '12px' }}
                  formatter={(value: any) => [formatDurationMinutes(Number(value)), 'Duration']}
                />
                <Bar dataKey="nightMinutes" name="Duration" fill="url(#nightDrivingGradient)" radius={[0, 6, 6, 0]} barSize={20}>
                  <LabelList dataKey="nightMinutes" position="right" style={{ fill: '#4b5563', fontSize: 10, fontWeight: 600 }} formatter={(val: any) => formatDurationHours(Number(val))} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

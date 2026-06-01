import type { FleetData } from "../../types/fleet";
import { Route, Timer } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ProhibitedPanelProps {
  data: FleetData;
}

export function ProhibitedPanel({ data }: ProhibitedPanelProps) {
  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const remaining = mins % 60;
    return hours === 0 ? `${remaining}m` : `${hours}h ${remaining}m`;
  };

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="section-title"><span>Prohibited Driving</span></div>
      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 'var(--space-md)' }}>
        {/* Left: Chart */}
        <div className="lg:col-span-2 dash-card" style={{ padding: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>Prohibited Driving Duration by Vehicle (Minutes)</h3>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data.prohibitedData} margin={{ top: 8, right: 24, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="prohibitedGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8ad424" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="#8ad424" stopOpacity={0.95} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4e7ec" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <YAxis dataKey="vehicle" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#000' }} width={85} />
                <Tooltip cursor={{ fill: 'rgba(138, 212, 36, 0.06)' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e4e7ec', color: '#000', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', fontSize: '12px' }}
                  itemStyle={{ color: '#8ad424' }} />
                <Bar dataKey="duration" name="Minutes" fill="url(#prohibitedGradient)" radius={[0, 6, 6, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Right: Metric cards */}
        <div className="flex flex-col" style={{ gap: 'var(--space-md)' }}>
          <div className="metric-card flex-1" style={{ borderLeft: '3px solid var(--primary)' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="metric-label">Longest Prohibited Distance</p>
                <p className="metric-value">
                  {data.worstProhibitedDistance}<span style={{ fontSize: '0.8rem', fontWeight: 600, marginLeft: '4px', color: 'var(--text-muted)' }}>km</span>
                </p>
                <p className="metric-sub">Vehicle: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{data.worstProhibitedDistanceVehicle}</span></p>
              </div>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--primary-light)' }}>
                <Route style={{ width: '18px', height: '18px', color: 'var(--primary)' }} />
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <div className="score-bar-track">
                <div className="score-bar-fill" style={{ width: '100%' }} />
              </div>
            </div>
          </div>
          <div className="metric-card flex-1" style={{ borderLeft: '3px solid var(--primary)' }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="metric-label">Longest Prohibited Duration</p>
                <p className="metric-value">{formatDuration(data.worstProhibitedDuration)}</p>
                <p className="metric-sub"><span style={{ color: 'var(--text-muted)' }}>{data.worstProhibitedDuration} minutes total</span></p>
                <p className="metric-sub">Vehicle: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{data.worstProhibitedVehicle}</span></p>
              </div>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--primary-light)' }}>
                <Timer style={{ width: '18px', height: '18px', color: 'var(--primary)' }} />
              </div>
            </div>
            <div style={{ marginTop: '12px' }}>
              <div className="score-bar-track">
                <div className="score-bar-fill" style={{ width: `${Math.min((data.worstProhibitedDuration / 600) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

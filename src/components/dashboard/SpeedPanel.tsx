import type { FleetData } from "../../types/fleet";
import { Zap, TrendingUp, ShieldAlert } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SpeedPanelProps {
  data: FleetData;
}

export function SpeedPanel({ data }: SpeedPanelProps) {
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
      <div className="section-title"><span>Speed Monitoring</span></div>
      
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <div className="metric-card" style={{ borderLeft: '3px solid var(--primary)' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="metric-label">Highest Top Speed</p>
              <p className="metric-value">
                {data.maxSpeed}<span style={{ fontSize: '0.8rem', fontWeight: 600, marginLeft: '4px', color: 'var(--text-muted)' }}>km/h</span>
              </p>
              <p className="metric-sub">Vehicle: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{data.maxSpeedVehicle}</span></p>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--primary-light)' }}>
              <Zap style={{ width: '18px', height: '18px', color: 'var(--primary)' }} />
            </div>
          </div>
        </div>
        <div className="metric-card" style={{ borderLeft: '3px solid var(--primary)' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="metric-label">Most Overspeed Events</p>
              <p className="metric-value">
                {data.topViolatorEvents}<span style={{ fontSize: '0.8rem', fontWeight: 600, marginLeft: '4px', color: 'var(--text-muted)' }}>events</span>
              </p>
              <p className="metric-sub">Vehicle: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{data.topViolator}</span></p>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--primary-light)' }}>
              <TrendingUp style={{ width: '18px', height: '18px', color: 'var(--primary)' }} />
            </div>
          </div>
        </div>
        <div className="metric-card" style={{ borderLeft: '3px solid var(--primary)' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="metric-label">Speed Limit Threshold</p>
              <p className="metric-value">
                {data.speedLimit}<span style={{ fontSize: '0.8rem', fontWeight: 600, marginLeft: '4px', color: 'var(--text-muted)' }}>km/h</span>
              </p>
              <p className="metric-sub">Company policy benchmark</p>
            </div>
            <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--primary-light)' }}>
              <ShieldAlert style={{ width: '18px', height: '18px', color: 'var(--primary)' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'var(--space-md)' }}>
        
        {/* Left Chart: Max Speed */}
        <div className="dash-card" style={{ padding: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>Max Speed Recorded by Vehicle</h3>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.speedAnalysisData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="maxSpeedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00bdff" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#00bdff" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e7ec" />
                <XAxis dataKey="vehicle" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dx={-6} />
                <Tooltip cursor={{ fill: 'rgba(0, 189, 255, 0.06)' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e4e7ec', color: '#000', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', fontSize: '12px' }}
                  itemStyle={{ color: '#00bdff' }} />
                <Bar dataKey="maxSpeed" name="Max Speed (km/h)" fill="url(#maxSpeedGradient)" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Chart: Overspeed Count */}
        <div className="dash-card" style={{ padding: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>Overspeed Counts ({'>'}110 km/h)</h3>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.speedAnalysisData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="speedCountGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e7ec" />
                <XAxis dataKey="vehicle" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dx={-6} />
                <Tooltip cursor={{ fill: 'rgba(244, 63, 94, 0.06)' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e4e7ec', color: '#000', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', fontSize: '12px' }}
                  itemStyle={{ color: '#f43f5e' }} />
                <Bar dataKey="overspeedCount" name="Events > 110 km/h" fill="url(#speedCountGradient)" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}

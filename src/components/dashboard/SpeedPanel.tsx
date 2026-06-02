import type { FleetData } from "../../types/fleet";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

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
              <p className="metric-label">Highest Speed Recorded</p>
              <p className="metric-value">
                {data.maxSpeed}<span style={{ fontSize: '0.8rem', fontWeight: 600, marginLeft: '4px', color: 'var(--text-muted)' }}>km/h</span>
              </p>
              <p className="metric-sub">Vehicle: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{data.maxSpeedVehicle}</span></p>
            </div>
          </div>
        </div>
        <div className="metric-card" style={{ borderLeft: '3px solid var(--primary)' }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="metric-label">Total Events Count</p>
              <p className="metric-value">
                {data.totalEventsCount}<span style={{ fontSize: '0.8rem', fontWeight: 600, marginLeft: '4px', color: 'var(--text-muted)' }}>events</span>
              </p>
              <p className="metric-sub">Across all vehicles</p>
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
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        
        {/* Left Chart: Max Speed */}
        <div className="dash-card" style={{ padding: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>Max Speed Recorded by Vehicle</h3>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.speedAnalysisData} margin={{ top: 16, right: 8, left: 16, bottom: 0 }}>
                <defs>
                  <linearGradient id="maxSpeedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#89D329" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#89D329" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e7ec" />
                <XAxis dataKey="vehicle" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dx={-6} tickFormatter={(value) => `${value} km/h`} />
                <Tooltip cursor={{ fill: 'rgba(137, 211, 41, 0.06)' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e4e7ec', color: '#000', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', fontSize: '12px' }}
                  formatter={(value: any) => [value, 'Speed']} />
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
              <BarChart data={data.speedAnalysisData} margin={{ top: 16, right: 8, left: 16, bottom: 0 }}>
                <defs>
                  <linearGradient id="speedCountGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00BCFF" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#00BCFF" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e7ec" />
                <XAxis dataKey="vehicle" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dx={-6} tickFormatter={(value) => `${value} times`} />
                <Tooltip cursor={{ fill: 'rgba(0, 188, 255, 0.06)' }}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e4e7ec', color: '#000', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', fontSize: '12px' }}
                  formatter={(value: any) => [value, 'Count']} />
                <Bar dataKey="overspeedCount" name="Events > 110 km/h" fill="url(#speedCountGradient)" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="dash-card" style={{ padding: 'var(--space-lg)' }}>
        <h3 style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>Comparison: Max Speed vs Overspeed Count</h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
          Green bars represent the maximum speed recorded in <strong>km/h</strong>. Blue bars represent the number of <strong>times</strong> (events) where the vehicle exceeded the 110 km/h limit.
        </p>
        <div style={{ height: '320px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.speedAnalysisData} margin={{ top: 20, right: 32, left: 16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e7ec" />
              <XAxis dataKey="vehicle" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dy={8} />
              <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dx={-6} tickFormatter={(value) => `${value} km/h`} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dx={6} tickFormatter={(value) => `${value} times`} />
              
              <Tooltip 
                cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }}
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e4e7ec', color: '#000', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', fontSize: '12px' }}
                formatter={(value: any, name: any) => [value, name]}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              
              <Bar yAxisId="left" dataKey="maxSpeed" name="Max Speed" fill="#89D329" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar yAxisId="right" dataKey="overspeedCount" name="Overspeed Count" fill="#00BCFF" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

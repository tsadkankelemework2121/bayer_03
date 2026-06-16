import { useState } from "react";
import type { FleetData } from "../../types/fleet";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

interface ContinuousDrivingPanelProps {
  data: FleetData;
}

export function ContinuousDrivingPanel({ data }: ContinuousDrivingPanelProps) {
  const list = data.continuousDrivingList || [];
  const [expandedVehicles, setExpandedVehicles] = useState<Record<string, boolean>>({});

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const remaining = mins % 60;
    return hours === 0 ? `${remaining}m` : `${hours}h ${remaining}m`;
  };

  const toggleVehicle = (vehicle: string) => {
    setExpandedVehicles(prev => ({
      ...prev,
      [vehicle]: !prev[vehicle]
    }));
  };

  // Chart data: aggregate top 10 vehicles by totalRouteLength
  const chartData = [...list]
    .sort((a, b) => b.totalRouteLength - a.totalRouteLength)
    .map(item => ({
      vehicle: item.vehicle,
      routeLength: Math.round(item.totalRouteLength * 100) / 100,
      durationMinutes: item.totalDurationMinutes,
    }))
    .slice(0, 10);

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="section-title"><span>Continuous Driving (&gt; 2 Hours &amp; &gt; 50 km)</span></div>

      {list.length === 0 ? (
        <div className="dash-card" style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>No continuous driving incidents detected (threshold: 2 hours &amp; 50 km).</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'var(--space-md)' }}>
          {/* Left: Bar Chart */}
          <div className="dash-card" style={{ padding: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
              Distance covered
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
                Continuous Driving Log
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
                  {list.flatMap((item, idx) => {
                    const isExpanded = !!expandedVehicles[item.vehicle];
                    return [
                      <tr
                        key={`${item.vehicle}-parent-${idx}`}
                        onClick={() => toggleVehicle(item.vehicle)}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                        className={isExpanded ? 'bg-[var(--primary-light)]' : ''}
                      >
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 'var(--space-xs)',
                            userSelect: 'none'
                          }}>
                            <span style={{
                              display: 'inline-block',
                              width: '12px',
                              textAlign: 'center',
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              transition: 'transform 0.15s ease',
                              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                              marginRight: '4px'
                            }}>
                              ▶
                            </span>
                            {item.vehicle}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {formatDuration(item.totalDurationMinutes)} ({item.driveCount} drive{item.driveCount > 1 ? 's' : ''})
                          </span>
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {item.totalRouteLength.toFixed(2)} km
                          </span>
                        </td>
                      </tr>,
                      isExpanded && (
                        <tr key={`${item.vehicle}-child-${idx}`} style={{ background: 'var(--bg-page)' }}>
                          <td colSpan={3} style={{ padding: 'var(--space-md) var(--space-lg)' }}>
                            <div style={{
                              paddingLeft: 'var(--space-md)',
                              borderLeft: '3px solid var(--primary)',
                              animation: 'fadeIn 0.25s ease-out both'
                            }}>
                              <h4 style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                color: 'var(--text-muted)',
                                marginBottom: 'var(--space-sm)'
                              }}>
                                Detailed Continuous Drives
                              </h4>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                                <thead>
                                  <tr style={{ borderBottom: '1px solid var(--border-card)' }}>
                                    <th style={{ textAlign: 'left', padding: '6px 0', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem' }}>Drive</th>
                                    <th style={{ textAlign: 'left', padding: '6px 0', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem' }}>Duration</th>
                                    <th style={{ textAlign: 'right', padding: '6px 0', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem' }}>Distance</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.drives.map((drive, dIdx) => (
                                    <tr key={dIdx} style={{ borderBottom: dIdx < item.drives.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                                      <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>
                                        Drive #{dIdx + 1}
                                      </td>
                                      <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>
                                        {drive.duration} ({formatDuration(drive.durationMinutes)})
                                      </td>
                                      <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>
                                        {drive.routeLength.toFixed(2)} km
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </td>
                        </tr>
                      )
                    ];
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

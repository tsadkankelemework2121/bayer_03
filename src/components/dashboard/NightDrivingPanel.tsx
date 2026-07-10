import { useState } from "react";
import type { FleetData } from "../../types/fleet";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";

interface NightDrivingPanelProps {
  data: FleetData;
}

export function NightDrivingPanel({ data }: NightDrivingPanelProps) {
  const list = data.nightDrivingList || [];
  const [expandedVehicles, setExpandedVehicles] = useState<Record<string, boolean>>({});

  const formatDurationHours = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const remaining = mins % 60;
    return hours === 0 ? `${remaining}m` : `${hours}h ${remaining}m`;
  };

  const formatDurationMinutes = (mins: number) => `${Math.round(mins)} min`;

  const toggleVehicle = (vehicle: string) => {
    setExpandedVehicles(prev => ({
      ...prev,
      [vehicle]: !prev[vehicle]
    }));
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
      <div className="section-title"><span>Night Driving (22:00 – 04:00)</span></div>

      {list.length === 0 ? (
        <div className="dash-card" style={{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>No night driving incidents detected.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: 'var(--space-md)' }}>
          {/* Left: Bar Chart */}
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

          {/* Right: Detail Table */}
          <div className="dash-card overflow-hidden">
            <div style={{ padding: 'var(--space-md) var(--space-lg)', borderBottom: '1px solid var(--border-card)' }}>
              <h3 style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Night Driving Log
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Vehicle</th>
                    <th>Driver</th>
                    <th>Night Duration</th>
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
                        <td style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>
                          {item.driver}
                        </td>
                        <td>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                            {formatDurationHours(item.totalNightMinutes)} ({item.nightDriveCount} drive{item.nightDriveCount > 1 ? 's' : ''})
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
                                Detailed Night Drives
                              </h4>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                                <thead>
                                  <tr style={{ borderBottom: '1px solid var(--border-card)' }}>
                                    <th style={{ textAlign: 'left', padding: '6px 0', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem' }}>Trip</th>
                                    <th style={{ textAlign: 'left', padding: '6px 0', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem' }}>Night Interval</th>
                                    <th style={{ textAlign: 'right', padding: '6px 0', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem' }}>Overlap Duration</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {item.drives.map((drive, dIdx) => (
                                    <tr key={dIdx} style={{ borderBottom: dIdx < item.drives.length - 1 ? '1px solid var(--divider)' : 'none' }}>
                                      <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>
                                        Trip #{dIdx + 1}
                                      </td>
                                      <td style={{ padding: '8px 0', color: 'var(--text-secondary)' }}>
                                        {drive.dtStart.substring(11, 16)} - {drive.dtEnd.substring(11, 16)} ({drive.dtStart.substring(5, 10)})
                                      </td>
                                      <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)' }}>
                                        {formatDurationHours(drive.overlapMinutes)}
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

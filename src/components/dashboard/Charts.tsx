import type { FleetData } from "../../types/fleet";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
} from "recharts";

interface ChartsProps {
  data: FleetData;
}

export function Charts({ data }: ChartsProps) {
  const total = data.complianceData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.35s' }}>
      <div className="section-title"><span>Fleet Compliance Breakdown</span></div>
      <div className="dash-card" style={{ padding: 'var(--space-lg)' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 items-center" style={{ gap: 'var(--space-xl)' }}>
          <div style={{ height: '260px', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.complianceData} cx="50%" cy="50%" innerRadius={72} outerRadius={105} paddingAngle={3} dataKey="value" stroke="none" animationBegin={300} animationDuration={1200}>
                  {data.complianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e4e7ec', color: '#000', boxShadow: '0 4px 16px rgba(0,0,0,0.06)', fontSize: '12px' }}
                  formatter={(value: any) => [`${value}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{total}%</p>
                <p style={{ fontSize: '0.7rem', fontWeight: 500, color: 'var(--text-muted)' }}>Total</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
            {data.complianceData.map((item, index) => {
              const vehicleCount = Math.round((item.value / 100) * data.totalVehicles);
              return (
                <div key={index} className="flex items-center" style={{ gap: 'var(--space-md)' }}>
                  <div
                    className="shrink-0"
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: item.color,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</span>
                      <div className="flex items-baseline" style={{ gap: '6px' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: item.color }}>{item.value}%</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>({vehicleCount})</span>
                      </div>
                    </div>
                    <div className="score-bar-track">
                      <div className="score-bar-fill" style={{ width: `${item.value}%`, background: item.color, transition: 'width 1.2s ease-out' }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

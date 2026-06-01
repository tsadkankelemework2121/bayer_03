import { Car, Gauge, ShieldCheck, AlertTriangle, Moon, Zap } from "lucide-react";
import type { FleetData } from "../../types/fleet";

interface KPIGridProps {
  data: FleetData;
}

function ProgressRing({ percent, size = 48 }: { percent: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={radius} className="progress-ring-circle-bg" />
      <circle cx={size / 2} cy={size / 2} r={radius} className="progress-ring-circle"
        style={{ stroke: 'var(--primary)', strokeDasharray: `${circumference}`, strokeDashoffset: offset }} />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: '0.65rem', fontWeight: 800, fill: 'var(--text-primary)' }}>{percent}%</text>
    </svg>
  );
}

export function KPIGrid({ data }: KPIGridProps) {
  const kpis = [
    { title: "Total Fleet", value: data.totalVehicles, suffix: "vehicles", icon: Car },
    { title: "Overspeeding", value: data.overspeedingVehicles, suffix: "vehicles", icon: Gauge },
    { title: "Night Driving", value: data.nightDrivingVehicles, suffix: "vehicles", icon: Moon },
    { title: "Continuous Driving", value: data.continuousDrivingVehicles, suffix: "vehicles", icon: Zap },
    { title: "Geofence Violations", value: data.prohibitedDrivingVehicles, suffix: "vehicles", icon: AlertTriangle },
    { title: "Compliance Rate", value: data.compliantPercent, isPercent: true, icon: ShieldCheck },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 stagger-children" style={{ gap: 'var(--space-md)' }}>
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div
            key={index}
            className="dash-card"
            style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}
          >
            <div className="flex items-center justify-between">
              <div
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'var(--primary-light)',
                }}
              >
                <Icon style={{ width: '18px', height: '18px', color: 'var(--primary)' }} />
              </div>
              {kpi.isPercent && <ProgressRing percent={kpi.value} />}
            </div>
            <div>
              <p className="metric-label">{kpi.title}</p>
              <div className="flex items-baseline" style={{ gap: '6px' }}>
                <span className="metric-value">{kpi.value}</span>
                {kpi.isPercent
                  ? <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>%</span>
                  : <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-muted)' }}>{kpi.suffix}</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

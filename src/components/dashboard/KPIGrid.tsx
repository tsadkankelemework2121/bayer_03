import type { FleetData } from "../../types/fleet";

interface KPIGridProps {
  data: FleetData;
}

export function KPIGrid({ data }: KPIGridProps) {
  const kpis = [
    { title: "Total Fleet", value: data.totalVehicles, suffix: "vehicles" },
    { title: "Overspeeding", value: data.overspeedingVehicles, suffix: "vehicles" },
    { title: "Night Driving", value: data.nightDrivingVehicles, suffix: "vehicles" },
    { title: "Continuous Driving", value: data.continuousDrivingVehicles, suffix: "vehicles" },
    { title: "Geofence Violations", value: data.prohibitedDrivingVehicles, suffix: "vehicles" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 stagger-children" style={{ gap: 'var(--space-md)' }}>
      {kpis.map((kpi, index) => {
        return (
          <div
            key={index}
            className="dash-card"
            style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}
          >
            <div>
              <p className="metric-label">{kpi.title}</p>
              <div className="flex items-baseline" style={{ gap: '6px', marginTop: '4px' }}>
                <span className="metric-value">{kpi.value}</span>
                <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-muted)' }}>{kpi.suffix}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

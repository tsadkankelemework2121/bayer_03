import type { FleetData } from "../../types/fleet";

interface DistancePanelProps {
  data: FleetData;
}

export function DistancePanel({ data }: DistancePanelProps) {
  const distances = data.distanceData || [];
  
  if (distances.length === 0) return null;
  
  // Find highest distance for percentage calculations
  const maxDistance = Math.max(...distances.map(d => d.distance), 1);
  const totalFleetDistance = distances.reduce((acc, d) => acc + d.distance, 0);
  const avgDistance = Math.round(totalFleetDistance / distances.length);
  const topVehicle = distances[0];
  
  return (
    <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="section-title flex items-center" style={{ gap: '8px' }}>
        <span>Fleet Distance Tracker</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        
        {/* Metric Summaries (Left Panel) */}
        <div className="flex flex-col gap-4 lg:col-span-1">
          {/* Top Performer Card */}
          <div className="dash-card flex-1 flex flex-col justify-between" style={{ padding: 'var(--space-lg)', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(137, 211, 41, 0.1) 0%, rgba(137, 211, 41, 0) 70%)',
              pointerEvents: 'none'
            }} />
            
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-md)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Longest Journey</span>
              </div>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {topVehicle?.distance.toLocaleString()}<span style={{ fontSize: '0.9rem', fontWeight: 600, marginLeft: '4px', color: 'var(--text-muted)' }}>km</span>
              </p>
              <p className="flex items-center" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px', gap: '4px' }}>
                Vehicle Plate: <strong style={{ color: 'var(--primary)' }}>{topVehicle?.vehicle}</strong>
              </p>
            </div>
            
            <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Active distance leader for the current tracking period.
              </span>
            </div>
          </div>

          {/* Average & Fleet Stats */}
          <div className="dash-card flex-1 flex flex-col justify-between" style={{ padding: 'var(--space-lg)', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              right: '-20px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 188, 255, 0.1) 0%, rgba(0, 188, 255, 0) 70%)',
              pointerEvents: 'none'
            }} />
            
            <div>
              <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-md)' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Fleet Distance</span>
              </div>
              <p style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {totalFleetDistance.toLocaleString()}<span style={{ fontSize: '0.9rem', fontWeight: 600, marginLeft: '4px', color: 'var(--text-muted)' }}>km</span>
              </p>
              <p className="flex items-center" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px', gap: '4px' }}>
                Average: <strong style={{ color: 'var(--text-primary)' }}>{avgDistance.toLocaleString()} km</strong> / vehicle
              </p>
            </div>
            
            <div style={{ marginTop: 'var(--space-md)', paddingTop: 'var(--space-md)', borderTop: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Aggregated mileage statistics across all tracked vehicles.
              </span>
            </div>
          </div>
        </div>

        {/* Mileage Leaderboard (Right Panel) */}
        <div className="lg:col-span-2 dash-card" style={{ padding: 'var(--space-lg)' }}>
          <h3 style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
            Distance Covered by Vehicle (km)
          </h3>
          
          <div className="flex flex-col gap-4">
            {distances.slice(0, 7).map((item, index) => {
              const percentage = Math.round((item.distance / maxDistance) * 100);
              
              return (
                <div 
                  key={item.vehicle} 
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg transition-all duration-200"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                  }}
                >
                  {/* Vehicle Identifier & Rank */}
                  <div className="flex items-center gap-3 sm:w-1/4">
                    <span 
                      style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        color: index === 0 ? '#89D329' : index === 1 ? '#00BCFF' : 'var(--text-muted)',
                        minWidth: '18px'
                      }}
                    >
                      #{index + 1}
                    </span>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                      {item.vehicle}
                    </span>
                  </div>

                  {/* Horizontal Mileage Progress Bar */}
                  <div className="flex-1 flex items-center gap-3">
                    <div 
                      className="relative w-full" 
                      style={{ 
                        height: '10px', 
                        backgroundColor: 'rgba(255, 255, 255, 0.06)', 
                        borderRadius: '6px',
                        overflow: 'hidden'
                      }}
                    >
                      <div 
                        className="transition-all duration-1000 ease-out" 
                        style={{ 
                          width: `${percentage}%`, 
                          height: '100%',
                          borderRadius: '6px',
                          background: `linear-gradient(90deg, #00BCFF 0%, #89D329 100%)`,
                        }}
                      />
                    </div>
                    
                    {/* Percentage Indicator */}
                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', width: '32px', textAlign: 'right' }}>
                      {percentage}%
                    </span>
                  </div>

                  {/* Distance Value Badge */}
                  <div className="sm:w-1/4 flex justify-end items-center gap-1.5">
                    <span 
                      style={{ 
                        fontWeight: 700, 
                        fontSize: '0.85rem', 
                        color: 'var(--text-primary)',
                      }}
                    >
                      {item.distance.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                      km
                    </span>
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

import React from 'react';

export function Skeleton({
  width = '100%',
  height = '20px',
  borderRadius = 'var(--radius-sm)',
  className = '',
  style = {}
}) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
      aria-hidden="true"
    />
  );
}

export function OutfitCardSkeleton() {
  return (
    <div className="card-premium" style={{ overflow: 'hidden', padding: 0 }}>
      <Skeleton height="360px" borderRadius="var(--radius-lg) var(--radius-lg) 0 0" />
      <div style={{ padding: '1.25rem' }}>
        <Skeleton width="45%" height="16px" style={{ marginBottom: '0.65rem' }} />
        <Skeleton width="80%" height="22px" style={{ marginBottom: '0.75rem' }} />
        <Skeleton width="95%" height="14px" style={{ marginBottom: '1.25rem' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Skeleton width="30%" height="20px" />
          <Skeleton width="40%" height="38px" borderRadius="var(--radius-md)" />
        </div>
      </div>
    </div>
  );
}

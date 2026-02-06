'use client';

export default function PortfolioSummary({ funds, positions }) {
  if (!Array.isArray(funds) || !funds.length) return null;

  const getCurrentPrice = (f) => {
    if (f.estPricedCoverage > 0.05 && Number.isFinite(Number(f.estGsz))) {
      return Number(f.estGsz);
    }
    if (Number.isFinite(Number(f.gsz))) {
      return Number(f.gsz);
    }
    return Number(f.dwjz);
  };

  const stats = funds.reduce(
    (acc, f) => {
      const pos = positions?.[f.code];
      if (!pos || !pos.shares || pos.shares <= 0) return acc;
      const price = getCurrentPrice(f);
      if (!Number.isFinite(price) || price <= 0) return acc;
      const value = pos.shares * price;
      const cost = pos.costPrice > 0 ? pos.shares * pos.costPrice : 0;
      const todayPct =
        typeof f.estGszzl === 'number' && f.estPricedCoverage > 0.05
          ? f.estGszzl
          : Number(f.gszzl) || 0;
      const todayPnl = value * (todayPct / 100);
      return {
        totalValue: acc.totalValue + value,
        totalCost: acc.totalCost + cost,
        todayPnl: acc.todayPnl + todayPnl,
      };
    },
    { totalValue: 0, totalCost: 0, todayPnl: 0 }
  );

  if (stats.totalValue <= 0) return null;

  const holdYield =
    stats.totalCost > 0 ? (stats.totalValue / stats.totalCost - 1) * 100 : null;
  const holdDir =
    holdYield != null
      ? holdYield > 0
        ? 'up'
        : holdYield < 0
        ? 'down'
        : ''
      : '';
  const todayDir = stats.todayPnl > 0 ? 'up' : stats.todayPnl < 0 ? 'down' : '';

  return (
    <div
      className="glass card"
      style={{
        marginTop: 12,
        marginBottom: 12,
        padding: '12px 16px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          fontSize: 13,
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div style={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
          <div className="muted" style={{ fontSize: 12 }}>
            总资产
          </div>
          <div style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.3 }}>
            {stats.totalValue.toFixed(2)} 元
          </div>
        </div>
        <div style={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
          <div className="muted" style={{ fontSize: 12 }}>
            当日收益
          </div>
          <div
            className={todayDir}
            style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.3 }}
          >
            {stats.todayPnl >= 0 ? '+' : ''}
            {stats.todayPnl.toFixed(2)} 元
          </div>
        </div>
        <div style={{ minWidth: 0, flex: 1, textAlign: 'left' }}>
          <div className="muted" style={{ fontSize: 12 }}>
            持有收益(%)
          </div>
          <div
            className={holdDir}
            style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.3 }}
          >
            {holdYield != null
              ? `${holdYield > 0 ? '+' : ''}${holdYield.toFixed(2)}%`
              : '—'}
          </div>
        </div>
      </div>
    </div>
  );
}



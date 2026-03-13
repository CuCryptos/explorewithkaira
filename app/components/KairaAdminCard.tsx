interface KairaAdminCardProps {
  label: string;
  value: number;
  decimals?: number;
  change?: number | null;
  percentChange?: number | null;
  invertColor?: boolean;
  alert?: boolean;
}

export function KairaAdminCard({
  label,
  value,
  decimals = 0,
  change,
  percentChange,
  invertColor = false,
  alert = false,
}: KairaAdminCardProps) {
  const displayValue = decimals > 0 ? value.toFixed(decimals) : value;

  const isPositive = change !== null && change !== undefined && change > 0;
  const isNegative = change !== null && change !== undefined && change < 0;
  const arrow = isPositive ? '\u2191' : isNegative ? '\u2193' : null;

  const isGood = invertColor ? isNegative : isPositive;
  const isBad = invertColor ? isPositive : isNegative;
  const trendColor = isGood ? 'text-green-600' : isBad ? 'text-red-600' : 'text-mugon-muted';

  return (
    <div
      className={`rounded-[24px] border p-4 shadow-[0_12px_36px_rgba(22,16,10,0.05)] ${
        alert ? 'border-red-400 bg-red-500/10' : 'border-mugon-border bg-mugon-surface'
      }`}
    >
      <p className="text-sm text-mugon-muted">{label}</p>
      <p className="mt-1 font-mugon-heading text-4xl text-mugon-text">{displayValue}</p>
      {arrow && change !== null && change !== undefined && (
        <p className={`mt-1 text-sm ${trendColor}`}>
          <span>{arrow}</span> {Math.abs(change)}{' '}
          {percentChange !== null && percentChange !== undefined && (
            <span>({percentChange > 0 ? '+' : ''}{percentChange.toFixed(1)}%)</span>
          )}
        </p>
      )}
    </div>
  );
}

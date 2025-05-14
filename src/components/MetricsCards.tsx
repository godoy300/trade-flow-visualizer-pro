
import { Card, CardContent } from "@/components/ui/card";
import { useTrade } from "@/context/TradeContext";

const MetricsCards = () => {
  const { metrics } = useTrade();
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value / 100);
  };

  const metricsList = [
    {
      label: "Total Trades",
      value: metrics.totalTrades,
      format: (v: number) => v,
      color: "text-foreground"
    },
    {
      label: "Win Rate",
      value: metrics.winRate,
      format: formatPercentage,
      color: metrics.winRate > 50 ? "text-profit" : "text-loss"
    },
    {
      label: "Avg Win",
      value: metrics.avgWin,
      format: formatPercentage,
      color: "text-profit"
    },
    {
      label: "Avg Loss",
      value: metrics.avgLoss,
      format: formatPercentage,
      color: "text-loss"
    },
    {
      label: "Profit Factor",
      value: metrics.profitFactor,
      format: (v: number) => v.toFixed(2),
      color: metrics.profitFactor > 1 ? "text-profit" : "text-loss"
    },
    {
      label: "Avg Fee Cost",
      value: metrics.avgCost,
      format: formatCurrency,
      color: "text-neutral"
    },
    {
      label: "Total Profit",
      value: metrics.totalProfit,
      format: formatCurrency,
      color: metrics.totalProfit > 0 ? "text-profit" : "text-loss"
    },
    {
      label: "Total Fees",
      value: metrics.totalFees,
      format: formatCurrency,
      color: "text-loss"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metricsList.map((metric, index) => (
        <Card key={index} className="crypto-card">
          <CardContent className="p-4 stat-card">
            <p className="stat-label">{metric.label}</p>
            <p className={`stat-value ${metric.color}`}>
              {metric.format(metric.value)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsCards;


import { useTrade } from "@/context/TradeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, ZAxis } from "recharts";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-chart-tooltip border border-border p-2 rounded-md shadow-md">
        <p className="text-sm font-bold">{data.type} Trade</p>
        <p className="text-xs">Stop: {(data.x).toFixed(2)}%</p>
        <p className="text-xs">Win: {(data.y).toFixed(2)}%</p>
        <p className="text-xs">R/R: {data.riskReward.toFixed(2)}</p>
        <p className="text-xs text-muted-foreground">{data.orderType} Order</p>
      </div>
    );
  }

  return null;
};

const StopWinAnalysis = () => {
  const { filteredTrades } = useTrade();
  
  // Prepare data for scatter plot
  const prepareScatterData = () => {
    return filteredTrades.map(trade => {
      const stopPercentage = trade.stopPercentage * 100;
      const winPercentage = trade.winPercentage * 100;
      const riskReward = Math.abs(winPercentage / stopPercentage);
      
      return {
        x: stopPercentage,
        y: winPercentage,
        riskReward: riskReward,
        type: trade.type,
        orderType: trade.orderType,
        resultType: trade.resultType,
        // Size is proportional to risk/reward ratio (scaled for visualization)
        z: riskReward * 20
      };
    });
  };
  
  const scatterData = prepareScatterData();

  return (
    <Card className="crypto-card h-[400px]">
      <CardHeader className="pb-2">
        <CardTitle>Stop vs. Win Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Stop %" 
              unit="%" 
              domain={[0, 'dataMax']} 
              stroke="#94a3b8"
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Win %" 
              unit="%" 
              domain={['dataMin', 'dataMax']} 
              stroke="#94a3b8"
            />
            <ZAxis type="number" dataKey="z" range={[50, 400]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <ReferenceLine 
              y={0} 
              stroke="#94a3b8" 
              strokeDasharray="3 3" 
              label={{ value: "Breakeven", position: "right", fill: "#94a3b8" }} 
            />
            <ReferenceLine 
              stroke="#94a3b8" 
              strokeDasharray="3 3" 
              segment={[{ x: 0, y: 0 }, { x: 20, y: 20 }]} 
              label={{ value: "1:1 R/R", position: "right", fill: "#94a3b8" }} 
            />
            <Scatter 
              name="LONG/WIN" 
              data={scatterData.filter(d => d.type === "LONG" && d.resultType === "WIN")} 
              fill="#22c55e" 
              shape="circle" 
            />
            <Scatter 
              name="LONG/LOSS" 
              data={scatterData.filter(d => d.type === "LONG" && d.resultType === "LOSS")} 
              fill="#ef4444" 
              shape="circle" 
            />
            <Scatter 
              name="SHORT/WIN" 
              data={scatterData.filter(d => d.type === "SHORT" && d.resultType === "WIN")} 
              fill="#3b82f6" 
              shape="diamond" 
            />
            <Scatter 
              name="SHORT/LOSS" 
              data={scatterData.filter(d => d.type === "SHORT" && d.resultType === "LOSS")} 
              fill="#f97316" 
              shape="diamond" 
            />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StopWinAnalysis;


import { useTrade } from "@/context/TradeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ReturnsDistribution = () => {
  const { filteredTrades } = useTrade();
  
  // Prepare data for histogram
  const prepareHistogramData = () => {
    // Get win percentages
    const returns = filteredTrades.map(trade => trade.winPercentage * 100);
    
    // Define bins for histogram
    const minReturn = Math.floor(Math.min(...returns) / 2) * 2;
    const maxReturn = Math.ceil(Math.max(...returns) / 2) * 2;
    const binSize = 2; // 2% bins
    
    const bins: { range: string; count: number; color: string }[] = [];
    
    for (let i = minReturn; i <= maxReturn; i += binSize) {
      const binMin = i;
      const binMax = i + binSize;
      const count = returns.filter(r => r >= binMin && r < binMax).length;
      
      bins.push({
        range: `${binMin}% to ${binMax}%`,
        count,
        color: binMin >= 0 ? "#22c55e" : "#ef4444" // Green for positive, red for negative
      });
    }
    
    return bins;
  };
  
  const histogramData = prepareHistogramData();

  return (
    <Card className="crypto-card h-[400px]">
      <CardHeader className="pb-2">
        <CardTitle>Returns Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={histogramData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey="range" 
              stroke="#94a3b8" 
              angle={-45} 
              textAnchor="end" 
              height={80} 
              tick={{ fontSize: 12 }}
            />
            <YAxis stroke="#94a3b8" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#0f172a", 
                borderColor: "#334155", 
                borderRadius: "0.375rem" 
              }}
              labelStyle={{ color: "#f8fafc" }}
              itemStyle={{ color: "#f8fafc" }}
            />
            <Bar 
              dataKey="count" 
              fill="fill" 
              name="Trades" 
              isAnimationActive={true}
              animationDuration={1000}
            >
              {histogramData.map((entry, index) => (
                <cells key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ReturnsDistribution;

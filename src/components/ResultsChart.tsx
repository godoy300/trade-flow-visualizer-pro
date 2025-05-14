
import { useTrade } from "@/context/TradeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const ResultsChart = () => {
  const { filteredTrades } = useTrade();
  
  // Calculate count of wins and losses by order type
  const prepareChartData = () => {
    const makerWins = filteredTrades.filter(t => t.orderType === "MAKER" && t.resultType === "WIN").length;
    const makerLosses = filteredTrades.filter(t => t.orderType === "MAKER" && t.resultType === "LOSS").length;
    const takerWins = filteredTrades.filter(t => t.orderType === "TAKER" && t.resultType === "WIN").length;
    const takerLosses = filteredTrades.filter(t => t.orderType === "TAKER" && t.resultType === "LOSS").length;
    
    return [
      { name: "MAKER", Wins: makerWins, Losses: makerLosses },
      { name: "TAKER", Wins: takerWins, Losses: takerLosses }
    ];
  };
  
  const data = prepareChartData();

  return (
    <Card className="crypto-card h-[400px]">
      <CardHeader className="pb-2">
        <CardTitle>Trade Results by Order Type</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
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
            <Legend />
            <Bar dataKey="Wins" fill="#22c55e" />
            <Bar dataKey="Losses" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ResultsChart;

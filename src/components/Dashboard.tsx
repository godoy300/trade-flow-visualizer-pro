
import FilterBar from "./FilterBar";
import MetricsCards from "./MetricsCards";
import ResultsChart from "./ResultsChart";
import ReturnsDistribution from "./ReturnsDistribution";
import StopWinAnalysis from "./StopWinAnalysis";
import TradeTable from "./TradeTable";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6">Trade Analytics Dashboard</h2>
      
      <FilterBar />
      
      <MetricsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ResultsChart />
        <ReturnsDistribution />
      </div>
      
      <StopWinAnalysis />
      
      <TradeTable />
    </div>
  );
};

export default Dashboard;

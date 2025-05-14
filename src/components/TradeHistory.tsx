
import FilterBar from "./FilterBar";
import TradeTable from "./TradeTable";

const TradeHistory = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6">Trade History</h2>
      
      <FilterBar />
      
      <TradeTable />
    </div>
  );
};

export default TradeHistory;

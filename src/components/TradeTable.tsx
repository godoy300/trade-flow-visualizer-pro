
import { useState } from "react";
import { useTrade } from "@/context/TradeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Trade } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import TradeAddDialog from "./trade-table/TradeAddDialog";
import TradesTargetsTab from "./trade-table/TradesTargetsTab";
import SetupAnalysisTab from "./trade-table/SetupAnalysisTab";
import BrokerAnalysisTab from "./trade-table/BrokerAnalysisTab";
import RiskRewardTab from "./trade-table/RiskRewardTab";

const TradeTable = () => {
  const { filteredTrades, setupAnalysis, brokerAnalysis, addTrade } = useTrade();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editedValues, setEditedValues] = useState<Partial<Trade>>({});
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newTrade, setNewTrade] = useState<Partial<Trade>>({
    type: "LONG",
    orderType: "MAKER",
    margin: 100,
    leverage: 5,
    entryPrice: 0,
    exitPrice: 0,
    stopPercentage: 0.05,
    winPercentage: 0,
    resultType: "WIN",
    entryFee: 0,
    exitFee: 0,
    totalCost: 0,
    date: new Date().toISOString().split('T')[0],
    setup: "",
    broker: "",
  });

  const { toast } = useToast();
  
  // Manual pagination
  const paginatedTrades = filteredTrades.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(filteredTrades.length / pageSize);
  
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
    }).format(value);
  };

  const handleEdit = (tradeId: number) => {
    const trade = filteredTrades.find(t => t.id === tradeId);
    if (trade) {
      setIsEditing(tradeId);
      setEditedValues({ ...trade });
    }
  };

  const handleSaveEdit = () => {
    // In a real app, this would save to the backend
    // For now, just show a toast and reset editing state
    toast({
      title: "Trade updated",
      description: `Trade #${isEditing} has been updated successfully.`,
    });
    setIsEditing(null);
    setEditedValues({});
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditedValues({});
  };

  const handleDelete = (tradeId: number) => {
    // In a real app, this would delete from the backend
    // For now, just show a toast
    toast({
      title: "Trade deleted",
      description: `Trade #${tradeId} has been removed.`,
      variant: "destructive",
    });
  };

  const handleAddTrade = () => {
    // Calculate missing fields
    const calculatedTrade = {
      ...newTrade,
      winPercentage: newTrade.type === "LONG" 
        ? ((newTrade.exitPrice || 0) - (newTrade.entryPrice || 0)) / (newTrade.entryPrice || 1) 
        : ((newTrade.entryPrice || 0) - (newTrade.exitPrice || 0)) / (newTrade.entryPrice || 1),
      resultType: newTrade.type === "LONG" 
        ? (newTrade.exitPrice || 0) > (newTrade.entryPrice || 0) ? "WIN" : "LOSS" 
        : (newTrade.exitPrice || 0) < (newTrade.entryPrice || 0) ? "WIN" : "LOSS",
      target1Price: calculateTarget1Price(newTrade),
    };

    // Add the trade
    addTrade(calculatedTrade as Omit<Trade, 'id'>);
    
    // Show success message
    toast({
      title: "Trade added",
      description: "New trade has been added successfully.",
    });

    // Reset form and close dialog
    setIsAddDialogOpen(false);
    setNewTrade({
      type: "LONG",
      orderType: "MAKER",
      margin: 100,
      leverage: 5,
      entryPrice: 0,
      exitPrice: 0,
      stopPercentage: 0.05,
      winPercentage: 0,
      resultType: "WIN",
      entryFee: 0,
      exitFee: 0,
      totalCost: 0,
      date: new Date().toISOString().split('T')[0],
      setup: "",
      broker: "",
    });
  };

  // Calculate Target 1 price based on stop percentage (1:1 risk/reward)
  const calculateTarget1Price = (trade: Partial<Trade>) => {
    if (!trade.entryPrice || !trade.stopPercentage) return undefined;

    if (trade.type === "LONG") {
      const stopDelta = trade.entryPrice * trade.stopPercentage;
      return trade.entryPrice + stopDelta;
    } else {
      const stopDelta = trade.entryPrice * trade.stopPercentage;
      return trade.entryPrice - stopDelta;
    }
  };

  // Calculate position value (margin * leverage)
  const calculatePositionValue = (trade: Trade) => {
    return trade.margin * trade.leverage;
  };

  return (
    <Card className="crypto-card">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>Trade Details</CardTitle>
        <TradeAddDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          newTrade={newTrade}
          setNewTrade={setNewTrade}
          onAddTrade={handleAddTrade}
        />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trades-targets">
          <TabsList className="mb-4">
            <TabsTrigger value="trades-targets">Trades & Targets</TabsTrigger>
            <TabsTrigger value="setups">Setup Analysis</TabsTrigger>
            <TabsTrigger value="brokers">Broker Analysis</TabsTrigger>
            <TabsTrigger value="risk-reward">Risk/Reward Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trades-targets">
            <TradesTargetsTab
              paginatedTrades={paginatedTrades}
              isEditing={isEditing}
              editedValues={editedValues}
              formatCurrency={formatCurrency}
              formatPercentage={formatPercentage}
              calculatePositionValue={calculatePositionValue}
              calculateTarget1Price={calculateTarget1Price}
              handleEdit={handleEdit}
              handleSaveEdit={handleSaveEdit}
              handleCancelEdit={handleCancelEdit}
              handleDelete={handleDelete}
              setEditedValues={setEditedValues}
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          </TabsContent>
          
          <TabsContent value="setups">
            <SetupAnalysisTab setupAnalysis={setupAnalysis} />
          </TabsContent>
          
          <TabsContent value="brokers">
            <BrokerAnalysisTab 
              brokerAnalysis={brokerAnalysis} 
              formatCurrency={formatCurrency} 
            />
          </TabsContent>
          
          <TabsContent value="risk-reward">
            <RiskRewardTab
              paginatedTrades={paginatedTrades}
              formatPercentage={formatPercentage}
              page={page}
              totalPages={totalPages}
              setPage={setPage}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TradeTable;

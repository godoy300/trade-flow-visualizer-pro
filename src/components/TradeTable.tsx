
import { useState } from "react";
import { useTrade } from "@/context/TradeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Pencil, Trash2, Check, X, AlertCircle } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trade } from "@/types";
import { useToast } from "@/components/ui/use-toast";

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
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <PlusCircle className="h-4 w-4 mr-1" /> Add Trade
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Trade</DialogTitle>
              <DialogDescription>
                Enter the details for your new trade. Required fields are marked with an asterisk (*).
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date*</label>
                <Input 
                  type="date" 
                  value={newTrade.date} 
                  onChange={(e) => setNewTrade({...newTrade, date: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type*</label>
                <select 
                  className="w-full p-2 border rounded" 
                  value={newTrade.type} 
                  onChange={(e) => setNewTrade({...newTrade, type: e.target.value as "LONG" | "SHORT"})}
                >
                  <option value="LONG">LONG</option>
                  <option value="SHORT">SHORT</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Order Type*</label>
                <select 
                  className="w-full p-2 border rounded" 
                  value={newTrade.orderType} 
                  onChange={(e) => setNewTrade({...newTrade, orderType: e.target.value as "MAKER" | "TAKER"})}
                >
                  <option value="MAKER">MAKER</option>
                  <option value="TAKER">TAKER</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Setup</label>
                <Input 
                  type="text" 
                  value={newTrade.setup} 
                  onChange={(e) => setNewTrade({...newTrade, setup: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Broker</label>
                <Input 
                  type="text" 
                  value={newTrade.broker} 
                  onChange={(e) => setNewTrade({...newTrade, broker: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Margin*</label>
                <Input 
                  type="number" 
                  value={newTrade.margin} 
                  onChange={(e) => setNewTrade({...newTrade, margin: parseFloat(e.target.value)})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Leverage*</label>
                <Input 
                  type="number" 
                  value={newTrade.leverage} 
                  onChange={(e) => setNewTrade({...newTrade, leverage: parseFloat(e.target.value)})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Entry Price*</label>
                <Input 
                  type="number" 
                  value={newTrade.entryPrice} 
                  onChange={(e) => setNewTrade({...newTrade, entryPrice: parseFloat(e.target.value)})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Exit Price*</label>
                <Input 
                  type="number" 
                  value={newTrade.exitPrice} 
                  onChange={(e) => setNewTrade({...newTrade, exitPrice: parseFloat(e.target.value)})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Stop %*</label>
                <Input 
                  type="number" 
                  value={newTrade.stopPercentage} 
                  onChange={(e) => setNewTrade({...newTrade, stopPercentage: parseFloat(e.target.value)})} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddTrade}>Save Trade</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Actions</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Setup</TableHead>
                    <TableHead>Broker</TableHead>
                    <TableHead>Entry</TableHead>
                    <TableHead>Exit</TableHead>
                    <TableHead>Stop %</TableHead>
                    <TableHead>Result %</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>TP1 (1:1)</TableHead>
                    <TableHead>TP2</TableHead>
                    <TableHead>TP3</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTrades.length > 0 ? (
                    paginatedTrades.map((trade) => {
                      const isEditingRow = isEditing === trade.id;
                      const positionValue = calculatePositionValue(trade);
                      const target1Price = calculateTarget1Price(trade);

                      return (
                        <TableRow key={trade.id}>
                          <TableCell className="w-[120px]">
                            {isEditingRow ? (
                              <div className="flex space-x-1">
                                <Button variant="ghost" size="icon" onClick={handleSaveEdit}>
                                  <Check className="h-4 w-4 text-green-500" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                                  <X className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex space-x-1">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(trade.id)}>
                                  <Pencil className="h-4 w-4 text-blue-500" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(trade.id)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            {isEditingRow ? (
                              <Input 
                                type="date"
                                value={editedValues.date || trade.date}
                                onChange={(e) => setEditedValues({...editedValues, date: e.target.value})}
                                className="w-32"
                              />
                            ) : trade.date}
                          </TableCell>
                          <TableCell className={trade.type === "LONG" ? "text-profit" : "text-loss"}>
                            {isEditingRow ? (
                              <select 
                                value={editedValues.type || trade.type}
                                onChange={(e) => setEditedValues({...editedValues, type: e.target.value as "LONG" | "SHORT"})}
                                className="w-24"
                              >
                                <option value="LONG">LONG</option>
                                <option value="SHORT">SHORT</option>
                              </select>
                            ) : trade.type}
                          </TableCell>
                          <TableCell>
                            {isEditingRow ? (
                              <select 
                                value={editedValues.orderType || trade.orderType}
                                onChange={(e) => setEditedValues({...editedValues, orderType: e.target.value as "MAKER" | "TAKER"})}
                                className="w-24"
                              >
                                <option value="MAKER">MAKER</option>
                                <option value="TAKER">TAKER</option>
                              </select>
                            ) : trade.orderType}
                          </TableCell>
                          <TableCell>
                            {isEditingRow ? (
                              <Input 
                                type="text"
                                value={editedValues.setup || trade.setup || ""}
                                onChange={(e) => setEditedValues({...editedValues, setup: e.target.value})}
                                className="w-32"
                              />
                            ) : trade.setup}
                          </TableCell>
                          <TableCell>
                            {isEditingRow ? (
                              <Input 
                                type="text"
                                value={editedValues.broker || trade.broker || ""}
                                onChange={(e) => setEditedValues({...editedValues, broker: e.target.value})}
                                className="w-32"
                              />
                            ) : trade.broker}
                          </TableCell>
                          <TableCell>
                            {isEditingRow ? (
                              <Input 
                                type="number"
                                value={editedValues.entryPrice || trade.entryPrice}
                                onChange={(e) => setEditedValues({...editedValues, entryPrice: parseFloat(e.target.value)})}
                                className="w-24"
                              />
                            ) : formatCurrency(trade.entryPrice)}
                          </TableCell>
                          <TableCell>
                            {isEditingRow ? (
                              <Input 
                                type="number"
                                value={editedValues.exitPrice || trade.exitPrice}
                                onChange={(e) => setEditedValues({...editedValues, exitPrice: parseFloat(e.target.value)})}
                                className="w-24"
                              />
                            ) : formatCurrency(trade.exitPrice)}
                          </TableCell>
                          <TableCell>
                            {isEditingRow ? (
                              <Input 
                                type="number"
                                value={editedValues.stopPercentage || trade.stopPercentage}
                                onChange={(e) => setEditedValues({...editedValues, stopPercentage: parseFloat(e.target.value)})}
                                className="w-20"
                              />
                            ) : formatPercentage(trade.stopPercentage)}
                          </TableCell>
                          <TableCell 
                            className={`${trade.winPercentage >= 0 ? "text-profit" : "text-loss"}`}
                          >
                            {formatPercentage(trade.winPercentage)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(positionValue)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(target1Price || 0)}
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              placeholder="TP2 price"
                              defaultValue={trade.target2Price}
                              className="w-28"
                              disabled={!isEditingRow}
                              onChange={(e) => isEditingRow && setEditedValues({
                                ...editedValues, 
                                target2Price: parseFloat(e.target.value)
                              })}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              placeholder="TP3 price"
                              defaultValue={trade.target3Price}
                              className="w-28"
                              disabled={!isEditingRow}
                              onChange={(e) => isEditingRow && setEditedValues({
                                ...editedValues, 
                                target3Price: parseFloat(e.target.value)
                              })}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={14} className="text-center py-4">
                        No trades found matching current filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <Button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <Button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="setups">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Setup</TableHead>
                    <TableHead className="text-right">Trades Count</TableHead>
                    <TableHead className="text-right">Win Rate</TableHead>
                    <TableHead className="text-right">Avg Return</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {setupAnalysis.length > 0 ? (
                    setupAnalysis.map((setup, index) => (
                      <TableRow key={index}>
                        <TableCell>{setup.setup}</TableCell>
                        <TableCell className="text-right">{setup.count}</TableCell>
                        <TableCell 
                          className={`text-right ${setup.winRate >= 50 ? "text-profit" : "text-loss"}`}
                        >
                          {setup.winRate.toFixed(2)}%
                        </TableCell>
                        <TableCell 
                          className={`text-right ${setup.avgReturn >= 0 ? "text-profit" : "text-loss"}`}
                        >
                          {setup.avgReturn.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        No setup data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="brokers">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Broker</TableHead>
                    <TableHead className="text-right">Trades Count</TableHead>
                    <TableHead className="text-right">Win Rate</TableHead>
                    <TableHead className="text-right">Avg Fee</TableHead>
                    <TableHead className="text-right">Total Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brokerAnalysis.length > 0 ? (
                    brokerAnalysis.map((broker, index) => (
                      <TableRow key={index}>
                        <TableCell>{broker.broker}</TableCell>
                        <TableCell className="text-right">{broker.count}</TableCell>
                        <TableCell 
                          className={`text-right ${broker.winRate >= 50 ? "text-profit" : "text-loss"}`}
                        >
                          {broker.winRate.toFixed(2)}%
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(broker.avgFee)}</TableCell>
                        <TableCell 
                          className={`text-right ${broker.totalProfit >= 0 ? "text-profit" : "text-loss"}`}
                        >
                          {formatCurrency(broker.totalProfit)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4">
                        No broker data available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="risk-reward">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Setup</TableHead>
                    <TableHead className="text-right">Stop %</TableHead>
                    <TableHead className="text-right">Result %</TableHead>
                    <TableHead className="text-right">Risk/Reward</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Quality</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTrades.length > 0 ? (
                    paginatedTrades.map((trade) => {
                      const riskReward = Math.abs(trade.winPercentage / trade.stopPercentage).toFixed(2);
                      let quality = "Poor";
                      
                      if (trade.winPercentage >= 0) {
                        if (parseFloat(riskReward) >= 3) quality = "Excellent";
                        else if (parseFloat(riskReward) >= 2) quality = "Good";
                        else if (parseFloat(riskReward) >= 1) quality = "Fair";
                      }
                      
                      return (
                        <TableRow key={`risk-${trade.id}`}>
                          <TableCell>{trade.date}</TableCell>
                          <TableCell className={trade.type === "LONG" ? "text-profit" : "text-loss"}>
                            {trade.type}
                          </TableCell>
                          <TableCell>{trade.setup}</TableCell>
                          <TableCell className="text-right">{formatPercentage(trade.stopPercentage)}</TableCell>
                          <TableCell 
                            className={`text-right ${trade.winPercentage >= 0 ? "text-profit" : "text-loss"}`}
                          >
                            {formatPercentage(trade.winPercentage)}
                          </TableCell>
                          <TableCell className="text-right">{riskReward}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              trade.winPercentage >= 0 ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                            }`}>
                              {trade.winPercentage >= 0 ? "WIN" : "LOSS"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              quality === "Excellent" ? "bg-green-500/20 text-green-500" :
                              quality === "Good" ? "bg-blue-500/20 text-blue-500" :
                              quality === "Fair" ? "bg-yellow-500/20 text-yellow-500" :
                              "bg-red-500/20 text-red-500"
                            }`}>
                              {quality}
                            </span>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No trades found matching current filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <Button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <Button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TradeTable;

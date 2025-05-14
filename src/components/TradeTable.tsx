
import { useState } from "react";
import { useTrade } from "@/context/TradeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

const TradeTable = () => {
  const { filteredTrades, setupAnalysis, brokerAnalysis } = useTrade();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  
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

  return (
    <Card className="crypto-card">
      <CardHeader className="pb-2">
        <CardTitle>Trade Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="trades">
          <TabsList className="mb-4">
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="setups">Setup Analysis</TabsTrigger>
            <TabsTrigger value="brokers">Broker Analysis</TabsTrigger>
            <TabsTrigger value="targets">Target Analysis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trades">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Setup</TableHead>
                    <TableHead>Broker</TableHead>
                    <TableHead className="text-right">Margin</TableHead>
                    <TableHead className="text-right">Leverage</TableHead>
                    <TableHead className="text-right">Entry Price</TableHead>
                    <TableHead className="text-right">Exit Price</TableHead>
                    <TableHead className="text-right">Stop %</TableHead>
                    <TableHead className="text-right">Result %</TableHead>
                    <TableHead className="text-right">Fees</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTrades.length > 0 ? (
                    paginatedTrades.map((trade) => (
                      <TableRow key={trade.id}>
                        <TableCell>{trade.date}</TableCell>
                        <TableCell className={trade.type === "LONG" ? "text-profit" : "text-loss"}>
                          {trade.type}
                        </TableCell>
                        <TableCell>{trade.orderType}</TableCell>
                        <TableCell>{trade.setup}</TableCell>
                        <TableCell>{trade.broker}</TableCell>
                        <TableCell className="text-right">{formatCurrency(trade.margin)}</TableCell>
                        <TableCell className="text-right">{trade.leverage}x</TableCell>
                        <TableCell className="text-right">{formatCurrency(trade.entryPrice)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(trade.exitPrice)}</TableCell>
                        <TableCell className="text-right">{formatPercentage(trade.stopPercentage)}</TableCell>
                        <TableCell 
                          className={`text-right ${trade.winPercentage >= 0 ? "text-profit" : "text-loss"}`}
                        >
                          {formatPercentage(trade.winPercentage)}
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(trade.totalCost)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center py-4">
                        No trades found matching current filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-2 py-1 border rounded text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-2 py-1 border rounded text-sm disabled:opacity-50"
                >
                  Next
                </button>
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
          
          <TabsContent value="targets">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Position Value</TableHead>
                    <TableHead>Entry Price</TableHead>
                    <TableHead>Stop %</TableHead>
                    <TableHead>Target 1 (1:1)</TableHead>
                    <TableHead>Value (50%)</TableHead>
                    <TableHead>Target 2</TableHead>
                    <TableHead>Target 3</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTrades.length > 0 ? (
                    paginatedTrades.map((trade) => {
                      const positionValue = trade.margin * trade.leverage;
                      const target1Value = positionValue * 0.5; // 50% of position
                      
                      return (
                        <TableRow key={`target-${trade.id}`}>
                          <TableCell>{trade.date}</TableCell>
                          <TableCell className={trade.type === "LONG" ? "text-profit" : "text-loss"}>
                            {trade.type}
                          </TableCell>
                          <TableCell>{formatCurrency(positionValue)}</TableCell>
                          <TableCell>{formatCurrency(trade.entryPrice)}</TableCell>
                          <TableCell>{formatPercentage(trade.stopPercentage)}</TableCell>
                          <TableCell>
                            {trade.target1Price 
                              ? formatCurrency(trade.target1Price) 
                              : "N/A"}
                          </TableCell>
                          <TableCell>{formatCurrency(target1Value)}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              placeholder="Target 2 price"
                              defaultValue={trade.target2Price}
                              className="w-32"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              placeholder="Target 3 price"
                              defaultValue={trade.target3Price}
                              className="w-32"
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4">
                        No trades found matching current filters
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="px-2 py-1 border rounded text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="px-2 py-1 border rounded text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TradeTable;


import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { MAKER_FEE, TAKER_FEE } from "@/data/mockData";

const TradeCalculator = () => {
  const [tradeType, setTradeType] = useState<"LONG" | "SHORT">("LONG");
  const [orderType, setOrderType] = useState<"MAKER" | "TAKER">("TAKER");
  const [margin, setMargin] = useState<number>(100);
  const [leverage, setLeverage] = useState<number>(10);
  const [entryPrice, setEntryPrice] = useState<number>(40000);
  const [stopPercentage, setStopPercentage] = useState<number>(2);
  const [target1Percentage, setTarget1Percentage] = useState<number>(2); // 1:1 Risk:Reward
  const [target2Percentage, setTarget2Percentage] = useState<number>(4); // 2:1 Risk:Reward
  const [target3Percentage, setTarget3Percentage] = useState<number>(6); // 3:1 Risk:Reward
  
  // Derived values
  const [positionSize, setPositionSize] = useState<number>(0);
  const [stopPrice, setStopPrice] = useState<number>(0);
  const [target1Price, setTarget1Price] = useState<number>(0);
  const [target2Price, setTarget2Price] = useState<number>(0);
  const [target3Price, setTarget3Price] = useState<number>(0);
  const [entryFee, setEntryFee] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [target1Profit, setTarget1Profit] = useState<number>(0);
  const [target2Profit, setTarget2Profit] = useState<number>(0);
  const [target3Profit, setTarget3Profit] = useState<number>(0);
  const [exitFee1, setExitFee1] = useState<number>(0);
  const [exitFee2, setExitFee2] = useState<number>(0);
  const [exitFee3, setExitFee3] = useState<number>(0);
  const [netProfit1, setNetProfit1] = useState<number>(0);
  const [netProfit2, setNetProfit2] = useState<number>(0);
  const [netProfit3, setNetProfit3] = useState<number>(0);
  const [riskRewardRatio1, setRiskRewardRatio1] = useState<number>(0);
  const [riskRewardRatio2, setRiskRewardRatio2] = useState<number>(0);
  const [riskRewardRatio3, setRiskRewardRatio3] = useState<number>(0);
  
  // Update target1Percentage to match stopPercentage (1:1 Risk:Reward)
  useEffect(() => {
    setTarget1Percentage(stopPercentage);
  }, [stopPercentage]);
  
  // Calculate all derivative values when inputs change
  useEffect(() => {
    const calculateValues = () => {
      // Position size
      const posSize = margin * leverage;
      setPositionSize(posSize);
      
      // Fee rates
      const entryFeeRate = orderType === "MAKER" ? MAKER_FEE : TAKER_FEE;
      const entryFeeAmount = posSize * entryFeeRate;
      setEntryFee(entryFeeAmount);
      
      // Stop price
      let stopPrc = 0;
      if (tradeType === "LONG") {
        stopPrc = entryPrice * (1 - stopPercentage / 100);
      } else {
        stopPrc = entryPrice * (1 + stopPercentage / 100);
      }
      setStopPrice(stopPrc);
      
      // Target prices
      let t1Price = 0, t2Price = 0, t3Price = 0;
      if (tradeType === "LONG") {
        t1Price = entryPrice * (1 + target1Percentage / 100);
        t2Price = entryPrice * (1 + target2Percentage / 100);
        t3Price = entryPrice * (1 + target3Percentage / 100);
      } else {
        t1Price = entryPrice * (1 - target1Percentage / 100);
        t2Price = entryPrice * (1 - target2Percentage / 100);
        t3Price = entryPrice * (1 - target3Percentage / 100);
      }
      setTarget1Price(t1Price);
      setTarget2Price(t2Price);
      setTarget3Price(t3Price);
      
      // P/L calculations
      // Stop loss (negative number)
      const sl = -posSize * (stopPercentage / 100);
      setStopLoss(sl);
      
      // Profit at targets (considering partial exits)
      // For target 1, 50% of position exits
      const profitT1 = posSize * (target1Percentage / 100) * 0.5;
      setTarget1Profit(profitT1);
      
      // For target 2, 25% of position exits
      const profitT2 = posSize * (target2Percentage / 100) * 0.25;
      setTarget2Profit(profitT2);
      
      // For target 3, 25% of position exits
      const profitT3 = posSize * (target3Percentage / 100) * 0.25;
      setTarget3Profit(profitT3);
      
      // Exit fees
      const exitFeeRate = orderType === "MAKER" ? MAKER_FEE : TAKER_FEE;
      const ef1 = (posSize * 0.5) * exitFeeRate;
      const ef2 = (posSize * 0.25) * exitFeeRate;
      const ef3 = (posSize * 0.25) * exitFeeRate;
      setExitFee1(ef1);
      setExitFee2(ef2);
      setExitFee3(ef3);
      
      // Net profit after fees
      setNetProfit1(profitT1 - ef1);
      setNetProfit2(profitT2 - ef2);
      setNetProfit3(profitT3 - ef3);
      
      // Risk:Reward ratios
      const risk = Math.abs(sl);
      setRiskRewardRatio1(risk > 0 ? profitT1 / risk : 0);
      setRiskRewardRatio2(risk > 0 ? profitT2 / risk : 0);
      setRiskRewardRatio3(risk > 0 ? profitT3 / risk : 0);
    };
    
    calculateValues();
  }, [
    tradeType, 
    orderType, 
    margin, 
    leverage, 
    entryPrice, 
    stopPercentage, 
    target1Percentage,
    target2Percentage,
    target3Percentage
  ]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6">Trade Calculator</h2>
      
      <Tabs defaultValue="calculator">
        <TabsList className="mb-6">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="risk-reward">Risk/Reward Analysis</TabsTrigger>
          <TabsTrigger value="fees">Fee Breakdown</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calculator">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="crypto-card">
              <CardHeader>
                <CardTitle>Trade Parameters</CardTitle>
                <CardDescription>Set up the parameters for your trade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Trade Type</Label>
                  <RadioGroup
                    value={tradeType}
                    onValueChange={(value) => setTradeType(value as "LONG" | "SHORT")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="LONG" id="long" />
                      <Label htmlFor="long" className="text-profit">LONG</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="SHORT" id="short" />
                      <Label htmlFor="short" className="text-loss">SHORT</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Order Type</Label>
                  <Select value={orderType} onValueChange={(value) => setOrderType(value as "MAKER" | "TAKER")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Order Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MAKER">MAKER ({MAKER_FEE * 100}%)</SelectItem>
                      <SelectItem value="TAKER">TAKER ({TAKER_FEE * 100}%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="margin">Margin (USD)</Label>
                  <Input
                    id="margin"
                    type="number"
                    value={margin}
                    onChange={(e) => setMargin(Number(e.target.value))}
                    min={1}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="leverage">Leverage</Label>
                  <Input
                    id="leverage"
                    type="number"
                    value={leverage}
                    onChange={(e) => setLeverage(Number(e.target.value))}
                    min={1}
                    max={125}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="entryPrice">Entry Price (USD)</Label>
                  <Input
                    id="entryPrice"
                    type="number"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(Number(e.target.value))}
                    min={0.00000001}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stopPercentage">Stop Loss (%)</Label>
                  <Input
                    id="stopPercentage"
                    type="number"
                    value={stopPercentage}
                    onChange={(e) => setStopPercentage(Number(e.target.value))}
                    min={0.01}
                    max={99}
                    step={0.01}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="target2Percentage">Target 2 (%)</Label>
                  <Input
                    id="target2Percentage"
                    type="number"
                    value={target2Percentage}
                    onChange={(e) => setTarget2Percentage(Number(e.target.value))}
                    min={0.01}
                    step={0.01}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="target3Percentage">Target 3 (%)</Label>
                  <Input
                    id="target3Percentage"
                    type="number"
                    value={target3Percentage}
                    onChange={(e) => setTarget3Percentage(Number(e.target.value))}
                    min={0.01}
                    step={0.01}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="crypto-card">
              <CardHeader>
                <CardTitle>Trade Summary</CardTitle>
                <CardDescription>Calculated values based on your parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Position Size</p>
                    <p className="text-lg font-semibold">{formatCurrency(positionSize)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Entry Fee</p>
                    <p className="text-lg font-semibold text-loss">{formatCurrency(entryFee)}</p>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-2">Stop Loss</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="text-base text-loss">{formatCurrency(stopPrice)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Loss Amount</p>
                      <p className="text-base text-loss">{formatCurrency(stopLoss)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-2">Target 1 (1:1) - 50% Exit</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="text-base text-profit">{formatCurrency(target1Price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Profit</p>
                      <p className="text-base text-profit">{formatCurrency(target1Profit)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-2">Target 2 - 25% Exit</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="text-base text-profit">{formatCurrency(target2Price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Profit</p>
                      <p className="text-base text-profit">{formatCurrency(target2Profit)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-2">Target 3 - 25% Exit</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="text-base text-profit">{formatCurrency(target3Price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Profit</p>
                      <p className="text-base text-profit">{formatCurrency(target3Profit)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-2">Trade Statistics</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Risk:Reward 1</p>
                      <p className="text-base">{riskRewardRatio1.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Risk:Reward 2</p>
                      <p className="text-base">{riskRewardRatio2.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Risk:Reward 3</p>
                      <p className="text-base">{riskRewardRatio3.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="risk-reward">
          <Card className="crypto-card">
            <CardHeader>
              <CardTitle>Risk/Reward Analysis</CardTitle>
              <CardDescription>Detailed breakdown of potential outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Scenario</th>
                      <th className="text-right py-2">Risk Amount</th>
                      <th className="text-right py-2">Reward Amount</th>
                      <th className="text-right py-2">Risk:Reward Ratio</th>
                      <th className="text-right py-2">Exit Fee</th>
                      <th className="text-right py-2">Net Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3">Stop Loss Hit</td>
                      <td className="text-right text-loss">{formatCurrency(Math.abs(stopLoss))}</td>
                      <td className="text-right">-</td>
                      <td className="text-right">-</td>
                      <td className="text-right text-loss">~{formatCurrency(entryFee * 0.9)}</td>
                      <td className="text-right text-loss">{formatCurrency(stopLoss - entryFee * 0.9)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Target 1 Hit (50% exit)</td>
                      <td className="text-right text-loss">{formatCurrency(Math.abs(stopLoss))}</td>
                      <td className="text-right text-profit">{formatCurrency(target1Profit)}</td>
                      <td className="text-right">{riskRewardRatio1.toFixed(2)}</td>
                      <td className="text-right text-loss">{formatCurrency(exitFee1)}</td>
                      <td className="text-right text-profit">{formatCurrency(netProfit1)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3">Target 2 Hit (25% exit)</td>
                      <td className="text-right text-loss">{formatCurrency(Math.abs(stopLoss) * 0.5)}</td>
                      <td className="text-right text-profit">{formatCurrency(target2Profit)}</td>
                      <td className="text-right">{(riskRewardRatio2 * 2).toFixed(2)}</td>
                      <td className="text-right text-loss">{formatCurrency(exitFee2)}</td>
                      <td className="text-right text-profit">{formatCurrency(netProfit2)}</td>
                    </tr>
                    <tr>
                      <td className="py-3">Target 3 Hit (25% exit)</td>
                      <td className="text-right text-loss">{formatCurrency(Math.abs(stopLoss) * 0.5)}</td>
                      <td className="text-right text-profit">{formatCurrency(target3Profit)}</td>
                      <td className="text-right">{(riskRewardRatio3 * 2).toFixed(2)}</td>
                      <td className="text-right text-loss">{formatCurrency(exitFee3)}</td>
                      <td className="text-right text-profit">{formatCurrency(netProfit3)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-card rounded-lg border border-border">
                <h3 className="font-medium mb-2">Perfect Scenario (All Targets Hit)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Profit</p>
                    <p className="text-lg font-semibold text-profit">
                      {formatCurrency(target1Profit + target2Profit + target3Profit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Fees</p>
                    <p className="text-lg font-semibold text-loss">
                      {formatCurrency(entryFee + exitFee1 + exitFee2 + exitFee3)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Net Profit</p>
                    <p className="text-lg font-semibold text-profit">
                      {formatCurrency(netProfit1 + netProfit2 + netProfit3 - entryFee)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fees">
          <Card className="crypto-card">
            <CardHeader>
              <CardTitle>Fee Breakdown</CardTitle>
              <CardDescription>Detailed analysis of trading fees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Fee Rates</h3>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">MAKER Fee</td>
                        <td className="text-right">{(MAKER_FEE * 100).toFixed(2)}%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">TAKER Fee</td>
                        <td className="text-right">{(TAKER_FEE * 100).toFixed(2)}%</td>
                      </tr>
                      <tr>
                        <td className="py-2">Current Order Type</td>
                        <td className="text-right font-medium">{orderType} ({orderType === "MAKER" ? (MAKER_FEE * 100).toFixed(2) : (TAKER_FEE * 100).toFixed(2)}%)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Trade Entry</h3>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Position Size</td>
                        <td className="text-right">{formatCurrency(positionSize)}</td>
                      </tr>
                      <tr>
                        <td className="py-2">Entry Fee</td>
                        <td className="text-right text-loss">{formatCurrency(entryFee)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Trade Exit (Target 1 - 50%)</h3>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Exit Position Size</td>
                        <td className="text-right">{formatCurrency(positionSize * 0.5)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Profit (Before Fee)</td>
                        <td className="text-right text-profit">{formatCurrency(target1Profit)}</td>
                      </tr>
                      <tr>
                        <td className="py-2">Exit Fee</td>
                        <td className="text-right text-loss">{formatCurrency(exitFee1)}</td>
                      </tr>
                      <tr className="border-t font-medium">
                        <td className="py-2">Net Profit</td>
                        <td className="text-right text-profit">{formatCurrency(netProfit1)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Trade Exit (Target 2 - 25%)</h3>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Exit Position Size</td>
                        <td className="text-right">{formatCurrency(positionSize * 0.25)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Profit (Before Fee)</td>
                        <td className="text-right text-profit">{formatCurrency(target2Profit)}</td>
                      </tr>
                      <tr>
                        <td className="py-2">Exit Fee</td>
                        <td className="text-right text-loss">{formatCurrency(exitFee2)}</td>
                      </tr>
                      <tr className="border-t font-medium">
                        <td className="py-2">Net Profit</td>
                        <td className="text-right text-profit">{formatCurrency(netProfit2)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Trade Exit (Target 3 - 25%)</h3>
                  <table className="w-full">
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Exit Position Size</td>
                        <td className="text-right">{formatCurrency(positionSize * 0.25)}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Profit (Before Fee)</td>
                        <td className="text-right text-profit">{formatCurrency(target3Profit)}</td>
                      </tr>
                      <tr>
                        <td className="py-2">Exit Fee</td>
                        <td className="text-right text-loss">{formatCurrency(exitFee3)}</td>
                      </tr>
                      <tr className="border-t font-medium">
                        <td className="py-2">Net Profit</td>
                        <td className="text-right text-profit">{formatCurrency(netProfit3)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="p-4 bg-card rounded-lg border border-border">
                  <h3 className="font-medium mb-2">Total Fee Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Fees (All Targets)</p>
                      <p className="text-lg font-semibold text-loss">
                        {formatCurrency(entryFee + exitFee1 + exitFee2 + exitFee3)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Fee % of Position</p>
                      <p className="text-lg font-semibold text-loss">
                        {((entryFee + exitFee1 + exitFee2 + exitFee3) / positionSize * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradeCalculator;

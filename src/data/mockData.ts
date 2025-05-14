
import { Trade, Goal, BrokerAnalysis, SetupAnalysis } from "../types";

export const MAKER_FEE = 0.0002;
export const TAKER_FEE = 0.0006;

export const mockTrades: Trade[] = Array.from({ length: 50 }, (_, i) => {
  const id = i + 1;
  const type = Math.random() > 0.5 ? "LONG" : "SHORT";
  const margin = Math.floor(Math.random() * 500) + 100;
  const leverage = Math.floor(Math.random() * 20) + 1;
  const entryPrice = Math.random() * 40000 + 10000;
  const stopPercentage = (Math.random() * 0.1 + 0.01);
  const stopPrice = type === "LONG" 
    ? entryPrice * (1 - stopPercentage) 
    : entryPrice * (1 + stopPercentage);
  
  const isWin = Math.random() > 0.4;
  const winPercentage = isWin 
    ? Math.random() * 0.2 + 0.01 
    : -stopPercentage;
  
  const exitPrice = type === "LONG"
    ? entryPrice * (1 + winPercentage)
    : entryPrice * (1 - winPercentage);
  
  const orderType = Math.random() > 0.5 ? "MAKER" : "TAKER";
  const fee = orderType === "MAKER" ? MAKER_FEE : TAKER_FEE;
  
  const entryFee = margin * leverage * fee;
  
  const positionValue = margin * leverage;
  const profitLoss = type === "LONG"
    ? positionValue * winPercentage
    : positionValue * winPercentage;

  const exitFee = Math.abs((positionValue + profitLoss) * fee);
  
  const totalCost = entryFee + exitFee;
  
  const resultType = isWin ? "WIN" : "LOSS";
  
  // Generate a date within the last 3 months
  const today = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(today.getMonth() - 3);
  const randomDate = new Date(
    threeMonthsAgo.getTime() + Math.random() * (today.getTime() - threeMonthsAgo.getTime())
  );
  
  const setups = ["Breakout", "Support/Resistance", "Trend Following", "Reversal", "Range Trading"];
  const brokers = ["Binance", "Bybit", "OKX", "Kucoin", "Huobi"];
  
  const target1Price = type === "LONG"
    ? entryPrice * (1 + stopPercentage)
    : entryPrice * (1 - stopPercentage);
    
  const target2Price = type === "LONG"
    ? entryPrice * (1 + stopPercentage * 2)
    : entryPrice * (1 - stopPercentage * 2);
    
  const target3Price = type === "LONG"
    ? entryPrice * (1 + stopPercentage * 3)
    : entryPrice * (1 - stopPercentage * 3);

  return {
    id,
    type,
    margin,
    leverage,
    entryPrice,
    exitPrice,
    orderType,
    stopPrice,
    stopPercentage,
    winPercentage,
    resultType,
    entryFee,
    exitFee,
    totalCost,
    date: randomDate.toISOString().split('T')[0],
    setup: setups[Math.floor(Math.random() * setups.length)],
    broker: brokers[Math.floor(Math.random() * brokers.length)],
    target1Price,
    target2Price,
    target3Price
  };
});

export const mockGoals: Goal[] = [
  {
    id: 1,
    period: "daily",
    incomeTarget: 50,
    accountGrowthTarget: 1,
    currentProgress: 75
  },
  {
    id: 2,
    period: "weekly",
    incomeTarget: 350,
    accountGrowthTarget: 5,
    currentProgress: 60
  },
  {
    id: 3,
    period: "monthly",
    incomeTarget: 1500,
    accountGrowthTarget: 15,
    currentProgress: 45
  },
  {
    id: 4,
    period: "quarterly",
    incomeTarget: 4500,
    accountGrowthTarget: 30,
    currentProgress: 35
  },
  {
    id: 5,
    period: "biannual",
    incomeTarget: 9000,
    accountGrowthTarget: 50,
    currentProgress: 25
  },
  {
    id: 6,
    period: "annual",
    incomeTarget: 18000,
    accountGrowthTarget: 100,
    currentProgress: 20
  }
];

export const calculateMetrics = (trades: Trade[]) => {
  if (trades.length === 0) return {
    totalTrades: 0,
    winRate: 0,
    avgWin: 0,
    avgLoss: 0,
    profitFactor: 0,
    avgCost: 0,
    profitAfterFees: 0,
    totalProfit: 0,
    totalFees: 0
  };

  const totalTrades = trades.length;
  const winningTrades = trades.filter(t => t.resultType === "WIN");
  const losingTrades = trades.filter(t => t.resultType === "LOSS");
  
  const winRate = (winningTrades.length / totalTrades) * 100;
  
  const totalProfit = trades.reduce((sum, trade) => {
    const positionValue = trade.margin * trade.leverage;
    return sum + (positionValue * trade.winPercentage);
  }, 0);
  
  const totalFees = trades.reduce((sum, trade) => sum + trade.totalCost, 0);
  const profitAfterFees = totalProfit - totalFees;
  
  const avgWin = winningTrades.length 
    ? winningTrades.reduce((sum, t) => sum + t.winPercentage, 0) / winningTrades.length * 100
    : 0;
    
  const avgLoss = losingTrades.length 
    ? losingTrades.reduce((sum, t) => sum + t.winPercentage, 0) / losingTrades.length * 100
    : 0;
    
  const grossWins = winningTrades.reduce((sum, t) => {
    const positionValue = t.margin * t.leverage;
    return sum + (positionValue * t.winPercentage);
  }, 0);
  
  const grossLosses = Math.abs(losingTrades.reduce((sum, t) => {
    const positionValue = t.margin * t.leverage;
    return sum + (positionValue * t.winPercentage);
  }, 0));
  
  const profitFactor = grossLosses ? grossWins / grossLosses : grossWins > 0 ? Infinity : 0;
  
  const avgCost = totalFees / totalTrades;
  
  return {
    totalTrades,
    winRate,
    avgWin,
    avgLoss,
    profitFactor,
    avgCost,
    profitAfterFees,
    totalProfit,
    totalFees
  };
};

export const getSetupAnalysis = (trades: Trade[]): SetupAnalysis[] => {
  const setups = new Map<string, { count: number; wins: number; totalReturn: number }>();
  
  trades.forEach(trade => {
    if (!trade.setup) return;
    
    const existing = setups.get(trade.setup) || { count: 0, wins: 0, totalReturn: 0 };
    setups.set(trade.setup, {
      count: existing.count + 1,
      wins: existing.wins + (trade.resultType === "WIN" ? 1 : 0),
      totalReturn: existing.totalReturn + trade.winPercentage
    });
  });
  
  return Array.from(setups.entries()).map(([setup, data]) => ({
    setup,
    count: data.count,
    winRate: (data.wins / data.count) * 100,
    avgReturn: (data.totalReturn / data.count) * 100
  })).sort((a, b) => b.avgReturn - a.avgReturn);
};

export const getBrokerAnalysis = (trades: Trade[]): BrokerAnalysis[] => {
  const brokers = new Map<string, { 
    count: number; 
    wins: number; 
    totalFees: number;
    totalProfit: number;
  }>();
  
  trades.forEach(trade => {
    if (!trade.broker) return;
    
    const existing = brokers.get(trade.broker) || { 
      count: 0, 
      wins: 0, 
      totalFees: 0,
      totalProfit: 0
    };
    
    const positionValue = trade.margin * trade.leverage;
    const profit = positionValue * trade.winPercentage;
    
    brokers.set(trade.broker, {
      count: existing.count + 1,
      wins: existing.wins + (trade.resultType === "WIN" ? 1 : 0),
      totalFees: existing.totalFees + trade.totalCost,
      totalProfit: existing.totalProfit + profit
    });
  });
  
  return Array.from(brokers.entries()).map(([broker, data]) => ({
    broker,
    count: data.count,
    winRate: (data.wins / data.count) * 100,
    avgFee: data.totalFees / data.count,
    totalProfit: data.totalProfit
  })).sort((a, b) => b.totalProfit - a.totalProfit);
};


export interface Trade {
  id: number;
  type: "LONG" | "SHORT";
  margin: number;
  leverage: number;
  entryPrice: number;
  exitPrice: number;
  orderType: "MAKER" | "TAKER";
  stopPrice?: number;
  stopPercentage: number;
  winPercentage: number;
  resultType: "WIN" | "LOSS";
  entryFee: number;
  exitFee: number;
  totalCost: number;
  date: string;
  setup?: string;
  broker?: string;
  target1Price?: number;
  target2Price?: number;
  target3Price?: number;
}

export interface FilterState {
  tradeType: string;
  orderType: string;
  dateRange: [Date | null, Date | null];
  setup: string;
  broker: string;
}

export interface MetricsData {
  totalTrades: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  profitFactor: number;
  avgCost: number;
  profitAfterFees: number;
  totalProfit: number;
  totalFees: number;
}

export interface SetupAnalysis {
  setup: string;
  count: number;
  winRate: number;
  avgReturn: number;
}

export interface BrokerAnalysis {
  broker: string;
  count: number;
  winRate: number;
  avgFee: number;
  totalProfit: number;
}

export interface Goal {
  id: number;
  period: "daily" | "weekly" | "monthly" | "quarterly" | "biannual" | "annual";
  incomeTarget: number;
  accountGrowthTarget: number;
  currentProgress: number; // Percentage of goal achieved
}

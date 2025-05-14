
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { 
  Trade, 
  FilterState, 
  MetricsData, 
  Goal, 
  SetupAnalysis,
  BrokerAnalysis
} from '../types';
import { 
  mockTrades, 
  mockGoals, 
  calculateMetrics, 
  getSetupAnalysis,
  getBrokerAnalysis
} from '../data/mockData';

interface TradeContextProps {
  trades: Trade[];
  filteredTrades: Trade[];
  metrics: MetricsData;
  filters: FilterState;
  goals: Goal[];
  setupAnalysis: SetupAnalysis[];
  brokerAnalysis: BrokerAnalysis[];
  setFilters: (filters: Partial<FilterState>) => void;
  updateGoal: (goalId: number, updates: Partial<Goal>) => void;
  addTrade: (trade: Omit<Trade, 'id'>) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  tradeType: 'all',
  orderType: 'all',
  dateRange: [null, null],
  setup: 'all',
  broker: 'all'
};

export const TradeContext = createContext<TradeContextProps | undefined>(undefined);

export const TradeProvider = ({ children }: { children: ReactNode }) => {
  const [trades, setTrades] = useState<Trade[]>(mockTrades);
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>(mockTrades);
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [metrics, setMetrics] = useState<MetricsData>(calculateMetrics(mockTrades));
  const [setupAnalysis, setSetupAnalysis] = useState<SetupAnalysis[]>(getSetupAnalysis(mockTrades));
  const [brokerAnalysis, setBrokerAnalysis] = useState<BrokerAnalysis[]>(getBrokerAnalysis(mockTrades));

  // Apply filters whenever trades or filters change
  useEffect(() => {
    let result = [...trades];
    
    if (filters.tradeType !== 'all') {
      result = result.filter(trade => trade.type === filters.tradeType);
    }
    
    if (filters.orderType !== 'all') {
      result = result.filter(trade => trade.orderType === filters.orderType);
    }
    
    if (filters.setup !== 'all') {
      result = result.filter(trade => trade.setup === filters.setup);
    }
    
    if (filters.broker !== 'all') {
      result = result.filter(trade => trade.broker === filters.broker);
    }
    
    if (filters.dateRange[0] && filters.dateRange[1]) {
      const startDate = filters.dateRange[0].getTime();
      const endDate = filters.dateRange[1].getTime();
      
      result = result.filter(trade => {
        const tradeDate = new Date(trade.date).getTime();
        return tradeDate >= startDate && tradeDate <= endDate;
      });
    }
    
    setFilteredTrades(result);
    setMetrics(calculateMetrics(result));
    setSetupAnalysis(getSetupAnalysis(result));
    setBrokerAnalysis(getBrokerAnalysis(result));
  }, [trades, filters]);

  const setFilters = (newFilters: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState(defaultFilters);
  };

  const updateGoal = (goalId: number, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, ...updates } : goal
    ));
  };

  const addTrade = (trade: Omit<Trade, 'id'>) => {
    const newTrade: Trade = {
      ...trade,
      id: trades.length + 1
    };
    
    setTrades(prev => [...prev, newTrade]);
  };

  return (
    <TradeContext.Provider value={{
      trades,
      filteredTrades,
      metrics,
      filters,
      goals,
      setupAnalysis,
      brokerAnalysis,
      setFilters,
      updateGoal,
      addTrade,
      resetFilters
    }}>
      {children}
    </TradeContext.Provider>
  );
};

export const useTrade = () => {
  const context = useContext(TradeContext);
  if (context === undefined) {
    throw new Error('useTrade must be used within a TradeProvider');
  }
  return context;
};

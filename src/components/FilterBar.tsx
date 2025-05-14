
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTrade } from "@/context/TradeContext";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

const FilterBar = () => {
  const { filters, setFilters, resetFilters, filteredTrades, trades } = useTrade();
  const [dateOpen, setDateOpen] = useState(false);

  // Get unique setups and brokers
  const setups = Array.from(new Set(trades.map(trade => trade.setup))).filter(Boolean) as string[];
  const brokers = Array.from(new Set(trades.map(trade => trade.broker))).filter(Boolean) as string[];

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6 flex flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-[200px]">
        <Select value={filters.tradeType} onValueChange={value => setFilters({ tradeType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Trade Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="LONG">LONG</SelectItem>
            <SelectItem value="SHORT">SHORT</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1 min-w-[200px]">
        <Select value={filters.orderType} onValueChange={value => setFilters({ orderType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Order Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="MAKER">MAKER</SelectItem>
            <SelectItem value="TAKER">TAKER</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1 min-w-[200px]">
        <Select value={filters.setup} onValueChange={value => setFilters({ setup: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Setup" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Setups</SelectItem>
            {setups.map(setup => (
              <SelectItem key={setup} value={setup}>{setup}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1 min-w-[200px]">
        <Select value={filters.broker} onValueChange={value => setFilters({ broker: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Broker" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brokers</SelectItem>
            {brokers.map(broker => (
              <SelectItem key={broker} value={broker}>{broker}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1 min-w-[230px]">
        <Popover open={dateOpen} onOpenChange={setDateOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.dateRange[0] && filters.dateRange[1] ? (
                <span>
                  {format(filters.dateRange[0], "PP")} - {format(filters.dateRange[1], "PP")}
                </span>
              ) : (
                <span>Date Range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="range"
              selected={{
                from: filters.dateRange[0] || undefined,
                to: filters.dateRange[1] || undefined
              }}
              onSelect={(range) => {
                setFilters({
                  dateRange: [range?.from || null, range?.to || null]
                });
                setDateOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <Button 
        variant="outline" 
        onClick={resetFilters}
        className="min-w-[120px]"
      >
        Reset Filters
      </Button>
      
      <div className="text-muted-foreground text-sm ml-auto">
        Showing {filteredTrades.length} of {trades.length} trades
      </div>
    </div>
  );
};

export default FilterBar;


import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trade } from "@/types";

interface TradeAddDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newTrade: Partial<Trade>;
  setNewTrade: (trade: Partial<Trade>) => void;
  onAddTrade: () => void;
}

const TradeAddDialog = ({
  isOpen,
  onOpenChange,
  newTrade,
  setNewTrade,
  onAddTrade,
}: TradeAddDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onAddTrade}>Save Trade</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TradeAddDialog;

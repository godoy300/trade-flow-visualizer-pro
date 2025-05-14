
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Trade } from "@/types";
import TradeActionButtons from "./TradeActionButtons";

interface TradeRowItemProps {
  trade: Trade;
  isEditing: boolean;
  editedValues: Partial<Trade>;
  formatCurrency: (value: number) => string;
  formatPercentage: (value: number) => string;
  calculatePositionValue: (trade: Trade) => number;
  calculateTarget1Price: (trade: Partial<Trade>) => number | undefined;
  onEdit: (tradeId: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (tradeId: number) => void;
  onEditValueChange: (values: Partial<Trade>) => void;
}

const TradeRowItem = ({
  trade,
  isEditing,
  editedValues,
  formatCurrency,
  formatPercentage,
  calculatePositionValue,
  calculateTarget1Price,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  onEditValueChange,
}: TradeRowItemProps) => {
  const positionValue = calculatePositionValue(trade);
  const target1Price = calculateTarget1Price(trade);

  // For editing values, use editedValues if available, otherwise fall back to trade values
  const currentValues = isEditing ? editedValues : trade;
  
  // Function to update edited values
  const handleInputChange = (field: keyof Trade, value: any) => {
    onEditValueChange({...editedValues, [field]: value});
  };

  return (
    <TableRow className={isEditing ? "bg-muted/20" : ""}>
      <TableCell className="w-[120px]">
        <TradeActionButtons
          isEditing={isEditing}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
          onEdit={() => onEdit(trade.id)}
          onDelete={() => onDelete(trade.id)}
        />
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            type="date"
            value={editedValues.date || trade.date}
            onChange={(e) => handleInputChange('date', e.target.value)}
            className="w-32"
          />
        ) : trade.date}
      </TableCell>
      <TableCell className={trade.type === "LONG" ? "text-profit" : "text-loss"}>
        {isEditing ? (
          <select 
            value={editedValues.type || trade.type}
            onChange={(e) => handleInputChange('type', e.target.value as "LONG" | "SHORT")}
            className="w-24 p-2 border rounded"
          >
            <option value="LONG">LONG</option>
            <option value="SHORT">SHORT</option>
          </select>
        ) : trade.type}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <select 
            value={editedValues.orderType || trade.orderType}
            onChange={(e) => handleInputChange('orderType', e.target.value as "MAKER" | "TAKER")}
            className="w-24 p-2 border rounded"
          >
            <option value="MAKER">MAKER</option>
            <option value="TAKER">TAKER</option>
          </select>
        ) : trade.orderType}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            type="text"
            value={editedValues.setup || trade.setup || ""}
            onChange={(e) => handleInputChange('setup', e.target.value)}
            className="w-32"
          />
        ) : trade.setup}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            type="text"
            value={editedValues.broker || trade.broker || ""}
            onChange={(e) => handleInputChange('broker', e.target.value)}
            className="w-32"
          />
        ) : trade.broker}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            type="number"
            value={editedValues.entryPrice || trade.entryPrice}
            onChange={(e) => handleInputChange('entryPrice', parseFloat(e.target.value))}
            className="w-24"
          />
        ) : formatCurrency(trade.entryPrice)}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            type="number"
            value={editedValues.exitPrice || trade.exitPrice}
            onChange={(e) => handleInputChange('exitPrice', parseFloat(e.target.value))}
            className="w-24"
          />
        ) : formatCurrency(trade.exitPrice)}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            type="number"
            value={editedValues.stopPercentage || trade.stopPercentage}
            onChange={(e) => handleInputChange('stopPercentage', parseFloat(e.target.value))}
            className="w-20"
            step="0.01"
          />
        ) : formatPercentage(trade.stopPercentage)}
      </TableCell>
      <TableCell 
        className={`${trade.winPercentage >= 0 ? "text-profit" : "text-loss"}`}
      >
        {formatPercentage(trade.winPercentage)}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <Input 
              type="number"
              value={editedValues.margin || trade.margin}
              onChange={(e) => handleInputChange('margin', parseFloat(e.target.value))}
              className="w-20"
            />
            <span>×</span>
            <Input 
              type="number"
              value={editedValues.leverage || trade.leverage}
              onChange={(e) => handleInputChange('leverage', parseFloat(e.target.value))}
              className="w-16"
            />
          </div>
        ) : formatCurrency(positionValue)}
      </TableCell>
      <TableCell>
        {formatCurrency(target1Price || 0)}
      </TableCell>
      <TableCell>
        <Input
          type="number"
          placeholder="TP2 price"
          value={isEditing ? editedValues.target2Price || trade.target2Price || '' : trade.target2Price || ''}
          className="w-28"
          disabled={!isEditing}
          onChange={(e) => isEditing && handleInputChange('target2Price', e.target.value ? parseFloat(e.target.value) : undefined)}
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          placeholder="TP3 price"
          value={isEditing ? editedValues.target3Price || trade.target3Price || '' : trade.target3Price || ''}
          className="w-28"
          disabled={!isEditing}
          onChange={(e) => isEditing && handleInputChange('target3Price', e.target.value ? parseFloat(e.target.value) : undefined)}
        />
      </TableCell>
    </TableRow>
  );
};

export default TradeRowItem;

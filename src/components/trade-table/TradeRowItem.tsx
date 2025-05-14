
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

  return (
    <TableRow>
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
            onChange={(e) => onEditValueChange({...editedValues, date: e.target.value})}
            className="w-32"
          />
        ) : trade.date}
      </TableCell>
      <TableCell className={trade.type === "LONG" ? "text-profit" : "text-loss"}>
        {isEditing ? (
          <select 
            value={editedValues.type || trade.type}
            onChange={(e) => onEditValueChange({...editedValues, type: e.target.value as "LONG" | "SHORT"})}
            className="w-24"
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
            onChange={(e) => onEditValueChange({...editedValues, orderType: e.target.value as "MAKER" | "TAKER"})}
            className="w-24"
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
            onChange={(e) => onEditValueChange({...editedValues, setup: e.target.value})}
            className="w-32"
          />
        ) : trade.setup}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            type="text"
            value={editedValues.broker || trade.broker || ""}
            onChange={(e) => onEditValueChange({...editedValues, broker: e.target.value})}
            className="w-32"
          />
        ) : trade.broker}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            type="number"
            value={editedValues.entryPrice || trade.entryPrice}
            onChange={(e) => onEditValueChange({...editedValues, entryPrice: parseFloat(e.target.value)})}
            className="w-24"
          />
        ) : formatCurrency(trade.entryPrice)}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            type="number"
            value={editedValues.exitPrice || trade.exitPrice}
            onChange={(e) => onEditValueChange({...editedValues, exitPrice: parseFloat(e.target.value)})}
            className="w-24"
          />
        ) : formatCurrency(trade.exitPrice)}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Input 
            type="number"
            value={editedValues.stopPercentage || trade.stopPercentage}
            onChange={(e) => onEditValueChange({...editedValues, stopPercentage: parseFloat(e.target.value)})}
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
          disabled={!isEditing}
          onChange={(e) => isEditing && onEditValueChange({
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
          disabled={!isEditing}
          onChange={(e) => isEditing && onEditValueChange({
            ...editedValues, 
            target3Price: parseFloat(e.target.value)
          })}
        />
      </TableCell>
    </TableRow>
  );
};

export default TradeRowItem;

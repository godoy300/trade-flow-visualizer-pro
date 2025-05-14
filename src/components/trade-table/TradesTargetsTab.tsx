
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trade } from "@/types";
import TradeRowItem from "./TradeRowItem";

interface TradesTargetsTabProps {
  paginatedTrades: Trade[];
  isEditing: number | null;
  editedValues: Partial<Trade>;
  formatCurrency: (value: number) => string;
  formatPercentage: (value: number) => string;
  calculatePositionValue: (trade: Trade) => number;
  calculateTarget1Price: (trade: Partial<Trade>) => number | undefined;
  handleEdit: (tradeId: number) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  handleDelete: (tradeId: number) => void;
  setEditedValues: (values: Partial<Trade>) => void;
  page: number;
  totalPages: number;
  setPage: (value: number) => void;
}

const TradesTargetsTab = ({
  paginatedTrades,
  isEditing,
  editedValues,
  formatCurrency,
  formatPercentage,
  calculatePositionValue,
  calculateTarget1Price,
  handleEdit,
  handleSaveEdit,
  handleCancelEdit,
  handleDelete,
  setEditedValues,
  page,
  totalPages,
  setPage,
}: TradesTargetsTabProps) => {
  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0">
            <TableRow>
              <TableHead className="w-[100px]">Actions</TableHead>
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
              paginatedTrades.map((trade) => (
                <TradeRowItem
                  key={trade.id}
                  trade={trade}
                  isEditing={isEditing === trade.id}
                  editedValues={isEditing === trade.id ? editedValues : {}}
                  formatCurrency={formatCurrency}
                  formatPercentage={formatPercentage}
                  calculatePositionValue={calculatePositionValue}
                  calculateTarget1Price={calculateTarget1Price}
                  onEdit={handleEdit}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                  onDelete={handleDelete}
                  onEditValueChange={setEditedValues}
                />
              ))
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
            onClick={() => setPage(Math.max(page - 1, 1))}
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
            onClick={() => setPage(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            variant="outline"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
};

export default TradesTargetsTab;

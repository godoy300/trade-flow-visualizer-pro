
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trade } from "@/types";

interface RiskRewardTabProps {
  paginatedTrades: Trade[];
  formatPercentage: (value: number) => string;
  page: number;
  totalPages: number;
  setPage: (value: number) => void;
}

const RiskRewardTab = ({ 
  paginatedTrades, 
  formatPercentage, 
  page, 
  totalPages, 
  setPage 
}: RiskRewardTabProps) => {
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Setup</TableHead>
              <TableHead className="text-right">Stop %</TableHead>
              <TableHead className="text-right">Result %</TableHead>
              <TableHead className="text-right">Risk/Reward</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Quality</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTrades.length > 0 ? (
              paginatedTrades.map((trade) => {
                const riskReward = Math.abs(trade.winPercentage / trade.stopPercentage).toFixed(2);
                let quality = "Poor";
                
                if (trade.winPercentage >= 0) {
                  if (parseFloat(riskReward) >= 3) quality = "Excellent";
                  else if (parseFloat(riskReward) >= 2) quality = "Good";
                  else if (parseFloat(riskReward) >= 1) quality = "Fair";
                }
                
                return (
                  <TableRow key={`risk-${trade.id}`}>
                    <TableCell>{trade.date}</TableCell>
                    <TableCell className={trade.type === "LONG" ? "text-profit" : "text-loss"}>
                      {trade.type}
                    </TableCell>
                    <TableCell>{trade.setup}</TableCell>
                    <TableCell className="text-right">{formatPercentage(trade.stopPercentage)}</TableCell>
                    <TableCell 
                      className={`text-right ${trade.winPercentage >= 0 ? "text-profit" : "text-loss"}`}
                    >
                      {formatPercentage(trade.winPercentage)}
                    </TableCell>
                    <TableCell className="text-right">{riskReward}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        trade.winPercentage >= 0 ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                      }`}>
                        {trade.winPercentage >= 0 ? "WIN" : "LOSS"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        quality === "Excellent" ? "bg-green-500/20 text-green-500" :
                        quality === "Good" ? "bg-blue-500/20 text-blue-500" :
                        quality === "Fair" ? "bg-yellow-500/20 text-yellow-500" :
                        "bg-red-500/20 text-red-500"
                      }`}>
                        {quality}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
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

export default RiskRewardTab;

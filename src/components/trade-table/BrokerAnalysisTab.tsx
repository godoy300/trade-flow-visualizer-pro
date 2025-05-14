
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BrokerAnalysis } from "@/types";

interface BrokerAnalysisTabProps {
  brokerAnalysis: BrokerAnalysis[];
  formatCurrency: (value: number) => string;
}

const BrokerAnalysisTab = ({ brokerAnalysis, formatCurrency }: BrokerAnalysisTabProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Broker</TableHead>
            <TableHead className="text-right">Trades Count</TableHead>
            <TableHead className="text-right">Win Rate</TableHead>
            <TableHead className="text-right">Avg Fee</TableHead>
            <TableHead className="text-right">Total Profit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brokerAnalysis.length > 0 ? (
            brokerAnalysis.map((broker, index) => (
              <TableRow key={index}>
                <TableCell>{broker.broker}</TableCell>
                <TableCell className="text-right">{broker.count}</TableCell>
                <TableCell 
                  className={`text-right ${broker.winRate >= 50 ? "text-profit" : "text-loss"}`}
                >
                  {broker.winRate.toFixed(2)}%
                </TableCell>
                <TableCell className="text-right">{formatCurrency(broker.avgFee)}</TableCell>
                <TableCell 
                  className={`text-right ${broker.totalProfit >= 0 ? "text-profit" : "text-loss"}`}
                >
                  {formatCurrency(broker.totalProfit)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No broker data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default BrokerAnalysisTab;

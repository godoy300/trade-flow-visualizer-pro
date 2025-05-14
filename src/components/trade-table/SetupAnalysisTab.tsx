
import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { SetupAnalysis } from "@/types";

interface SetupAnalysisTabProps {
  setupAnalysis: SetupAnalysis[];
}

const SetupAnalysisTab = ({ setupAnalysis }: SetupAnalysisTabProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Setup</TableHead>
            <TableHead className="text-right">Trades Count</TableHead>
            <TableHead className="text-right">Win Rate</TableHead>
            <TableHead className="text-right">Avg Return</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {setupAnalysis.length > 0 ? (
            setupAnalysis.map((setup, index) => (
              <TableRow key={index}>
                <TableCell>{setup.setup}</TableCell>
                <TableCell className="text-right">{setup.count}</TableCell>
                <TableCell 
                  className={`text-right ${setup.winRate >= 50 ? "text-profit" : "text-loss"}`}
                >
                  {setup.winRate.toFixed(2)}%
                </TableCell>
                <TableCell 
                  className={`text-right ${setup.avgReturn >= 0 ? "text-profit" : "text-loss"}`}
                >
                  {setup.avgReturn.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4">
                No setup data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default SetupAnalysisTab;

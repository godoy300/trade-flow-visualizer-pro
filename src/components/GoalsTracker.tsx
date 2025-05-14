
import { useTrade } from "@/context/TradeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const GoalsTracker = () => {
  const { goals, updateGoal, metrics } = useTrade();
  const [editModeId, setEditModeId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{
    incomeTarget: number;
    accountGrowthTarget: number;
  }>({ incomeTarget: 0, accountGrowthTarget: 0 });
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  const handleEdit = (goalId: number, incomeTarget: number, accountGrowthTarget: number) => {
    setEditModeId(goalId);
    setEditValues({ incomeTarget, accountGrowthTarget });
  };
  
  const handleSave = (goalId: number) => {
    updateGoal(goalId, {
      incomeTarget: editValues.incomeTarget,
      accountGrowthTarget: editValues.accountGrowthTarget
    });
    setEditModeId(null);
  };
  
  const handleCancel = () => {
    setEditModeId(null);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-6">Trading Goals</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="crypto-card bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
            <CardHeader className="pb-2">
              <CardTitle>Current Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Profit (After Fees)</p>
                <p className={`text-2xl font-bold ${metrics.profitAfterFees >= 0 ? 'text-profit' : 'text-loss'}`}>
                  {formatCurrency(metrics.profitAfterFees)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className={`text-2xl font-bold ${metrics.winRate >= 50 ? 'text-profit' : 'text-loss'}`}>
                  {metrics.winRate.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Profit Factor</p>
                <p className={`text-2xl font-bold ${metrics.profitFactor >= 1.5 ? 'text-profit' : metrics.profitFactor >= 1 ? 'text-yellow-500' : 'text-loss'}`}>
                  {metrics.profitFactor.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="crypto-card bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-500/30">
            <CardHeader className="pb-2">
              <CardTitle>Goals Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Goals Set</p>
                <p className="text-2xl font-bold">{goals.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Progress</p>
                <p className="text-2xl font-bold">
                  {(goals.reduce((sum, goal) => sum + goal.currentProgress, 0) / goals.length).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Milestone</p>
                <p className="text-2xl font-bold text-primary">
                  {goals.find(g => g.currentProgress < 100)?.period.charAt(0).toUpperCase() + goals.find(g => g.currentProgress < 100)?.period.slice(1) || "All Complete!"}
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="crypto-card bg-gradient-to-br from-indigo-900/20 to-violet-900/20 border-indigo-500/30">
            <CardHeader className="pb-2">
              <CardTitle>Required Growth</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">To Meet Annual Goal</p>
                <p className="text-2xl font-bold">
                  {(goals.find(g => g.period === "annual")?.accountGrowthTarget || 0).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Required</p>
                <p className="text-2xl font-bold">
                  {((goals.find(g => g.period === "annual")?.accountGrowthTarget || 0) / 12).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Monthly</p>
                <p className={`text-2xl font-bold ${metrics.profitAfterFees >= ((goals.find(g => g.period === "annual")?.accountGrowthTarget || 0) / 12) ? 'text-profit' : 'text-loss'}`}>
                  {/* Assuming metrics.profitAfterFees is monthly for simplicity */}
                  {(metrics.profitAfterFees / 100).toFixed(1)}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
          
        <div className="grid grid-cols-1 gap-6">
          {goals.map((goal) => (
            <Card key={goal.id} className="crypto-card">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="capitalize">{goal.period} Goals</CardTitle>
                {editModeId === goal.id ? (
                  <div className="space-x-2">
                    <button
                      onClick={() => handleSave(goal.id)}
                      className="text-sm px-2 py-1 bg-primary text-primary-foreground rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="text-sm px-2 py-1 bg-secondary text-secondary-foreground rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEdit(goal.id, goal.incomeTarget, goal.accountGrowthTarget)}
                    className="text-sm px-2 py-1 bg-primary/80 hover:bg-primary text-primary-foreground rounded"
                  >
                    Edit
                  </button>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Income Target</p>
                    {editModeId === goal.id ? (
                      <Input
                        type="number"
                        value={editValues.incomeTarget}
                        onChange={(e) => setEditValues(prev => ({ ...prev, incomeTarget: Number(e.target.value) }))}
                        className="w-32 text-right"
                        min={0}
                      />
                    ) : (
                      <p className="text-lg font-bold">{formatCurrency(goal.incomeTarget)}</p>
                    )}
                  </div>
                  <Progress value={goal.currentProgress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{formatCurrency(goal.incomeTarget * (goal.currentProgress / 100))}</span>
                    <span>{goal.currentProgress}%</span>
                    <span>{formatCurrency(goal.incomeTarget)}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Account Growth Target</p>
                    {editModeId === goal.id ? (
                      <div className="flex items-center">
                        <Input
                          type="number"
                          value={editValues.accountGrowthTarget}
                          onChange={(e) => setEditValues(prev => ({ ...prev, accountGrowthTarget: Number(e.target.value) }))}
                          className="w-24 text-right"
                          min={0}
                        />
                        <span className="ml-1">%</span>
                      </div>
                    ) : (
                      <p className="text-lg font-bold">{goal.accountGrowthTarget}%</p>
                    )}
                  </div>
                  <Progress value={goal.currentProgress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{(goal.accountGrowthTarget * (goal.currentProgress / 100)).toFixed(1)}%</span>
                    <span>{goal.currentProgress}%</span>
                    <span>{goal.accountGrowthTarget}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalsTracker;

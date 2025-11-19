/**
 * financial-tracker/components/Dashboard.tsx
 *
 * Dashboard summary cards showing income, expenses, net profit, and
 * transaction counts. This component is a presentational aggregation of
 * high-level metrics.
 */
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";

interface DashboardProps {
  totalIncome: number;
  totalExpenses: number;
  monthlyProfit: number;
  transactionCount: number;
}

/**
 * Dashboard
 *
 * Presentational component that displays top-level financial metrics.
 * @param totalIncome - Total income for the period
 * @param totalExpenses - Total expenses for the period
 * @param monthlyProfit - Net profit for the period
 * @param transactionCount - Number of transactions
 */
export function Dashboard({ totalIncome, totalExpenses, monthlyProfit, transactionCount }: DashboardProps) {
  const profitPercentage = totalIncome > 0 ? ((monthlyProfit / totalIncome) * 100).toFixed(1) : 0;
  const isProfitable = monthlyProfit >= 0;

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-green-400 to-green-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-white/90">💰 Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-white/80">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-400 to-red-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-white/90">💸 Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-white/80">This month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className={`${isProfitable ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 'bg-gradient-to-br from-orange-400 to-orange-600'} text-white border-0 shadow-lg`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-white/90">{isProfitable ? '🎉' : '⚠️'} Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${Math.abs(monthlyProfit).toLocaleString()}
            </div>
            <p className="text-xs text-white/80">
              {profitPercentage}% of income
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-400 to-blue-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm text-white/90">📋 Transactions</CardTitle>
            <PieChart className="h-4 w-4 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{transactionCount}</div>
            <p className="text-xs text-white/80">This month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
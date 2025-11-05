import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import type { Transaction } from "./TransactionList";

interface BudgetWheelProps {
  transactions: Transaction[];
  monthlyBudget?: number;
  totalIncome: number;
  totalExpenses: number;
}

export function BudgetWheel({
  transactions,
  monthlyBudget = 5000,
  totalIncome,
  totalExpenses,
}: BudgetWheelProps) {
  // Budget utilization
  const budgetUsed = (totalExpenses / monthlyBudget) * 100;
  const remainingBudget = monthlyBudget - totalExpenses;

  return (
    <div className="space-y-4 p-4">
      <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-gray-800">
            Budget Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {/* Budget Wheel */}
          <div className="relative">
            <svg
              width="240"
              height="240"
              className="drop-shadow-lg"
            >
              {/* Outer budget ring */}
              <circle
                cx="120"
                cy="120"
                r="100"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="20"
                className="opacity-30"
              />

              {/* Budget used arc */}
              <circle
                cx="120"
                cy="120"
                r="100"
                fill="none"
                stroke={
                  budgetUsed > 90
                    ? "#ef4444"
                    : budgetUsed > 70
                      ? "#f59e0b"
                      : "#10b981"
                }
                strokeWidth="20"
                strokeDasharray={`${(budgetUsed / 100) * 628} 628`}
                strokeDashoffset="0"
                transform="rotate(-90 120 120)"
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>

            {/* Budget percentage overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div
                  className={`text-3xl font-bold ${budgetUsed > 90 ? "text-red-500" : budgetUsed > 70 ? "text-yellow-500" : "text-green-500"}`}
                >
                  {budgetUsed.toFixed(0)}%
                </div>
                <div className="text-sm text-gray-600 font-medium">
                  Budget Used
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  ${remainingBudget.toLocaleString()} left
                </div>
              </div>
            </div>
          </div>

          {/* Budget Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 w-full">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                ${totalIncome.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">
                Income
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                ${monthlyBudget.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">
                Budget
              </div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-500">
                ${totalExpenses.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">Spent</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}